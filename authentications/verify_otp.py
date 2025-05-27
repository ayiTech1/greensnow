from rest_framework_simplejwt.tokens import RefreshToken
from django.views.decorators.cache import never_cache
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model
from authentications.utils import OTPService
from .session_helpers import clear_otp_session
from authentications.response import error_response

User = get_user_model()

@never_cache
def verify_otp(request):
    """
    Endpoint to verify OTP and issue JWT tokens.
    """
    user_id = request.session.get('otp_user_id')
    method = request.session.get('otp_method')
    identifier = request.session.get('otp_identifier')

    if not all([user_id, method, identifier]):
        return error_response("OTP verification session expired or invalid")

    otp = request.data.get('otp')
    if not otp or len(otp) != 6:
        return error_response("Please provide a valid 6-digit OTP")

    purpose = request.session.get('otp_purpose', 'registration')

    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return error_response("User not found", status.HTTP_404_NOT_FOUND)

    if not OTPService().verify_otp(identifier, otp, purpose):
        return error_response("Invalid or expired OTP")

    # Clear session after successful verification
    clear_otp_session(request)

    # Generate JWT tokens
    refresh = RefreshToken.for_user(user)

    # Set detail message based on purpose
    if purpose == 'registration':
        detail_msg = "Registration successful"
    else:
        detail_msg = "Login successful"

    return Response({
        "detail": detail_msg,
        "access": str(refresh.access_token),
        "refresh": str(refresh),
    }, status=status.HTTP_200_OK)
