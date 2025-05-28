import logging
from django.utils import timezone
from django.core.exceptions import ValidationError, PermissionDenied
from users.models import  User
from notification.utils import send_push_notification
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
    shift.approved_by = user  
    shift.approved_at = timezone.now()  
    shift.save()

    send_push_notification(shift.employer.user, f"Your shift {shift.id} has been approved.", notification_type='SHIFT_APPROVED', shift=shift)
    send_push_notification(user, f"You approved shift {shift.id}.", notification_type='SHIFT_APPROVED', shift=shift)

    logger.info(f"Shift {shift.id} approved by manager {user.email}")

    return shift

