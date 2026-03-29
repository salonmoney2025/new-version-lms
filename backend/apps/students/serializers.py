from rest_framework import serializers
from .models import Student, Enrollment, Attendance, LeaveApplication, StudentFeedback, StudentDocument, CourseRegistration


class StudentSerializer(serializers.ModelSerializer):
    """
    Serializer for Student model
    """
    user_email = serializers.EmailField(source='user.email', read_only=True)
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    campus_name = serializers.CharField(source='campus.name', read_only=True)
    department_name = serializers.CharField(source='department.name', read_only=True)
    program_name = serializers.CharField(source='program.name', read_only=True)

    class Meta:
        model = Student
        fields = [
            'id', 'user', 'user_email', 'user_name', 'student_id',
            'campus', 'campus_name', 'department', 'department_name',
            'program', 'program_name', 'admission_date', 'enrollment_status',
            'current_semester', 'gpa', 'guardian_name', 'guardian_phone',
            'guardian_email', 'medical_info', 'blood_group', 'address',
            'emergency_contact', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'student_id', 'created_at', 'updated_at']

    def validate(self, attrs):
        """
        Validate student data
        """
        user = attrs.get('user', self.instance.user if self.instance else None)

        # Ensure user has STUDENT role
        if user and user.role != 'STUDENT':
            raise serializers.ValidationError({
                'user': 'User must have STUDENT role.'
            })

        return attrs


class EnrollmentSerializer(serializers.ModelSerializer):
    """
    Serializer for Enrollment model
    """
    student_id = serializers.CharField(source='student.student_id', read_only=True)
    student_name = serializers.CharField(source='student.user.get_full_name', read_only=True)
    course_code = serializers.CharField(source='course_offering.course.code', read_only=True)
    course_title = serializers.CharField(source='course_offering.course.title', read_only=True)
    instructor_name = serializers.CharField(
        source='course_offering.instructor.user.get_full_name',
        read_only=True,
        allow_null=True
    )

    class Meta:
        model = Enrollment
        fields = [
            'id', 'student', 'student_id', 'student_name',
            'course_offering', 'course_code', 'course_title', 'instructor_name',
            'semester', 'academic_year', 'enrollment_date', 'status',
            'grade', 'grade_point', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'enrollment_date', 'created_at', 'updated_at']

    def validate(self, attrs):
        """
        Validate enrollment data
        """
        student = attrs.get('student', self.instance.student if self.instance else None)
        course_offering = attrs.get('course_offering', self.instance.course_offering if self.instance else None)

        # Check if student is already enrolled in this course offering
        if not self.instance:  # Only for new enrollments
            if Enrollment.objects.filter(student=student, course_offering=course_offering).exists():
                raise serializers.ValidationError({
                    'course_offering': 'Student is already enrolled in this course offering.'
                })

        # Check if course offering is full
        if course_offering and course_offering.is_full:
            raise serializers.ValidationError({
                'course_offering': 'This course offering is full.'
            })

        return attrs


class AttendanceSerializer(serializers.ModelSerializer):
    """
    Serializer for Attendance model
    """
    student_id = serializers.CharField(source='student.student_id', read_only=True)
    student_name = serializers.CharField(source='student.user.get_full_name', read_only=True)
    course_code = serializers.CharField(source='course_offering.course.code', read_only=True)
    course_title = serializers.CharField(source='course_offering.course.title', read_only=True)
    marked_by_name = serializers.CharField(source='marked_by.get_full_name', read_only=True, allow_null=True)

    class Meta:
        model = Attendance
        fields = [
            'id', 'student', 'student_id', 'student_name',
            'course_offering', 'course_code', 'course_title',
            'date', 'status', 'marked_by', 'marked_by_name',
            'remarks', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'marked_by', 'created_at', 'updated_at']

    def validate(self, attrs):
        """
        Validate attendance data
        """
        student = attrs.get('student', self.instance.student if self.instance else None)
        course_offering = attrs.get('course_offering', self.instance.course_offering if self.instance else None)
        date = attrs.get('date', self.instance.date if self.instance else None)

        # Check if attendance already exists for this combination
        attendance_id = self.instance.id if self.instance else None
        if Attendance.objects.filter(
            student=student,
            course_offering=course_offering,
            date=date
        ).exclude(id=attendance_id).exists():
            raise serializers.ValidationError({
                'date': 'Attendance record already exists for this student and course on this date.'
            })

        return attrs


class LeaveApplicationSerializer(serializers.ModelSerializer):
    """Serializer for Leave Application"""
    student_id = serializers.CharField(source='student.student_id', read_only=True)
    student_name = serializers.CharField(source='student.user.get_full_name', read_only=True)
    reviewed_by_name = serializers.CharField(source='reviewed_by.get_full_name', read_only=True, allow_null=True)
    duration = serializers.IntegerField(source='duration_days', read_only=True)

    class Meta:
        model = LeaveApplication
        fields = [
            'id', 'student', 'student_id', 'student_name',
            'leave_type', 'start_date', 'end_date', 'duration',
            'reason', 'supporting_document', 'status',
            'reviewed_by', 'reviewed_by_name', 'reviewed_date',
            'review_comments', 'application_date',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'application_date', 'reviewed_by', 'reviewed_date', 'created_at', 'updated_at']


class StudentFeedbackSerializer(serializers.ModelSerializer):
    """Serializer for Student Feedback"""
    student_id = serializers.CharField(source='student.student_id', read_only=True)
    student_name = serializers.CharField(source='student.user.get_full_name', read_only=True)
    assigned_to_name = serializers.CharField(source='assigned_to.get_full_name', read_only=True, allow_null=True)
    responded_by_name = serializers.CharField(source='responded_by.get_full_name', read_only=True, allow_null=True)

    class Meta:
        model = StudentFeedback
        fields = [
            'id', 'student', 'student_id', 'student_name',
            'category', 'subject', 'description', 'priority', 'status',
            'is_anonymous', 'attachment',
            'assigned_to', 'assigned_to_name', 'response',
            'responded_by', 'responded_by_name', 'responded_date',
            'resolution_date', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'responded_by', 'responded_date', 'resolution_date', 'created_at', 'updated_at']


class StudentDocumentSerializer(serializers.ModelSerializer):
    """Serializer for Student Document"""
    student_id = serializers.CharField(source='student.student_id', read_only=True)
    student_name = serializers.CharField(source='student.user.get_full_name', read_only=True)
    uploaded_by_name = serializers.CharField(source='uploaded_by.get_full_name', read_only=True, allow_null=True)
    verified_by_name = serializers.CharField(source='verified_by.get_full_name', read_only=True, allow_null=True)

    class Meta:
        model = StudentDocument
        fields = [
            'id', 'student', 'student_id', 'student_name',
            'document_type', 'title', 'file', 'file_size',
            'uploaded_by', 'uploaded_by_name', 'upload_date',
            'is_verified', 'verified_by', 'verified_by_name', 'verified_date',
            'expiry_date', 'notes', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'uploaded_by', 'upload_date', 'file_size', 'created_at', 'updated_at']


class CourseRegistrationSerializer(serializers.ModelSerializer):
    """Serializer for Course Registration"""
    student_id = serializers.CharField(source='student.student_id', read_only=True)
    student_name = serializers.CharField(source='student.user.get_full_name', read_only=True)
    approved_by_name = serializers.CharField(source='approved_by.get_full_name', read_only=True, allow_null=True)
    
    class Meta:
        model = CourseRegistration
        fields = [
            'id', 'student', 'student_id', 'student_name',
            'semester', 'academic_year', 'courses',
            'total_credits', 'status', 'submitted_date',
            'approved_by', 'approved_by_name', 'approved_date',
            'rejection_reason', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'approved_by', 'approved_date', 'created_at', 'updated_at']
