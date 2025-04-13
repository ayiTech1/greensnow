from django.urls import path, include
from rest_framework.routers import DefaultRouter
from users.views.user_views import AuthViewSet, GoogleLogin, AppleLogin
from users.views.user_profile_views import EmployerProfileViewSet, EmployeeProfileViewSet

router = DefaultRouter()

# Register the AuthViewSet once under 'auth'
router.register(r'auth', AuthViewSet, basename='auth')
router.register(r'employerprofiles', EmployerProfileViewSet, basename='employerprofiles')
router.register(r'employeeprofiles', EmployeeProfileViewSet, basename='employeeprofiles')

urlpatterns = [
    path('', include(router.urls)),
    path('auth/google/', GoogleLogin.as_view(), name='google_login'),
    path('auth/apple/', AppleLogin.as_view(), name='apple_login'),
    
]

