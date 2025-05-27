import logging
from django.core.exceptions import  PermissionDenied
from notification.services import notify_user
from django.db import transaction


logger = logging.getLogger('shift')

@transaction.atomic
def update_shift(user, shift, validated_data):
    if user.is_manager or (user.is_employer and shift.employer.user == user):
        for attr, value in validated_data.items():
            setattr(shift, attr, value)
        shift.save()
        logger.info(f"Shift updated by {user.email} - Shift ID: {shift.id}")
        notify_user(shift.employer.user, f"Shift {shift.id} updated.", related_shift=shift)
        return shift

    raise PermissionDenied("You do not have permission to update this shift.")
