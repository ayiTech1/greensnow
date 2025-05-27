import logging
from rest_framework import status
from rest_framework.response import Response
from django.db import transaction
from django.contrib.auth import get_user_model
from users.models import Role
from authentications.serializers import (
    RegisterRoleSerializer,
    RegisterStepOneSerializer,
    RegisterStepTwoSerializer,
    UserRegistrationSerializer
)
from authentications.session_helpers import prepare_registration_session, clear_registration_session, prepare_otp_session
from authentications.otp_method import send_otp_to_user
from authentications.response import error_response

User = get_user_model()
NEXT_STEP_BASIC_INFO = "personal_information"
NEXT_STEP_COMPLETE_REGISTRATION = "contact_verification"
NEXT_STEP_VERIFY_CONTACT = "verify_contact"



def register_role(request) -> Response:
    """
    Step 1: Save selected role in session.
    """
    serializer = RegisterRoleSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    role_name = serializer.validated_data['role']
    role = Role.objects.filter(name__iexact=role_name).first()

    if not role:
        return error_response("Invalid role")

    prepare_registration_session(request, {'role': role.id})

    return Response({
        "detail": "Role saved successfully",
        "next_step": NEXT_STEP_BASIC_INFO
    }, status=status.HTTP_200_OK)

def register_basic(request) -> Response:
    """
    Step 2: Save personal information in session.
    """
    if not request.session.get('registration', {}).get('role'):
        return error_response("Please select a role first")

    serializer = RegisterStepOneSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    prepare_registration_session(request, {
        'step1_data': serializer.validated_data,
        'step': 'personal_info_completed'
    })

    return Response({
        "detail": "Personal information saved",
        "next_step": NEXT_STEP_COMPLETE_REGISTRATION
    }, status=status.HTTP_200_OK)

def complete_register(request) -> Response:
    """
    Step 3: Complete registration, create user, and send OTP.
    """
    session_data = request.session.get('registration', {})

    if not session_data.get('role') or not session_data.get('step1_data'):
        return error_response("Please complete previous steps first")

    serializer = RegisterStepTwoSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    with transaction.atomic():
        registration_data = {
            **session_data['step1_data'],
            **serializer.validated_data,
            'role': session_data['role']
        }

        user_serializer = UserRegistrationSerializer(data=registration_data)
        if not user_serializer.is_valid():
            return Response(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        user = user_serializer.save()

        # Set OTP session keys before sending OTP
        prepare_otp_session(request, user, method='email', identifier=user.email)

        send_otp = send_otp_to_user(user, 'email', 'registration')
        if "error" in send_otp:
            return Response(send_otp["error"], status=status.HTTP_400_BAD_REQUEST)
        
        clear_registration_session(request)  

        return Response({
            "detail": "Registration complete. Verification code sent.",
            "verification": ["email"],
            "next_step": NEXT_STEP_VERIFY_CONTACT
        }, status=status.HTTP_201_CREATED)
