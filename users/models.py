from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import FileExtensionValidator
import pyotp

# Approval choices
APPROVAL_CHOICES = [
    ('pending', 'Pending'),
    ('approved', 'Approved'),
    ('rejected', 'Rejected')
]

class Role(models.Model):
    ROLE_CHOICES = [
        ('manager', 'Manager'),
        ('employer', 'Employer'),
        ('employee', 'Employee')
    ]

    name = models.CharField(max_length=20, choices=ROLE_CHOICES, unique=True)
    description = models.TextField(blank=True)

    class Meta:
        verbose_name = "Role"
        verbose_name_plural = "Roles"

    def __str__(self):
        return self.get_name_display()


class User(AbstractUser):
    email = models.EmailField(unique=True)
    email_verified = models.BooleanField(default=False)
    address = models.TextField(blank=True)
    role = models.ForeignKey(Role, on_delete=models.SET_NULL, null=True, blank=True)
    date_of_birth = models.DateField(blank=True, null=True, help_text="Date of birth in YYYY-MM-DD format")
    phone_verified = models.BooleanField(default=False)
    phone_number = models.CharField(max_length=13, blank=True, null=True)
    totp_secret = models.CharField(max_length=32, blank=True, null=True)

    def get_totp_uri(self):
        if not self.totp_secret:
            return None
        return pyotp.totp.TOTP(self.totp_secret).provisioning_uri(
            name=self.email,
            issuer_name="Greensnow"
        )

    def generate_totp_secret(self):
        self.totp_secret = pyotp.random_base32()
        self.save()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    class Meta:
        verbose_name = "User"
        verbose_name_plural = "Users"

    def __str__(self):
        return self.email

    # @property
    # def full_name(self):
    #     return f"{self.first_name} {self.last_name}".strip()

    @property
    def primary_role(self):
        return self.role.name if self.role else None
    @property
    def is_manager(self):
        return self.primary_role and self.primary_role.lower() == 'manager'

    @property
    def is_employer(self):
        return self.primary_role and self.primary_role.lower() == 'employer'

    @property
    def is_employee(self):
        return self.primary_role and self.primary_role.lower() == 'employee'



class EmployerProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='employer_profile')
    company_name = models.CharField(max_length=100, unique=True)
    address = models.TextField(blank=True, null=True)
    industry = models.CharField(max_length=100, blank=True, null=True)
    website = models.URLField(blank=True, null=True)
    
    approval_status = models.CharField(max_length=10, choices=APPROVAL_CHOICES, default='pending')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.company_name} ({self.user.email})"


class EmployeeProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='employee_profile')
    company = models.ForeignKey(EmployerProfile, on_delete=models.SET_NULL, blank=True, null=True, related_name='employees')

    id_card = models.FileField(upload_to='documents/id_cards/', blank=True, null=True,
        validators=[FileExtensionValidator(['pdf', 'jpg', 'jpeg', 'png'])])

    passport = models.FileField(upload_to='documents/passports/', blank=True, null=True,
        validators=[FileExtensionValidator(['pdf', 'jpg', 'jpeg', 'png'])])

    profile_image = models.ImageField(upload_to='images/profiles/', blank=True, null=True)

    certificates = models.FileField(upload_to='documents/certificates/', blank=True, null=True,
        validators=[FileExtensionValidator(['pdf', 'jpg', 'jpeg', 'png'])])

    approval_status = models.CharField(max_length=10, choices=APPROVAL_CHOICES, default='pending')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Employee Profile for {self.user.email}"
