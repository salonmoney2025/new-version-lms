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
            # Basic indexes
            models.Index(fields=['student', 'exam']),
            models.Index(fields=['exam']),
            models.Index(fields=['graded_by']),
            models.Index(fields=['approval_status']),
            models.Index(fields=['is_published']),

            # PHASE 1: Composite indexes for common filter combinations (CRITICAL for performance)
            models.Index(fields=['exam', 'is_deleted', 'approval_status'], name='exam_deleted_approval_idx'),
            models.Index(fields=['student', 'is_published', '-graded_date'], name='student_published_date_idx'),
            models.Index(fields=['exam', 'approval_status', 'is_published'], name='exam_approval_published_idx'),
            models.Index(fields=['graded_by', '-graded_date'], name='grader_date_idx'),
            models.Index(fields=['exam', 'is_deleted'], name='exam_deleted_idx'),  # For grades action
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


class GradeScale(BaseModel):
    """Grade scale configuration for programs"""
    program = models.ForeignKey('courses.Program', on_delete=models.CASCADE, related_name='grade_scales')
    letter_grade = models.CharField(max_length=2, help_text="Letter grade (A, B+, B, C+, C, D, F)")
    min_percentage = models.DecimalField(max_digits=5, decimal_places=2, validators=[MinValueValidator(0.00), MaxValueValidator(100.00)])
    max_percentage = models.DecimalField(max_digits=5, decimal_places=2, validators=[MinValueValidator(0.00), MaxValueValidator(100.00)])
    grade_points = models.DecimalField(max_digits=3, decimal_places=2, validators=[MinValueValidator(0.00), MaxValueValidator(4.00)])
    description = models.CharField(max_length=50, help_text="Description (Excellent, Very Good, etc.)")

    class Meta:
        verbose_name = 'Grade Scale'
        verbose_name_plural = 'Grade Scales'
        ordering = ['-min_percentage']
        unique_together = [['program', 'letter_grade']]
        indexes = [
            models.Index(fields=['program', 'min_percentage', 'max_percentage']),
        ]

    def __str__(self):
        return f"{self.program.code} - {self.letter_grade} ({self.min_percentage}-{self.max_percentage}%)"


class ScriptCollection(BaseModel):
    """Track collection of physical exam answer scripts"""
    exam = models.ForeignKey(Exam, on_delete=models.CASCADE, related_name='script_collections')
    student = models.ForeignKey('students.Student', on_delete=models.CASCADE, related_name='script_collections')
    script_collected = models.BooleanField(default=False)
    collection_date = models.DateTimeField(null=True, blank=True)
    collected_by = models.ForeignKey('authentication.User', on_delete=models.SET_NULL, null=True, blank=True, related_name='collected_scripts')
    script_number = models.CharField(max_length=50, blank=True, null=True, help_text="Physical script identifier")
    notes = models.TextField(blank=True, null=True, help_text="Notes about missing scripts or issues")

    class Meta:
        verbose_name = 'Script Collection'
        verbose_name_plural = 'Script Collections'
        ordering = ['-collection_date']
        unique_together = [['exam', 'student']]
        indexes = [
            models.Index(fields=['exam', 'student']),
            models.Index(fields=['exam', 'script_collected']),
        ]

    def __str__(self):
        status = "Collected" if self.script_collected else "Missing"
        return f"{self.exam.name} - {self.student.student_id} ({status})"


class PromotionalList(BaseModel):
    """List of students eligible for promotion to next level"""
    semester = models.CharField(max_length=20)
    academic_year = models.CharField(max_length=9)
    program = models.ForeignKey('courses.Program', on_delete=models.CASCADE, related_name='promotional_lists')
    level = models.IntegerField(help_text="Current level (e.g., Year 1, 2, 3, 4)")
    generated_date = models.DateTimeField(auto_now_add=True)
    approved_by = models.ForeignKey('authentication.User', on_delete=models.SET_NULL, null=True, blank=True, related_name='approved_promotional_lists')
    approved_date = models.DateTimeField(null=True, blank=True)
    is_approved = models.BooleanField(default=False, db_index=True)
    is_executed = models.BooleanField(default=False, db_index=True, help_text="Whether promotions have been applied")
    executed_date = models.DateTimeField(null=True, blank=True)

    class Meta:
        verbose_name = 'Promotional List'
        verbose_name_plural = 'Promotional Lists'
        ordering = ['-academic_year', '-semester', 'program', 'level']
        unique_together = [['semester', 'academic_year', 'program', 'level']]
        indexes = [
            models.Index(fields=['program', 'level']),
            models.Index(fields=['academic_year', 'semester']),
            models.Index(fields=['is_approved', 'is_executed']),
        ]

    def __str__(self):
        return f"{self.program.code} Level {self.level} - {self.semester} {self.academic_year}"


class StudentPromotion(BaseModel):
    """Individual student promotion record"""
    PROMOTED = 'PROMOTED'
    PROBATION = 'PROBATION'
    REPEAT = 'REPEAT'
    WITHDRAWN = 'WITHDRAWN'

    STATUS_CHOICES = (
        (PROMOTED, 'Promoted'),
        (PROBATION, 'On Probation'),
        (REPEAT, 'Repeat Level'),
        (WITHDRAWN, 'Withdrawn'),
    )

    promotional_list = models.ForeignKey(PromotionalList, on_delete=models.CASCADE, related_name='student_promotions')
    student = models.ForeignKey('students.Student', on_delete=models.CASCADE, related_name='promotions')
    current_level = models.IntegerField()
    next_level = models.IntegerField(null=True, blank=True)
    cgpa = models.DecimalField(max_digits=3, decimal_places=2)
    credits_earned = models.IntegerField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, db_index=True)
    remarks = models.TextField(blank=True, null=True)
    effective_date = models.DateField()

    class Meta:
        verbose_name = 'Student Promotion'
        verbose_name_plural = 'Student Promotions'
        ordering = ['promotional_list', 'student']
        unique_together = [['promotional_list', 'student']]
        indexes = [
            models.Index(fields=['student', 'status']),
            models.Index(fields=['promotional_list', 'status']),
        ]

    def __str__(self):
        return f"{self.student.student_id} - Level {self.current_level} -> {self.next_level} ({self.status})"


class GraduationList(BaseModel):
    """List of students eligible for graduation"""
    academic_year = models.CharField(max_length=9)
    program = models.ForeignKey('courses.Program', on_delete=models.CASCADE, related_name='graduation_lists')
    ceremony_date = models.DateField(null=True, blank=True)
    generated_date = models.DateTimeField(auto_now_add=True)
    approved_by = models.ForeignKey('authentication.User', on_delete=models.SET_NULL, null=True, blank=True, related_name='approved_graduation_lists')
    approved_date = models.DateTimeField(null=True, blank=True)
    is_approved = models.BooleanField(default=False, db_index=True)

    class Meta:
        verbose_name = 'Graduation List'
        verbose_name_plural = 'Graduation Lists'
        ordering = ['-academic_year', 'program']
        unique_together = [['academic_year', 'program']]
        indexes = [
            models.Index(fields=['program', 'academic_year']),
            models.Index(fields=['is_approved']),
        ]

    def __str__(self):
        return f"{self.program.code} Graduation List - {self.academic_year}"


class GraduatingStudent(BaseModel):
    """Individual graduating student record"""
    FIRST_CLASS = 'FIRST_CLASS'
    SECOND_UPPER = 'SECOND_UPPER'
    SECOND_LOWER = 'SECOND_LOWER'
    THIRD_CLASS = 'THIRD_CLASS'
    PASS = 'PASS'

    CLASSIFICATION_CHOICES = (
        (FIRST_CLASS, 'First Class Honours'),
        (SECOND_UPPER, 'Second Class Honours (Upper Division)'),
        (SECOND_LOWER, 'Second Class Honours (Lower Division)'),
        (THIRD_CLASS, 'Third Class Honours'),
        (PASS, 'Pass'),
    )

    graduation_list = models.ForeignKey(GraduationList, on_delete=models.CASCADE, related_name='graduating_students')
    student = models.ForeignKey('students.Student', on_delete=models.CASCADE, related_name='graduations')
    final_cgpa = models.DecimalField(max_digits=3, decimal_places=2)
    classification = models.CharField(max_length=20, choices=CLASSIFICATION_CHOICES)
    total_credits = models.IntegerField()
    is_cleared = models.BooleanField(default=False, help_text="Cleared for graduation (no outstanding fees/issues)")
    remarks = models.TextField(blank=True, null=True)

    class Meta:
        verbose_name = 'Graduating Student'
        verbose_name_plural = 'Graduating Students'
        ordering = ['-final_cgpa', 'student']
        unique_together = [['graduation_list', 'student']]
        indexes = [
            models.Index(fields=['graduation_list', 'classification']),
            models.Index(fields=['student', 'final_cgpa']),
        ]

    def __str__(self):
        return f"{self.student.student_id} - {self.classification} (CGPA: {self.final_cgpa})"

    @staticmethod
    def calculate_classification(cgpa):
        """Calculate degree classification based on CGPA (Sierra Leone system)"""
        if cgpa >= 3.70:
            return GraduatingStudent.FIRST_CLASS
        elif cgpa >= 3.00:
            return GraduatingStudent.SECOND_UPPER
        elif cgpa >= 2.50:
            return GraduatingStudent.SECOND_LOWER
        elif cgpa >= 2.00:
            return GraduatingStudent.THIRD_CLASS
        elif cgpa >= 1.50:
            return GraduatingStudent.PASS
        else:
            return None  # Below passing threshold


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
