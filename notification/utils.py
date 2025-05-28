import requests
from notification.models import Device, Notification

def send_push_notification(user, message, notification_type=None, shift=None, assignment=None):
    devices = Device.objects.filter(user=user)

    if not devices.exists():
        print(f"No devices registered for user {user.email}")
        return

    success = False
    for device in devices:
        try:
            response = requests.post(
                'https://exp.host/--/api/v2/push/send',
                json={
                    'to': device.device_token,
                    'title': 'Notification',
                    'body': message,
                    'sound': 'default',
                },
                headers={'Content-Type': 'application/json'}
            )
            if response.status_code == 200:
                success = True
        except Exception as e:
            print(f"Error sending push to {device.device_token}: {e}")

    
    Notification.objects.create(
        user=user,
        message=message,
        notification_type=notification_type,
        related_shift=shift,
        related_assignment=assignment,
        push_sent=success,
    )


