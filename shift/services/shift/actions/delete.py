import logging
from django.core.exceptions import  PermissionDenied
from notification.services import notify_user
from django.db import transaction


logger = logging.getLogger('shift')


@transaction.atomic
def delete_shift(user, shift):
    if not user.is_manager:
        raise PermissionDenied("Only managers can delete shifts.")

    shift_id = shift.id
    shift.delete()
    logger.info(f"Shift deleted by {user.email} - Shift ID: {shift_id}")
    notify_user(user, f"You deleted shift {shift_id}")
