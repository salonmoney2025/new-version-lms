#!/usr/bin/env python3
"""
Script to append remaining Phase 1 models to models.py
Run this after applying the initial Exam and Grade updates
"""

remaining_models = """

class GradeScale(BaseModel):
    \"\"\"Grade scale configuration for programs\"\"\"
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
    \"\"\"Track collection of physical exam answer scripts\"\"\"
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
    \"\"\"List of students eligible for promotion to next level\"\"\"
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
    \"\"\"Individual student promotion record\"\"\"
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
    \"\"\"List of students eligible for graduation\"\"\"
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
    \"\"\"Individual graduating student record\"\"\"
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
        \"\"\"Calculate degree classification based on CGPA (Sierra Leone system)\"\"\"
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
"""

if __name__ == "__main__":
    with open('models.py', 'a') as f:
        f.write(remaining_models)
    print("[OK] Successfully appended 6 new models to models.py")
    print("  - GradeScale")
    print("  - ScriptCollection")
    print("  - PromotionalList")
    print("  - StudentPromotion")
    print("  - GraduationList")
    print("  - GraduatingStudent")
    print("  - Transcript (updated)")
