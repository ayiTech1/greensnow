from django.db.models.signals import post_save
from django.dispatch import receiver
from django.apps import AppConfig
from django.contrib.auth.models import User
from users.models import  EmployerProfile, EmployeeProfile
from django.db.models.signals import post_migrate
from django.apps import apps
from .models import Role

class YourAppConfig(AppConfig):
    name = 'users'

    def ready(self):
        import users.signals

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        if instance.role and instance.role.name == 'employer':
            EmployerProfile.objects.create(user=instance)
        elif instance.role and instance.role.name == 'employee':
            EmployeeProfile.objects.create(user=instance)




@receiver(post_migrate)
def create_default_roles(sender, **kwargs):
    if sender.name == 'users':  # Only run for the 'users' app
        default_roles = ['Manager', 'Employer', 'Employee']
        for role_name in default_roles:
            Role.objects.get_or_create(name=role_name)





