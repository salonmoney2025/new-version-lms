# New Models to Add to models.py - Based on GitHub Best Practices

from django.db import models
from apps.authentication.models import BaseModel


class LeaveApplication(BaseModel):
    """Student leave application management (Best practice from GitHub repos)"""
    SICK_LEAVE = 'SICK_LEAVE'
    PERSONAL = 'PERSONAL'
    FAMILY_EMERGENCY = 'FAMILY_EMERGENCY'
    ACADEMIC = 'ACADEMIC'
    OTHER = 'OTHER'

    LEAVE_TYPE_CHOICES = (
        (SICK_LEAVE, 'Sick Leave'),
        (PERSONAL, 'Personal'),
        (FAMILY_EMERGENCY, 'Family Emergency'),
        (ACADEMIC, 'Academic'),
        (OTHER, 'Other'),
    )

    PENDING = 'PENDING'
    APPROVED = 'APPROVED'
    REJECTED = 'REJECTED'
    CANCELLED = 'CANCELLED'

    STATUS_CHOICES = (
        (PENDING, 'Pending'),
        (APPROVED, 'Approved'),
        (REJECTED, 'Rejected'),
        (CANCELLED, 'Cancelled'),
    )

    student = models.ForeignKey('Student', on_delete=models.CASCADE, related_name='leave_applications')
    leave_type = models.CharField(max_length=20, choices=LEAVE_TYPE_CHOICES, db_index=True)
    start_date = models.DateField()
    end_date = models.DateField()
    reason = models.TextField(help_text="Reason for leave")
    supporting_document = models.FileField(upload_to='leave_documents/', blank=True, null=True, help_text="Medical certificate or supporting document")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=PENDING, db_index=True)
    reviewed_by = models.ForeignKey('authentication.User', on_delete=models.SET_NULL, null=True, blank=True, related_name='reviewed_leaves')
    reviewed_date = models.DateTimeField(null=True, blank=True)
    review_comments = models.TextField(blank=True, null=True)
    application_date = models.DateField(auto_now_add=True)

    class Meta:
        verbose_name = 'Leave Application'
        verbose_name_plural = 'Leave Applications'
        ordering = ['-application_date']
        indexes = [
            models.Index(fields=['student', 'status']),
            models.Index(fields=['status', 'application_date']),
            models.Index(fields=['start_date', 'end_date']),
        ]

    def __str__(self):
        return f"{self.student.student_id} - {self.leave_type} ({self.start_date} to {self.end_date})"

    @property
    def duration_days(self):
        """Calculate leave duration in days"""
        return (self.end_date - self.start_date).days + 1


class StudentFeedback(BaseModel):
    """Student feedback and complaints system (Best practice from GitHub repos)"""
    ACADEMIC = 'ACADEMIC'
    ADMINISTRATIVE = 'ADMINISTRATIVE'
    FACILITY = 'FACILITY'
    STAFF_CONDUCT = 'STAFF_CONDUCT'
    FINANCE = 'FINANCE'
    IT_SUPPORT = 'IT_SUPPORT'
    OTHER = 'OTHER'

    CATEGORY_CHOICES = (
        (ACADEMIC, 'Academic'),
        (ADMINISTRATIVE, 'Administrative'),
        (FACILITY, 'Facility'),
        (STAFF_CONDUCT, 'Staff Conduct'),
        (FINANCE, 'Finance'),
        (IT_SUPPORT, 'IT Support'),
        (OTHER, 'Other'),
    )

    PENDING = 'PENDING'
    IN_PROGRESS = 'IN_PROGRESS'
    RESOLVED = 'RESOLVED'
    CLOSED = 'CLOSED'

    STATUS_CHOICES = (
        (PENDING, 'Pending'),
        (IN_PROGRESS, 'In Progress'),
        (RESOLVED, 'Resolved'),
        (CLOSED, 'Closed'),
    )

    LOW = 'LOW'
    MEDIUM = 'MEDIUM'
    HIGH = 'HIGH'
    URGENT = 'URGENT'

    PRIORITY_CHOICES = (
        (LOW, 'Low'),
        (MEDIUM, 'Medium'),
        (HIGH, 'High'),
        (URGENT, 'Urgent'),
    )

    student = models.ForeignKey('Student', on_delete=models.CASCADE, related_name='feedbacks')
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, db_index=True)
    subject = models.CharField(max_length=200)
    description = models.TextField()
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default=MEDIUM, db_index=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=PENDING, db_index=True)
    is_anonymous = models.BooleanField(default=False, help_text="Submit feedback anonymously")
    attachment = models.FileField(upload_to='feedback_attachments/', blank=True, null=True)
    assigned_to = models.ForeignKey('authentication.User', on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_feedbacks')
    response = models.TextField(blank=True, null=True)
    responded_by = models.ForeignKey('authentication.User', on_delete=models.SET_NULL, null=True, blank=True, related_name='responded_feedbacks')
    responded_date = models.DateTimeField(null=True, blank=True)
    resolution_date = models.DateTimeField(null=True, blank=True)

    class Meta:
        verbose_name = 'Student Feedback'
        verbose_name_plural = 'Student Feedbacks'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['student', 'status']),
            models.Index(fields=['category', 'status']),
            models.Index(fields=['priority', 'status']),
            models.Index(fields=['assigned_to', 'status']),
        ]

    def __str__(self):
        student_display = "Anonymous" if self.is_anonymous else self.student.student_id
        return f"{student_display} - {self.category}: {self.subject}"


class StudentDocument(BaseModel):
    """Student document management system"""
    ADMISSION_LETTER = 'ADMISSION_LETTER'
    ID_CARD = 'ID_CARD'
    TRANSCRIPT = 'TRANSCRIPT'
    CERTIFICATE = 'CERTIFICATE'
    RECOMMENDATION_LETTER = 'RECOMMENDATION_LETTER'
    PASSPORT_PHOTO = 'PASSPORT_PHOTO'
    BIRTH_CERTIFICATE = 'BIRTH_CERTIFICATE'
    WAEC_RESULT = 'WAEC_RESULT'
    OTHER = 'OTHER'

    DOCUMENT_TYPE_CHOICES = (
        (ADMISSION_LETTER, 'Admission Letter'),
        (ID_CARD, 'ID Card'),
        (TRANSCRIPT, 'Transcript'),
        (CERTIFICATE, 'Certificate'),
        (RECOMMENDATION_LETTER, 'Recommendation Letter'),
        (PASSPORT_PHOTO, 'Passport Photo'),
        (BIRTH_CERTIFICATE, 'Birth Certificate'),
        (WAEC_RESULT, 'WAEC Result'),
        (OTHER, 'Other'),
    )

    student = models.ForeignKey('Student', on_delete=models.CASCADE, related_name='documents')
    document_type = models.CharField(max_length=30, choices=DOCUMENT_TYPE_CHOICES, db_index=True)
    title = models.CharField(max_length=200)
    file = models.FileField(upload_to='student_documents/%Y/%m/')
    file_size = models.PositiveIntegerField(help_text="File size in bytes")
    uploaded_by = models.ForeignKey('authentication.User', on_delete=models.SET_NULL, null=True, related_name='uploaded_documents')
    upload_date = models.DateTimeField(auto_now_add=True)
    is_verified = models.BooleanField(default=False)
    verified_by = models.ForeignKey('authentication.User', on_delete=models.SET_NULL, null=True, blank=True, related_name='verified_documents')
    verified_date = models.DateTimeField(null=True, blank=True)
    expiry_date = models.DateField(null=True, blank=True, help_text="For documents that expire")
    notes = models.TextField(blank=True, null=True)

    class Meta:
        verbose_name = 'Student Document'
        verbose_name_plural = 'Student Documents'
        ordering = ['-upload_date']
        indexes = [
            models.Index(fields=['student', 'document_type']),
            models.Index(fields=['document_type', 'is_verified']),
        ]

    def __str__(self):
        return f"{self.student.student_id} - {self.title}"


class CourseRegistration(BaseModel):
    """Student course registration for each semester"""
    DRAFT = 'DRAFT'
    SUBMITTED = 'SUBMITTED'
    APPROVED = 'APPROVED'
    REJECTED = 'REJECTED'

    STATUS_CHOICES = (
        (DRAFT, 'Draft'),
        (SUBMITTED, 'Submitted'),
        (APPROVED, 'Approved'),
        (REJECTED, 'Rejected'),
    )

    student = models.ForeignKey('Student', on_delete=models.CASCADE, related_name='course_registrations')
    semester = models.CharField(max_length=20)
    academic_year = models.CharField(max_length=9)
    courses = models.ManyToManyField('courses.CourseOffering', related_name='registrations')
    total_credits = models.PositiveIntegerField(default=0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=DRAFT, db_index=True)
    submitted_date = models.DateTimeField(null=True, blank=True)
    approved_by = models.ForeignKey('authentication.User', on_delete=models.SET_NULL, null=True, blank=True, related_name='approved_registrations')
    approved_date = models.DateTimeField(null=True, blank=True)
    rejection_reason = models.TextField(blank=True, null=True)

    class Meta:
        verbose_name = 'Course Registration'
        verbose_name_plural = 'Course Registrations'
        ordering = ['-academic_year', '-semester']
        unique_together = [['student', 'semester', 'academic_year']]
        indexes = [
            models.Index(fields=['student', 'semester', 'academic_year']),
            models.Index(fields=['status']),
        ]

    def __str__(self):
        return f"{self.student.student_id} - {self.semester} {self.academic_year}"
