from rest_framework import serializers
from .models import LeaveApplication, StudentFeedback, StudentDocument, CourseRegistration


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

    def validate(self, attrs):
        start_date = attrs.get('start_date')
        end_date = attrs.get('end_date')
        if start_date and end_date and start_date > end_date:
            raise serializers.ValidationError({'end_date': 'End date must be after start date.'})
        return attrs


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

    def validate_file(self, value):
        if value.size > 10 * 1024 * 1024:
            raise serializers.ValidationError("File size should not exceed 10MB.")
        return value


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
