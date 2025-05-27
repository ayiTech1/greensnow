from django.contrib.auth import get_user_model
from django.views.decorators.cache import never_cache
from rest_framework.response import Response
from rest_framework import status
from authentications.serializers import LoginSerializer
from .session_helpers import prepare_otp_session

User = get_user_model()

@never_cache
def login(request):
    serializer = LoginSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    user = serializer.validated_data['user']
    
    prepare_otp_session(request, user)

    return Response({
        "detail": "Please choose an OTP method",
        "next": "choose-otp-method"
    }, status=status.HTTP_200_OK)

