from django.contrib.auth import authenticate
from django.core.validators import RegexValidator
from django.utils.translation import gettext_lazy as _
import pyotp
from rest_framework import serializers
from users.models import Role, User
from authentications.serial_functions import (
    normalize_email,
    normalize_phone,
    validate_age_limit,
    check_unique_user_field,
    validate_password_match_and_strength,
    get_user_by_email,

)
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.contrib.auth.password_validation import validate_password

import logging
logger = logging.getLogger(__name__)


# --- Serializers ---
class RegisterRoleSerializer(serializers.Serializer):
    role = serializers.CharField()

    def validate_role(self, value):
        if not Role.objects.filter(name__iexact=value).exists():
            raise serializers.ValidationError("Invalid role provided")
        return value.lower()

class RegisterStepOneSerializer(serializers.Serializer):
    email = serializers.EmailField()
    phone_number = serializers.CharField(
        validators=[
            RegexValidator(
                regex=r'^\+?[0-9]{10,15}$',
                message="Phone number must be in international format (+XXXXXXXXXXX)"
            )
        ]
    )
    username = serializers.CharField(required=False, allow_blank=True)

    def validate_email(self, value):
        email = normalize_email(value)
        return check_unique_user_field('email', email)

    def validate_phone_number(self, value):
        phone = normalize_phone(value)
        return check_unique_user_field('phone_number', phone)


class RegisterStepTwoSerializer(serializers.Serializer):
    address = serializers.CharField()
    date_of_birth = serializers.DateField()
    password = serializers.CharField(write_only=True)
    password_confirm = serializers.CharField(write_only=True)

    def validate_date_of_birth(self, value):
        return validate_age_limit(value)

    def validate(self, data):
        validate_password_match_and_strength(data['password'], data['password_confirm'])
        return data


class UserRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email', 'username',  'password', 
                 'phone_number', 'date_of_birth', 'address', 'role']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        role_name = validated_data.pop('role')
        role = Role.objects.get(name__iexact=role_name)
        
        user = User.objects.create_user(
            **validated_data,
            role=role,
            email_verified=False,
            phone_verified=False
        )
        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        email = normalize_email(attrs.get("email"))
        password = attrs.get("password")

        # Prevent using email as password
        if email == password:
            raise serializers.ValidationError(_("Password cannot be the same as your email address."))

        user = authenticate(email=email, password=password)
        if not user:
            raise serializers.ValidationError(_("Invalid email or password."))
        if not user.is_active:
            raise serializers.ValidationError(_("This account is inactive."))

        # Ensure the email matches the user's email in the database (case-insensitive)
        if user.email.lower() != email.lower():
            raise serializers.ValidationError(_("Email does not match our records."))

        attrs['user'] = user
        return attrs
    

class OTPSendSerializer(serializers.Serializer):
    email_or_phone = serializers.CharField()
    method = serializers.ChoiceField(choices=[('email', 'Email'), ('sms', 'SMS')])


class OTPVerifySerializer(serializers.Serializer):
    email_or_phone = serializers.CharField()
    otp = serializers.CharField(min_length=6, max_length=6)
    method = serializers.ChoiceField(choices=[('email', 'Email'), ('sms', 'SMS')])


class ResendOTPSerializer(serializers.Serializer):
    method = serializers.ChoiceField(
        choices=[('email', 'Email'), ('sms', 'SMS')],
        help_text="Method to resend OTP (email or sms)"
    )

class TOTPSetupSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        email = normalize_email(value)
        return check_unique_user_field('email', email)


class TOTPVerifySerializer(serializers.Serializer):
    email = serializers.EmailField()
    totp_code = serializers.CharField(max_length=6)

    def validate(self, attrs):
        email = normalize_email(attrs.get("email"))
        code = attrs.get("totp_code")

        user = get_user_by_email(email)

        if not user.totp_secret:
            raise serializers.ValidationError("Authenticator app not set up.")

        totp = pyotp.TOTP(user.totp_secret)
        if not totp.verify(code, valid_window=1):
            raise serializers.ValidationError("Invalid TOTP code.")

        attrs["user"] = user
        return attrs



class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()

class PasswordResetVerifySerializer(serializers.Serializer):
    otp = serializers.CharField(min_length=6, max_length=6)

class PasswordResetConfirmSerializer(serializers.Serializer):
    new_password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    def validate(self, data):
        if data['new_password'] != data['confirm_password']:
            raise serializers.ValidationError({
                "confirm_password": "Passwords do not match"
            })
        
        try:
            validate_password(data['new_password'])
        except ValidationError as e:
            raise serializers.ValidationError({
                "new_password": list(e.messages)
            })
        
        return data