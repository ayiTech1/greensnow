import pytest
from django.urls import reverse
from rest_framework.test import APIClient
from users.models import Role, User

@pytest.fixture
def api_client():
    return APIClient()

@pytest.fixture
def employee_role():
    return Role.objects.create(name="Employee")

def test_full_registration_flow(api_client, employee_role):
    # Step 1: Register Role
    res_role = api_client.post(reverse('auth-register-role'), {"role": "Employee"})
    assert res_role.status_code == 200
    assert res_role.data['detail'] == "Role saved successfully."

    # Step 2: Register Step 1
    step1_data = {
        "email": "newuser@example.com",
        "phone_number": "+1234567890",
        "first_name": "New",
        "last_name": "User"
    }
    res_step1 = api_client.post(reverse('auth-register-step-1'), step1_data)
    assert res_step1.status_code == 200
    assert res_step1.data['detail'] == "Step 1 data saved."

    # Step 3: Register Step 2
    step2_data = {
        "home_address": "456 Hope Road",
        "date_of_birth": "1990-01-01",
        "password": "Password123!",
        "password_confirm": "Password123!"
    }
    res_step2 = api_client.post(reverse('auth-register-step-2'), step2_data)
    assert res_step2.status_code == 201
    assert res_step2.data['detail'] == "Registration complete. OTP sent."

    # Verify user exists in DB
    assert User.objects.filter(email="newuser@example.com").exists()
