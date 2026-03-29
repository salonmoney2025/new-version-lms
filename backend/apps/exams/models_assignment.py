# Assignment Submission System - To be added to exams/models.py
from django.db import models
from apps.authentication.models import BaseModel


class Assignment(BaseModel):
    """Online assignment management (Best practice from GitHub repos)"""
    DRAFT = 'DRAFT'
    PUBLISHED = 'PUBLISHED'
    CLOSED = 'CLOSED'

    STATUS_CHOICES = (
        (DRAFT, 'Draft'),
        (PUBLISHED, 'Published'),
        (CLOSED, 'Closed'),
    )

    course_offering = models.ForeignKey('courses.CourseOffering', on_delete=models.CASCADE, related_name='assignments')
    title = models.CharField(max_length=200)
    description = models.TextField()
    instructions = models.TextField(blank=True, null=True)
    attachment = models.FileField(upload_to='assignments/', blank=True, null=True, help_text="Assignment file/document")
    total_marks = models.PositiveIntegerField()
    due_date = models.DateTimeField()
    allow_late_submission = models.BooleanField(default=False)
    late_submission_penalty = models.DecimalField(max_digits=5, decimal_places=2, default=0, help_text="Percentage penalty per day")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=DRAFT, db_index=True)
    created_by = models.ForeignKey('authentication.User', on_delete=models.SET_NULL, null=True, related_name='created_assignments')
    published_date = models.DateTimeField(null=True, blank=True)

    class Meta:
        verbose_name = 'Assignment'
        verbose_name_plural = 'Assignments'
        ordering = ['-due_date']
        indexes = [
            models.Index(fields=['course_offering', 'status']),
            models.Index(fields=['due_date']),
            models.Index(fields=['status']),
        ]

    def __str__(self):
        return f"{self.course_offering.course.code} - {self.title}"

    @property
    def is_overdue(self):
        from django.utils import timezone
        return timezone.now() > self.due_date


class AssignmentSubmission(BaseModel):
    """Student assignment submissions"""
    SUBMITTED = 'SUBMITTED'
    GRADED = 'GRADED'
    LATE = 'LATE'
    RESUBMITTED = 'RESUBMITTED'

    STATUS_CHOICES = (
        (SUBMITTED, 'Submitted'),
        (GRADED, 'Graded'),
        (LATE, 'Late Submission'),
        (RESUBMITTED, 'Resubmitted'),
    )

    assignment = models.ForeignKey(Assignment, on_delete=models.CASCADE, related_name='submissions')
    student = models.ForeignKey('students.Student', on_delete=models.CASCADE, related_name='assignment_submissions')
    submission_text = models.TextField(blank=True, null=True, help_text="Text submission")
    submission_file = models.FileField(upload_to='assignment_submissions/%Y/%m/', blank=True, null=True)
    submitted_date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=SUBMITTED, db_index=True)
    is_late = models.BooleanField(default=False)

    # Grading fields
    marks_obtained = models.DecimalField(max_digits=6, decimal_places=2, null=True, blank=True)
    graded_by = models.ForeignKey('authentication.User', on_delete=models.SET_NULL, null=True, blank=True, related_name='graded_assignments')
    graded_date = models.DateTimeField(null=True, blank=True)
    feedback = models.TextField(blank=True, null=True)

    class Meta:
        verbose_name = 'Assignment Submission'
        verbose_name_plural = 'Assignment Submissions'
        ordering = ['-submitted_date']
        unique_together = [['assignment', 'student']]
        indexes = [
            models.Index(fields=['assignment', 'student']),
            models.Index(fields=['status']),
            models.Index(fields=['submitted_date']),
        ]

    def __str__(self):
        return f"{self.student.student_id} - {self.assignment.title}"

    def save(self, *args, **kwargs):
        # Auto-check if submission is late
        if self.assignment.due_date < self.submitted_date:
            self.is_late = True
            self.status = self.LATE
        super().save(*args, **kwargs)


class OnlineQuiz(BaseModel):
    """Online quiz system"""
    course_offering = models.ForeignKey('courses.CourseOffering', on_delete=models.CASCADE, related_name='quizzes')
    title = models.CharField(max_length=200)
    description = models.TextField()
    duration_minutes = models.PositiveIntegerField(help_text="Time limit in minutes")
    total_marks = models.PositiveIntegerField()
    passing_marks = models.PositiveIntegerField()
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    allow_multiple_attempts = models.BooleanField(default=False)
    max_attempts = models.PositiveIntegerField(default=1)
    shuffle_questions = models.BooleanField(default=True)
    show_correct_answers = models.BooleanField(default=False, help_text="Show correct answers after submission")
    is_active = models.BooleanField(default=True)

    class Meta:
        verbose_name = 'Online Quiz'
        verbose_name_plural = 'Online Quizzes'
        ordering = ['-start_time']
        indexes = [
            models.Index(fields=['course_offering', 'is_active']),
            models.Index(fields=['start_time', 'end_time']),
        ]

    def __str__(self):
        return f"{self.course_offering.course.code} - {self.title}"


class QuizQuestion(BaseModel):
    """Quiz questions"""
    MULTIPLE_CHOICE = 'MULTIPLE_CHOICE'
    TRUE_FALSE = 'TRUE_FALSE'
    SHORT_ANSWER = 'SHORT_ANSWER'

    QUESTION_TYPE_CHOICES = (
        (MULTIPLE_CHOICE, 'Multiple Choice'),
        (TRUE_FALSE, 'True/False'),
        (SHORT_ANSWER, 'Short Answer'),
    )

    quiz = models.ForeignKey(OnlineQuiz, on_delete=models.CASCADE, related_name='questions')
    question_text = models.TextField()
    question_type = models.CharField(max_length=20, choices=QUESTION_TYPE_CHOICES)
    marks = models.PositiveIntegerField(default=1)
    order = models.PositiveIntegerField(default=0)

    # For multiple choice
    option_a = models.CharField(max_length=500, blank=True, null=True)
    option_b = models.CharField(max_length=500, blank=True, null=True)
    option_c = models.CharField(max_length=500, blank=True, null=True)
    option_d = models.CharField(max_length=500, blank=True, null=True)
    correct_option = models.CharField(max_length=1, blank=True, null=True, help_text="A, B, C, or D")

    # For other types
    correct_answer = models.TextField(blank=True, null=True)
    explanation = models.TextField(blank=True, null=True, help_text="Explanation shown after submission")

    class Meta:
        verbose_name = 'Quiz Question'
        verbose_name_plural = 'Quiz Questions'
        ordering = ['quiz', 'order']
        indexes = [
            models.Index(fields=['quiz', 'order']),
        ]

    def __str__(self):
        return f"{self.quiz.title} - Q{self.order}"


class QuizAttempt(BaseModel):
    """Student quiz attempts"""
    STARTED = 'STARTED'
    SUBMITTED = 'SUBMITTED'
    GRADED = 'GRADED'

    STATUS_CHOICES = (
        (STARTED, 'Started'),
        (SUBMITTED, 'Submitted'),
        (GRADED, 'Graded'),
    )

    quiz = models.ForeignKey(OnlineQuiz, on_delete=models.CASCADE, related_name='attempts')
    student = models.ForeignKey('students.Student', on_delete=models.CASCADE, related_name='quiz_attempts')
    attempt_number = models.PositiveIntegerField(default=1)
    start_time = models.DateTimeField(auto_now_add=True)
    end_time = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STARTED)
    marks_obtained = models.DecimalField(max_digits=6, decimal_places=2, null=True, blank=True)
    answers = models.JSONField(default=dict, help_text="Student's answers")

    class Meta:
        verbose_name = 'Quiz Attempt'
        verbose_name_plural = 'Quiz Attempts'
        ordering = ['-start_time']
        indexes = [
            models.Index(fields=['quiz', 'student']),
            models.Index(fields=['status']),
        ]

    def __str__(self):
        return f"{self.student.student_id} - {self.quiz.title} (Attempt {self.attempt_number})"


class ResultVerification(BaseModel):
    """Result verification with QR code (Best practice from GitHub repos)"""
    student = models.ForeignKey('students.Student', on_delete=models.CASCADE, related_name='result_verifications')
    semester = models.CharField(max_length=20)
    academic_year = models.CharField(max_length=9)
    verification_code = models.CharField(max_length=50, unique=True, db_index=True)
    qr_code = models.ImageField(upload_to='qr_codes/', null=True, blank=True)
    generated_date = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    verification_count = models.PositiveIntegerField(default=0)
    last_verified_date = models.DateTimeField(null=True, blank=True)

    class Meta:
        verbose_name = 'Result Verification'
        verbose_name_plural = 'Result Verifications'
        ordering = ['-generated_date']
        unique_together = [['student', 'semester', 'academic_year']]
        indexes = [
            models.Index(fields=['verification_code']),
            models.Index(fields=['student', 'is_active']),
        ]

    def __str__(self):
        return f"{self.student.student_id} - {self.semester} {self.academic_year}"
