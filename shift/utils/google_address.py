import logging
import requests
from django.conf import settings  
from django.core.exceptions import ValidationError

logger = logging.getLogger('shift')

def geocode_address_google(address):
    try:
        api_key = settings.GOOGLE_MAPS_API_KEY
        url = "https://maps.googleapis.com/maps/api/geocode/json"
        params = {
            'address': address,
            'key': api_key
        }
        response = requests.get(url, params=params)
        response.raise_for_status()
        data = response.json()
        if data['status'] != 'OK' or not data['results']:
            raise ValidationError("Could not geocode the address with Google Maps.")

        location = data['results'][0]['geometry']['location']
        lat = location['lat']
        lng = location['lng']
        return lat, lng
    except requests.RequestException as e:
        logger.error(f"Google geocoding failed: {e}")
        raise ValidationError("Failed to get location data from Google Maps.")