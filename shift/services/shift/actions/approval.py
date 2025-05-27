import logging
from django.utils import timezone
from django.core.exceptions import ValidationError, PermissionDenied
from users.models import  User
from notification.services import notify_user
from shift.models import Shift
from django.db import transaction


logger = logging.getLogger('shift')



@transaction.atomic
def approve_shift(user: User, shift_id: int):
    if not user.is_manager:
        raise PermissionDenied("Only managers can approve shifts.")
    try:
        shift = Shift.objects.get(pk=shift_id)
    except Shift.DoesNotExist:
        raise ValidationError("Shift not found.")

    if shift.status != 'pending_approval':
        raise ValidationError("Only shifts pending approval can be approved.")

    shift.status = 'approved'
    shift.approved_by = user  # Assuming you have this field to track manager who approved
    shift.approved_at = timezone.now()  # Assuming you have this field for timestamp
    shift.save()

    notify_user(shift.employer.user, f"Your shift {shift.id} has been approved.", related_shift=shift)
    notify_user("manager", f"Shift {shift.id} has been approved.", related_shift=shift)

    logger.info(f"Shift {shift.id} approved by manager {user.email}")

    return shift

