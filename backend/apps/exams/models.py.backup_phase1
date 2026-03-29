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

    class Meta:
        verbose_name = 'Exam'
        verbose_name_plural = 'Exams'
        ordering = ['-date', 'start_time']
        indexes = [
            models.Index(fields=['course_offering', 'exam_type']),
            models.Index(fields=['date']),
            models.Index(fields=['exam_type']),
        ]

    def __str__(self):
        return f"{self.course_offering.course.code} - {self.name} ({self.exam_type})"


class Grade(BaseModel):
    student = models.ForeignKey('students.Student', on_delete=models.CASCADE, related_name='grades')
    exam = models.ForeignKey(Exam, on_delete=models.CASCADE, related_name='grades')
    marks_obtained = models.DecimalField(max_digits=6, decimal_places=2, validators=[MinValueValidator(0.00)])
    graded_by = models.ForeignKey('authentication.User', on_delete=models.SET_NULL, null=True, related_name='graded_exams')
    graded_date = models.DateTimeField(auto_now_add=True)
    remarks = models.TextField(blank=True, null=True)

    class Meta:
        verbose_name = 'Grade'
        verbose_name_plural = 'Grades'
        ordering = ['-graded_date']
        unique_together = [['student', 'exam']]
        indexes = [
            models.Index(fields=['student', 'exam']),
            models.Index(fields=['exam']),
            models.Index(fields=['graded_by']),
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


class Transcript(BaseModel):
    student = models.ForeignKey('students.Student', on_delete=models.CASCADE, related_name='transcripts')
    semester = models.CharField(max_length=20)
    academic_year = models.CharField(max_length=9)
    courses_taken = models.JSONField(default=list, help_text="List of courses with grades")
    total_credits = models.PositiveIntegerField(default=0)
    gpa = models.DecimalField(max_digits=3, decimal_places=2, default=Decimal('0.00'), validators=[MinValueValidator(0.00), MaxValueValidator(4.00)])
    cgpa = models.DecimalField(max_digits=3, decimal_places=2, default=Decimal('0.00'), validators=[MinValueValidator(0.00), MaxValueValidator(4.00)])
    generated_date = models.DateTimeField(auto_now_add=True)
    issued_date = models.DateField(null=True, blank=True)

    class Meta:
        verbose_name = 'Transcript'
        verbose_name_plural = 'Transcripts'
        ordering = ['-academic_year', '-semester']
        unique_together = [['student', 'semester', 'academic_year']]
        indexes = [
            models.Index(fields=['student', 'academic_year']),
            models.Index(fields=['academic_year']),
            models.Index(fields=['semester']),
        ]

    def __str__(self):
        return f"{self.student.student_id} - {self.semester} {self.academic_year}"
