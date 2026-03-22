"""
Letters Management Serializers
"""
from rest_framework import serializers
from .models import LetterTemplate, GeneratedLetter, LetterSignature, LetterLog
from apps.authentication.models import User
from apps.students.models import Student
from apps.staff.models import StaffMember


class LetterTemplateSerializer(serializers.ModelSerializer):
    """Serializer for Letter Templates"""
    created_by_name = serializers.CharField(source='created_by.get_full_name', read_only=True)
    campus_name = serializers.CharField(source='campus.name', read_only=True)
    letter_type_display = serializers.CharField(source='get_letter_type_display', read_only=True)

    class Meta:
        model = LetterTemplate
        fields = [
            'id', 'name', 'letter_type', 'letter_type_display', 'subject', 'body',
            'header_html', 'footer_html', 'requires_signature', 'signature_roles',
            'campus', 'campus_name', 'is_active', 'created_by', 'created_by_name',
            'available_variables', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class LetterTemplateCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating Letter Templates"""

    class Meta:
        model = LetterTemplate
        fields = [
            'name', 'letter_type', 'subject', 'body', 'header_html', 'footer_html',
            'requires_signature', 'signature_roles', 'campus', 'is_active',
            'available_variables'
        ]

    def create(self, validated_data):
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)


class GeneratedLetterSerializer(serializers.ModelSerializer):
    """Serializer for Generated Letters"""
    template_name = serializers.CharField(source='template.name', read_only=True)
    template_type = serializers.CharField(source='template.letter_type', read_only=True)
    student_name = serializers.CharField(source='student.user.get_full_name', read_only=True, allow_null=True)
    staff_name = serializers.CharField(source='staff.user.get_full_name', read_only=True, allow_null=True)
    signed_by_name = serializers.CharField(source='signed_by.get_full_name', read_only=True, allow_null=True)
    issued_by_name = serializers.CharField(source='issued_by.get_full_name', read_only=True, allow_null=True)
    created_by_name = serializers.CharField(source='created_by.get_full_name', read_only=True)
    campus_name = serializers.CharField(source='campus.name', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = GeneratedLetter
        fields = [
            'id', 'template', 'template_name', 'template_type', 'student', 'student_name',
            'staff', 'staff_name', 'recipient_name', 'recipient_email', 'subject', 'content',
            'rendered_html', 'status', 'status_display', 'reference_number', 'signed_by',
            'signed_by_name', 'signed_at', 'digital_signature', 'issued_by', 'issued_by_name',
            'issued_at', 'created_by', 'created_by_name', 'pdf_file', 'campus', 'campus_name',
            'metadata', 'notes', 'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'reference_number', 'signed_by', 'signed_at', 'digital_signature',
            'issued_by', 'issued_at', 'created_at', 'updated_at'
        ]


class GeneratedLetterCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating Generated Letters"""

    class Meta:
        model = GeneratedLetter
        fields = [
            'template', 'student', 'staff', 'recipient_name', 'recipient_email',
            'subject', 'content', 'campus', 'metadata', 'notes'
        ]

    def validate(self, data):
        """Ensure either student or staff or recipient_name is provided"""
        if not any([data.get('student'), data.get('staff'), data.get('recipient_name')]):
            raise serializers.ValidationError(
                "At least one of student, staff, or recipient_name must be provided"
            )
        return data

    def create(self, validated_data):
        from django.template import Context, Template as DjangoTemplate
        from django.utils import timezone

        letter = GeneratedLetter(**validated_data)
        letter.created_by = self.context['request'].user

        # Generate reference number
        letter.reference_number = letter.generate_reference_number()

        # Render content using template
        template_obj = letter.template
        context_data = {
            **letter.metadata,
            'recipient_name': letter.recipient_name or (
                letter.student.user.get_full_name() if letter.student else
                letter.staff.user.get_full_name() if letter.staff else ''
            ),
            'date': timezone.now().strftime('%B %d, %Y'),
            'reference_number': letter.reference_number,
        }

        # Render subject and content
        subject_template = DjangoTemplate(template_obj.subject)
        content_template = DjangoTemplate(template_obj.body)

        letter.subject = subject_template.render(Context(context_data))
        letter.content = content_template.render(Context(context_data))

        # Render full HTML
        full_html = f"""
        {template_obj.header_html or ''}
        <div class="letter-content">
            <h2>{letter.subject}</h2>
            {letter.content}
        </div>
        {template_obj.footer_html or ''}
        """
        letter.rendered_html = full_html

        letter.save()
        return letter


class LetterSignatureSerializer(serializers.ModelSerializer):
    """Serializer for Letter Signatures"""
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    campus_name = serializers.CharField(source='campus.name', read_only=True, allow_null=True)

    class Meta:
        model = LetterSignature
        fields = [
            'id', 'user', 'user_name', 'signature_image', 'title',
            'is_active', 'campus', 'campus_name', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class LetterLogSerializer(serializers.ModelSerializer):
    """Serializer for Letter Logs"""
    performed_by_name = serializers.CharField(source='performed_by.get_full_name', read_only=True)
    action_display = serializers.CharField(source='get_action_display', read_only=True)

    class Meta:
        model = LetterLog
        fields = [
            'id', 'letter', 'action', 'action_display', 'performed_by',
            'performed_by_name', 'ip_address', 'user_agent', 'details', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class SignLetterSerializer(serializers.Serializer):
    """Serializer for signing a letter"""
    digital_signature = serializers.CharField(required=False, allow_blank=True)
    signature_id = serializers.UUIDField(required=False)

    def validate(self, data):
        if not data.get('digital_signature') and not data.get('signature_id'):
            raise serializers.ValidationError(
                "Either digital_signature or signature_id must be provided"
            )
        return data


class IssueLetterSerializer(serializers.Serializer):
    """Serializer for issuing a letter"""
    send_email = serializers.BooleanField(default=False)
    email_message = serializers.CharField(required=False, allow_blank=True)
