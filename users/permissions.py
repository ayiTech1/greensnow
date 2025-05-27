from rest_framework import permissions
from rest_framework.permissions import BasePermission

class OwnerOrManagerOrEmployer(permissions.BasePermission):

    """
    Custom permission to only allow the Owner, Manager, or Employer to view a profile.
    - Owner can view, update, and delete their own profile.
    - Manager can view, update, and delete any profile.
    - Employer can view employee profiles but cannot update or delete them.
    """

    def has_permission(self, request, view):
        # Allow access to any authenticated user
        return request.user and request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        """
        Allow access if the user is:
        - The owner of the profile.
        - A manager (can access all profiles).
        - An employer (can only view employee profiles).
        """
        # Check if the user is the owner of the profile
        if obj.user == request.user:
            return True

        # Check if the user has the Manager role
        if request.user.role and request.user.role.name.lower() == "manager":
            return True
        
        # Check if the user has the Employer role and the target profile is an employee
        if request.user.role and request.user.role.name.lower() == "employer":
            # Employers can only view employee profiles, not update or delete them
            if obj.user.role and obj.user.role.name.lower() == "employee":
                if view.action in ['retrieve']:  # Employers can only view profiles
                    return True
                return False

        # If neither owner, manager, nor employer, deny access
        return False


class IsEmployeeOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow employees to edit their own profiles.
    All other users can only read the profiles.
    """

    def has_permission(self, request, view):
        # Allow access to any authenticated user
        return request.user and request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        # Allow read-only access for all authenticated users
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Allow write access only for the employee themselves
        return obj.user == request.user
    


class IsManager(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and hasattr(request.user, 'is_manager')
            and request.user.is_manager
        )



class IsEmployer(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_employer

class IsManagerOrEmployer(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and (
            request.user.is_manager or request.user.is_employer
        )
