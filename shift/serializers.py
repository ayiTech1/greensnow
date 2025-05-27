from rest_framework import serializers
from users.models import User
from .models import Shift, ShiftAssignment, ShiftRating

# Minimal nested serializers for read-only nested display

class UserNestedSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']  

class ShiftNestedSerializer(serializers.ModelSerializer):
    class Meta:
        model = Shift
        fields = ['id', 'name', 'start_time', 'end_time']

class ShiftAssignmentNestedSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShiftAssignment
        fields = ['id', 'status', 'filled_openings']

# Main serializers

class ShiftSerializer(serializers.ModelSerializer):
    employer = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    manager = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), allow_null=True, required=False)

    # Nested read-only representations for GET
    employer_detail = UserNestedSerializer(source='employer', read_only=True)
    manager_detail = UserNestedSerializer(source='manager', read_only=True)

    class Meta:
        model = Shift
        fields = [
            "id",
            "employer",
            "employer_detail",
            "manager",
            "manager_detail",
            "name",
            "description",
            "location",
            "location_map_url",
            "company_name",
            "start_time",
            "end_time",
            "base_pay",
            "bonus_pay",
            "total_pay",
            "total_openings",
            "status",
            "is_active",
            "requirements",
            "prohibited_items",
            "image_url",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ('created_at', 'updated_at')

    def validate(self, data):
        user = self.context['request'].user
        company_name = data.get('company_name')
        
        # Validate start and end time (support partial update)
        start_time = data.get('start_time', getattr(self.instance, 'start_time', None))
        end_time = data.get('end_time', getattr(self.instance, 'end_time', None))
        if start_time and end_time and start_time >= end_time:
            raise serializers.ValidationError("start_time must be before end_time.")
        
        # Validate company_name depending on user role
        if user.is_manager and not company_name:
            raise serializers.ValidationError({"company_name": "This field is required for managers."})
        
        if not user.is_manager and company_name:
            raise serializers.ValidationError({"company_name": "Only managers can provide company_name."})

        return data


class ShiftAssignmentSerializer(serializers.ModelSerializer):
    shift = serializers.PrimaryKeyRelatedField(queryset=Shift.objects.all())
    employee = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())

    shift_detail = ShiftNestedSerializer(source='shift', read_only=True)
    employee_detail = UserNestedSerializer(source='employee', read_only=True)

    class Meta:
        model = ShiftAssignment
        fields = [
            "id",
            "shift",
            "shift_detail",
            "employee",
            "employee_detail",
            "status",
            "filled_openings",
            "actual_start_time",
            "actual_end_time",
            "notify_time_start",
            "completed_notes",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ('created_at', 'updated_at')

    def validate(self, data):
        actual_start = data.get('actual_start_time', getattr(self.instance, 'actual_start_time', None))
        actual_end = data.get('actual_end_time', getattr(self.instance, 'actual_end_time', None))
        if actual_start and actual_end and actual_start > actual_end:
            raise serializers.ValidationError("actual_start_time must be before or equal to actual_end_time.")
        return data




class ShiftRatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShiftRating
        fields = [
            'id', 'shift', 'assignment', 'rater', 'ratee',
            'rating', 'review', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'rater', 'ratee']
