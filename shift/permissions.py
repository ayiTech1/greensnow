from rest_framework.permissions import BasePermission


class IsManager(BasePermission):
    def has_permission(self, request, view):
        user = request.user
        return hasattr(user, 'manager') and user.manager.is_active


class IsEmployer(BasePermission):
    def has_permission(self, request, view):
        user = request.user
        return hasattr(user, 'employer') and user.employer.is_active
    
class IsEmployee(BasePermission):
    def has_permission(self, request, view):
        user = request.user
        return hasattr(user, 'employee') and user.employee.is_active
    
class IsManagerOrEmployer(BasePermission):
    def has_permission(self, request, view):
        user = request.user
        return hasattr(user, 'manager') or hasattr(user, 'employer')


class CanViewShift(BasePermission):
    def has_object_permission(self, request, view, obj):
        user = request.user
        if user.is_manager:
            return True
        if user.is_employer:
            return obj.employer.user == user
        if user.is_employee:
            return obj.status == 'approved'
        return False


class CanEditShift(BasePermission):
    def has_object_permission(self, request, view, obj):
        user = request.user
        if user.is_manager:
            return True
        if user.is_employer and obj.employer.user == user:
            return True
        return False



class CanRateShiftPermission(BasePermission):
    

    def has_permission(self, request, view):
        # Allow all authenticated users to access list and retrieve views
        if view.action in ['list', 'retrieve']:
            return request.user and request.user.is_authenticated
        # For create and update, check object-level permission in has_object_permission
        return request.user and request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        
        user = request.user

        if view.action in ['update', 'partial_update', 'destroy']:
            # Only allow if user is the rater or the employer of the shift
            if obj.rater == user:
                return True
            if obj.shift.employer == user:
                return True
            return False
        return True
