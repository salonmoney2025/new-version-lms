"""
Notifications Admin Interface
"""
from django.contrib import admin
from .models import (
    NotificationTemplate, Notification, EmailLog, SMSLog, NotificationPreference
)


@admin.register(NotificationTemplate)
class NotificationTemplateAdmin(admin.ModelAdmin):
    list_display = ['name', 'notification_type', 'channel', 'is_active']
    list_filter = ['notification_type', 'channel', 'is_active']
    search_fields = ['name', 'subject']


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ['title', 'recipient', 'notification_type', 'priority', 'status', 'created_at']
    list_filter = ['notification_type', 'priority', 'status', 'created_at']
    search_fields = ['title', 'message', 'recipient__email']
    ordering = ['-created_at']


@admin.register(EmailLog)
class EmailLogAdmin(admin.ModelAdmin):
    list_display = ['subject', 'recipient_email', 'status', 'sent_at']
    list_filter = ['status', 'sent_at']
    search_fields = ['recipient_email', 'subject']
    ordering = ['-created_at']


@admin.register(SMSLog)
class SMSLogAdmin(admin.ModelAdmin):
    list_display = ['recipient_phone', 'status', 'sent_at']
    list_filter = ['status', 'sent_at']
    search_fields = ['recipient_phone']
    ordering = ['-created_at']


@admin.register(NotificationPreference)
class NotificationPreferenceAdmin(admin.ModelAdmin):
    list_display = ['user', 'enable_in_app', 'enable_email', 'enable_sms', 'enable_push']
    list_filter = ['enable_in_app', 'enable_email', 'enable_sms', 'enable_push']
    search_fields = ['user__email', 'user__first_name', 'user__last_name']
