from django.conf import settings
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import FileExtensionValidator



APPROVAL_CHOICES = [
    ('created', 'Created'),
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
    email = models.EmailField(
        unique=True,
        help_text="User's email address, must be unique"
    )
    email_verified = models.BooleanField(
        default=False,
        help_text="Indicates if the user's email has been verified"
    )
    address = models.TextField(
        blank=True,
        null=True,
        help_text="User's address, can be used for verification or contact purposes"
    )
    role = models.ForeignKey(
        Role, 
        on_delete=models.SET_NULL, 
        null=True, blank=True,
        related_name='users',
        help_text="Role of the user in the system (e.g., Manager, Employer, Employee)"
    )
    date_of_birth = models.DateField(
        blank=True, 
        null=True, 
        help_text="Date of birth in YYYY-MM-DD format"
    )
    phone_verified = models.BooleanField(
        default=False,
        help_text="Indicates if the user's phone number has been verified"
    )
    phone_number = models.CharField(
        max_length=13, 
        blank=True, 
        null=True,
        help_text="Phone number in international format (e.g., +1234567890)"
    )
    total_rating = models.DecimalField(
        default=0.0, 
        max_digits=5, 
        decimal_places=2,
        help_text="Total rating score given to the user (sum of all ratings received)"
    )
    rating_count = models.PositiveIntegerField(
        default=0,
        help_text="Total number of ratings received by the user"
    )
    average_rating = models.FloatField(
        default=0.0,
        max_digits=5,
        decimal_places=2,
        help_text="Average rating based on total_rating and rating_count"
    )

    
    

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    class Meta:
        verbose_name = "User"
        verbose_name_plural = "Users"

    def __str__(self):
        return self.email

    
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
    approval_status = models.CharField(max_length=10, choices=APPROVAL_CHOICES, default='created')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
  
    def __str__(self):
        return f"{self.company_name} ({self.user.email})"


class EmployeeProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='employee_profile')
    id_card = models.FileField(upload_to='documents/id_cards/', blank=True, null=True,
        validators=[FileExtensionValidator(['pdf', 'jpg', 'jpeg', 'png'])])
    passport = models.FileField(upload_to='documents/passports/', blank=True, null=True,
        validators=[FileExtensionValidator(['pdf', 'jpg', 'jpeg', 'png'])])
    profile_image = models.ImageField(upload_to='images/profiles/', blank=True, null=True)
    certificates = models.FileField(upload_to='documents/certificates/', blank=True, null=True,
        validators=[FileExtensionValidator(['pdf', 'jpg', 'jpeg', 'png'])])
    approval_status = models.CharField(max_length=10, choices=APPROVAL_CHOICES, default='created')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    

    def __str__(self):
        return f"Employee Profile for {self.user.email}"
    
    