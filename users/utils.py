import profile
import random
import io
import qrcode
from django.core.mail import send_mail
from django.core.cache import cache
from django.conf import settings
from django.http import HttpResponse
from twilio.rest import Client


# === OTP SECTION ===

def generate_otp():
    """Generate a 6-digit OTP"""
    return str(random.randint(100000, 999999))


def store_otp_in_cache(user, otp_code):
    """Cache OTP with a 5-minute expiry"""
    cache.set(f"otp_{user.email}", otp_code, timeout=300)


def get_cached_otp(email):
    """Retrieve cached OTP"""
    return cache.get(f"otp_{email}")


def delete_cached_otp(email):
    """Clear OTP from cache after verification"""
    cache.delete(f"otp_{email}")


def send_otp_email(user, otp_code):
    """Send OTP via email"""
    subject = "OTP Verification Code"
    message = f"Your OTP code is: {otp_code}"
    send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [user.email])


def send_otp_sms(user, otp_code):
    """Send OTP via SMS using Twilio"""
    if not user.phone_number:
        raise ValueError("User does not have a phone number.")
    
    message = f"Your OTP code is: {otp_code}"
    client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
    
    try:
        client.messages.create(
            body=message,
            from_=settings.TWILIO_PHONE_NUMBER,
            to=user.phone_number
        )
    except Exception as e:
        raise Exception(f"Failed to send OTP via SMS: {str(e)}")


def generate_and_send_otp(user, method="email"):
    """
    Generate and send OTP using the specified method: 'email' or 'sms'
    """
    otp_code = generate_otp()
    store_otp_in_cache(user, otp_code)

    if method == "email":
        send_otp_email(user, otp_code)
    elif method == "sms":
        send_otp_sms(user, otp_code)
    else:
        raise ValueError("Invalid OTP method. Use 'email' or 'sms'.")

    return otp_code


def validate_cached_otp(email, submitted_otp):
    """
    Validate submitted OTP against cached value.
    Returns tuple: (is_valid, message, status_code)
    """
    cached_otp = get_cached_otp(email)
    if not cached_otp:
        return False, "OTP has expired or is invalid.", 400

    if cached_otp != submitted_otp:
        return False, "Incorrect OTP.", 400

    delete_cached_otp(email)
    return True, "OTP verified.", 200


# === QR CODE SECTION ===

def generate_qr_code_image(uri: str) -> HttpResponse:
    """
    Generate a QR code image from a URI and return as HTTP response (image/png)
    """
    qr = qrcode.make(uri)
    buffer = io.BytesIO()
    qr.save(buffer, format='PNG')
    buffer.seek(0)
    return HttpResponse(buffer.read(), content_type="image/png")



# utils.py or wherever you defined it
def send_notification(email,first_name, action):
    send_mail(
        subject='Profile Submission Notice',
        message=f"Dear {first_name}, your profile has been {action} and is pending manager review.",
        from_email='noreply@greensnow.com',
        recipient_list=[email],
        fail_silently=True
    )

