from rest_framework import status
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from django.db import transaction
from authentications.utils import OTPService
from authentications.serializers import (
    PasswordResetRequestSerializer,
    PasswordResetVerifySerializer,
    PasswordResetConfirmSerializer
)
from .session_helpers import (
    prepare_password_reset_session,
    clear_password_reset_session,
    get_password_reset_user
)

User = get_user_model()

def request_password_reset(request):
    serializer = PasswordResetRequestSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    email = serializer.validated_data['email']
    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response(
            {"detail": "If this email exists, we'll send a reset code"},
            status=status.HTTP_200_OK
        )
    
    # Prepare session and send OTP
    prepare_password_reset_session(request, user)
    otp_service = OTPService()
    otp_service.send_otp(user.email, 'email', 'password_reset')
    
    return Response({
        "detail": "Reset code sent to your email",
        "next": "verify-reset-code"
    }, status=status.HTTP_200_OK)


def verify_password_reset(request):
    serializer = PasswordResetVerifySerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    user = get_password_reset_user(request)
    if not user:
        return Response(
            {"detail": "Reset session expired. Please start over."},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    otp_service = OTPService()
    if not otp_service.verify_otp(user.email, serializer.validated_data['otp'], 'password_reset'):
        return Response(
            {"detail": "Invalid or expired verification code"},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Mark verification complete in session
    request.session['password_reset']['verified'] = True
    request.session.modified = True
    
    return Response({
        "detail": "Verification successful",
        "next": "confirm-new-password"
    }, status=status.HTTP_200_OK)


def confirm_password_reset(request):
    serializer = PasswordResetConfirmSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    user = get_password_reset_user(request)
    if not user or not request.session.get('password_reset', {}).get('verified'):
        return Response(
            {"detail": "Verification required. Please start over."},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    with transaction.atomic():
        user.set_password(serializer.validated_data['new_password'])
        user.save()
        
        # Clear all active sessions
        user.auth_token_set.all().delete()
        
        clear_password_reset_session(request)
        
        return Response({
            "detail": "Password reset successfully",
            "next": "login"
        }, status=status.HTTP_200_OK)