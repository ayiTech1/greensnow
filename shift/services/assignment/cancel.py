import logging
from django.utils import timezone
from django.core.exceptions import ValidationError, PermissionDenied
from shift.models import Shift, ShiftAssignment
from notification.services import notify_user
from shift.models import Shift, ShiftAssignment
from django.db import transaction


logger = logging.getLogger('shift')



@transaction.atomic
def cancel_shift_assignment(user, shift_id, confirm=False):
    try:
        shift = Shift.objects.get(pk=shift_id)
    except Shift.DoesNotExist:
        raise ValidationError("Shift not found.")

    # Check if the user has taken the shift
    try:
        assignment = ShiftAssignment.objects.get(shift=shift, employee=user)
    except ShiftAssignment.DoesNotExist:
        raise PermissionDenied("You have not taken this shift.")

    # Prevent cancellation if shift has started
    if timezone.now() >= shift.start_time:
        raise ValidationError("You cannot cancel a shift that has already started.")

    # Warn before canceling
    if not confirm:
        return {
            "confirm_required": True,
            "message": "Are you sure you want to cancel this shift? Cancelling will deduct 5 from your rate."
        }

    # Proceed with cancellation
    assignment.delete()

    if shift.filled_openings > 0:
        shift.filled_openings -= 1
        shift.save()

    # Deduct 5 from employee's rate
    if hasattr(user):
        user.rate = max(user.rate - 5, 0)
        user.save()

    # Notify employer and manager
    notify_user(shift.employer.user, f"{user.get_full_name()} has canceled shift {shift.id}.", related_shift=shift)
    notify_user("manager", f"{user.get_full_name()} canceled shift {shift.id}.", related_shift=shift)

    return {
        "success": True,
        "message": f"Shift {shift.id} canceled. 5 has been deducted from your rate.",
        "new_rate": user.rate
    }
