from celery import shared_task
from django.utils import timezone
from datetime import timedelta
from notification.services import notify_user
from shift.models import ShiftAssignment
from django.contrib.auth.models import User

@shared_task
def notify_before_shift_start():
    now = timezone.now()
    notify_time_start = now + timedelta(minutes=10)
    notify_time_end = now + timedelta(minutes=11)  # small window to catch tasks

    assignments = ShiftAssignment.objects.filter(
        status='taken',
        shift__start_time__gte=notify_time_start,
        shift__start_time__lt=notify_time_end,
        notify_start_sent=False
    )

    for assignment in assignments:
        shift = assignment.shift
        employee = assignment.employee
        employer_user = shift.employer.user

        message = f"Shift {shift.id} will start in 10 minutes."

        # Notify employer
        notify_user(employer_user, message, related_shift=shift)
        # Notify employee
        notify_user(employee, message, related_shift=shift)

        # Notify all managers
        managers = User.objects.filter(is_manager=True)
        for manager in managers:
            notify_user(manager, f"{employee.get_full_name()}'s shift {shift.id} will start in 10 minutes.", related_shift=shift)

        # Mark as notified to avoid duplicate notifications
        assignment.notify_start_sent = True
        assignment.save(update_fields=['notify_start_sent'])

@shared_task
def auto_start_shifts():
    now = timezone.now()
    assignments = ShiftAssignment.objects.filter(status='taken', shift__start_time__lte=now)
    for assignment in assignments:
        assignment.status = 'in_progress'
        assignment.actual_start_time = now
        assignment.save()
        notify_user(assignment.shift.employer.user,
                    f"{assignment.employee.get_full_name()} shift {assignment.shift.id} automatically started.",
                    related_shift=assignment.shift)
        notify_user("manager",
                    f"{assignment.employee.get_full_name()} shift {assignment.shift.id} automatically started.",
                    related_shift=assignment.shift)

@shared_task
def expire_due_shift_assignments():
    now = timezone.now()
    # Find assignments still 'taken' but whose shift start time is in the past
    expired_assignments = ShiftAssignment.objects.filter(
        status='taken',
        shift__start_time__lt=now
    )

    for assignment in expired_assignments:
        assignment.status = 'expired'
        assignment.save(update_fields=['status'])

        employer_user = assignment.shift.employer.user
        employee = assignment.employee

        message = f"Shift {assignment.shift.id} has expired as it was not started on time."

        # Notify employer
        notify_user(employer_user, message, related_shift=assignment.shift)

        # Notify employee
        notify_user(employee, message, related_shift=assignment.shift)

        # Notify all managers
        managers = User.objects.filter(is_manager=True)
        for manager in managers:
            notify_user(manager, f"{employee.get_full_name()}'s shift {assignment.shift.id} has expired.", related_shift=assignment.shift)
