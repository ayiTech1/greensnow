import logging
from rest_framework.decorators import action
from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from rest_framework.throttling import ScopedRateThrottle
from rest_framework.permissions import IsAuthenticated
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.apple.views import AppleOAuth2Adapter
from dj_rest_auth.registration.views import SocialLoginView
from authentications.register import (
    register_role,
    register_basic,
    complete_register as complete_registration,
)

from authentications.reset_password import ( 
    request_password_reset,
    verify_password_reset,
    confirm_password_reset,
)
from authentications.login import login
from authentications.resend_otp import resend_otp
from authentications.otp_method import select_otp_method
from authentications.verify_otp import verify_otp
from authentications.logout import logout 





logger = logging.getLogger(__name__)
class AuthViewSet(viewsets.ViewSet):
    throttle_classes = [ScopedRateThrottle]
    permission_classes = [AllowAny]
    throttle_scope = "auth"

    # --- Registration Steps ---
    @action(detail=False, methods=['post'], url_path='register-role')
    def register_role_action(self, request):
        return register_role(request)

    @action(detail=False, methods=['post'], url_path='register-basic')
    def register_basic_action(self, request):
        return register_basic(request)

    @action(detail=False, methods=['post'], url_path='register-complete')
    def register_complete_action(self, request):
        return complete_registration(request)

    # --- Dedicated Verification Endpoints ---
    @action(detail=False, methods=["post"], url_path="send-otp")
    def send_otp_action(self, request):
        return select_otp_method(request)

    @action(detail=False, methods=["post"], url_path="verify-otp")
    def verify_otp_action(self, request):
        return verify_otp(request)

    @action(detail=False, methods=["post"], url_path="resend-otp")
    def resend_otp_action(self, request):
        return resend_otp(request)

    # --- Dedicated Password Endpoints ---
    @action(detail=False, methods=["post"], url_path="reset-password")
    def reset_password_action(self, request):
        return request_password_reset(request)

    @action(detail=False, methods=["post"], url_path="verify-reset-password")
    def verify_reset_password_action(self, request):
        return verify_password_reset(request)

    @action(detail=False, methods=["post"], url_path="new-password")
    def new_password_action(self, request):
        return confirm_password_reset(request)

    @action(detail=False, methods=['post'], url_path='login')
    def login_action(self, request):
        return login(request)
    
    
    # @action(detail=False, methods=['post'], url_path='otp-method')
    # def otp_method_action(self, request):
    #     return select_otp_method(request)
    
    
    
    @action(detail=False, methods=["post"], url_path="logout", permission_classes=[IsAuthenticated])
    def logout_action(self, request):
        return logout(request)

class GoogleLogin(SocialLoginView):
    adapter_class = GoogleOAuth2Adapter

class AppleLogin(SocialLoginView):
    adapter_class = AppleOAuth2Adapter