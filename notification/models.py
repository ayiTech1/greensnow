from django.conf import settings
from django.db import models
from django.utils.translation import gettext_lazy as _
from users.models import User
from shift.models import Shift, ShiftAssignment, TimeStampedModel


class DeviceType(models.TextChoices):
    IOS = 'ios', 'iOS'
    ANDROID = 'android', 'Android'


class NotificationType(models.TextChoices):
    SHIFT_CREATED = 'SHIFT_CREATED', _('Shift Created')
    SHIFT_APPROVED = 'SHIFT_APPROVED', _('Shift Approved')
    SHIFT_REJECTED = 'SHIFT_REJECTED', _('Shift Rejected')
    SHIFT_TAKEN = 'SHIFT_TAKEN', _('Shift Taken')
    SHIFT_CANCELLED = 'SHIFT_CANCELLED', _('Shift Cancelled')
    SHIFT_STARTING_SOON = 'SHIFT_STARTING_SOON', _('Shift Starting Soon')
    SHIFT_REMINDER = 'SHIFT_REMINDER', _('Shift Reminder')
    USER_PROFILE_UPDATED = 'USER_PROFILE_UPDATED', _('User Profile Updated')


class Device(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    device_token = models.CharField(max_length=255, unique=True)
    device_type = models.CharField(max_length=10, choices=DeviceType.choices)

    def __str__(self):
        return f"{self.user.username} - {self.device_type}"


class Notification(TimeStampedModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    notification_type = models.CharField(max_length=50, choices=NotificationType.choices)
    message = models.TextField()
    related_shift = models.ForeignKey(Shift, on_delete=models.SET_NULL, null=True, blank=True)
    related_assignment = models.ForeignKey(ShiftAssignment, on_delete=models.SET_NULL, null=True, blank=True)
    is_read = models.BooleanField(default=False)
    email_sent = models.BooleanField(default=False)
    push_sent = models.BooleanField(default=False)

    class Meta:
        verbose_name = _("Notification")
        verbose_name_plural = _("Notifications")
