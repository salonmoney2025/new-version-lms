from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from apps.authentication.models import BaseModel
from decimal import Decimal


class Exam(BaseModel):
    MIDTERM = 'MIDTERM'
    FINAL = 'FINAL'
    QUIZ = 'QUIZ'
    ASSIGNMENT = 'ASSIGNMENT'

    EXAM_TYPE_CHOICES = (
        (MIDTERM, 'Midterm'),
        (FINAL, 'Final'),
        (QUIZ, 'Quiz'),
        (ASSIGNMENT, 'Assignment'),
    )

    SCHEDULED = 'SCHEDULED'
    ONGOING = 'ONGOING'
    COMPLETED = 'COMPLETED'
    CANCELLED = 'CANCELLED'

    STATUS_CHOICES = (
        (SCHEDULED, 'Scheduled'),
        (ONGOING, 'Ongoing'),
        (COMPLETED, 'Completed'),
        (CANCELLED, 'Cancelled'),
    )

    course_offering = models.ForeignKey('courses.CourseOffering', on_delete=models.CASCADE, related_name='exams')
    name = models.CharField(max_length=200)
    exam_type = models.CharField(max_length=20, choices=EXAM_TYPE_CHOICES, db_index=True)
    date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    duration_minutes = models.PositiveIntegerField()
    total_marks = models.DecimalField(max_digits=6, decimal_places=2, validators=[MinValueValidator(0.00)])
    passing_marks = models.DecimalField(max_digits=6, decimal_places=2, validators=[MinValueValidator(0.00)])
    instructions = models.TextField(blank=True, null=True)

    # Phase 1 additions
    venue = models.CharField(max_length=200, blank=True, null=True, help_text="Exam venue/location")
    capacity = models.PositiveIntegerField(blank=True, null=True, help_text="Maximum number of students")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=SCHEDULED, db_index=True)
    invigilators = models.ManyToManyField('staff.StaffMember', related_name='invigilated_exams', blank=True)

    class Meta:
        verbose_name = 'Exam'
        verbose_name_plural = 'Exams'
        ordering = ['-date', 'start_time']
        indexes = [
            models.Index(fields=['course_offering', 'exam_type']),
            models.Index(fields=['date']),
            models.Index(fields=['exam_type']),
            models.Index(fields=['status']),
        ]

    def __str__(self):
        return f"{self.course_offering.course.code} - {self.name} ({self.exam_type})"


class Grade(BaseModel):
    DRAFT = 'DRAFT'
    PENDING_APPROVAL = 'PENDING_APPROVAL'
    APPROVED = 'APPROVED'
    PUBLISHED = 'PUBLISHED'
    REJECTED = 'REJECTED'

    APPROVAL_STATUS_CHOICES = (
        (DRAFT, 'Draft'),
        (PENDING_APPROVAL, 'Pending Approval'),
        (APPROVED, 'Approved'),
        (PUBLISHED, 'Published'),
        (REJECTED, 'Rejected'),
    )

    student = models.ForeignKey('students.Student', on_delete=models.CASCADE, related_name='grades')
    exam = models.ForeignKey(Exam, on_delete=models.CASCADE, related_name='grades')
    marks_obtained = models.DecimalField(max_digits=6, decimal_places=2, validators=[MinValueValidator(0.00)])
    graded_by = models.ForeignKey('authentication.User', on_delete=models.SET_NULL, null=True, related_name='graded_exams')
    graded_date = models.DateTimeField(auto_now_add=True)
    remarks = models.TextField(blank=True, null=True)

    # Phase 1 additions
    grade_letter = models.CharField(max_length=2, blank=True, null=True, help_text="Letter grade (A, B+, B, C+, C, D, F)")
    approval_status = models.CharField(max_length=20, choices=APPROVAL_STATUS_CHOICES, default=DRAFT, db_index=True)
    approved_by = models.ForeignKey('authentication.User', on_delete=models.SET_NULL, null=True, blank=True, related_name='approved_grades')
    approved_date = models.DateTimeField(null=True, blank=True)
    is_published = models.BooleanField(default=False, db_index=True)
    published_by = models.ForeignKey('authentication.User', on_delete=models.SET_NULL, null=True, blank=True, related_name='published_grades')
    published_date = models.DateTimeField(null=True, blank=True)

    class Meta:
        verbose_name = 'Grade'
        verbose_name_plural = 'Grades'
        ordering = ['-graded_date']
        unique_together = [['student', 'exam']]
        indexes = [
            models.Index(fields=['student', 'exam']),
            models.Index(fields=['exam']),
            models.Index(fields=['graded_by']),
            models.Index(fields=['approval_status']),
            models.Index(fields=['is_published']),
        ]

    def __str__(self):
        return f"{self.student.student_id} - {self.exam.name} - {self.marks_obtained}/{self.exam.total_marks}"

    @property
    def percentage(self):
        if self.exam.total_marks > 0:
            return (self.marks_obtained / self.exam.total_marks) * 100
        return 0

    @property
    def is_passing(self):
        return self.marks_obtained >= self.exam.passing_marks

    def calculate_grade_letter(self):
        """Calculate grade letter based on percentage and program grade scale"""
        percentage = self.percentage

        # Try to get program-specific grade scale
        try:
            program = self.exam.course_offering.course.department.programs.first()
            if program:
                grade_scale = GradeScale.objects.filter(
                    program=program,
                    min_percentage__lte=percentage,
                    max_percentage__gte=percentage
                ).first()

                if grade_scale:
                    return grade_scale.letter_grade
        except:
            pass

        # Default grading scale (Sierra Leone system)
        if percentage >= 80:
            return 'A'
        elif percentage >= 75:
            return 'B+'
        elif percentage >= 70:
            return 'B'
        elif percentage >= 65:
            return 'C+'
        elif percentage >= 60:
            return 'C'
        elif percentage >= 50:
            return 'D'
        else:
            return 'F'
Script to append remaining Phase 1 models to models.py
Run this after applying the initial Exam and Grade updates

