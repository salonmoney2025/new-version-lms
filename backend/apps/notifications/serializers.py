"""
Notifications Serializers
"""
from rest_framework import serializers
from .models import (
    NotificationTemplate, Notification, EmailLog, SMSLog, NotificationPreference
)


class NotificationTemplateSerializer(serializers.ModelSerializer):
    """Serializer for Notification Templates"""
    notification_type_display = serializers.CharField(source='get_notification_type_display', read_only=True)
    channel_display = serializers.CharField(source='get_channel_display', read_only=True)

    class Meta:
        model = NotificationTemplate
        fields = [
            'id', 'name', 'notification_type', 'notification_type_display',
            'channel', 'channel_display', 'subject', 'body', 'html_body',
            'available_variables', 'is_active',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class NotificationSerializer(serializers.ModelSerializer):
    """Serializer for Notifications"""
    recipient_name = serializers.CharField(source='recipient.get_full_name', read_only=True)
    notification_type_display = serializers.CharField(source='get_notification_type_display', read_only=True)
    priority_display = serializers.CharField(source='get_priority_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    is_read = serializers.SerializerMethodField()

    class Meta:
        model = Notification
        fields = [
            'id', 'recipient', 'recipient_name', 'template',
            'title', 'message', 'html_content',
            'notification_type', 'notification_type_display',
            'priority', 'priority_display',
            'status', 'status_display',
            'sent_at', 'delivered_at', 'read_at', 'is_read',
            'action_url', 'action_text',
            'related_object_type', 'related_object_id',
            'created_at'
        ]
        read_only_fields = ['id', 'sent_at', 'delivered_at', 'read_at', 'created_at']

    def get_is_read(self, obj):
        return obj.read_at is not None


class SendNotificationSerializer(serializers.Serializer):
    """Serializer for sending notifications"""
    recipient_ids = serializers.ListField(
        child=serializers.IntegerField(),
        min_length=1
    )
    title = serializers.CharField(max_length=200)
    message = serializers.CharField(style={'base_template': 'textarea.html'})
    notification_type = serializers.ChoiceField(choices=NotificationTemplate.NOTIFICATION_TYPES)
    priority = serializers.ChoiceField(
        choices=Notification.PRIORITY_CHOICES,
        default='MEDIUM'
    )
    action_url = serializers.CharField(max_length=500, required=False, allow_blank=True)
    action_text = serializers.CharField(max_length=100, required=False, allow_blank=True)


class EmailLogSerializer(serializers.ModelSerializer):
    """Serializer for Email Logs"""
    recipient_user_name = serializers.CharField(source='recipient_user.get_full_name', read_only=True, allow_null=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = EmailLog
        fields = [
            'id', 'recipient_email', 'recipient_user', 'recipient_user_name',
            'notification', 'subject', 'body', 'html_body',
            'sent_at', 'status', 'status_display', 'error_message',
            'opened_at', 'clicked_at', 'created_at'
        ]
        read_only_fields = ['id', 'sent_at', 'opened_at', 'clicked_at', 'created_at']


class SMSLogSerializer(serializers.ModelSerializer):
    """Serializer for SMS Logs"""
    recipient_user_name = serializers.CharField(source='recipient_user.get_full_name', read_only=True, allow_null=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = SMSLog
        fields = [
            'id', 'recipient_phone', 'recipient_user', 'recipient_user_name',
            'notification', 'message', 'sent_at', 'status', 'status_display',
            'error_message', 'provider_message_id', 'cost', 'created_at'
        ]
        read_only_fields = ['id', 'sent_at', 'created_at']


class NotificationPreferenceSerializer(serializers.ModelSerializer):
    """Serializer for Notification Preferences"""
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)

    class Meta:
        model = NotificationPreference
        fields = [
            'id', 'user', 'user_name',
            'enable_in_app', 'enable_email', 'enable_sms', 'enable_push',
            'disabled_notification_types',
            'enable_quiet_hours', 'quiet_hours_start', 'quiet_hours_end',
            'enable_daily_digest', 'daily_digest_time',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
