from django.forms import ValidationError
from shift.models import Shift

def update_shift_status(shift, new_status, user):
    try:
        shift.update_status(new_status, user)
    except ValidationError as e:
        raise ValidationError(f"Failed to update shift status: {str(e)}")
