from django.core.cache import caches
from django.conf import settings
from authentications.task import send_otp_email, send_otp_sms
import random
import string
import logging

logger = logging.getLogger(__name__)

class OTPService:
    """Service for generating, storing, sending, and verifying OTP codes."""

    def __init__(self):
        """Initialize OTPService with the configured cache."""
        self.cache = caches['otp']

    def _log_error(self, message: str, exc: Exception):
        logger.error(f"{message}: {type(exc).__name__}: {exc}")

    def _log_warning(self, message: str):
        logger.warning(message)

    def generate_otp(self) -> str:
        """Generate a random numeric OTP code."""
        otp_length = getattr(settings, 'OTP_LENGTH', 6)
        return ''.join(random.SystemRandom().choice(string.digits) for _ in range(otp_length))

    def store_otp(self, identifier: str, purpose: str = 'auth') -> str:
        """Store the OTP in cache for the given identifier and purpose."""
        otp = self.generate_otp()
        cache_key = f'otp_{purpose}_{identifier}'
        expiry = getattr(settings, 'OTP_EXPIRY_MINUTES', 5) * 60
        try:
            self.cache.set(
                cache_key,
                {'otp': otp, 'attempts': 0},
                timeout=expiry
            )
            return otp
        except Exception as e:
            self._log_error("Failed to store OTP in cache", e)
            raise Exception("Unable to store OTP. Try again later.")

    def verify_otp(self, identifier: str, user_otp: str, purpose: str = 'auth') -> bool:
        """Verify the provided OTP for the identifier and purpose."""
        cache_key = f'otp_{purpose}_{identifier}'
        try:
            cached_data = self.cache.get(cache_key)

            if not cached_data:
                self._log_warning(f"OTP verification failed: No OTP found for {identifier}")
                return False

            if cached_data['attempts'] >= settings.OTP_MAX_ATTEMPTS:
                self._log_warning(f"OTP blocked: Max attempts for {identifier}")
                return False

            if cached_data['otp'] != user_otp:
                cached_data['attempts'] += 1

                # Safe update without resetting TTL
                try:
                    ttl = self.cache.ttl(cache_key)
                    self.cache.set(cache_key, cached_data, timeout=ttl if ttl > 0 else 60)
                except Exception as e:
                    self._log_error("Error updating OTP attempts", e)

                self._log_warning(f"OTP verification failed: Incorrect OTP for {identifier}")
                return False

            self.cache.delete(cache_key)
            return True

        except Exception as e:
            self._log_error(f"OTP verification error for {identifier}", e)
            return False

    def validate_user_method(self, user, method: str):
        """Validate that the user has the required contact method."""
        if method == 'email' and not user.email:
            return {"detail": "Email not provided by user"}
        if method == 'sms' and not user.phone_number:
            return {"detail": "Phone number not provided by user"}
        return None

    def send_otp(self, identifier: str, method: str, purpose: str) -> bool:
        """Send an OTP to the user via the specified method asynchronously."""
        cooldown_key = f'otp_cooldown_{purpose}_{identifier}'

        try:
            if self.cache.get(cooldown_key):
                self._log_warning(f"OTP resend attempt too soon for {identifier}")
                return False

            otp = self.store_otp(identifier, purpose)
            print(f"[DEBUG] OTP for {identifier} ({method}): {otp}")

            send_methods = {
                'email': send_otp_email,
                'sms': send_otp_sms
            }
            send_func = send_methods.get(method)
            if send_func:
                try:
                    send_func.apply_async(args=[identifier, otp])
                except Exception as e:
                    self._log_error("Failed to queue OTP task (is Celery/Redis running?)", e)
                    return False
            else:
                self._log_warning(f"Unknown OTP method '{method}' for {identifier}")
                return False

            self.cache.set(cooldown_key, True, timeout=30)
            return True

        except Exception as e:
            if "forcibly closed by the remote host" in str(e) or "Connection refused" in str(e):
                self._log_error("Redis or cache server is not running or was disconnected.", e)
            else:
                self._log_error(f"Failed to send OTP for {identifier}", e)
            return False
