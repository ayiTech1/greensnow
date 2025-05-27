import requests
from rest_framework.response import Response
from rest_framework import status
from notification.models import Device
from notification.serializers import NotificationSerializer
from notification.utils import send_notification

EXPO_PUSH_URL = "https://exp.host/--/api/v2/push/send"


def notify_user(user, message, notification_type='info', related_shift=None, related_assignment=None):
    data = {
        "user": user.id,
        "message": message,
        "notification_type": notification_type,
        "related_shift": related_shift.id if related_shift else None,
        "related_assignment": related_assignment.id if related_assignment else None,
    }

    serializer = NotificationSerializer(data=data)
    if serializer.is_valid():
        notification = serializer.save()

        try:
            device = Device.objects.get(user=user)
            headers = {
                "Content-Type": "application/json",
                "Accept": "application/json",
            }
            payload = {
                "to": device.device_token,
                "sound": "default",
                "title": "New Notification",
                "body": message,
            }
            response = requests.post(EXPO_PUSH_URL, json=payload, headers=headers)
            notification.push_sent = (response.status_code == 200)
            notification.save()
        except Device.DoesNotExist:
            print("Device not found for user:", user.email)
    else:
        print("Notification creation failed:", serializer.errors)


def save_and_notify(serializer, user=None, action='updated'):
    instance = serializer.save(user=user, approval_status='pending') if user else serializer.save(approval_status='pending')
    send_notification(instance.user.email, instance.user.username, action)


def change_status_and_notify(profile, status_value):
    profile.approval_status = status_value
    profile.save()
    send_notification(profile.user.email, profile.user.username, status_value)
    return Response({'status': status_value}, status=status.HTTP_200_OK)


def get_profiles_by_status(status_value, model):
    return model.objects.filter(approval_status=status_value)


def update_profile_and_notify(serializer, notify=True, approval_status='pending', action='updated'):
    instance = serializer.save(approval_status=approval_status)
    if notify:
        send_notification(instance.user.email, instance.user.username, action)
    return instance


def create_profile_and_notify(serializer, user=None, approval_status='pending', action='submitted', notify=True):
    instance = serializer.save(user=user, approval_status=approval_status) if user else serializer.save(approval_status=approval_status)
    if notify:
        send_notification(instance.user.email, instance.user.username, action)
    return instance
