from celery import shared_task
from django.core.mail import send_mail
from django.conf import settings
from twilio.rest import Client

# === OTP SECTION ===

@shared_task
def send_otp_email(identifier, otp_code):
    # Identifier is assumed to be the email address in this case
    user_email = identifier
    subject = "OTP Verification Code"
    message = f"Your OTP code is: {otp_code}"
    try:
        send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [user_email])
    except Exception as e:
        # Log or handle email sending error
        import logging
        logging.error(f"Failed to send OTP email to {user_email}: {type(e).__name__}: {e}")


@shared_task
def send_otp_sms(identifier, otp_code):
    # Identifier is assumed to be the phone number in this case
    phone_number = identifier
    message = f"Your OTP code is: {otp_code}"
    
    try:
        # Initialize Twilio client inside the task
        client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
        client.messages.create(
            body=message,
            from_=settings.TWILIO_PHONE_NUMBER,
            to=phone_number
        )
    except Exception as e:
        # Log or handle SMS sending error
        import logging
        logging.error(f"Failed to send OTP SMS to {phone_number}: {type(e).__name__}: {e}")
