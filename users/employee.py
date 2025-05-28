from users.models import EmployeeProfile
from users.services import (
    get_user_filtered_queryset,
    get_user_profile_or_none,
    save_and_notify,
)
from users.manager import get_manager_employee_profiles
from rest_framework.response import Response
from rest_framework import status

def get_employee_queryset(user):
    if getattr(user, 'is_manager', False):
        return get_manager_employee_profiles(user)
    return get_user_filtered_queryset(user, EmployeeProfile)

def get_employee_profile(user):
    return get_user_profile_or_none(user, EmployeeProfile)



def update_employee_profile(serializer):
    """
    Only allow the employee to update their own profile, set approval_status to 'pending', and send notification.
    """
    user = serializer.context['request'].user
    profile = get_employee_profile(user)
    if not profile or profile.user_id != user.id:
        return Response({'detail': 'You are not authorized to update this profile.'}, status=status.HTTP_403_FORBIDDEN)
    return save_and_notify(serializer, action='updated')



def list_employee_profiles(request, viewset):
    user = request.user
    if not (user.is_manager or user.is_employer):
        return Response({'detail': 'Not authorized'}, status=status.HTTP_403_FORBIDDEN)
    return super(type(viewset), viewset).list(request)


def me_employee_profile(viewset, request):
    profile = get_employee_profile(request.user)
    if not profile:
        return Response({'detail': 'Profile not found.'}, status=status.HTTP_404_NOT_FOUND)
    serializer = viewset.get_serializer(profile)
    return Response(serializer.data)

def status_employee_profile(viewset, request):
    """
    Returns the approval status of the employee's profile.
    If manager, returns all employee statuses.
    """
    user = request.user
    if getattr(user, 'is_manager', False):
        queryset = get_employee_queryset(user)
        statuses = queryset.values('user__id', 'user__username', 'approval_status')
        return Response({"statuses": list(statuses)})
    else:
        profile = get_employee_profile(user)
        if not profile:
            return Response({'detail': 'Profile not found.'}, status=status.HTTP_404_NOT_FOUND)
        return Response({"status": profile.approval_status})
