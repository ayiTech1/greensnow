from django.conf import settings
from django.db import models
from users.models import User
from shift.models import Shift, ShiftAssignment, TimeStampedModel
from django.utils.translation import gettext_lazy as _

class DeviceType(models.Model):
    DEVICE_TYPES = (
        ('ios', 'iOS'),
        ('android', 'Android')
    )


class NotificationType(models.TextChoices):
    SHIFT_CREATED = 'SHIFT_CREATED', _('Shift Created')
    SHIFT_APPROVED = 'SHIFT_APPROVED', _('Shift Approved')
    SHIFT_REJECTED = 'SHIFT_REJECTED', _('Shift Rejected')
    SHIFT_TAKEN = 'SHIFT_TAKEN', _('Shift Taken')
    SHIFT_CANCELLED = 'SHIFT_CANCELLED', _('Shift Cancelled')
    SHIFT_STARTING_SOON = 'SHIFT_STARTING_SOON', _('Shift Starting Soon')
    SHIFT_REMINDER = 'SHIFT_REMINDER', _('Shift Reminder')



class Device(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    device_token = models.CharField(max_length=255, unique=True)
    device_type = models.CharField(max_length=10, choices=DeviceType)
    
    def __str__(self):
        return f"{self.user.username} - {self.device_type}"
    

class Notification(TimeStampedModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications', help_text=_("User receiving this notification"), verbose_name=_("User"))
    notification_type = models.CharField(max_length=50, choices=NotificationType.choices, help_text=_("Type of notification"), verbose_name=_("Notification Type"))
    message = models.TextField(help_text=_("Notification message content"), verbose_name=_("Message"))
    related_shift = models.ForeignKey(Shift, on_delete=models.CASCADE, null=True, blank=True, help_text=_("Related shift, if applicable"), verbose_name=_("Related Shift"))
    related_assignment = models.ForeignKey(ShiftAssignment, on_delete=models.CASCADE, null=True, blank=True, help_text=_("Related shift assignment, if applicable"), verbose_name=_("Related Assignment"))
    is_read = models.BooleanField(default=False, help_text=_("Whether the user has read the notification"), verbose_name=_("Is Read"))
    email_sent = models.BooleanField(default=False, help_text=_("Whether the notification was sent via email"), verbose_name=_("Email Sent"))
    push_sent = models.BooleanField(default=False, help_text=_("Whether the notification was sent as a push notification"), verbose_name=_("Push Sent"))

    class Meta:
        verbose_name = _("Notification")
        verbose_name_plural = _("Notifications")