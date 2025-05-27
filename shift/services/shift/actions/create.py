import logging
from django.core.exceptions import ValidationError, PermissionDenied
from users.models import EmployerProfile
from shift.models import Shift
from notification.services import notify_user
from django.db import transaction


logger = logging.getLogger('shift')

@transaction.atomic
def create_shift(user, validated_data):
    if user.is_manager:
        company_name = validated_data.get('company_name')
        if not company_name:
            raise ValidationError("Managers must provide a company_name.")
        try:
            employer = EmployerProfile.objects.get(company_name=company_name)
        except EmployerProfile.DoesNotExist:
            raise ValidationError("Invalid company name provided.")
        validated_data['employer'] = employer
        validated_data['status'] = 'approved'

    elif user.is_employer:
        try:
            employer = user.employer_profile
        except EmployerProfile.DoesNotExist:
            raise ValidationError("No employer profile found.")
        if employer.approval_status != 'approved':
            raise ValidationError("Employer profile must be approved before creating shifts.")
        validated_data['employer'] = employer
        validated_data['status'] = 'pending_approval'

    else:
        raise PermissionDenied("Only managers or employers can create shifts.")

    shift = Shift.objects.create(**validated_data)
    logger.info(f"Shift created by {user.email} (role: {user.primary_role}) - Shift ID: {shift.id}")
    notify_user(shift.employer.user, f"New shift created with status: {shift.status}", related_shift=shift)
    return shift
