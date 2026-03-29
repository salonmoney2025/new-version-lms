from django.db import models
from apps.authentication.models import BaseModel


class Notification(BaseModel):
    INFO, WARNING, ALERT, ANNOUNCEMENT = 'INFO', 'WARNING', 'ALERT', 'ANNOUNCEMENT'
    LOW, MEDIUM, HIGH, URGENT = 'LOW', 'MEDIUM', 'HIGH', 'URGENT'

    recipient_user = models.ForeignKey('authentication.User', on_delete=models.CASCADE, related_name='notifications_received')
    sender_user = models.ForeignKey('authentication.User', on_delete=models.SET_NULL, null=True, blank=True, related_name='notifications_sent')
    title = models.CharField(max_length=200)
    message = models.TextField()
    notification_type = models.CharField(max_length=20, default=INFO, db_index=True)
    priority = models.CharField(max_length=20, default=MEDIUM)
    is_read = models.BooleanField(default=False, db_index=True)
    sent_at = models.DateTimeField(auto_now_add=True)
    read_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        verbose_name = 'Notification'
        verbose_name_plural = 'Notifications'
        ordering = ['-sent_at']
        indexes = [
            models.Index(fields=['recipient_user', 'is_read']),
            models.Index(fields=['notification_type']),
            models.Index(fields=['sent_at']),
        ]

    def __str__(self):
        return f"{self.title} - {self.recipient_user.email}"


class SMSLog(BaseModel):
    PENDING, SENT, FAILED, DELIVERED = 'PENDING', 'SENT', 'FAILED', 'DELIVERED'

    recipient_phone = models.CharField(max_length=17)
    message = models.TextField()
    status = models.CharField(max_length=20, default=PENDING, db_index=True)
    sent_at = models.DateTimeField(auto_now_add=True)
    gateway_response = models.JSONField(default=dict, blank=True)
    cost = models.DecimalField(max_digits=6, decimal_places=2, null=True, blank=True)

    class Meta:
        verbose_name = 'SMS Log'
        verbose_name_plural = 'SMS Logs'
        ordering = ['-sent_at']
        indexes = [
            models.Index(fields=['recipient_phone']),
            models.Index(fields=['status']),
            models.Index(fields=['sent_at']),
        ]

    def __str__(self):
        return f"{self.recipient_phone} - {self.status}"


class EmailLog(BaseModel):
    PENDING, SENT, FAILED, DELIVERED = 'PENDING', 'SENT', 'FAILED', 'DELIVERED'

    recipient_email = models.EmailField()
    subject = models.CharField(max_length=200)
    body = models.TextField()
    status = models.CharField(max_length=20, default=PENDING, db_index=True)
    sent_at = models.DateTimeField(auto_now_add=True)
    opened_at = models.DateTimeField(null=True, blank=True)
    clicked_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        verbose_name = 'Email Log'
        verbose_name_plural = 'Email Logs'
        ordering = ['-sent_at']
        indexes = [
            models.Index(fields=['recipient_email']),
            models.Index(fields=['status']),
            models.Index(fields=['sent_at']),
        ]

    def __str__(self):
        return f"{self.recipient_email} - {self.subject}"


class SMSTemplate(BaseModel):
    """
    SMS Templates for various notifications and communications
    Supports variable placeholders like {student_name}, {amount}, {date}, etc.
    """
    ADMISSION = 'ADMISSION'
    PAYMENT = 'PAYMENT'
    EXAM = 'EXAM'
    GENERAL = 'GENERAL'
    REGISTRATION = 'REGISTRATION'
    RESULTS = 'RESULTS'
    ALERT = 'ALERT'

    TEMPLATE_TYPE_CHOICES = (
        (ADMISSION, 'Admission Notification'),
        (PAYMENT, 'Payment Notification'),
        (EXAM, 'Exam Notification'),
        (GENERAL, 'General Notification'),
        (REGISTRATION, 'Registration Notification'),
        (RESULTS, 'Results Notification'),
        (ALERT, 'Alert Notification'),
    )

    name = models.CharField(max_length=200, unique=True, help_text="Template identifier name")
    template_type = models.CharField(max_length=20, choices=TEMPLATE_TYPE_CHOICES, db_index=True)
    message = models.TextField(help_text="SMS message with placeholders like {student_name}, {amount}, {date}")
    description = models.TextField(blank=True, null=True, help_text="Description of when to use this template")
    is_active = models.BooleanField(default=True)

    # Available placeholders for this template
    available_placeholders = models.JSONField(
        default=list,
        blank=True,
        help_text="List of available placeholders for this template"
    )

    class Meta:
        verbose_name = 'SMS Template'
        verbose_name_plural = 'SMS Templates'
        ordering = ['template_type', 'name']
        indexes = [
            models.Index(fields=['template_type']),
            models.Index(fields=['is_active']),
        ]

    def __str__(self):
        return f"{self.name} ({self.get_template_type_display()})"

    def render(self, context):
        """
        Render the template with the provided context
        context: dict of placeholder values
        Returns: rendered message string
        """
        message = self.message
        for key, value in context.items():
            placeholder = f"{{{key}}}"
            message = message.replace(placeholder, str(value))
        return message


class Signature(BaseModel):
    """
    Digital signatures for university officials to be used on letters and documents
    """
    official_name = models.CharField(max_length=200, help_text="Full name of the official")
    title = models.CharField(max_length=200, help_text="Official title (e.g., Registrar, Dean, Vice Chancellor)")
    department = models.CharField(max_length=200, blank=True, null=True, help_text="Department or Office")
    signature_image = models.ImageField(upload_to='signatures/', help_text="Scanned signature image")
    campus = models.ForeignKey(
        'campuses.Campus',
        on_delete=models.CASCADE,
        related_name='official_signatures',
        null=True,
        blank=True,
        help_text="Campus this signature belongs to (optional)"
    )
    is_default = models.BooleanField(default=False, help_text="Default signature for documents")
    is_active = models.BooleanField(default=True)

    class Meta:
        verbose_name = 'Signature'
        verbose_name_plural = 'Signatures'
        ordering = ['official_name']
        indexes = [
            models.Index(fields=['is_default']),
            models.Index(fields=['is_active']),
            models.Index(fields=['campus']),
        ]

    def __str__(self):
        return f"{self.official_name} - {self.title}"

    def save(self, *args, **kwargs):
        """Ensure only one default signature per campus"""
        if self.is_default:
            # Remove default flag from other signatures in the same campus
            Signature.objects.filter(
                campus=self.campus,
                is_default=True
            ).exclude(id=self.id).update(is_default=False)
        super().save(*args, **kwargs)
