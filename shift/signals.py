from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import (
    ApprovalStatus, NotificationType, Shift, ShiftApproval, ShiftApplication,
    ShiftAssignment, Notification, ShiftStatus
)

@receiver(post_save, sender=Shift)
def handle_shift_creation(sender, instance, created, **kwargs):
    if created and not instance.employer.is_manager():
        # Already handled in the model's save method
        pass

@receiver(post_save, sender=ShiftApproval)
def handle_shift_approval(sender, instance, created, **kwargs):
    if not created and instance.status == ApprovalStatus.APPROVED:
        # Check if this was the first approval for the shift
        if instance.shift.approvals.filter(status=ApprovalStatus.APPROVED).count() == 1:
            instance.shift.update_status(ShiftStatus.APPROVED, instance.manager)

@receiver(post_save, sender=ShiftApplication)
def handle_application_creation(sender, instance, created, **kwargs):
    if created:
        # Notify employer about new application
        Notification.objects.create(
            user=instance.shift.employer,
            notification_type=NotificationType.APPLICATION_SUBMITTED,
            message=f"New application for shift '{instance.shift.name}' from {instance.employee.full_name}",
            related_shift=instance.shift,
            related_application=instance
        )

@receiver(post_save, sender=ShiftAssignment)
def handle_assignment_creation(sender, instance, created, **kwargs):
    if created:
        # Notify employee about assignment
        Notification.objects.create(
            user=instance.employee,
            notification_type=NotificationType.APPLICATION_APPROVED,
            message=f"You've been assigned to shift '{instance.shift.name}'",
            related_shift=instance.shift,
            related_assignment=instance
        )