import logging
from django.core.exceptions import ValidationError, PermissionDenied
from shift.models import Shift, ShiftAssignment
from notification.utils import send_push_notification
from shift.models import Shift, ShiftAssignment
from django.db import transaction
from users.models import User


logger = logging.getLogger('shift')


@transaction.atomic
def assign_shift_to_employee(user, shift_id):
    if not user.is_employee:
        raise PermissionDenied("Only employees can take shifts.")

    if user.employee_profile.approval_status != 'approved':
        raise PermissionDenied("Your profile must be approved to take shifts.")

    try:
        shift = Shift.objects.get(pk=shift_id)
    except Shift.DoesNotExist:
        raise ValidationError("Shift not found.")

    if shift.status != 'approved':
        raise PermissionDenied("Only approved shifts can be taken.")

    if shift.filled_openings >= shift.openings:
        raise ValidationError("This shift has already been filled.")

    if ShiftAssignment.objects.filter(shift=shift, employee=user).exists():
        raise ValidationError("You have already taken this shift.")

    assignment = ShiftAssignment.objects.create(
        shift=shift,
        employee=user,
        status='taken'
    )

    shift.filled_openings += 1
    shift.save()

    send_push_notification(shift.employer.user, f"{user.username()} has taken shift {shift.id}.", notification_type='SHIFT_TAKEN', shift=shift)
    managers = User.objects.filter(is_manager=True)
    for manager in managers:
        send_push_notification(
            manager,
            f"{user.username()} has taken shift {shift.id}.",
            notification_type='SHIFT_TAKEN',
            shift=shift
        )
    return assignment