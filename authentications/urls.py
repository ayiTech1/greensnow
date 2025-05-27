from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AuthViewSet, GoogleLogin, AppleLogin

router = DefaultRouter()
router.register(r'', AuthViewSet, basename='auth')  

urlpatterns = [
    path('', include(router.urls)),
    path('google/', GoogleLogin.as_view(), name='google_login'),
    path('apple/', AppleLogin.as_view(), name='apple_login'),
]
