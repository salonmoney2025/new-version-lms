"""
Letters Management Models
Handles templates and generated letters for the university
"""
from django.db import models
from apps.authentication.models import BaseModel, User
from apps.students.models import Student
from apps.staff.models import StaffMember
from apps.campuses.models import Campus


class LetterTemplate(BaseModel):
    """
    Template for generating various types of letters
    """
    LETTER_TYPES = (
        ('ADMISSION', 'Admission Letter'),
        ('OFFER', 'Offer Letter'),
        ('REFERENCE', 'Reference Letter'),
        ('TRANSCRIPT', 'Transcript Request'),
        ('PROVISIONAL', 'Provisional Admission'),
        ('CONFIRMATION', 'Confirmation of Studies'),
        ('RECOMMENDATION', 'Recommendation Letter'),
        ('WITHDRAWAL', 'Withdrawal Confirmation'),
        ('SUSPENSION', 'Suspension Notice'),
        ('EXPULSION', 'Expulsion Notice'),
        ('COMPLETION', 'Course Completion'),
        ('INTERNSHIP', 'Internship Letter'),
        ('EMPLOYMENT', 'Employment Verification'),
        ('CUSTOM', 'Custom Letter'),
    )

    name = models.CharField(max_length=255)
    letter_type = models.CharField(max_length=50, choices=LETTER_TYPES)
    subject = models.CharField(max_length=500)
    body = models.TextField(help_text="Use {{variable}} for dynamic content")
    header_html = models.TextField(blank=True, null=True, help_text="HTML for letter header")
    footer_html = models.TextField(blank=True, null=True, help_text="HTML for letter footer")

    # Signature settings
    requires_signature = models.BooleanField(default=True)
    signature_roles = models.JSONField(
        default=list,
        help_text="List of roles that can sign this letter type"
    )

    # Metadata
    campus = models.ForeignKey(
        Campus,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='letter_templates',
        help_text="Campus-specific template, null for system-wide"
    )
    is_active = models.BooleanField(default=True)
    created_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        related_name='created_letter_templates'
    )

    # Available variables for this template
    available_variables = models.JSONField(
        default=dict,
        help_text="Dictionary of variables that can be used in this template"
    )

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Letter Template'
        verbose_name_plural = 'Letter Templates'
        indexes = [
            models.Index(fields=['letter_type', 'is_active']),
            models.Index(fields=['campus', 'letter_type']),
        ]

    def __str__(self):
        return f"{self.name} ({self.get_letter_type_display()})"


class GeneratedLetter(BaseModel):
    """
    Generated letter instance
    """
    STATUS_CHOICES = (
        ('DRAFT', 'Draft'),
        ('PENDING_SIGNATURE', 'Pending Signature'),
        ('SIGNED', 'Signed'),
        ('ISSUED', 'Issued'),
        ('CANCELLED', 'Cancelled'),
    )

    template = models.ForeignKey(
        LetterTemplate,
        on_delete=models.PROTECT,
        related_name='generated_letters'
    )

    # Recipient information
    student = models.ForeignKey(
        Student,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='letters'
    )
    staff = models.ForeignKey(
        StaffMember,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='letters'
    )
    recipient_name = models.CharField(
        max_length=255,
        help_text="Fallback if not student/staff"
    )
    recipient_email = models.EmailField(blank=True, null=True)

    # Letter content
    subject = models.CharField(max_length=500)
    content = models.TextField(help_text="Rendered letter content with variables replaced")
    rendered_html = models.TextField(help_text="Full HTML of the letter")

    # Status and tracking
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='DRAFT')
    reference_number = models.CharField(max_length=100, unique=True, db_index=True)

    # Signature tracking
    signed_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='signed_letters'
    )
    signed_at = models.DateTimeField(null=True, blank=True)
    digital_signature = models.TextField(blank=True, null=True)

    # Issue tracking
    issued_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='issued_letters'
    )
    issued_at = models.DateTimeField(null=True, blank=True)

    # Creation tracking
    created_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        related_name='created_letters'
    )

    # PDF storage
    pdf_file = models.FileField(
        upload_to='letters/pdfs/',
        null=True,
        blank=True
    )

    # Campus
    campus = models.ForeignKey(
        Campus,
        on_delete=models.CASCADE,
        related_name='letters'
    )

    # Additional metadata
    metadata = models.JSONField(
        default=dict,
        help_text="Additional data used in letter generation"
    )

    # Notes
    notes = models.TextField(blank=True, null=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Generated Letter'
        verbose_name_plural = 'Generated Letters'
        indexes = [
            models.Index(fields=['reference_number']),
            models.Index(fields=['status', 'campus']),
            models.Index(fields=['student', 'status']),
            models.Index(fields=['created_at']),
        ]

    def __str__(self):
        recipient = self.student or self.staff or self.recipient_name
        return f"{self.reference_number} - {recipient}"

    def generate_reference_number(self):
        """Generate unique reference number for the letter"""
        from django.utils import timezone
        import random
        import string

        year = timezone.now().year
        campus_code = self.campus.code if self.campus else 'SYS'
        letter_type = self.template.letter_type[:3].upper()
        random_string = ''.join(random.choices(string.digits, k=6))

        return f"{campus_code}/{letter_type}/{year}/{random_string}"


class LetterSignature(BaseModel):
    """
    Digital signature for letters
    """
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='letter_signatures'
    )
    signature_image = models.ImageField(
        upload_to='letters/signatures/',
        help_text="Upload signature image"
    )
    title = models.CharField(
        max_length=255,
        help_text="e.g., Vice Chancellor, Registrar, Dean"
    )
    is_active = models.BooleanField(default=True)
    campus = models.ForeignKey(
        Campus,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='signatures'
    )

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Letter Signature'
        verbose_name_plural = 'Letter Signatures'

    def __str__(self):
        return f"{self.user.get_full_name()} - {self.title}"


class LetterLog(BaseModel):
    """
    Audit log for letter actions
    """
    ACTION_TYPES = (
        ('CREATED', 'Created'),
        ('UPDATED', 'Updated'),
        ('SIGNED', 'Signed'),
        ('ISSUED', 'Issued'),
        ('CANCELLED', 'Cancelled'),
        ('DOWNLOADED', 'Downloaded'),
        ('EMAILED', 'Emailed'),
        ('VIEWED', 'Viewed'),
    )

    letter = models.ForeignKey(
        GeneratedLetter,
        on_delete=models.CASCADE,
        related_name='logs'
    )
    action = models.CharField(max_length=50, choices=ACTION_TYPES)
    performed_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True
    )
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True, null=True)
    details = models.JSONField(default=dict)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Letter Log'
        verbose_name_plural = 'Letter Logs'
        indexes = [
            models.Index(fields=['letter', 'action']),
            models.Index(fields=['created_at']),
        ]

    def __str__(self):
        return f"{self.letter.reference_number} - {self.action} by {self.performed_by}"
