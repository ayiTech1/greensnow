
from shift.models import Shift
from django.db import transaction

@transaction.atomic
def get_approved_shifts_for_user(user):
    if user.is_manager:
        return Shift.objects.filter(status='approved')
    elif user.is_employer:
        return Shift.objects.filter(employer__user=user, status='approved')
    return Shift.objects.none()
