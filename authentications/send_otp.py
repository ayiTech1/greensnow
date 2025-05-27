from authentications.utils import OTPService
from typing import  Dict, Any

def send_otp_to_user(user, method: str, purpose: str, request=None) -> Dict[str, Any]:
    """
    Send OTP to user via the specified method.
    """
    otp_service = OTPService()
    validation_error = otp_service.validate_user_method(user, method)
    if validation_error:
        return {"error": validation_error}

    identifier = user.email if method == 'email' else user.phone_number
    otp_sent = otp_service.send_otp(identifier, method, purpose)

    if not otp_sent:
        return {"error": {"detail": "OTP could not be sent. Please try again later."}}

    if request:
        request.session['otp_method'] = method
        request.session['otp_identifier'] = identifier
        request.session.modified = True

    return {
        "detail": f"OTP sent to your {method}",
        "method": method,
        "identifier": identifier
    }
