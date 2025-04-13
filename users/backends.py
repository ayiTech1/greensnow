from django.conf import settings
from rest_framework import authentication
from rest_framework.exceptions import AuthenticationFailed
from .models import User
import jwt





class JWTAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        token = self.get_token_from_request(request)
        if not token:
            return None

        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            self.validate_payload(payload)
            user = self.get_user(payload)
            return (user, None)
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Token expired')
        except (jwt.InvalidTokenError, User.DoesNotExist):
            raise AuthenticationFailed('Invalid token')

    def get_token_from_request(self, request):
        # Check both header and cookies
        header = request.META.get('HTTP_AUTHORIZATION', '')
        if header.startswith('Bearer '):
            return header.split(' ')[-1]
        return request.COOKIES.get('access_token')

    def validate_payload(self, payload):
        if payload.get('token_type') != 'access':
            raise AuthenticationFailed('Invalid token type')
        if 'user_id' not in payload:
            raise AuthenticationFailed('Token has no user identifier')

    def get_user(self, payload):
        user = User.objects.get(id=payload['user_id'])
        if not user.is_active:
            raise AuthenticationFailed('User inactive or deleted')
        return user