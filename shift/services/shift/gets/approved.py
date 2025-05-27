from shift.models import Shift
from django.db import transaction
from django.utils import timezone

@transaction.atomic
def get_approved_shifts_for_user(user):
    today = timezone.now().date()

    if user.is_manager:
        return Shift.objects.filter(status='approved').order_by('date', 'start_time')

    elif user.is_employer:
        return Shift.objects.filter(
            employer__user=user,
            status='approved'
        ).order_by('date', 'start_time')

    elif user.is_employee:
        return Shift.objects.filter(
            status='approved',
            date__gte=today
        ).order_by('date', 'start_time')

    return Shift.objects.none()
