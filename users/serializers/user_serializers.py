from datetime import date, datetime
from dateutil.relativedelta import relativedelta
from django.core.exceptions import ValidationError  
from django.contrib.auth.password_validation import validate_password
from django.utils.translation import gettext_lazy as _
from django.contrib.auth import authenticate
from rest_framework import serializers
import re
import pyotp  

from users.models import User, Role


class UserRegistrationSerializer(serializers.ModelSerializer):
    role = serializers.CharField(write_only=True)
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    password_confirm = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})

    class Meta:
        model = User
        fields = [
            'email', 'username', 'first_name', 'last_name',
            'phone_number', 'date_of_birth', 'password',
            'password_confirm', 'role'
        ]
        extra_kwargs = {
            'email': {'required': True},
            'first_name': {'required': True},
            'last_name': {'required': True},
            'date_of_birth': {'required': True},
        }

    def validate_email(self, value):
        value = value.strip().lower()
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError(_("Email address is already in use."))
        if not re.match(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', value):
            raise serializers.ValidationError(_("Enter a valid email address."))
        return value

    def validate_username(self, value):
        value = value.strip().lower()
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError(_("Username is already taken."))
        if len(value) < 3 or not re.match(r'^[a-zA-Z0-9_.-]+$', value):
            raise serializers.ValidationError(_("Username must be at least 3 characters and can only contain letters, numbers, underscores, hyphens, and dots."))
        return value

    def validate_phone_number(self, value):
        if value:
            if not value.startswith('+'):
                raise serializers.ValidationError(_("Phone number must start with a '+' sign."))
            if len(value) < 12:
                raise serializers.ValidationError(_("Phone number should have at least 10 digits."))
            if not re.match(r'^\+[0-9]{9,15}$', value):
                raise serializers.ValidationError(_("Phone number can only contain digits after '+' sign."))
        return value

    def validate_first_name(self, value):
        value = value.strip()
        if not value:
            raise serializers.ValidationError(_("First name cannot be empty."))
        if len(value) < 2:
            raise serializers.ValidationError(_("First name must be at least 2 characters long."))
        if not re.match(r'^[a-zA-Z\- ]+$', value):
            raise serializers.ValidationError(_("First name can only contain letters, hyphens, and spaces."))
        return value

    def validate_last_name(self, value):
        value = value.strip()
        if not value:
            raise serializers.ValidationError(_("Last name cannot be empty."))
        if len(value) < 2:
            raise serializers.ValidationError(_("Last name must be at least 2 characters long."))
        if not re.match(r'^[a-zA-Z\- ]+$', value):
            raise serializers.ValidationError(_("Last name can only contain letters, hyphens, and spaces."))
        return value

    def validate_date_of_birth(self, value):
        if not isinstance(value, date):
            try:
                value = datetime.strptime(str(value), '%Y-%m-%d').date()
            except ValueError:
                raise serializers.ValidationError(_("Invalid date format. Use YYYY-MM-DD."))

        today = date.today()
        age = relativedelta(today, value).years

        if value > today:
            raise serializers.ValidationError(_("Date of birth cannot be in the future."))
        if age < 16:
            raise serializers.ValidationError(_("User must be at least 16 years old."))
        if age > 120:
            raise serializers.ValidationError(_("Please enter a valid date of birth."))
        return value

    def validate_password(self, value):
        try:
            validate_password(value)
        except ValidationError as e:
            raise serializers.ValidationError(list(e.messages))

        if len(value) < 10:
            raise serializers.ValidationError(_("Password must be at least 10 characters long."))
        if not re.search(r'[A-Z]', value):
            raise serializers.ValidationError(_("Password must contain at least one uppercase letter."))
        if not re.search(r'[a-z]', value):
            raise serializers.ValidationError(_("Password must contain at least one lowercase letter."))
        if not re.search(r'[0-9]', value):
            raise serializers.ValidationError(_("Password must contain at least one digit."))
        if not re.search(r'[^A-Za-z0-9]', value):
            raise serializers.ValidationError(_("Password must contain at least one special character."))
        return value

    def validate_role(self, value):
        value = value.strip().lower()
        try:
            Role.objects.get(name__iexact=value)
        except Role.DoesNotExist:
            raise serializers.ValidationError(_(f"Role '{value}' does not exist."))
        return value

    def validate(self, data):
        if data.get('password') != data.get('password_confirm'):
            raise serializers.ValidationError({'password_confirm': _("Passwords do not match.")})
        return data

    def create(self, validated_data):
        role_name = validated_data.pop('role').strip().lower()
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')

        role = Role.objects.get(name__iexact=role_name)

        user = User(
            email=validated_data['email'].strip().lower(),
            username=validated_data['username'].strip().lower(),
            first_name=validated_data['first_name'].strip(),
            last_name=validated_data['last_name'].strip(),
            phone_number=validated_data.get('phone_number'),
            date_of_birth=validated_data['date_of_birth'],
            role=role
        )
        user.set_password(password)
        user.save()
        return user


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
        try:
            User.objects.get(email=value)
        except User.DoesNotExist:
            raise serializers.ValidationError("User not found.")
        return value

    def create(self, validated_data):
        user = User.objects.get(email=validated_data["email"].strip().lower())
        if not user.totp_secret:
            user.generate_totp_secret()
            user.save()
        return {"otp_uri": user.get_totp_uri()}


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
        if not totp.verify(code):
            raise serializers.ValidationError("Invalid TOTP code.")

        attrs["user"] = user
        return attrs
