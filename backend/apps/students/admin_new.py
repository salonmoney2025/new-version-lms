from django.contrib import admin
from .models import (
    Student, Enrollment, Attendance,
    LeaveApplication, StudentFeedback, StudentDocument, CourseRegistration
)


@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ('student_id', 'user', 'campus', 'department', 'enrollment_status', 'gpa', 'admission_date')
    list_filter = ('enrollment_status', 'campus', 'department', 'program')
    search_fields = ('student_id', 'user__email', 'user__first_name', 'user__last_name')
    readonly_fields = ('student_id', 'created_at', 'updated_at')
    fieldsets = (
        ('Basic Information', {
            'fields': ('user', 'student_id', 'campus', 'department', 'program', 'admission_date')
        }),
        ('Academic Information', {
            'fields': ('enrollment_status', 'current_semester', 'gpa')
        }),
        ('Guardian Information', {
            'fields': ('guardian_name', 'guardian_phone', 'guardian_email')
        }),
        ('Medical & Emergency', {
            'fields': ('medical_info', 'blood_group', 'emergency_contact')
        }),
        ('Address', {
            'fields': ('address',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(Enrollment)
class EnrollmentAdmin(admin.ModelAdmin):
    list_display = ('student', 'course_offering', 'semester', 'academic_year', 'status', 'grade')
    list_filter = ('status', 'semester', 'academic_year')
    search_fields = ('student__student_id', 'course_offering__course__code')
    readonly_fields = ('enrollment_date', 'created_at', 'updated_at')


@admin.register(Attendance)
class AttendanceAdmin(admin.ModelAdmin):
    list_display = ('student', 'course_offering', 'date', 'status', 'marked_by')
    list_filter = ('status', 'date')
    search_fields = ('student__student_id', 'course_offering__course__code')
    readonly_fields = ('created_at', 'updated_at')


@admin.register(LeaveApplication)
class LeaveApplicationAdmin(admin.ModelAdmin):
    list_display = ('student', 'leave_type', 'start_date', 'end_date', 'status', 'application_date')
    list_filter = ('status', 'leave_type', 'application_date')
    search_fields = ('student__student_id', 'reason')
    readonly_fields = ('application_date', 'reviewed_date', 'created_at', 'updated_at')
    fieldsets = (
        ('Application Details', {
            'fields': ('student', 'leave_type', 'start_date', 'end_date', 'reason', 'supporting_document')
        }),
        ('Review Information', {
            'fields': ('status', 'reviewed_by', 'reviewed_date', 'review_comments')
        }),
        ('Timestamps', {
            'fields': ('application_date', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(StudentFeedback)
class StudentFeedbackAdmin(admin.ModelAdmin):
    list_display = ('student', 'category', 'subject', 'priority', 'status', 'created_at')
    list_filter = ('status', 'category', 'priority', 'is_anonymous')
    search_fields = ('subject', 'description', 'student__student_id')
    readonly_fields = ('responded_date', 'resolution_date', 'created_at', 'updated_at')
    fieldsets = (
        ('Feedback Details', {
            'fields': ('student', 'category', 'subject', 'description', 'priority', 'is_anonymous', 'attachment')
        }),
        ('Assignment & Response', {
            'fields': ('status', 'assigned_to', 'response', 'responded_by', 'responded_date', 'resolution_date')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(StudentDocument)
class StudentDocumentAdmin(admin.ModelAdmin):
    list_display = ('student', 'document_type', 'title', 'is_verified', 'upload_date')
    list_filter = ('document_type', 'is_verified', 'upload_date')
    search_fields = ('student__student_id', 'title')
    readonly_fields = ('upload_date', 'uploaded_by', 'file_size', 'verified_date', 'created_at', 'updated_at')
    fieldsets = (
        ('Document Information', {
            'fields': ('student', 'document_type', 'title', 'file', 'file_size')
        }),
        ('Upload Information', {
            'fields': ('uploaded_by', 'upload_date')
        }),
        ('Verification', {
            'fields': ('is_verified', 'verified_by', 'verified_date', 'expiry_date', 'notes')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(CourseRegistration)
class CourseRegistrationAdmin(admin.ModelAdmin):
    list_display = ('student', 'semester', 'academic_year', 'total_credits', 'status')
    list_filter = ('status', 'semester', 'academic_year')
    search_fields = ('student__student_id',)
    readonly_fields = ('submitted_date', 'approved_date', 'created_at', 'updated_at')
    filter_horizontal = ('courses',)
    fieldsets = (
        ('Registration Details', {
            'fields': ('student', 'semester', 'academic_year', 'courses', 'total_credits')
        }),
        ('Approval Information', {
            'fields': ('status', 'submitted_date', 'approved_by', 'approved_date', 'rejection_reason')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
