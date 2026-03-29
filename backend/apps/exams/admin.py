from django.contrib import admin
from .models import (
    Exam, Grade, Transcript,
    GradeScale, ScriptCollection,
    PromotionalList, StudentPromotion,
    GraduationList, GraduatingStudent
)


@admin.register(Exam)
class ExamAdmin(admin.ModelAdmin):
    list_display = ['name', 'course_offering', 'exam_type', 'date', 'start_time', 'venue', 'status']
    list_filter = ['exam_type', 'status', 'date']
    search_fields = ['name', 'course_offering__course__code', 'course_offering__course__name', 'venue']
    date_hierarchy = 'date'
    filter_horizontal = ['invigilators']
    readonly_fields = ['created_at', 'updated_at']

    fieldsets = (
        ('Basic Information', {
            'fields': ('course_offering', 'name', 'exam_type')
        }),
        ('Schedule', {
            'fields': ('date', 'start_time', 'end_time', 'duration_minutes')
        }),
        ('Venue & Capacity', {
            'fields': ('venue', 'capacity', 'invigilators')
        }),
        ('Marks', {
            'fields': ('total_marks', 'passing_marks')
        }),
        ('Status & Instructions', {
            'fields': ('status', 'instructions')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(Grade)
class GradeAdmin(admin.ModelAdmin):
    list_display = ['student', 'exam', 'marks_obtained', 'grade_letter', 'approval_status', 'is_published']
    list_filter = ['approval_status', 'is_published', 'grade_letter']
    search_fields = ['student__student_id', 'student__user__first_name', 'student__user__last_name', 'exam__name']
    readonly_fields = ['graded_date', 'percentage', 'is_passing', 'created_at', 'updated_at']

    fieldsets = (
        ('Basic Information', {
            'fields': ('student', 'exam', 'marks_obtained', 'grade_letter')
        }),
        ('Grading Details', {
            'fields': ('graded_by', 'graded_date', 'percentage', 'is_passing', 'remarks')
        }),
        ('Approval Workflow', {
            'fields': ('approval_status', 'approved_by', 'approved_date')
        }),
        ('Publishing', {
            'fields': ('is_published', 'published_by', 'published_date')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(GradeScale)
class GradeScaleAdmin(admin.ModelAdmin):
    list_display = ['program', 'letter_grade', 'min_percentage', 'max_percentage', 'grade_points', 'description']
    list_filter = ['program']
    search_fields = ['program__code', 'program__name', 'letter_grade']
    readonly_fields = ['created_at', 'updated_at']
    ordering = ['program', '-min_percentage']


@admin.register(ScriptCollection)
class ScriptCollectionAdmin(admin.ModelAdmin):
    list_display = ['exam', 'student', 'script_collected', 'collection_date', 'collected_by', 'script_number']
    list_filter = ['script_collected', 'exam', 'collection_date']
    search_fields = ['student__student_id', 'exam__name', 'script_number']
    readonly_fields = ['created_at', 'updated_at']
    date_hierarchy = 'collection_date'


@admin.register(PromotionalList)
class PromotionalListAdmin(admin.ModelAdmin):
    list_display = ['program', 'level', 'semester', 'academic_year', 'is_approved', 'is_executed', 'generated_date']
    list_filter = ['is_approved', 'is_executed', 'program', 'level', 'semester']
    search_fields = ['program__code', 'program__name', 'academic_year']
    readonly_fields = ['generated_date', 'created_at', 'updated_at']
    date_hierarchy = 'generated_date'

    fieldsets = (
        ('Basic Information', {
            'fields': ('program', 'level', 'semester', 'academic_year')
        }),
        ('Approval', {
            'fields': ('is_approved', 'approved_by', 'approved_date')
        }),
        ('Execution', {
            'fields': ('is_executed', 'executed_date')
        }),
        ('Timestamps', {
            'fields': ('generated_date', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(StudentPromotion)
class StudentPromotionAdmin(admin.ModelAdmin):
    list_display = ['student', 'promotional_list', 'current_level', 'next_level', 'cgpa', 'status', 'effective_date']
    list_filter = ['status', 'promotional_list', 'current_level', 'next_level']
    search_fields = ['student__student_id', 'student__user__first_name', 'student__user__last_name']
    readonly_fields = ['created_at', 'updated_at']
    date_hierarchy = 'effective_date'


@admin.register(GraduationList)
class GraduationListAdmin(admin.ModelAdmin):
    list_display = ['program', 'academic_year', 'ceremony_date', 'is_approved', 'generated_date']
    list_filter = ['is_approved', 'program']
    search_fields = ['program__code', 'program__name', 'academic_year']
    readonly_fields = ['generated_date', 'created_at', 'updated_at']
    date_hierarchy = 'ceremony_date'

    fieldsets = (
        ('Basic Information', {
            'fields': ('program', 'academic_year', 'ceremony_date')
        }),
        ('Approval', {
            'fields': ('is_approved', 'approved_by', 'approved_date')
        }),
        ('Timestamps', {
            'fields': ('generated_date', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(GraduatingStudent)
class GraduatingStudentAdmin(admin.ModelAdmin):
    list_display = ['student', 'graduation_list', 'final_cgpa', 'classification', 'total_credits', 'is_cleared']
    list_filter = ['classification', 'is_cleared', 'graduation_list']
    search_fields = ['student__student_id', 'student__user__first_name', 'student__user__last_name']
    readonly_fields = ['created_at', 'updated_at']
    ordering = ['-final_cgpa']


@admin.register(Transcript)
class TranscriptAdmin(admin.ModelAdmin):
    list_display = ['student', 'semester', 'academic_year', 'total_credits', 'gpa', 'cgpa', 'generated_date']
    list_filter = ['semester', 'academic_year']
    search_fields = ['student__student_id', 'student__user__first_name', 'student__user__last_name']
    readonly_fields = ['generated_date', 'created_at', 'updated_at']
    date_hierarchy = 'generated_date'
