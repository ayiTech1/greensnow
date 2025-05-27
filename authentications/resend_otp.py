from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import login as auth_login
from django.views.decorators.cache import never_cache
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model
from authentications.utils import OTPService
from authentications.send_otp import send_otp_to_user
from authentications.session_helpers import  get_otp_user_from_session
from authentications.serializers import ResendOTPSerializer
from authentications.response import error_response


User = get_user_model()

@never_cache
def resend_otp(request):
    """
    Endpoint to resend OTP.
    """
    serializer = ResendOTPSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    user = get_otp_user_from_session(request)
    if not user:
        return error_response("Session expired or invalid. Please start over.")

    method = serializer.validated_data['method']
    otp_result = send_otp_to_user(user, method, 'login', request)
    if "error" in otp_result:
        return Response(otp_result["error"], status=status.HTTP_400_BAD_REQUEST)

    return Response({
        "detail": f"New OTP sent to your {otp_result['method']}",
        "method": otp_result["method"],
        "next": "verify-otp"
    }, status=status.HTTP_200_OK)
