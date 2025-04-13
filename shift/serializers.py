from rest_framework import serializers
from .models import (
    Shift, ShiftApproval, ShiftApplication, 
    ShiftAssignment, Notification, ShiftRating, ShiftStatus
)
from users.models import User
from django.utils import timezone
from rest_framework.exceptions import ValidationError

class ShiftSerializer(serializers.ModelSerializer):
    employer_name = serializers.CharField(source='employer.full_name', read_only=True)
    manager_name = serializers.CharField(source='manager.full_name', read_only=True)
    available_openings = serializers.IntegerField(read_only=True)
    total_pay = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    can_apply = serializers.SerializerMethodField()
    
    class Meta:
        model = Shift
        fields = [
            'id', 'name', 'description', 'location', 'location_map_url', 'company_name',
            'start_time', 'end_time', 'base_pay', 'bonus_pay', 'total_pay',
            'total_openings', 'filled_openings', 'available_openings',
            'status', 'employer', 'employer_name', 'manager', 'manager_name',
            'requirements', 'prohibited_items', 'image_url', 'created_at',
            'updated_at', 'can_apply'
        ]
        extra_kwargs = {
            'employer': {'read_only': True},
            'manager': {'read_only': True},
            'status': {'read_only': True},
        }
    
    def get_can_apply(self, obj):
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            return False
        
        return (
            request.user.is_employee() and
            obj.status == ShiftStatus.PUBLISHED and
            obj.available_openings > 0 and
            obj.start_time > timezone.now() and
            not obj.applications.filter(employee=request.user).exists()
        )
    
    def validate(self, data):
        if 'start_time' in data and 'end_time' in data:
            if data['start_time'] >= data['end_time']:
                raise ValidationError("End time must be after start time.")
        
        if 'total_openings' in data and 'filled_openings' in data:
            if data['filled_openings'] > data['total_openings']:
                raise ValidationError("Filled openings cannot exceed total openings.")
        
        return data
    
    def create(self, validated_data):
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            raise ValidationError("Authentication required")
        
        validated_data['employer'] = request.user
        return super().create(validated_data)

class ShiftApprovalSerializer(serializers.ModelSerializer):
    manager_name = serializers.CharField(source='manager.full_name', read_only=True)
    shift_details = ShiftSerializer(source='shift', read_only=True)
    
    class Meta:
        model = ShiftApproval
        fields = [
            'id', 'shift', 'shift_details', 'manager', 'manager_name',
            'status', 'comments', 'created_at', 'updated_at'
        ]
        extra_kwargs = {
            'manager': {'read_only': True},
        }
    
    def update(self, instance, validated_data):
        request = self.context.get('request')
        if not request or not request.user.is_authenticated or not request.user.is_manager():
            raise ValidationError("Only managers can update approvals")
        
        if instance.manager != request.user:
            raise ValidationError("You can only update your own approvals")
        
        return super().update(instance, validated_data)

class ShiftApplicationSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source='employee.full_name', read_only=True)
    shift_details = ShiftSerializer(source='shift', read_only=True)
    
    class Meta:
        model = ShiftApplication
        fields = [
            'id', 'shift', 'shift_details', 'employee', 'employee_name',
            'status', 'notes', 'employer_notes', 'created_at', 'updated_at'
        ]
        extra_kwargs = {
            'employee': {'read_only': True},
            'status': {'read_only': True},
        }
    
    def validate(self, data):
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            raise ValidationError("Authentication required")
        
        shift = data.get('shift') or self.instance.shift if self.instance else None
        if not shift:
            raise ValidationError("Shift is required")
        
        if not shift.check_availability():
            raise ValidationError("This shift is not available for applications")
        
        if request.user == shift.employer:
            raise ValidationError("You cannot apply to your own shift")
        
        return data
    
    def create(self, validated_data):
        request = self.context.get('request')
        validated_data['employee'] = request.user
        return super().create(validated_data)

class ShiftAssignmentSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source='employee.full_name', read_only=True)
    shift_details = ShiftSerializer(source='shift', read_only=True)
    
    class Meta:
        model = ShiftAssignment
        fields = [
            'id', 'shift', 'shift_details', 'employee', 'employee_name',
            'application', 'actual_start_time', 'actual_end_time',
            'completed_notes', 'created_at', 'updated_at'
        ]
    
    def validate(self, data):
        if 'actual_start_time' in data and 'actual_end_time' in data:
            if data['actual_start_time'] >= data['actual_end_time']:
                raise ValidationError("End time must be after start time")
        
        return data

class NotificationSerializer(serializers.ModelSerializer):
    notification_type_display = serializers.CharField(
        source='get_notification_type_display', read_only=True
    )
    
    class Meta:
        model = Notification
        fields = [
            'id', 'notification_type', 'notification_type_display',
            'message', 'is_read', 'email_sent', 'push_sent',
            'created_at', 'updated_at'
        ]
        extra_kwargs = {
            'is_read': {'read_only': True},
            'email_sent': {'read_only': True},
            'push_sent': {'read_only': True},
        }

class ShiftRatingSerializer(serializers.ModelSerializer):
    rater_name = serializers.CharField(source='rater.full_name', read_only=True)
    ratee_name = serializers.CharField(source='ratee.full_name', read_only=True)
    
    class Meta:
        model = ShiftRating
        fields = [
            'id', 'shift', 'assignment', 'rater', 'rater_name',
            'ratee', 'ratee_name', 'rating', 'comments',
            'created_at', 'updated_at'
        ]
        extra_kwargs = {
            'rater': {'read_only': True},
        }
    
    def validate(self, data):
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            raise ValidationError("Authentication required")
        
        assignment = data.get('assignment') or self.instance.assignment if self.instance else None
        if not assignment:
            raise ValidationError("Assignment is required")
        
        # Validate that the rater is either the employee or employer
        if request.user not in [assignment.employee, assignment.shift.employer]:
            raise ValidationError("You can only rate shifts you're involved in")
        
        # Validate that the ratee is the other party
        ratee = data.get('ratee')
        if ratee not in [assignment.employee, assignment.shift.employer]:
            raise ValidationError("Invalid ratee")
        
        # Validate that the rater and ratee are different
        if request.user == ratee:
            raise ValidationError("You cannot rate yourself")
        
        # Validate that the shift is completed
        if assignment.shift.status != ShiftStatus.COMPLETED:
            raise ValidationError("You can only rate completed shifts")
        
        return data
    
    def create(self, validated_data):
        request = self.context.get('request')
        validated_data['rater'] = request.user
        return super().create(validated_data)