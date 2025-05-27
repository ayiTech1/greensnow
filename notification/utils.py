from django.core.mail import send_mail
from celery import shared_task

@shared_task
def send_notification_task(email, username, action):
    send_mail(
        subject='Profile Submission Notice',
        message=f"Dear {username}, your profile has been {action} and is pending manager review.",
        from_email='noreply@greensnow.com',
        recipient_list=[email],
        fail_silently=True
    )

def send_notification(email, username, action):
    send_notification_task.delay(email, username, action)

