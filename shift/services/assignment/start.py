import logging
from django.utils import timezone
from django.core.exceptions import ValidationError, PermissionDenied
from shift.models import Shift, ShiftAssignment
from notification.utils import send_push_notification
from shift.models import Shift, ShiftAssignment
from django.db import transaction
from users.models import User


logger = logging.getLogger('shift')


@transaction.atomic
def start_shift_assignment(user, shift_id):
    try:
        shift = Shift.objects.get(pk=shift_id)
    except Shift.DoesNotExist:
        raise ValidationError("Shift not found.")

    try:
        assignment = ShiftAssignment.objects.get(shift=shift, employee=user)
    except ShiftAssignment.DoesNotExist:
        raise PermissionDenied("You have not taken this shift.")

    if assignment.status != 'taken':
        raise ValidationError("Shift cannot be started unless it's in 'taken' status.")

    now = timezone.now()
    if now < shift.start_time:
        raise ValidationError("You cannot start the shift before the scheduled start time.")

    assignment.status = 'in_progress'
    assignment.actual_start_time = now
    assignment.save()

    # Notify the employer
    send_push_notification(
        shift.employer.user,
        f"{user.username()} has started shift {shift.id}.",
        notification_type='SHIFT_STARTED',
        shift=shift
    )

    # Notify all managers
    managers = User.objects.filter(is_manager=True)
    for manager in managers:
        send_push_notification(
            manager,
            f"{user.username()} has started shift {shift.id}.",
            notification_type='SHIFT_STARTED',
            shift=shift
        )

    return assignment
