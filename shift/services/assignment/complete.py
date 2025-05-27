import logging
from django.utils import timezone
from django.core.exceptions import ValidationError, PermissionDenied
from shift.models import Shift, ShiftAssignment
from notification.services import notify_user
from django.db import transaction

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
    notify_user(shift.employer.user,
                f"{user.get_full_name()} has completed shift {shift.id}.",
                related_shift=shift)
    notify_user("manager",
                f"{user.get_full_name()} has completed shift {shift.id}.",
                related_shift=shift)

    logger.info(f"Shift {shift.id} completed by {user.email} at {now.isoformat()}")
    return assignment
