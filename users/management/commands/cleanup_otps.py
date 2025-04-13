from django.core.management.base import BaseCommand
from django.utils import timezone
from users.models import OTP

class Command(BaseCommand):
    help = 'Cleans up expired OTPs'

    def handle(self, *args, **options):
        # Delete OTPs expired more than 1 day ago
        cutoff = timezone.now() - timezone.timedelta(days=1)
        expired_otps = OTP.objects.filter(expires_at__lt=cutoff)
        
        count = expired_otps.count()
        expired_otps.delete()
        
        self.stdout.write(self.style.SUCCESS(f"Successfully deleted {count} expired OTPs"))