from datetime import date
from dateutil.relativedelta import relativedelta
from django.contrib.auth.password_validation import validate_password
from django.utils.translation import gettext_lazy as _
from rest_framework import serializers
from users.models import User


def normalize_email(email):
    return email.strip().lower()

def normalize_phone(phone):
    return phone.strip()

def check_unique_user_field(field_name, value):
    filters = {field_name: value}
    if User.objects.filter(**filters).exists():
        raise serializers.ValidationError(f"{field_name.replace('_', ' ').capitalize()} already in use.")
    return value

def validate_age_limit(dob, minimum_age=13):
    age = relativedelta(date.today(), dob).years
    if age < minimum_age:
        raise serializers.ValidationError(f"You must be at least {minimum_age} years old.")
    return dob

def validate_password_match_and_strength(password, confirm_password):
    if password != confirm_password:
        raise serializers.ValidationError("Passwords do not match.")
    validate_password(password)
    return password

def get_user_by_email(email):
    try:
        return User.objects.get(email=email)
    except User.DoesNotExist:
        raise serializers.ValidationError("User not found.")