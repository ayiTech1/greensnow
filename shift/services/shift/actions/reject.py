import logging
from django.utils import timezone
from django.core.exceptions import ValidationError, PermissionDenied
from users.models import  User
from notification.utils import send_push_notification
from shift.models import Shift
from django.db import transaction


logger = logging.getLogger('shift')



@transaction.atomic
def reject_shift(user: User, shift_id: int, reason: str = ''):
    if not user.is_manager:
        raise PermissionDenied("Only managers can reject shifts.")
    try:
        shift = Shift.objects.get(pk=shift_id)
    except Shift.DoesNotExist:
        raise ValidationError("Shift not found.")

    if shift.status != 'pending_approval':
        raise ValidationError("Only shifts pending approval can be rejected.")

    shift.status = 'rejected'
    shift.rejection_reason = reason  
    shift.rejected_by = user  
    shift.rejected_at = timezone.now()
    shift.save()

    send_push_notification(shift.employer.user, f"Your shift {shift.id} has been rejected. Reason: {reason}", notification_type='SHIFT_REJECTED',shift=shift)
    send_push_notification(user, f"You rejected {shift.id}", notification_type='SHIFT_REJECTED',shift=shift)

    logger.info(f"Shift {shift.id} rejected by manager {user.email} with reason: {reason}")

    return shift