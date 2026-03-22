"""
Letters Management Views
"""
from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from django.utils import timezone
from django.core.mail import send_mail
from django.conf import settings

from .models import LetterTemplate, GeneratedLetter, LetterSignature, LetterLog
from .serializers import (
    LetterTemplateSerializer, LetterTemplateCreateSerializer,
    GeneratedLetterSerializer, GeneratedLetterCreateSerializer,
    LetterSignatureSerializer, LetterLogSerializer,
    SignLetterSerializer, IssueLetterSerializer
)


class LetterTemplateViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing Letter Templates
    """
    queryset = LetterTemplate.objects.all()
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['letter_type', 'is_active', 'campus']
    search_fields = ['name', 'subject']
    ordering_fields = ['created_at', 'name']

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return LetterTemplateCreateSerializer
        return LetterTemplateSerializer

    def get_queryset(self):
        user = self.request.user
        queryset = LetterTemplate.objects.filter(is_deleted=False)

        # Filter by role
        if user.role == 'SUPER_ADMIN':
            return queryset
        elif user.role in ['ADMIN', 'CAMPUS_ADMIN']:
            return queryset.filter(campus=user.campus) | queryset.filter(campus__isnull=True)
        else:
            # Only active templates for other roles
            return queryset.filter(is_active=True)

    def perform_create(self, serializer):
        # Only SUPER_ADMIN and ADMIN can create templates
        if self.request.user.role not in ['SUPER_ADMIN', 'ADMIN']:
            raise PermissionError("You don't have permission to create letter templates")
        serializer.save()


class GeneratedLetterViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing Generated Letters
    """
    queryset = GeneratedLetter.objects.all()
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'campus', 'template__letter_type']
    search_fields = ['reference_number', 'recipient_name', 'subject']
    ordering_fields = ['created_at', 'issued_at']

    def get_serializer_class(self):
        if self.action == 'create':
            return GeneratedLetterCreateSerializer
        return GeneratedLetterSerializer

    def get_queryset(self):
        user = self.request.user
        queryset = GeneratedLetter.objects.filter(is_deleted=False)

        # Filter by role
        if user.role == 'SUPER_ADMIN':
            return queryset
        elif user.role in ['ADMIN', 'CAMPUS_ADMIN']:
            return queryset.filter(campus=user.campus)
        elif user.role == 'STUDENT':
            # Students can only see their own letters
            if hasattr(user, 'student_profile'):
                return queryset.filter(student=user.student_profile)
            return queryset.none()
        elif user.role in ['DEAN', 'LECTURER']:
            # Can see letters they created or signed
            return queryset.filter(
                models.Q(created_by=user) | models.Q(signed_by=user)
            )
        else:
            return queryset.filter(created_by=user)

    def perform_create(self, serializer):
        # Check if user has permission to create letters
        allowed_roles = ['SUPER_ADMIN', 'ADMIN', 'CAMPUS_ADMIN', 'DEAN']
        if self.request.user.role not in allowed_roles:
            raise PermissionError("You don't have permission to create letters")
        serializer.save()

    @action(detail=True, methods=['post'])
    def sign(self, request, pk=None):
        """Sign a letter"""
        letter = self.get_object()
        serializer = SignLetterSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # Check if user has permission to sign
        if request.user.role not in letter.template.signature_roles:
            return Response(
                {'error': 'You do not have permission to sign this letter type'},
                status=status.HTTP_403_FORBIDDEN
            )

        # Check if letter is in correct status
        if letter.status not in ['DRAFT', 'PENDING_SIGNATURE']:
            return Response(
                {'error': 'Letter cannot be signed in its current status'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Sign the letter
        letter.signed_by = request.user
        letter.signed_at = timezone.now()
        letter.digital_signature = serializer.validated_data.get('digital_signature', '')
        letter.status = 'SIGNED'
        letter.save()

        # Log the action
        LetterLog.objects.create(
            letter=letter,
            action='SIGNED',
            performed_by=request.user,
            ip_address=request.META.get('REMOTE_ADDR'),
            user_agent=request.META.get('HTTP_USER_AGENT')
        )

        return Response(
            GeneratedLetterSerializer(letter).data,
            status=status.HTTP_200_OK
        )

    @action(detail=True, methods=['post'])
    def issue(self, request, pk=None):
        """Issue a letter"""
        letter = self.get_object()
        serializer = IssueLetterSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # Check if letter is signed
        if letter.status != 'SIGNED':
            return Response(
                {'error': 'Letter must be signed before it can be issued'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Issue the letter
        letter.issued_by = request.user
        letter.issued_at = timezone.now()
        letter.status = 'ISSUED'
        letter.save()

        # Log the action
        LetterLog.objects.create(
            letter=letter,
            action='ISSUED',
            performed_by=request.user,
            ip_address=request.META.get('REMOTE_ADDR'),
            user_agent=request.META.get('HTTP_USER_AGENT')
        )

        # Send email if requested
        if serializer.validated_data.get('send_email') and letter.recipient_email:
            try:
                send_mail(
                    subject=letter.subject,
                    message=serializer.validated_data.get('email_message', f'Please find attached your letter: {letter.reference_number}'),
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[letter.recipient_email],
                    fail_silently=False,
                )
                LetterLog.objects.create(
                    letter=letter,
                    action='EMAILED',
                    performed_by=request.user,
                    details={'email': letter.recipient_email}
                )
            except Exception as e:
                return Response(
                    {'warning': f'Letter issued but email failed: {str(e)}'},
                    status=status.HTTP_207_MULTI_STATUS
                )

        return Response(
            GeneratedLetterSerializer(letter).data,
            status=status.HTTP_200_OK
        )

    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        """Cancel a letter"""
        letter = self.get_object()

        # Only SUPER_ADMIN and ADMIN can cancel letters
        if request.user.role not in ['SUPER_ADMIN', 'ADMIN']:
            return Response(
                {'error': 'You do not have permission to cancel letters'},
                status=status.HTTP_403_FORBIDDEN
            )

        letter.status = 'CANCELLED'
        letter.save()

        # Log the action
        LetterLog.objects.create(
            letter=letter,
            action='CANCELLED',
            performed_by=request.user,
            ip_address=request.META.get('REMOTE_ADDR'),
            user_agent=request.META.get('HTTP_USER_AGENT'),
            details={'reason': request.data.get('reason', '')}
        )

        return Response(
            GeneratedLetterSerializer(letter).data,
            status=status.HTTP_200_OK
        )

    @action(detail=True, methods=['get'])
    def download(self, request, pk=None):
        """Download letter as PDF"""
        letter = self.get_object()

        # Log the download
        LetterLog.objects.create(
            letter=letter,
            action='DOWNLOADED',
            performed_by=request.user,
            ip_address=request.META.get('REMOTE_ADDR'),
            user_agent=request.META.get('HTTP_USER_AGENT')
        )

        # TODO: Generate and return PDF
        return Response(
            {'pdf_url': letter.pdf_file.url if letter.pdf_file else None},
            status=status.HTTP_200_OK
        )

    @action(detail=True, methods=['get'])
    def logs(self, request, pk=None):
        """Get logs for a letter"""
        letter = self.get_object()
        logs = LetterLog.objects.filter(letter=letter)
        serializer = LetterLogSerializer(logs, many=True)
        return Response(serializer.data)


class LetterSignatureViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing Letter Signatures
    """
    queryset = LetterSignature.objects.all()
    serializer_class = LetterSignatureSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['user', 'campus', 'is_active']
    search_fields = ['title', 'user__email', 'user__first_name', 'user__last_name']

    def get_queryset(self):
        user = self.request.user
        queryset = LetterSignature.objects.filter(is_deleted=False)

        # Filter by role
        if user.role == 'SUPER_ADMIN':
            return queryset
        elif user.role in ['ADMIN', 'CAMPUS_ADMIN']:
            return queryset.filter(campus=user.campus)
        else:
            # Users can only see their own signatures
            return queryset.filter(user=user)

    def perform_create(self, serializer):
        # Only SUPER_ADMIN, ADMIN, and users creating their own can create signatures
        if self.request.user.role not in ['SUPER_ADMIN', 'ADMIN']:
            if serializer.validated_data.get('user') != self.request.user:
                raise PermissionError("You can only create signatures for yourself")
        serializer.save()
