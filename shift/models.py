from django.conf import settings
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.db.models import Q, CheckConstraint
from django.utils.translation import gettext_lazy as _
import uuid
from users.models import User

class TimeStampedModel(models.Model):
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
        help_text=_("Unique identifier for the record"),
        verbose_name=_("ID")
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        db_index=True,
        help_text=_("Timestamp when the record was created"),
        verbose_name=_("Created At")
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        help_text=_("Timestamp when the record was last updated"),
        verbose_name=_("Updated At")
    )

    class Meta:
        abstract = True


class ShiftStatus(models.TextChoices):
    PENDING_APPROVAL = 'PENDING_APPROVAL', _('Pending Approval')
    APPROVED = 'APPROVED', _('Approved')
    REJECTED = 'REJECTED', _('Rejected')
 

class ShiftAssignmentStatus(models.TextChoices):
    TAKEN = 'TAKEN', _('Taken')
    IN_PROGRESS = 'IN_PROGRESS', _('In Progress')
    COMPLETED = 'COMPLETED', _('Completed')
    CANCELLED = 'CANCELLED', _('Cancelled')
    EXPIRED = 'EXPIRED', _('Expired')





class Shift(TimeStampedModel):
    employer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_shifts', help_text=_("Employer who created the shift"), verbose_name=_("Employer"))
    manager = models.ForeignKey(User, on_delete=models.SET_NULL, related_name='managed_shifts', null=True, blank=True, help_text=_("Manager assigned to oversee the shift"), verbose_name=_("Manager"))
    name = models.CharField(max_length=255, help_text=_("Title or name of the shift"), verbose_name=_("Shift Name"))
    description = models.TextField(blank=True, null=True, help_text=_("Detailed description of the shift"), verbose_name=_("Description"))
    address = models.TextField(help_text=_("Location address of the shift"), verbose_name=_("Location"))
    latitude = models.FloatField(null=True, blank=True, help_text=_("Latitude coordinate of the shift location"), verbose_name=_("Latitude"))
    longitude = models.FloatField(null=True, blank=True, help_text=_("Longitude coordinate of the shift location"), verbose_name=_("Longitude"))
    company_name = models.CharField(max_length=255, blank=True, null=True, help_text=_("Name of the company offering the shift"), verbose_name=_("Company Name"))
    date = models.DateField(db_index=True, help_text=_("Date when the shift occurs"), verbose_name=_("Shift Date"))
    start_time = models.TimeField(db_index=True, help_text=_("Time when the shift starts"), verbose_name=_("Start Time"))
    end_time = models.TimeField(db_index=True, help_text=_("Time when the shift ends"), verbose_name=_("End Time"))
    base_pay = models.DecimalField(max_digits=10, decimal_places=2, default=0.00, help_text=_("Base pay offered for the shift"), verbose_name=_("Base Pay"))
    bonus_pay = models.DecimalField(max_digits=10, decimal_places=2, default=0.00, help_text=_("Additional bonus pay for the shift"), verbose_name=_("Bonus Pay"))
    total_pay = models.DecimalField(max_digits=10, decimal_places=2, default=0.00, help_text=_("Total pay (base + bonus)"), verbose_name=_("Total Pay"))
    total_openings = models.PositiveIntegerField(default=1, help_text=_("Total number of openings available for this shift"), verbose_name=_("Total Openings"))
    status = models.CharField(max_length=20, choices=ShiftStatus.choices, default=ShiftStatus.PENDING_APPROVAL, db_index=True, help_text=_("Approval status of the shift"), verbose_name=_("Status"))
    is_active = models.BooleanField(default=True, db_index=True, help_text=_("Whether the shift is currently active"), verbose_name=_("Is Active"))
    requirements = models.JSONField(blank=True, null=True, help_text=_("List of requirements for the shift (in JSON format)"), verbose_name=_("Requirements"))
    prohibited_items = models.JSONField(blank=True, null=True, help_text=_("List of prohibited items during the shift (in JSON format)"), verbose_name=_("Prohibited Items"))
    image_url = models.URLField(blank=True, null=True, help_text=_("Optional image related to the shift"), verbose_name=_("Image URL"))

    class Meta:
        verbose_name = _("Shift")
        verbose_name_plural = _("Shifts")
        constraints = [
            CheckConstraint(check=Q(start_time__lt=models.F('end_time')), name='check_start_before_end'),
        ]


class ShiftAssignment(TimeStampedModel):
    shift = models.ForeignKey(Shift, on_delete=models.CASCADE, related_name='assignments', help_text=_("The shift to which this assignment belongs"), verbose_name=_("Shift"))
    employee = models.ForeignKey(User, on_delete=models.CASCADE, related_name='shift_assignments', help_text=_("Employee assigned to this shift"), verbose_name=_("Employee"))
    status = models.CharField(max_length=20, choices=ShiftAssignmentStatus.choices, default=ShiftAssignmentStatus.TAKEN, db_index=True, help_text=_("Current status of the shift assignment"), verbose_name=_("Assignment Status"))
    filled_openings = models.PositiveIntegerField(default=0, help_text=_("Number of filled openings by this assignment"), verbose_name=_("Filled Openings"))
    actual_start_time = models.TimeField(null=True, blank=True, help_text=_("Actual time the employee started the shift"), verbose_name=_("Actual Start Time"))
    actual_end_time = models.TimeField(null=True, blank=True, help_text=_("Actual time the employee ended the shift"), verbose_name=_("Actual End Time"))
    notify_time_start = models.BooleanField(default=False, help_text=_("Whether a shift reminder has been sent"), verbose_name=_("Reminder Sent"))
    completed_notes = models.TextField(blank=True, null=True, help_text=_("Notes entered upon completion of the shift"), verbose_name=_("Completion Notes"))

    class Meta:
        verbose_name = _("Shift Assignment")
        verbose_name_plural = _("Shift Assignments")
        constraints = [
            CheckConstraint(check=Q(actual_start_time__lte=models.F('actual_end_time')), name='check_actual_start_end'),
        ]



class ShiftRating(TimeStampedModel):
    shift = models.ForeignKey(
        Shift,
        on_delete=models.CASCADE,
        related_name='ratings',
        verbose_name=_("Shift")
    )
    assignment = models.ForeignKey(
        ShiftAssignment,
        on_delete=models.CASCADE,
        related_name='ratings',
        verbose_name=_("Shift Assignment")
    )
    rater = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='given_shift_ratings',
        verbose_name=_("Rater")  
    )
    ratee = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='received_shift_ratings',
        verbose_name=_("Ratee")  
    )
    rating = models.PositiveIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        verbose_name=_("Rating")
    )
    review = models.TextField(blank=True, null=True, verbose_name=_("Review"))

    class Meta:
        unique_together = ('assignment', 'rater')  # Prevent double rating per shift assignment per user
        verbose_name = _("Shift Rating")
        verbose_name_plural = _("Shift Ratings")
