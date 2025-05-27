from shift.models import ShiftAssignment

def get_in_progress_shift_assignments(user):
    qs = ShiftAssignment.objects.select_related(
        'employee__user',
        'shift__employer__user'
    ).filter(status='in_progress')

    if hasattr(user, 'manager'):
        return qs
    elif hasattr(user, 'employer'):
        return qs.filter(shift__employer=user.employer)
    elif hasattr(user, 'employee'):
        return qs.filter(employee=user.employee)
    
    return ShiftAssignment.objects.none()
