import logging
from django.core.exceptions import PermissionDenied
from notification.services import notify_user
from django.db import transaction
from shift.utils.google_address import geocode_address_google


logger = logging.getLogger('shift')



@transaction.atomic
def update_shift(user, shift, validated_data):
    # Ensure permission
    if not (user.is_manager or (user.is_employer and shift.employer.user == user)):
        raise PermissionDenied("You do not have permission to update this shift.")

    # If address is being updated, get new lat/lng
    new_address = validated_data.get('address')
    if new_address and new_address != shift.address:
        latitude, longitude = geocode_address_google(new_address)
        validated_data['latitude'] = latitude
        validated_data['longitude'] = longitude
        validated_data['location_map_url'] = f"https://maps.google.com/?q={latitude},{longitude}"

    # Apply updates
    for attr, value in validated_data.items():
        setattr(shift, attr, value)

    shift.save()
    logger.info(f"Shift updated by {user.email} - Shift ID: {shift.id}")
    notify_user(shift.employer.user, f"Shift {shift.id} updated.", related_shift=shift)
    return shift
