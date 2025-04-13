from rest_framework import serializers
from users.models import EmployerProfile, EmployeeProfile


class EmployerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmployerProfile
        fields = ['user', 'company_name', 'address', 'industry', 'website', 'created_at', 'updated_at']
    
    # You can add custom validation here if necessary.
    def validate_company_name(self, value):
        if len(value) < 3:
            raise serializers.ValidationError("Company name must be at least 3 characters long.")
        return value

    def validate_website(self, value):
        if value and not value.startswith("http"):
            raise serializers.ValidationError("Website URL must start with 'http'.")
        return value


class EmployeeProfileSerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(source='company.company_name', read_only=True)

    class Meta:
        model = EmployeeProfile
        fields = ['user', 'company', 'company_name', 'id_card', 'passport', 'profile_image', 'certificates', 'created_at', 'updated_at']
        read_only_fields = ['user', 'company_name', 'created_at', 'updated_at']

    # You can add custom validation here if necessary.
    def validate_id_card(self, value):
        if value and not value.name.endswith('.pdf'):
            raise serializers.ValidationError("ID card must be in PDF format.")
        return value

    def validate_passport(self, value):
        if value and not value.name.endswith('.pdf'):
            raise serializers.ValidationError("Passport must be in PDF format.")
        return value

    def validate_certificates(self, value):
        if value and not value.name.endswith('.pdf'):
            raise serializers.ValidationError("Certificate must be in PDF format.")
        return value
