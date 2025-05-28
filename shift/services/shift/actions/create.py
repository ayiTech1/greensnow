import logging
from django.core.exceptions import ValidationError, PermissionDenied
from users.models import EmployerProfile
from shift.models import Shift
from notification.utils import send_push_notification
from django.db import transaction
from shift.utils.google_address import geocode_address_google

logger = logging.getLogger('shift')




@transaction.atomic
def create_shift(user, validated_data):
    address = validated_data.get('address')
    if not address:
        raise ValidationError("Address is required.")

    # 🌐 Geocode using Google Maps
    latitude, longitude = geocode_address_google(address)
    validated_data['latitude'] = latitude
    validated_data['longitude'] = longitude
    validated_data['location_map_url'] = f"https://maps.google.com/?q={latitude},{longitude}"

    # 🧠 Role-based logic
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
    send_push_notification(shift.employer.user, f"New shift created with status: {shift.status}", notification_type='SHIFT_CREATED', shift=shift)
    return shift
