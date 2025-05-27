from rest_framework import serializers
from notification.models import Notification
from shift.serializers import ShiftAssignmentNestedSerializer, ShiftNestedSerializer, UserNestedSerializer
from shift.models import Shift, ShiftAssignment
from notification.models import Device
from users.models import User

class DeviceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Device
        fields = ['device_token', 'device_type']

class NotificationSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    related_shift = serializers.PrimaryKeyRelatedField(queryset=Shift.objects.all(), allow_null=True, required=False)
    related_assignment = serializers.PrimaryKeyRelatedField(queryset=ShiftAssignment.objects.all(), allow_null=True, required=False)

    user_detail = UserNestedSerializer(source='user', read_only=True)
    related_shift_detail = ShiftNestedSerializer(source='related_shift', read_only=True)
    related_assignment_detail = ShiftAssignmentNestedSerializer(source='related_assignment', read_only=True)

    class Meta:
        model = Notification
        fields = [
            "id",
            "user",
            "user_detail",
            "notification_type",
            "message",
            "related_shift",
            "related_shift_detail",
            "related_assignment",
            "related_assignment_detail",
            "is_read",
            "email_sent",
            "push_sent",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ('created_at', 'updated_at')
