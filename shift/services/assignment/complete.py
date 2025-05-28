import logging
from django.utils import timezone
from django.core.exceptions import ValidationError, PermissionDenied
from shift.models import Shift, ShiftAssignment
from notification.utils import send_push_notification
from django.db import transaction
from users.models import User

logger = logging.getLogger('shift')

@transaction.atomic
def complete_shift_assignment(user, shift_id, completed_notes=None):
    try:
        shift = Shift.objects.get(pk=shift_id)
    except Shift.DoesNotExist:
        raise ValidationError("Shift not found.")

    try:
        assignment = ShiftAssignment.objects.get(shift=shift, employee=user)
    except ShiftAssignment.DoesNotExist:
        raise PermissionDenied("You have not taken this shift.")

    if assignment.status != ShiftAssignment.Status.IN_PROGRESS:
        raise ValidationError("Only in-progress shifts can be completed.")

    now = timezone.now()
    if assignment.actual_start_time and now < assignment.actual_start_time:
        raise ValidationError("Completion time cannot be before start time.")

    assignment.status = ShiftAssignment.Status.COMPLETED
    assignment.actual_end_time = now
    if completed_notes is not None:
        assignment.completed_notes = completed_notes
    assignment.save()

    # Notify employer and managers
    send_push_notification(shift.employer.user,
                f"{user.user()} has completed shift {shift.id}.",
                notification_type='SHIFT_COMPLETED',shift=shift)
    
    managers = User.objects.filter(is_manager=True)
    for manager in managers:
        send_push_notification(
            manager,
            f"{user.username()} has completed shift {shift.id}.",
            notification_type='SHIFT_COMPLETED',
            shift=shift
        )

    logger.info(f"Shift {shift.id} completed by {user.email} at {now.isoformat()}")
    return assignment
