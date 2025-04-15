from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.throttling import ScopedRateThrottle
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from django.utils.decorators import method_decorator
from django.views.decorators.cache import never_cache
from django.core.cache import cache
from django.contrib.auth import get_user_model
from django.db import transaction
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.apple.views import AppleOAuth2Adapter
from dj_rest_auth.registration.views import SocialLoginView

from users.models import Role
from users.serializers.user_serializers import (
    RegisterStepOneSerializer,
    RegisterStepTwoSerializer,
    UserRegistrationSerializer,
    LoginSerializer,
    TOTPSetupSerializer,
    TOTPVerifySerializer
)
from users.utils import (
    generate_and_send_otp,
    validate_cached_otp,
    generate_qr_code_image
)

import logging

logger = logging.getLogger(__name__)
User = get_user_model()


def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        "access_token": str(refresh.access_token),
        "refresh_token": str(refresh)
    }


class AuthViewSet(viewsets.ViewSet):
    throttle_classes = [ScopedRateThrottle]
    permission_classes = [AllowAny]
    throttle_scope = "auth"

    @action(detail=False, methods=['post'], url_path='register-role')
    def register_role(self, request):
        try:
            role_name = request.data.get('role')
            if not role_name:
                return Response({"detail": "Role is required."}, status=status.HTTP_400_BAD_REQUEST)

            role = Role.objects.filter(name__iexact=role_name).first()
            if not role:
                return Response({"detail": "Invalid role provided."}, status=status.HTTP_400_BAD_REQUEST)

            request.session['registration_role'] = role.name
            request.session.modified = True
            return Response({"detail": "Role saved successfully."}, status=status.HTTP_200_OK)

        except Exception as e:
            logger.error(f"Error in register_role: {str(e)}")
            return Response({"detail": "Internal server error."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['post'], url_path='register-step-1')
    def register_step_1(self, request):
        try:
            serializer = RegisterStepOneSerializer(data=request.data)
            if serializer.is_valid():
                request.session['reg_step1'] = serializer.validated_data
                request.session.modified = True
                return Response({"detail": "Step 1 data saved."}, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            logger.error(f"Error in register_step_1: {str(e)}")
            return Response({"detail": "Internal server error."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['post'], url_path='register-step-2')
    def register_step_2(self, request):
        try:
            step1_data = request.session.get('reg_step1')
            role_name = request.session.get('registration_role')

            if not step1_data or not role_name:
                return Response({"detail": "Please complete previous steps."}, status=status.HTTP_400_BAD_REQUEST)

            serializer = RegisterStepTwoSerializer(data=request.data)
            if not serializer.is_valid():
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            with transaction.atomic():
                data = {
                    **step1_data,
                    **serializer.validated_data,
                    'role': role_name
                }

                data.pop('password_confirm')
                full_serializer = UserRegistrationSerializer(data=data)

                if full_serializer.is_valid():
                    user = full_serializer.save()
                    generate_and_send_otp(user, method='email')
                    request.session.flush()
                    return Response({"detail": "Registration complete. OTP sent."}, status=status.HTTP_201_CREATED)
                return Response(full_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            logger.exception("Error in register_step_2")
            return Response({"detail": "Internal server error."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @method_decorator(never_cache)
    @action(detail=False, methods=['post'], url_path='verify-otp')
    def verify_otp(self, request):
        otp_code = request.data.get('otp')
        email = request.session.get('otp_email')
        if not email or not otp_code:
            return Response({"detail": "OTP code is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"detail": "Invalid OTP session or user does not exist."}, status=status.HTTP_404_NOT_FOUND)

        valid, message, code = validate_cached_otp(email, otp_code)
        if not valid:
            return Response({"detail": message}, status=code)

        user.email_verified = True
        user.save()

        request.session.pop('otp_email', None)

        token = get_tokens_for_user(user)
        response = Response({
            "detail": "OTP verified successfully.",
            "access_token": token["access_token"],
            "refresh_token": token["refresh_token"]
        }, status=status.HTTP_200_OK)

        response.set_cookie(
            'access_token', token["access_token"],
            httponly=True, secure=True, samesite='Lax', path='/', max_age=3600
        )
        response.set_cookie(
            'refresh_token', token["refresh_token"],
            httponly=True, secure=True, samesite='Lax', path='/auth/', max_age=86400
        )

        return response

    @method_decorator(never_cache)
    @action(detail=False, methods=['post'], url_path='login')
    def login(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']

        request.session['otp_email'] = user.email
        request.session.modified = True

        return Response({
            "detail": "Login successful. Choose OTP method.",
            "next": "choose-otp-method"
        }, status=status.HTTP_200_OK)

    @method_decorator(never_cache)
    @action(detail=False, methods=['post'], url_path='choose-otp-method')
    def choose_otp_method(self, request):
        email = request.session.get('otp_email')
        method = request.data.get('otp_method')

        if not email or not method:
            return Response({"detail": "OTP method and session email are required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        if method == "authenticator":
            return Response({
                "detail": "Enter your authenticator app TOTP code.",
                "next": "verify-totp"
            })

        try:
            generate_and_send_otp(user, method=method)
        except Exception as e:
            return Response({"detail": f"Failed to send OTP: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({
            "detail": f"OTP sent to your {method}.",
            "next": "verify-otp"
        })

    @action(detail=False, methods=['post'], url_path='setup-totp', permission_classes=[IsAuthenticated])
    def setup_totp(self, request):
        serializer = TOTPSetupSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        result = serializer.save()
        return Response(result)

    @action(detail=False, methods=['post'], url_path='verify-totp', permission_classes=[AllowAny])
    def verify_totp(self, request):
        serializer = TOTPVerifySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]
        token = get_tokens_for_user(user)
        return Response({
            "detail": "TOTP verification successful.",
            **token
        })

    @action(detail=False, methods=['get'], url_path='qr-code', permission_classes=[IsAuthenticated])
    def qr_code(self, request):
        user = request.user
        if not user.totp_secret:
            user.generate_totp_secret()
        uri = user.get_totp_uri()
        return generate_qr_code_image(uri)

    @action(detail=False, methods=['post'], url_path='logout', permission_classes=[IsAuthenticated])
    def logout(self, request):
        refresh_token = request.data.get("refresh_token")
        if not refresh_token:
            return Response({"detail": "Refresh token is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
        except TokenError as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        response = Response({"detail": "Logout successful."}, status=status.HTTP_200_OK)
        response.delete_cookie('access_token', path='/')
        response.delete_cookie('refresh_token', path='/auth/')
        return response

    @action(detail=False, methods=['post'], url_path='resend-otp', throttle_scope='resend-otp')
    def resend_otp(self, request):
        email = request.data.get('email')
        method = request.data.get('method', 'email')

        if not email:
            return Response({"detail": "Email is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        if user.email_verified:
            return Response({"detail": "Email is already verified."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            generate_and_send_otp(user, method=method)
        except Exception as e:
            return Response({"detail": f"Failed to resend OTP: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({"detail": f"OTP resent to your {method} successfully."}, status=status.HTTP_200_OK)


# Social Login Views
class GoogleLogin(SocialLoginView):
    adapter_class = GoogleOAuth2Adapter

class AppleLogin(SocialLoginView):
    adapter_class = AppleOAuth2Adapter
