from rest_framework import serializers
from .models import Notification, SMSLog, EmailLog, SMSTemplate, Signature


class NotificationSerializer(serializers.ModelSerializer):
    """
    Serializer for Notification model
    """
    recipient_email = serializers.EmailField(source='recipient_user.email', read_only=True)
    recipient_name = serializers.CharField(source='recipient_user.get_full_name', read_only=True)
    sender_email = serializers.EmailField(source='sender_user.email', read_only=True, allow_null=True)
    sender_name = serializers.CharField(source='sender_user.get_full_name', read_only=True, allow_null=True)

    class Meta:
        model = Notification
        fields = [
            'id', 'recipient_user', 'recipient_email', 'recipient_name',
            'sender_user', 'sender_email', 'sender_name', 'title',
            'message', 'notification_type', 'priority', 'is_read',
            'sent_at', 'read_at', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'sent_at', 'read_at', 'created_at', 'updated_at']


class SMSLogSerializer(serializers.ModelSerializer):
    """
    Serializer for SMSLog model
    """
    class Meta:
        model = SMSLog
        fields = [
            'id', 'recipient_phone', 'message', 'status',
            'sent_at', 'gateway_response', 'cost',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'sent_at', 'created_at', 'updated_at']


class EmailLogSerializer(serializers.ModelSerializer):
    """
    Serializer for EmailLog model
    """
    class Meta:
        model = EmailLog
        fields = [
            'id', 'recipient_email', 'subject', 'body', 'status',
            'sent_at', 'opened_at', 'clicked_at',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'sent_at', 'opened_at', 'clicked_at', 'created_at', 'updated_at']


class SMSTemplateSerializer(serializers.ModelSerializer):
    """
    Serializer for SMSTemplate model
    """
    template_type_display = serializers.CharField(source='get_template_type_display', read_only=True)
    message_length = serializers.SerializerMethodField()

    class Meta:
        model = SMSTemplate
        fields = [
            'id', 'name', 'template_type', 'template_type_display',
            'message', 'description', 'is_active', 'available_placeholders',
            'message_length', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_message_length(self, obj):
        """Return the length of the message template"""
        return len(obj.message) if obj.message else 0


class SignatureSerializer(serializers.ModelSerializer):
    """
    Serializer for Signature model
    """
    campus_name = serializers.CharField(source='campus.name', read_only=True, allow_null=True)
    signature_url = serializers.SerializerMethodField()

    class Meta:
        model = Signature
        fields = [
            'id', 'official_name', 'title', 'department',
            'signature_image', 'signature_url', 'campus', 'campus_name',
            'is_default', 'is_active', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_signature_url(self, obj):
        """Return the full URL for the signature image"""
        if obj.signature_image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.signature_image.url)
            return obj.signature_image.url
        return None
