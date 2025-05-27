from shift.models import ShiftAssignment

def get_taken_shift_assignments_for_user(user):
    if user.is_manager:
        return ShiftAssignment.objects.filter(status="taken")

    if user.is_employer:
        return ShiftAssignment.objects.filter(shift__employer=user, status="taken")

    return ShiftAssignment.objects.none()

