# users/services/notifications.py
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

def send_profile_notification(email, action, context):
    """
    Send profile notification email with proper error handling
    """
    try:
        subject = f"Your Profile Has Been {action.title()}"
        html_message = render_to_string(
            'emails/profile_notification.html',
            context
        )
        plain_message = render_to_string(
            'emails/profile_notification.txt',
            context
        )
        
        send_mail(
            subject=subject,
            message=plain_message,
            html_message=html_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[email],
            fail_silently=False
        )
    except Exception as e:
        logger.error(f"Failed to send notification to {email}: {str(e)}")
        # Consider adding retry logic or dead letter queue here