from rest_framework import serializers
from .models import (
    Exam, Grade, Transcript,
    GradeScale, ScriptCollection,
    PromotionalList, StudentPromotion,
    GraduationList, GraduatingStudent
)


class ExamSerializer(serializers.ModelSerializer):
    """
    Serializer for Exam model
    """
    course_code = serializers.CharField(source='course_offering.course.code', read_only=True)
    course_title = serializers.CharField(source='course_offering.course.title', read_only=True)

    class Meta:
        model = Exam
        fields = [
            'id', 'course_offering', 'course_code', 'course_title',
            'name', 'exam_type', 'date', 'start_time', 'end_time',
            'duration_minutes', 'total_marks', 'passing_marks',
            'instructions', 'venue', 'capacity', 'status', 'invigilators',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate(self, attrs):
        """
        Validate exam data
        """
        start_time = attrs.get('start_time')
        end_time = attrs.get('end_time')
        total_marks = attrs.get('total_marks')
        passing_marks = attrs.get('passing_marks')

        # Validate time range
        if start_time and end_time and end_time <= start_time:
            raise serializers.ValidationError({
                'end_time': 'End time must be after start time.'
            })

        # Validate passing marks
        if passing_marks and total_marks and passing_marks > total_marks:
            raise serializers.ValidationError({
                'passing_marks': 'Passing marks cannot be greater than total marks.'
            })

        return attrs


class GradeSerializer(serializers.ModelSerializer):
    """
    Serializer for Grade model
    """
    student_id = serializers.CharField(source='student.student_id', read_only=True)
    student_name = serializers.CharField(source='student.user.get_full_name', read_only=True)
    exam_name = serializers.CharField(source='exam.name', read_only=True)
    course_code = serializers.CharField(source='exam.course_offering.course.code', read_only=True)
    graded_by_name = serializers.CharField(source='graded_by.get_full_name', read_only=True, allow_null=True)
    percentage = serializers.DecimalField(max_digits=5, decimal_places=2, read_only=True)
    is_passing = serializers.BooleanField(read_only=True)

    class Meta:
        model = Grade
        fields = [
            'id', 'student', 'student_id', 'student_name',
            'exam', 'exam_name', 'course_code',
            'marks_obtained', 'graded_by', 'graded_by_name',
            'graded_date', 'remarks', 'percentage', 'is_passing',
            'grade_letter', 'approval_status', 'approved_by', 'approved_date',
            'is_published', 'published_by', 'published_date',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'graded_by', 'graded_date', 'created_at', 'updated_at']

    def validate(self, attrs):
        """
        Validate grade data
        """
        student = attrs.get('student', self.instance.student if self.instance else None)
        exam = attrs.get('exam', self.instance.exam if self.instance else None)
        marks_obtained = attrs.get('marks_obtained')

        # Check if grade already exists for this student-exam combination
        grade_id = self.instance.id if self.instance else None
        if Grade.objects.filter(
            student=student,
            exam=exam
        ).exclude(id=grade_id).exists():
            raise serializers.ValidationError({
                'exam': 'Grade already exists for this student and exam.'
            })

        # Validate marks obtained
        if marks_obtained and exam and marks_obtained > exam.total_marks:
            raise serializers.ValidationError({
                'marks_obtained': f'Marks obtained cannot be greater than total marks ({exam.total_marks}).'
            })

        return attrs


class TranscriptSerializer(serializers.ModelSerializer):
    """
    Serializer for Transcript model
    """
    student_id = serializers.CharField(source='student.student_id', read_only=True)
    student_name = serializers.CharField(source='student.user.get_full_name', read_only=True)
    program_name = serializers.CharField(source='student.program.name', read_only=True)

    class Meta:
        model = Transcript
        fields = [
            'id', 'student', 'student_id', 'student_name', 'program_name',
            'semester', 'academic_year', 'courses_taken', 'total_credits',
            'gpa', 'cgpa', 'generated_date', 'issued_date',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'generated_date', 'created_at', 'updated_at']

    def validate(self, attrs):
        """
        Validate transcript data
        """
        student = attrs.get('student', self.instance.student if self.instance else None)
        semester = attrs.get('semester', self.instance.semester if self.instance else None)
        academic_year = attrs.get('academic_year', self.instance.academic_year if self.instance else None)

        # Check if transcript already exists for this combination
        transcript_id = self.instance.id if self.instance else None
        if Transcript.objects.filter(
            student=student,
            semester=semester,
            academic_year=academic_year
        ).exclude(id=transcript_id).exists():
            raise serializers.ValidationError({
                'semester': 'Transcript already exists for this student in this semester and academic year.'
            })

        return attrs


class GradeScaleSerializer(serializers.ModelSerializer):
    """
    Serializer for GradeScale model
    """
    program_code = serializers.CharField(source='program.code', read_only=True)
    program_name = serializers.CharField(source='program.name', read_only=True)

    class Meta:
        model = GradeScale
        fields = [
            'id', 'program', 'program_code', 'program_name',
            'letter_grade', 'min_percentage', 'max_percentage',
            'grade_points', 'description',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate(self, attrs):
        """
        Validate grade scale data
        """
        min_percentage = attrs.get('min_percentage')
        max_percentage = attrs.get('max_percentage')

        if min_percentage and max_percentage and min_percentage >= max_percentage:
            raise serializers.ValidationError({
                'max_percentage': 'Maximum percentage must be greater than minimum percentage.'
            })

        return attrs


class ScriptCollectionSerializer(serializers.ModelSerializer):
    """
    Serializer for ScriptCollection model
    """
    exam_name = serializers.CharField(source='exam.name', read_only=True)
    student_id = serializers.CharField(source='student.student_id', read_only=True)
    student_name = serializers.CharField(source='student.user.get_full_name', read_only=True)
    collected_by_name = serializers.CharField(source='collected_by.get_full_name', read_only=True, allow_null=True)

    class Meta:
        model = ScriptCollection
        fields = [
            'id', 'exam', 'exam_name', 'student', 'student_id', 'student_name',
            'script_collected', 'collection_date', 'collected_by', 'collected_by_name',
            'script_number', 'notes',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class PromotionalListSerializer(serializers.ModelSerializer):
    """
    Serializer for PromotionalList model
    """
    program_code = serializers.CharField(source='program.code', read_only=True)
    program_name = serializers.CharField(source='program.name', read_only=True)
    approved_by_name = serializers.CharField(source='approved_by.get_full_name', read_only=True, allow_null=True)
    student_count = serializers.SerializerMethodField()

    class Meta:
        model = PromotionalList
        fields = [
            'id', 'semester', 'academic_year', 'program', 'program_code', 'program_name',
            'level', 'generated_date', 'approved_by', 'approved_by_name', 'approved_date',
            'is_approved', 'is_executed', 'executed_date', 'student_count',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'generated_date', 'created_at', 'updated_at']

    def get_student_count(self, obj):
        """Get the count of students in this promotional list"""
        return obj.student_promotions.count()


class StudentPromotionSerializer(serializers.ModelSerializer):
    """
    Serializer for StudentPromotion model
    """
    student_id = serializers.CharField(source='student.student_id', read_only=True)
    student_name = serializers.CharField(source='student.user.get_full_name', read_only=True)
    promotional_list_info = serializers.SerializerMethodField()

    class Meta:
        model = StudentPromotion
        fields = [
            'id', 'promotional_list', 'promotional_list_info',
            'student', 'student_id', 'student_name',
            'current_level', 'next_level', 'cgpa', 'credits_earned',
            'status', 'remarks', 'effective_date',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_promotional_list_info(self, obj):
        """Get promotional list information"""
        return f"{obj.promotional_list.program.code} - Level {obj.promotional_list.level} - {obj.promotional_list.semester} {obj.promotional_list.academic_year}"


class GraduationListSerializer(serializers.ModelSerializer):
    """
    Serializer for GraduationList model
    """
    program_code = serializers.CharField(source='program.code', read_only=True)
    program_name = serializers.CharField(source='program.name', read_only=True)
    approved_by_name = serializers.CharField(source='approved_by.get_full_name', read_only=True, allow_null=True)
    student_count = serializers.SerializerMethodField()

    class Meta:
        model = GraduationList
        fields = [
            'id', 'academic_year', 'program', 'program_code', 'program_name',
            'ceremony_date', 'generated_date', 'approved_by', 'approved_by_name',
            'approved_date', 'is_approved', 'student_count',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'generated_date', 'created_at', 'updated_at']

    def get_student_count(self, obj):
        """Get the count of students in this graduation list"""
        return obj.graduating_students.count()


class GraduatingStudentSerializer(serializers.ModelSerializer):
    """
    Serializer for GraduatingStudent model
    """
    student_id = serializers.CharField(source='student.student_id', read_only=True)
    student_name = serializers.CharField(source='student.user.get_full_name', read_only=True)
    graduation_list_info = serializers.SerializerMethodField()
    classification_display = serializers.CharField(source='get_classification_display', read_only=True)

    class Meta:
        model = GraduatingStudent
        fields = [
            'id', 'graduation_list', 'graduation_list_info',
            'student', 'student_id', 'student_name',
            'final_cgpa', 'classification', 'classification_display',
            'total_credits', 'is_cleared', 'remarks',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_graduation_list_info(self, obj):
        """Get graduation list information"""
        return f"{obj.graduation_list.program.code} - {obj.graduation_list.academic_year}"
