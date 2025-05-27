from django.urls import path, include
from rest_framework.routers import DefaultRouter
# from users.views.user_views import AuthViewSet, GoogleLogin, AppleLogin
# from users.views.user_profile_views import EmployerProfileViewSet, EmployeeProfileViewSet
from .views import EmployerProfileViewSet, EmployeeProfileViewSet

router = DefaultRouter()

# Register the AuthViewSet once under 'auth'
# router.register(r'auth', AuthViewSet, basename='auth')

router.register(r'employerprofiles', EmployerProfileViewSet, basename='employerprofiles')
router.register(r'employeeprofiles', EmployeeProfileViewSet, basename='employeeprofiles')

# The endpoint to update an employer profile is:
# PATCH /users/employerprofiles/<pk>/
# or
# PUT /users/employerprofiles/<pk>/
# (where <pk> is the ID of the EmployerProfile you want to update)

# Example:
# PATCH /users/employerprofiles/1/
# PUT /users/employerprofiles/1/

# The error "No EmployerProfile matches the given query." means there is no EmployerProfile with the given <pk> (ID).
# To fix:
# 1. Make sure the EmployerProfile with the specified ID exists in the database.
# 2. You can list all employer profiles with:
#    GET /users/employerprofiles/
#    to find valid IDs.
# 3. Use a valid <pk> in your PATCH or PUT request.

# If you have a DRF ViewSet for EmployerProfile (e.g., EmployerProfileViewSet),
# and you want managers to approve an employer profile, you typically add a custom action.

# Example endpoint (assuming you have such an action in your ViewSet):
# POST /users/employerprofiles/<pk>/approve/

# <pk> is the ID of the EmployerProfile to approve.

# Example:
# POST /users/employerprofiles/1/approve/

# This requires you to have an @action(detail=True, methods=['post']) called "approve" in EmployerProfileViewSet.

# If you get "You do not have permission to perform this action." when calling
# POST /users/employerprofiles/<pk>/approve/
# it means your view's permission_classes or custom action permission is blocking the request.

# To fix:
# 1. Ensure the user making the request is authenticated and has the correct role (e.g., is_manager).
# 2. In EmployerProfileViewSet, your @action for "approve" should have:
#    permission_classes = [IsAuthenticated, IsManager]  # or your custom manager permission

# Example for your view:
# @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated, IsManager])
# def approve(self, request, pk=None):
#     ...approval logic...

urlpatterns = [
    path('', include(router.urls)),
    
    
]

