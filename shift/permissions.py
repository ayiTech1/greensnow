from rest_framework import permissions

class IsManager(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_manager()

class IsEmployer(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_employer()

class IsEmployee(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_employee()

class IsShiftEmployerOrManager(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.user.is_manager():
            return True
        return obj.employer == request.user

class IsApplicationEmployee(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.employee == request.user

class IsAssignmentEmployee(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.employee == request.user

class IsRatingParticipant(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return request.user in [obj.assignment.employee, obj.assignment.shift.employer]