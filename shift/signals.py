from django.db.models.signals import pre_save
from django.dispatch import receiver
from shift.models import ShiftAssignment, ShiftRating
from django.db.models.signals import post_save
from users.models import EmployeeProfile

@receiver(pre_save, sender=ShiftAssignment)
def reset_notify_flag_on_status_change(sender, instance, **kwargs):
    if not instance.pk:
        # This is a new ShiftAssignment, no previous status to compare
        return
    
    try:
        old_instance = ShiftAssignment.objects.get(pk=instance.pk)
    except ShiftAssignment.DoesNotExist:
        return
    
    # Reset notify_start_sent if status changed from 'taken' or 'in_progress' to 'done' or 'canceled'
    if old_instance.status in ['taken', 'in_progress'] and instance.status in ['completed', 'canceled']:
        instance.notify_start_sent = False

