from django.core.validators import MinValueValidator, MaxValueValidator
from django.core.exceptions import ValidationError
from django.db import models
from django.core.exceptions import ValidationError
import uuid
from django.utils.timezone import now
from django.db.models import Q, CheckConstraint
from django.utils.translation import gettext_lazy as _
from users.models import User
import logging

logger = logging.getLogger(__name__)

class TimeStampedModel(models.Model):
    """
    Abstract base model providing self-updating created and modified fields.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True
        ordering = ['-created_at']

class ShiftStatus(models.TextChoices):
    DRAFT = 'DRAFT', _('Draft')
    PENDING_APPROVAL = 'PENDING_APPROVAL', _('Pending Approval')
    APPROVED = 'APPROVED', _('Approved')
    REJECTED = 'REJECTED', _('Rejected')
    PUBLISHED = 'PUBLISHED', _('Published')
    TAKEN = 'TAKEN', _('Taken')
    IN_PROGRESS = 'IN_PROGRESS', _('In Progress')
    COMPLETED = 'COMPLETED', _('Completed')
    CANCELLED = 'CANCELLED', _('Cancelled')
    EXPIRED = 'EXPIRED', _('Expired')

class ShiftApplicationStatus(models.TextChoices):
    PENDING = 'PENDING', _('Pending')
    APPROVED = 'APPROVED', _('Approved')
    REJECTED = 'REJECTED', _('Rejected')
    WITHDRAWN = 'WITHDRAWN', _('Withdrawn')
    COMPLETED = 'COMPLETED', _('Completed')

class ApprovalStatus(models.TextChoices):
    PENDING = 'PENDING', _('Pending')
    APPROVED = 'APPROVED', _('Approved')
    REJECTED = 'REJECTED', _('Rejected')

class NotificationType(models.TextChoices):
    SHIFT_CREATED = 'SHIFT_CREATED', _('Shift Created')
    SHIFT_APPROVED = 'SHIFT_APPROVED', _('Shift Approved')
    SHIFT_REJECTED = 'SHIFT_REJECTED', _('Shift Rejected')
    SHIFT_PUBLISHED = 'SHIFT_PUBLISHED', _('Shift Published')
    APPLICATION_SUBMITTED = 'APPLICATION_SUBMITTED', _('Application Submitted')
    APPLICATION_APPROVED = 'APPLICATION_APPROVED', _('Application Approved')
    APPLICATION_REJECTED = 'APPLICATION_REJECTED', _('Application Rejected')
    SHIFT_STARTING_SOON = 'SHIFT_STARTING_SOON', _('Shift Starting Soon')
    SHIFT_REMINDER = 'SHIFT_REMINDER', _('Shift Reminder')

class ShiftManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().select_related('employer', 'manager')
    
    def for_user(self, user):
        """Get shifts relevant to the user based on their role."""
        qs = self.get_queryset()
        
        if user.is_manager():
            return qs.filter(
                Q(manager=user) | 
                Q(employer=user) | 
                Q(employer__in=user.managed_employers.all())
            )
        elif user.is_employer():
            return qs.filter(employer=user)
        elif user.is_employee():
            return qs.filter(
                Q(status=ShiftStatus.PUBLISHED) |
                Q(applications__employee=user)
            ).distinct()
        return qs.none()

class Shift(TimeStampedModel):
    """
    Represents a work shift that can be assigned to employees.
    """
    employer = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='created_shifts',
        help_text=_('User who created the shift')
    )
    manager = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        related_name='managed_shifts',
        null=True,
        blank=True,
        help_text=_('Manager responsible for approving the shift')
    )
    name = models.CharField(
        max_length=255,
        help_text=_('Name/title of the shift')
    )
    description = models.TextField(
        blank=True,
        null=True,
        help_text=_('Detailed description of the shift requirements')
    )
    location = models.TextField(
        help_text=_('Physical location where the shift will take place')
    )
    location_map_url = models.URLField(
        blank=True,
        null=True,
        help_text=_('URL to map of the location')
    )
    company_name = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        help_text=_('Name of the company posting the shift')
    )
    
    # Timing fields
    start_time = models.DateTimeField(
        db_index=True,
        help_text=_('Scheduled start time of the shift')
    )
    end_time = models.DateTimeField(
        db_index=True,
        help_text=_('Scheduled end time of the shift')
    )
    
    # Compensation fields
    base_pay = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0.00,
        help_text=_('Base pay for the shift')
    )
    bonus_pay = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0.00,
        help_text=_('Additional bonus pay for the shift')
    )
    
    # Shift capacity
    total_openings = models.PositiveIntegerField(
        default=1,
        help_text=_('Total number of workers needed for this shift')
    )
    filled_openings = models.PositiveIntegerField(
        default=0,
        help_text=_('Number of positions already filled')
    )
    
    # Status tracking
    status = models.CharField(
        max_length=20,
        choices=ShiftStatus.choices,
        default=ShiftStatus.DRAFT,
        db_index=True,
        help_text=_('Current status of the shift')
    )
    is_active = models.BooleanField(
        default=True,
        db_index=True,
        help_text=_('Soft delete flag')
    )
    
    # Additional metadata
    requirements = models.JSONField(
        blank=True,
        null=True,
        help_text=_('JSON array of required qualifications or items')
    )
    prohibited_items = models.JSONField(
        blank=True,
        null=True,
        help_text=_('JSON array of items not allowed during shift')
    )
    image_url = models.URLField(
        blank=True,
        null=True,
        help_text=_('URL of image associated with the shift')
    )

    objects = ShiftManager()

    class Meta:
        ordering = ['start_time']
        indexes = [
            models.Index(fields=['status', 'start_time']),
            models.Index(fields=['employer', 'status']),
        ]
        constraints = [
            CheckConstraint(
                check=Q(start_time__lt=models.F('end_time')),
                name='shift_start_before_end'
            ),
            CheckConstraint(
                check=Q(filled_openings__lte=models.F('total_openings')),
                name='filled_openings_lte_total'
            ),
        ]

    def __str__(self):
        return f"{self.name} ({self.start_time.date()})"

    def clean(self):
        """Validate shift data before saving."""
        if self.start_time and self.end_time and self.start_time >= self.end_time:
            raise ValidationError({'end_time': 'End time must be after start time.'})
        
        if self.filled_openings > self.total_openings:
            raise ValidationError(
                {'filled_openings': 'Filled openings cannot exceed total openings.'}
            )

        if not self.employer.is_employer():
            raise ValidationError("Shift employer must have employer role")
            
        if self.manager and not self.manager.is_manager():
            raise ValidationError("Shift manager must have manager role")

    def save(self, *args, **kwargs):
        """Handle automatic status transitions on save."""
        creating = self._state.adding
        
        if creating:
            if self.employer.is_manager():
                # Manager-created shifts are auto-approved
                self.status = ShiftStatus.APPROVED
            else:
                # Employer-created shifts need approval
                self.status = ShiftStatus.PENDING_APPROVAL
        
        super().save(*args, **kwargs)
        
        # For employer-created shifts, find all managers who can approve
        if creating and not self.employer.is_manager():
            self._notify_managers_for_approval()

    def _notify_managers_for_approval(self):
        """Notify all managers who can approve this shift."""
        managers = User.objects.filter(
            role="manager",
            is_active=True
        )
        
        for manager in managers:
            ShiftApproval.objects.create(
                shift=self,
                manager=manager,
                status=ApprovalStatus.PENDING
            )
            Notification.objects.create(
                user=manager,
                notification_type=NotificationType.SHIFT_CREATED,
                message=f"New shift '{self.name}' from {self.employer.full_name} needs approval",
                related_shift=self
            )

    @property
    def available_openings(self):
        """Calculate remaining openings."""
        return self.total_openings - self.filled_openings

    @property
    def total_pay(self):
        """Calculate total compensation for the shift."""
        return self.base_pay + self.bonus_pay

    @property
    def is_approved(self):
        """Check if shift has at least one manager approval."""
        return self.approvals.filter(status=ApprovalStatus.APPROVED).exists()

    def update_status(self, new_status, user):
        """Safely transition between statuses with role validation."""
        # Return early if status isn't changing
        if self.status == new_status:
            logger.debug(f"No status change needed for shift {self.id} (already {self.status})")
            return True
        
        valid_transitions = {
            ShiftStatus.DRAFT: {
                'allowed_roles': ['employer', 'manager'],
                'next_states': [ShiftStatus.PENDING_APPROVAL, ShiftStatus.APPROVED],
                'special_rules': {
                    'manager': lambda: new_status == ShiftStatus.APPROVED
                }
            },
            ShiftStatus.PENDING_APPROVAL: {
                'allowed_roles': ['manager'],
                'next_states': [ShiftStatus.APPROVED, ShiftStatus.REJECTED]
            },
            ShiftStatus.APPROVED: {
                'allowed_roles': ['employer', 'manager'],
                'next_states': [ShiftStatus.PUBLISHED]
            },
            ShiftStatus.PUBLISHED: {
                'allowed_roles': ['employer', 'manager'],
                'next_states': [ShiftStatus.TAKEN, ShiftStatus.CANCELLED]
            },
            ShiftStatus.TAKEN: {
                'allowed_roles': ['employer', 'employee'],
                'next_states': [ShiftStatus.IN_PROGRESS, ShiftStatus.CANCELLED]
            },
            ShiftStatus.IN_PROGRESS: {
                'allowed_roles': ['employer', 'employee'],
                'next_states': [ShiftStatus.COMPLETED]
            },
        }
        
        transition = valid_transitions.get(self.status)
        
        if not transition or new_status not in transition['next_states']:
            raise ValidationError(
                f"Invalid status transition from {self.status} to {new_status}"
            )
        
        # Check special rules first
        special_rule = transition.get('special_rules', {}).get(user.role)
        if special_rule and not special_rule():
            raise ValidationError(
                f"Special transition rule not satisfied for {user.role}"
            )
        
        # Then check general role permissions
        user_role_valid = (
            (user.is_manager() and 'manager' in transition['allowed_roles']) or
            (user.is_employer() and 'employer' in transition['allowed_roles']) or
            (user.is_employee() and 'employee' in transition['allowed_roles'])
        )
        
        if not user_role_valid:
            raise ValidationError(
                f"User with role {user.role} cannot perform this transition"
            )
        
        logger.info(f"Status updated: {self.status} -> {new_status} by {user}")
        self.status = new_status
        self.save(update_fields=['status'])
        return True

    def check_availability(self):
        """Check if shift is available for applications."""
        return (
            self.status == ShiftStatus.PUBLISHED
            and self.available_openings > 0
            and self.start_time > now()
            and self.is_active
        )

class ShiftApproval(TimeStampedModel):
    """
    Tracks approval workflow for shifts that require manager approval.
    """
    shift = models.ForeignKey(
        Shift,
        on_delete=models.CASCADE,
        related_name='approvals',
        help_text=_('Shift being approved')
    )
    manager = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='shift_approvals',
        help_text=_('Manager responsible for approval')
    )
    status = models.CharField(
        max_length=20,
        choices=ApprovalStatus.choices,
        default=ApprovalStatus.PENDING,
        help_text=_('Approval decision status')
    )
    comments = models.TextField(
        blank=True,
        null=True,
        help_text=_('Manager comments about the approval')
    )

    class Meta:
        unique_together = ('shift', 'manager')
        verbose_name = _('Shift Approval')
        verbose_name_plural = _('Shift Approvals')

    def __str__(self):
        return f"{self.shift.name} - {self.get_status_display()}"

    def save(self, *args, **kwargs):
        """Update shift status when approval is granted/rejected."""
        super().save(*args, **kwargs)
        
        if self.status == ApprovalStatus.APPROVED:
            if not self.shift.is_approved:
                self.shift.update_status(ShiftStatus.APPROVED, self.manager)
                Notification.objects.create(
                    user=self.shift.employer,
                    notification_type=NotificationType.SHIFT_APPROVED,
                    message=f"Your shift '{self.shift.name}' has been approved by {self.manager.full_name}",
                    related_shift=self.shift
                )
        elif self.status == ApprovalStatus.REJECTED:
            self.shift.update_status(ShiftStatus.REJECTED, self.manager)
            Notification.objects.create(
                user=self.shift.employer,
                notification_type=NotificationType.SHIFT_REJECTED,
                message=f"Your shift '{self.shift.name}' has been rejected by {self.manager.full_name}",
                related_shift=self.shift
            )

class ShiftApplication(TimeStampedModel):
    """
    Represents an employee's application to work a shift.
    """
    shift = models.ForeignKey(
        Shift,
        on_delete=models.CASCADE,
        related_name='applications',
        help_text=_('Shift being applied for')
    )
    employee = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='shift_applications',
        help_text=_('Employee applying for the shift')
    )
    status = models.CharField(
        max_length=20,
        choices=ShiftApplicationStatus.choices,
        default=ShiftApplicationStatus.PENDING,
        db_index=True,
        help_text=_('Current status of the application')
    )
    notes = models.TextField(
        blank=True,
        null=True,
        help_text=_('Additional notes from the applicant')
    )
    employer_notes = models.TextField(
        blank=True,
        null=True,
        help_text=_('Employer comments about the application')
    )

    class Meta:
        unique_together = ('shift', 'employee')
        verbose_name = _('Shift Application')
        verbose_name_plural = _('Shift Applications')

    def __str__(self):
        return f"{self.employee.email} - {self.shift.name}"

    def clean(self):
        """Validate application before saving."""
        if not self.shift.check_availability():
            raise ValidationError(
                "Cannot apply to this shift - it may be full, expired, or not published."
            )
        
        if self.employee == self.shift.employer:
            raise ValidationError("You cannot apply to your own shift.")

    def save(self, *args, **kwargs):
        """Handle application status changes."""
        creating = self._state.adding
        
        super().save(*args, **kwargs)
        
        if creating and self.status == ShiftApplicationStatus.APPROVED:
            self._update_shift_filled_count()

    def approve(self):
        """Approve this application."""
        if self.status != ShiftApplicationStatus.PENDING:
            raise ValidationError("Only pending applications can be approved.")
        
        self.status = ShiftApplicationStatus.APPROVED
        self.save()
        self._update_shift_filled_count()
        
        # Check if shift is now fully staffed
        if self.shift.available_openings == 0:
            self.shift.update_status(ShiftStatus.TAKEN, self.shift.employer)
        
        Notification.objects.create(
            user=self.employee,
            notification_type=NotificationType.APPLICATION_APPROVED,
            message=f"Your application for shift '{self.shift.name}' has been approved",
            related_shift=self.shift,
            related_application=self
        )

    def reject(self):
        """Reject this application."""
        if self.status != ShiftApplicationStatus.PENDING:
            raise ValidationError("Only pending applications can be rejected.")
        
        self.status = ShiftApplicationStatus.REJECTED
        self.save()
        
        Notification.objects.create(
            user=self.employee,
            notification_type=NotificationType.APPLICATION_REJECTED,
            message=f"Your application for shift '{self.shift.name}' has been rejected",
            related_shift=self.shift,
            related_application=self
        )

    def _update_shift_filled_count(self):
        """Update the shift's filled openings count."""
        if self.status == ShiftApplicationStatus.APPROVED:
            self.shift.filled_openings = models.F('filled_openings') + 1
            self.shift.save(update_fields=['filled_openings'])

class ShiftAssignment(TimeStampedModel):
    """
    Tracks the actual assignment of an employee to work a shift.
    """
    shift = models.ForeignKey(
        Shift,
        on_delete=models.CASCADE,
        related_name='assignments',
        help_text=_('Shift being assigned')
    )
    employee = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='shift_assignments',
        help_text=_('Employee assigned to the shift')
    )
    application = models.OneToOneField(
        ShiftApplication,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        help_text=_('Original application that led to this assignment')
    )
    actual_start_time = models.DateTimeField(
        null=True,
        blank=True,
        help_text=_('When the employee actually started working')
    )
    actual_end_time = models.DateTimeField(
        null=True,
        blank=True,
        help_text=_('When the employee actually finished working')
    )
    completed_notes = models.TextField(
        blank=True,
        null=True,
        help_text=_('Notes about shift completion')
    )

    class Meta:
        verbose_name = _('Shift Assignment')
        verbose_name_plural = _('Shift Assignments')

    def __str__(self):
        return f"{self.employee.email} assigned to {self.shift.name}"

    def clean(self):
        """Validate assignment data."""
        if self.actual_start_time and self.actual_end_time:
            if self.actual_start_time >= self.actual_end_time:
                raise ValidationError(
                    {'actual_end_time': 'End time must be after start time.'}
                )

    def mark_as_started(self, start_time=None):
        """Record that the shift has started."""
        self.actual_start_time = start_time or now()
        self.save()
        self.shift.update_status(ShiftStatus.IN_PROGRESS, self.employee)
        
        Notification.objects.create(
            user=self.shift.employer,
            notification_type=NotificationType.SHIFT_STARTING_SOON,
            message=f"{self.employee.full_name} has started shift '{self.shift.name}'",
            related_shift=self.shift,
            related_assignment=self
        )

    def mark_as_completed(self, end_time=None, notes=None):
        """Record that the shift has been completed."""
        self.actual_end_time = end_time or now()
        self.completed_notes = notes
        self.save()
        
        # Update related application status
        if self.application:
            self.application.status = ShiftApplicationStatus.COMPLETED
            self.application.save()
        
        # Check if all assignments are complete
        incomplete_assignments = self.shift.assignments.filter(
            actual_end_time__isnull=True
        ).exists()
        
        if not incomplete_assignments:
            self.shift.update_status(ShiftStatus.COMPLETED, self.shift.employer)
        
        Notification.objects.create(
            user=self.shift.employer,
            notification_type=NotificationType.SHIFT_COMPLETED,
            message=f"{self.employee.full_name} has completed shift '{self.shift.name}'",
            related_shift=self.shift,
            related_assignment=self
        )

class Notification(TimeStampedModel):
    """
    Tracks notifications sent to users about shift activities.
    """
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='notifications'
    )
    notification_type = models.CharField(
        max_length=50,
        choices=NotificationType.choices
    )
    message = models.TextField()
    related_shift = models.ForeignKey(
        Shift,
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )
    related_application = models.ForeignKey(
        ShiftApplication,
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )
    related_assignment = models.ForeignKey(
        ShiftAssignment,
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )
    is_read = models.BooleanField(default=False)
    email_sent = models.BooleanField(default=False)
    push_sent = models.BooleanField(default=False)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.get_notification_type_display()} - {self.user.email}"

    def mark_as_sent(self, method='email'):
        """Mark notification as sent by specified method."""
        if method == 'email':
            self.email_sent = True
        elif method == 'push':
            self.push_sent = True
        self.save()

class ShiftRating(TimeStampedModel):
    """
    Tracks ratings between employees and employers for completed shifts.
    """
    shift = models.ForeignKey(
        Shift,
        on_delete=models.CASCADE,
        related_name='ratings',
        help_text=_('Shift being rated')
    )
    assignment = models.ForeignKey(
        ShiftAssignment,
        on_delete=models.CASCADE,
        related_name='ratings',
        help_text=_('Specific assignment being rated')
    )
    rater = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='ratings_given',
        help_text=_('User providing the rating')
    )
    ratee = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='ratings_received',
        help_text=_('User receiving the rating')
    )
    rating = models.PositiveSmallIntegerField(
        help_text=_('Rating score (1-5)'),
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    comments = models.TextField(
        blank=True,
        null=True,
        help_text=_('Comments about the rating')
    )

    class Meta:
        unique_together = ('assignment', 'rater', 'ratee')
        verbose_name = _('Shift Rating')
        verbose_name_plural = _('Shift Ratings')

    def __str__(self):
        return f"{self.rater} rated {self.ratee} ({self.rating})"

    def clean(self):
        """Validate rating data."""
        if self.rater == self.ratee:
            raise ValidationError("You cannot rate yourself")
        
        if self.assignment.shift != self.shift:
            raise ValidationError("Assignment must belong to the shift")
        
        if self.assignment.shift.status != ShiftStatus.COMPLETED:
            raise ValidationError("You can only rate completed shifts")
        
        # Validate that rater is either the employee or employer
        if self.rater not in [self.assignment.employee, self.assignment.shift.employer]:
            raise ValidationError("Invalid rater")
        
        # Validate that ratee is the other party
        if self.ratee not in [self.assignment.employee, self.assignment.shift.employer]:
            raise ValidationError("Invalid ratee")