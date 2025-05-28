import requests
from rest_framework.response import Response
from rest_framework import status
from notification.utils import send_push_notification

def save_and_notify(serializer, user=None, action='updated'):
    instance = serializer.save(user=user, approval_status='pending') if user else serializer.save(approval_status='pending')
    message = f"Your profile has been {action} and is pending approval."
    send_push_notification(instance.user, message, notification_type='USER_PROFILE')
    return instance


def change_status_and_notify(profile, status_value):
    profile.approval_status = status_value
    profile.save()
    message = f"Your profile approval status has been changed to {status_value}."
    send_push_notification(profile.user, message, notification_type='USER_PROFILE')
    return Response({'status': status_value}, status=status.HTTP_200_OK)


def update_profile_and_notify(serializer, notify=True, approval_status='pending', action='updated'):
    instance = serializer.save(approval_status=approval_status)
    if notify:
        message = f"Your profile has been {action} and is now {approval_status}."
        send_push_notification(instance.user, message, notification_type='USER_PROFILE')
    return instance


def create_profile_and_notify(serializer, user=None, approval_status='pending', action='submitted', notify=True):
    instance = serializer.save(user=user, approval_status=approval_status) if user else serializer.save(approval_status=approval_status)
    if notify:
        message = f"Your profile has been {action} and is awaiting approval."
        send_push_notification(instance.user, message, notification_type='USER_PROFILE')
    return instance
