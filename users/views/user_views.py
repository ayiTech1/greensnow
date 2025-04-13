from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from users.models import Role
from users.serializers.user_serializers import (
    UserRegistrationSerializer, LoginSerializer,
    TOTPSetupSerializer, TOTPVerifySerializer
)
from users.utils import (
    generate_and_send_otp, validate_cached_otp,
    generate_qr_code_image
)
from django.core.cache import cache
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.throttling import  ScopedRateThrottle
from django.utils.decorators import method_decorator
from django.views.decorators.cache import never_cache
from rest_framework_simplejwt.exceptions import TokenError
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.apple.views import AppleOAuth2Adapter
from dj_rest_auth.registration.views import SocialLoginView


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

    @method_decorator(never_cache)
    @action(detail=False, methods=['post'], url_path='register-role')
    def register_role(self, request):
        role_name = request.data.get('role', '').lower()
        
        if not role_name:
            return Response(
                {"detail": "Role is required."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            Role.objects.get(name__iexact=role_name)
        except Role.DoesNotExist:
            return Response(
                {"detail": "Invalid role selection."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        request.session['registration_role'] = role_name
        request.session.save()
        
        return Response(
            {"detail": "Role registered successfully."},
            status=status.HTTP_200_OK
        )

    @method_decorator(never_cache)
    @action(detail=False, methods=['post'], url_path='register')
    def register(self, request):
        role_name = request.data.get('role') or request.session.get('registration_role')
        
        if not role_name:
            return Response(
                {"detail": "Complete role registration first."},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = UserRegistrationSerializer(
            data=request.data,
            context={'request': request}
        )
        
        if serializer.is_valid():
            user = serializer.save()
            
            try:
                generate_and_send_otp(user, method="email")
            except Exception:
                return Response(
                    {"detail": "User registered. OTP sending failed."},
                    status=status.HTTP_201_CREATED
                )
            
            if 'registration_role' in request.session:
                del request.session['registration_role']
                request.session.save()

            return Response(
                {"detail": "User registered successfully. OTP sent to email."},
                status=status.HTTP_201_CREATED
            )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @method_decorator(never_cache)
    @action(detail=False, methods=['post'], url_path='verify-otp')
    def verify_otp(self, request):
        email = request.data.get('email')
        otp_code = request.data.get('otp')

        if not email or not otp_code:
            return Response(
                {"detail": "Email and OTP are required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response(
                {"detail": "Invalid credentials."},
                status=status.HTTP_404_NOT_FOUND
            )

        valid, message, code = validate_cached_otp(email, otp_code)
        if not valid:
            return Response(
                {"detail": message},
                status=code
            )

        user.email_verified = True
        user.save()

        token = get_tokens_for_user(user)
        response = Response(
            {"detail": "OTP verified successfully."},
            status=status.HTTP_200_OK
        )
        
        response.set_cookie(
            'access_token',
            token["access_token"],
            httponly=True,
            secure=True,
            samesite='Lax',
            path='/',
            max_age=3600
        )
        response.set_cookie(
            'refresh_token',
            token["refresh_token"],
            httponly=True,
            secure=True,
            samesite='Lax',
            path='/auth/',
            max_age=86400
        )
        
        return response

    @method_decorator(never_cache)
    @action(detail=False, methods=['post'], url_path='login')
    def login(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        otp_method = serializer.validated_data['otp_method']

        if otp_method == "authenticator":
            return Response({
                "detail": "Enter your authenticator app TOTP code.",
                "next": "verify-totp"
            })

        try:
            generate_and_send_otp(user, method=otp_method)
        except Exception as e:
            return Response({"detail": f"Failed to send OTP: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({
            "detail": f"OTP sent to your {otp_method}. Please verify to complete login.",
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
        try:
            refresh_token = request.data.get("refresh_token")
            if not refresh_token:
                return Response({"detail": "Refresh token is required."}, status=status.HTTP_400_BAD_REQUEST)

            # Attempt to blacklist the refresh token
            try:
                token = RefreshToken(refresh_token)
                token.blacklist()  # Will only work if blacklist app is enabled
            except TokenError as e:
                return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)

            response = Response({"detail": "Logout successful."}, status=status.HTTP_200_OK)

            # Delete cookies if using cookie-based storage
            response.delete_cookie('access_token', path='/')
            response.delete_cookie('refresh_token', path='/auth/')

            return response

        except Exception as e:
            return Response({"detail": f"Logout failed: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

        
    @action(detail=False, methods=['post'], url_path='resend-otp', throttle_scope='resend-otp')
    def resend_otp(self, request):
        email = request.data.get('email')
        method = request.data.get('method', 'email')  # default to email

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
    


class GoogleLogin(SocialLoginView):
    adapter_class = GoogleOAuth2Adapter

class AppleLogin(SocialLoginView):
    adapter_class = AppleOAuth2Adapter



