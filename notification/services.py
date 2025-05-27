from rest_framework.response import Response
from rest_framework import status
from notification.utils import send_notification
from notification.serializers import NotificationSerializer


def get_user_filtered_queryset(user, model):
    # Fix: For OneToOneField to user, filter directly on user field
    return model.objects.filter(user=user)


def get_user_profile_or_none(user, model):
    """
    Generic function to get a user's profile or return None.
    """
    try:
        return model.objects.get(user=user)
    except model.DoesNotExist:
        return None  # Return None instead of raising DoesNotExist


def save_and_notify(serializer, user=None, action='updated'):
    """
    Generic function to save and notify.
    """
    if user:
        instance = serializer.save(user=user, approval_status='pending')
    else:
        instance = serializer.save(approval_status='pending')
    send_notification(instance.user.email, getattr(instance.user, 'username', ''), action)


def change_status_and_notify(profile, status_value):
    """
    Generic function to update approval status and notify.
    """
    profile.approval_status = status_value
    profile.save()
    send_notification(profile.user.email, getattr(profile.user, 'username', ''), status_value)
    return Response({'status': status_value}, status=status.HTTP_200_OK)


def get_profiles_by_status(status_value, model):
    """
    Get profiles with a given approval status.
    """
    return model.objects.filter(approval_status=status_value)

def update_profile_and_notify(serializer, notify=True, approval_status='pending', action='updated'):
    instance = serializer.save(approval_status=approval_status)
    if notify:
        send_notification(instance.user.email, getattr(instance.user, 'username', ''), action)
    return instance

def create_profile_and_notify(serializer, user=None, approval_status='pending', action='submitted', notify=True):
    """
    Saves the profile with the specified approval status and user.
    Optionally sends a notification.
    """
    if user:
        instance = serializer.save(user=user, approval_status=approval_status)
    else:
        instance = serializer.save(approval_status=approval_status)
    
    if notify:
        send_notification(
            instance.user.email,
            getattr(instance.user, 'username', ''),
            action
        )
    
    return instance




def notify_user(user, message, notification_type='info', related_shift=None, related_assignment=None):
    notification_data = {
        "user": user.id,
        "message": message,
        "notification_type": notification_type,
        "related_shift": related_shift.id if related_shift else None,
        "related_assignment": related_assignment.id if related_assignment else None,
    }

    serializer = NotificationSerializer(data=notification_data)
    if serializer.is_valid():
        serializer.save()
        print(f"Notification sent to {user.email}: {message}")
    else:
        print(f"Notification failed: {serializer.errors}")
