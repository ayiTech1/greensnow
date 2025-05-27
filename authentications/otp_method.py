from django.views.decorators.cache import never_cache
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model
from authentications.response import error_response
from authentications.send_otp import send_otp_to_user
from authentications.session_helpers import prepare_otp_session  # updated to include session update

User = get_user_model()
ALLOWED_OTP_METHODS = ['email', 'sms']

@never_cache
def select_otp_method(request):
    if not request.session.get('otp_user_id'):
        return error_response("Please login first")

    method = request.data.get('method')
    if not method or method not in ALLOWED_OTP_METHODS:
        return error_response("Please specify a valid OTP method (email or sms)")

    try:
        user = User.objects.get(id=request.session['otp_user_id'])
    except User.DoesNotExist:
        return error_response("User not found", status.HTTP_404_NOT_FOUND)

    identifier = user.email if method == 'email' else user.phone_number

    # Save chosen method and identifier in session
    prepare_otp_session(
        request=request,
        user=user,
        method=method,
        identifier=identifier,
        purpose='login'
    )

    otp_result = send_otp_to_user(user, method, 'login', request)
    if "error" in otp_result:
        return Response(otp_result["error"], status=status.HTTP_400_BAD_REQUEST)

    return Response({
        "detail": otp_result["detail"],
        "method": otp_result["method"],
        "next": "verify-otp"
    }, status=status.HTTP_200_OK)
