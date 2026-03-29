"""
Notifications Models
Handles in-app, email, and SMS notifications
"""
from django.db import models
from django.utils import timezone
from apps.authentication.models import BaseModel, User


class NotificationTemplate(BaseModel):
    """
    Templates for different types of notifications
    """
    NOTIFICATION_TYPES = (
        ('ADMISSION', 'Admission Notification'),
        ('COURSE_REGISTRATION', 'Course Registration'),
        ('EXAM_SCHEDULE', 'Exam Schedule'),
        ('RESULT_PUBLISHED', 'Result Published'),
        ('FEE_PAYMENT', 'Fee Payment'),
        ('FEE_REMINDER', 'Fee Reminder'),
        ('LIBRARY_DUE', 'Library Book Due'),
        ('LIBRARY_OVERDUE', 'Library Book Overdue'),
        ('HOSTEL_ALLOCATION', 'Hostel Allocation'),
        ('MAINTENANCE_UPDATE', 'Maintenance Update'),
        ('GENERAL_ANNOUNCEMENT', 'General Announcement'),
        ('EVENT_REMINDER', 'Event Reminder'),
        ('CUSTOM', 'Custom Notification'),
    )

    CHANNEL_CHOICES = (
        ('IN_APP', 'In-App'),
        ('EMAIL', 'Email'),
        ('SMS', 'SMS'),
        ('PUSH', 'Push Notification'),
    )

    name = models.CharField(max_length=200)
    notification_type = models.CharField(max_length=50, choices=NOTIFICATION_TYPES)
    channel = models.CharField(max_length=20, choices=CHANNEL_CHOICES)

    # Template Content
    subject = models.CharField(max_length=200, help_text="For email/push notifications")
    body = models.TextField(help_text="Use {{variable}} for dynamic content")
    html_body = models.TextField(blank=True, null=True, help_text="HTML version for emails")

    # Variables
    available_variables = models.JSONField(
        default=list,
        help_text="List of available variables for this template"
    )

    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['name']
        indexes = [
            models.Index(fields=['notification_type', 'channel']),
        ]

    def __str__(self):
        return f"{self.name} ({self.get_channel_display()})"


class Notification(BaseModel):
    """
    Individual notification sent to users
    """
    PRIORITY_CHOICES = (
        ('LOW', 'Low'),
        ('MEDIUM', 'Medium'),
        ('HIGH', 'High'),
        ('URGENT', 'Urgent'),
    )

    STATUS_CHOICES = (
        ('PENDING', 'Pending'),
        ('SENT', 'Sent'),
        ('DELIVERED', 'Delivered'),
        ('READ', 'Read'),
        ('FAILED', 'Failed'),
    )

    recipient = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='notifications'
    )
    template = models.ForeignKey(
        NotificationTemplate,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='sent_notifications'
    )

    # Content
    title = models.CharField(max_length=200)
    message = models.TextField()
    html_content = models.TextField(blank=True, null=True)

    # Metadata
    notification_type = models.CharField(
        max_length=50,
        choices=NotificationTemplate.NOTIFICATION_TYPES
    )
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='MEDIUM')

    # Status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    sent_at = models.DateTimeField(null=True, blank=True)
    delivered_at = models.DateTimeField(null=True, blank=True)
    read_at = models.DateTimeField(null=True, blank=True)

    # Links
    action_url = models.CharField(max_length=500, blank=True, null=True)
    action_text = models.CharField(max_length=100, blank=True, null=True)

    # Related Objects (for context)
    related_object_type = models.CharField(max_length=50, blank=True, null=True)
    related_object_id = models.IntegerField(blank=True, null=True)

    # Error tracking
    error_message = models.TextField(blank=True, null=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['recipient', 'status']),
            models.Index(fields=['recipient', 'read_at']),
            models.Index(fields=['created_at']),
        ]

    def __str__(self):
        return f"{self.title} - {self.recipient.get_full_name()}"

    def mark_as_sent(self):
        self.status = 'SENT'
        self.sent_at = timezone.now()
        self.save()

    def mark_as_delivered(self):
        self.status = 'DELIVERED'
        self.delivered_at = timezone.now()
        self.save()

    def mark_as_read(self):
        if not self.read_at:
            self.read_at = timezone.now()
            self.status = 'READ'
            self.save()


class EmailLog(BaseModel):
    """
    Log of all emails sent from the system
    """
    recipient_email = models.EmailField()
    recipient_user = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='emails_received'
    )
    notification = models.ForeignKey(
        Notification,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='email_logs'
    )

    # Email Details
    subject = models.CharField(max_length=200)
    body = models.TextField()
    html_body = models.TextField(blank=True, null=True)

    # Sending Details
    sent_at = models.DateTimeField(null=True, blank=True)
    status = models.CharField(
        max_length=20,
        choices=[
            ('PENDING', 'Pending'),
            ('SENT', 'Sent'),
            ('FAILED', 'Failed'),
        ],
        default='PENDING'
    )
    error_message = models.TextField(blank=True, null=True)

    # Tracking
    opened_at = models.DateTimeField(null=True, blank=True)
    clicked_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['recipient_email', 'status']),
            models.Index(fields=['sent_at']),
        ]

    def __str__(self):
        return f"{self.subject} to {self.recipient_email}"


class SMSLog(BaseModel):
    """
    Log of all SMS sent from the system
    """
    recipient_phone = models.CharField(max_length=20)
    recipient_user = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='sms_received'
    )
    notification = models.ForeignKey(
        Notification,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='sms_logs'
    )

    # SMS Details
    message = models.TextField()

    # Sending Details
    sent_at = models.DateTimeField(null=True, blank=True)
    status = models.CharField(
        max_length=20,
        choices=[
            ('PENDING', 'Pending'),
            ('SENT', 'Sent'),
            ('DELIVERED', 'Delivered'),
            ('FAILED', 'Failed'),
        ],
        default='PENDING'
    )
    error_message = models.TextField(blank=True, null=True)

    # Provider details
    provider_message_id = models.CharField(max_length=200, blank=True, null=True)
    cost = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['recipient_phone', 'status']),
            models.Index(fields=['sent_at']),
        ]

    def __str__(self):
        return f"SMS to {self.recipient_phone}"


class NotificationPreference(BaseModel):
    """
    User preferences for notifications
    """
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='notification_preferences'
    )

    # Channel Preferences
    enable_in_app = models.BooleanField(default=True)
    enable_email = models.BooleanField(default=True)
    enable_sms = models.BooleanField(default=False)
    enable_push = models.BooleanField(default=True)

    # Notification Type Preferences (stored as JSON)
    disabled_notification_types = models.JSONField(
        default=list,
        help_text="List of notification types the user has disabled"
    )

    # Quiet Hours
    enable_quiet_hours = models.BooleanField(default=False)
    quiet_hours_start = models.TimeField(null=True, blank=True)
    quiet_hours_end = models.TimeField(null=True, blank=True)

    # Digest Settings
    enable_daily_digest = models.BooleanField(default=False)
    daily_digest_time = models.TimeField(null=True, blank=True)

    class Meta:
        verbose_name = 'Notification Preference'
        verbose_name_plural = 'Notification Preferences'

    def __str__(self):
        return f"Preferences for {self.user.get_full_name()}"

    def should_send_notification(self, notification_type, channel):
        """Check if notification should be sent based on preferences"""
        # Check if notification type is disabled
        if notification_type in self.disabled_notification_types:
            return False

        # Check channel preferences
        if channel == 'IN_APP' and not self.enable_in_app:
            return False
        elif channel == 'EMAIL' and not self.enable_email:
            return False
        elif channel == 'SMS' and not self.enable_sms:
            return False
        elif channel == 'PUSH' and not self.enable_push:
            return False

        # Check quiet hours
        if self.enable_quiet_hours and self.quiet_hours_start and self.quiet_hours_end:
            current_time = timezone.now().time()
            if self.quiet_hours_start <= current_time <= self.quiet_hours_end:
                return False

        return True
