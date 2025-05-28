from users.models import EmployerProfile
from users.services import (get_user_filtered_queryset, get_user_profile)
from notification.services import (save_and_notify)
from users.manager import get_manager_employer_profiles
from rest_framework.response import Response
from rest_framework import status

def get_employer_queryset(user):
    if getattr(user, 'is_manager', False):
        return get_manager_employer_profiles(user)
    return get_user_filtered_queryset(user, EmployerProfile)

def get_employer_profile(user):
    return get_user_profile(user, EmployerProfile)


def update_employer_profile(serializer):
    """
    Only allow the employer to update their own profile, set approval_status to 'pending', and send notification.
    """
    user = serializer.context['request'].user
    profile = get_employer_profile(user)
    if not profile or profile.user_id != user.id:
        return Response({'detail': 'You are not authorized to update this profile.'}, status=status.HTTP_403_FORBIDDEN)
    return save_and_notify(serializer, action='updated')

def list_employer_profiles(request, viewset):
    user = request.user
    if not (user.is_manager or user.is_employer):
        return Response({'detail': 'You are not authorized to view all employer profiles.'},
                        status=status.HTTP_403_FORBIDDEN)
    return super(type(viewset), viewset).list(request)


def me_employer_profile(viewset, request):
    profile = get_employer_profile(request.user)
    if not profile:
        return Response({'detail': 'Profile not found.'}, status=status.HTTP_404_NOT_FOUND)
    serializer = viewset.get_serializer(profile)
    return Response(serializer.data)

def status_employeer_profile(viewset, request):
    user = request.user
    if getattr(user, 'is_manager', False):
        queryset = get_employer_queryset(user)
        statuses = queryset.values('user__id', 'user__username', 'approval_status')
        return Response({"statuses": list(statuses)})
    else:
        profile = get_employer_profile(user)
        if not profile:
            return Response({'detail': 'Profile not found.'}, status=status.HTTP_404_NOT_FOUND)
        return Response({"status": profile.approval_status})
