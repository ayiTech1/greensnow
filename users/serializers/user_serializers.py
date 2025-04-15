from datetime import date
from dateutil.relativedelta import relativedelta

from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from django.core.validators import RegexValidator
from django.utils.translation import gettext_lazy as _

from rest_framework import serializers

import pyotp

from users.models import User


# --- Validators ---
def validate_unique_email(value):
    value = value.strip().lower()
    if User.objects.filter(email=value).exists():
        raise serializers.ValidationError("Email already in use.")
    return value


def validate_unique_phone(value):
    value = value.strip()
    if User.objects.filter(phone_number=value).exists():
        raise serializers.ValidationError("Phone number already in use.")
    return value


# --- Serializers ---
class RegisterStepOneSerializer(serializers.Serializer):
    email = serializers.EmailField(validators=[validate_unique_email])
    phone_number = serializers.CharField(
        validators=[
            RegexValidator(
                regex=r'^\+?[0-9]{10,15}$',
                message="Phone number must be in international format (+XXXXXXXXXXX)"
            ),
            validate_unique_phone
        ]
    )
    username = serializers.CharField(required=False, allow_blank=True)

    def validate_email(self, value):
        return value.strip().lower()


class RegisterStepTwoSerializer(serializers.Serializer):
    address = serializers.CharField()
    date_of_birth = serializers.DateField()
    password = serializers.CharField(write_only=True)
    password_confirm = serializers.CharField(write_only=True)

    def validate_date_of_birth(self, value):
        age = relativedelta(date.today(), value).years
        if age < 13:
            raise serializers.ValidationError("You must be at least 13 years old.")
        return value

    def validate(self, data):
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError("Passwords do not match.")
        validate_password(data['password'])
        return data


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = [
            'email', 'phone_number', 'username',
            'address', 'date_of_birth', 'password'
        ]
        extra_kwargs = {
            'password': {'write_only': True},
        }

    def create(self, validated_data):
        # Fallback: use email as username if not provided
        if not validated_data.get('username'):
            validated_data['username'] = validated_data['email']
        return User.objects.create_user(**validated_data)


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    otp_method = serializers.ChoiceField(choices=["email", "sms", "authenticator"])

    def validate(self, attrs):
        email = attrs.get("email").strip().lower()
        password = attrs.get("password")

        user = authenticate(email=email, password=password)
        if not user:
            raise serializers.ValidationError(_("Invalid email or password."))
        if not user.is_active:
            raise serializers.ValidationError(_("This account is inactive."))

        attrs['user'] = user
        return attrs


class TOTPSetupSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        value = value.strip().lower()
        if not User.objects.filter(email=value).exists():
            raise serializers.ValidationError("User not found.")
        return value

    # Note: TOTP setup logic (secret generation, QR code, etc.) should be handled in the view or a service function.


class TOTPVerifySerializer(serializers.Serializer):
    email = serializers.EmailField()
    totp_code = serializers.CharField(max_length=6)

    def validate(self, attrs):
        email = attrs.get("email").strip().lower()
        code = attrs.get("totp_code")

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise serializers.ValidationError("Invalid credentials.")

        if not user.totp_secret:
            raise serializers.ValidationError("Authenticator app not set up.")

        totp = pyotp.TOTP(user.totp_secret)
        if not totp.verify(code, valid_window=1):
            raise serializers.ValidationError("Invalid TOTP code.")

        attrs["user"] = user
        return attrs
