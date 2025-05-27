import requests
from notification.models import Device, Notification
from celery import shared_task
from users.models import User

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

    # Create the notification record
    Notification.objects.create(
        user=user,
        message=message,
        notification_type=notification_type or 'SHIFT_REMINDER',
        related_shift=shift,
        related_assignment=assignment,
        push_sent=success,
    )



@shared_task
def send_notification_task(user_id, username, action):
    try:
        user = User.objects.get(id=user_id)
        message = f"Dear {username}, your profile has been {action} and is pending manager review."
        send_push_notification(user, message, notification_type='USER_PROFILE_UPDATED')  
    except User.DoesNotExist:
        print(f"User with ID {user_id} not found.")

def send_notification(user_id, username, action):
    send_notification_task.delay(user_id, username, action)
