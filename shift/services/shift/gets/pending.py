from shift.models import Shift
from django.db import transaction



@transaction.atomic
def get_pending_shifts_for_user(user):
    if user.is_manager:
        return Shift.objects.filter(status='pending_approval')
    elif user.is_employer:
        return Shift.objects.filter(employer__user=user, status='pending_approval')
    return Shift.objects.none()