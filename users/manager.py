from users.models import EmployerProfile, EmployeeProfile
from notification.services import change_status_and_notify, get_profiles_by_status
from rest_framework.response import Response
from rest_framework import status

def get_manager_employer_profiles(user):
    return EmployerProfile.objects.all()

def get_manager_employee_profiles(user):
    return EmployeeProfile.objects.all()

def approve_employer_profile_action(viewset, request, pk=None):
    try:
        profile = EmployerProfile.objects.get(pk=pk)
    except EmployerProfile.DoesNotExist:
        return Response({'detail': 'EmployerProfile not found.'}, status=status.HTTP_404_NOT_FOUND)
    return change_status_and_notify(profile, 'approved')

def reject_employer_profile_action(viewset, request, pk=None):
    try:
        profile = EmployerProfile.objects.get(pk=pk)
    except EmployerProfile.DoesNotExist:
        return Response({'detail': 'EmployerProfile not found.'}, status=status.HTTP_404_NOT_FOUND)
    return change_status_and_notify(profile, 'rejected')

def approve_employee_profile_action(viewset, request, pk=None):
    try:
        profile = EmployeeProfile.objects.get(pk=pk)
    except EmployeeProfile.DoesNotExist:
        return Response({'detail': 'EmployeeProfile not found.'}, status=status.HTTP_404_NOT_FOUND)
    return change_status_and_notify(profile, 'approved')

def reject_employee_profile_action(viewset, request, pk=None):
    try:
        profile = EmployeeProfile.objects.get(pk=pk)
    except EmployeeProfile.DoesNotExist:
        return Response({'detail': 'EmployeeProfile not found.'}, status=status.HTTP_404_NOT_FOUND)
    return change_status_and_notify(profile, 'rejected')

