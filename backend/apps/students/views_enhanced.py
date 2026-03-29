# Enhanced views for new student features - GitHub best practices
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters
from django.utils import timezone

from .models import LeaveApplication, StudentFeedback, StudentDocument, CourseRegistration
from .additional_serializers import (
    LeaveApplicationSerializer, StudentFeedbackSerializer,
    StudentDocumentSerializer, CourseRegistrationSerializer
)
from apps.authentication.permissions import IsAdmin, IsAdminOrReadOnly


class LeaveApplicationViewSet(viewsets.ModelViewSet):
    """ViewSet for student leave applications"""
    queryset = LeaveApplication.objects.filter(is_deleted=False)
    serializer_class = LeaveApplicationSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['student', 'leave_type', 'status', 'start_date', 'end_date']
    search_fields = ['student__student_id', 'reason', 'review_comments']
    ordering_fields = ['application_date', 'start_date', 'status']
    ordering = ['-application_date']

    def get_queryset(self):
        queryset = LeaveApplication.objects.filter(is_deleted=False).select_related(
            'student', 'student__user', 'reviewed_by'
        )
        # Students can only see their own applications
        if hasattr(self.request.user, 'student_profile'):
            queryset = queryset.filter(student=self.request.user.student_profile)
        return queryset

    @action(detail=True, methods=['post'], permission_classes=[IsAdmin])
    def approve(self, request, pk=None):
        """Approve a leave application"""
        leave_app = self.get_object()
        leave_app.status = LeaveApplication.APPROVED
        leave_app.reviewed_by = request.user
        leave_app.reviewed_date = timezone.now()
        leave_app.review_comments = request.data.get('review_comments', '')
        leave_app.save()

        return Response(
            LeaveApplicationSerializer(leave_app).data,
            status=status.HTTP_200_OK
        )

    @action(detail=True, methods=['post'], permission_classes=[IsAdmin])
    def reject(self, request, pk=None):
        """Reject a leave application"""
        leave_app = self.get_object()
        leave_app.status = LeaveApplication.REJECTED
        leave_app.reviewed_by = request.user
        leave_app.reviewed_date = timezone.now()
        leave_app.review_comments = request.data.get('review_comments', 'Application rejected.')
        leave_app.save()

        return Response(
            LeaveApplicationSerializer(leave_app).data,
            status=status.HTTP_200_OK
        )

    @action(detail=False, methods=['get'])
    def my_applications(self, request):
        """Get current user's leave applications"""
        if not hasattr(request.user, 'student_profile'):
            return Response(
                {'error': 'User is not a student'},
                status=status.HTTP_400_BAD_REQUEST
            )

        applications = self.queryset.filter(student=request.user.student_profile)
        serializer = self.get_serializer(applications, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], permission_classes=[IsAdmin])
    def pending(self, request):
        """Get all pending leave applications"""
        pending_apps = self.queryset.filter(status=LeaveApplication.PENDING)
        serializer = self.get_serializer(pending_apps, many=True)
        return Response(serializer.data)


class StudentFeedbackViewSet(viewsets.ModelViewSet):
    """ViewSet for student feedback and complaints"""
    queryset = StudentFeedback.objects.filter(is_deleted=False)
    serializer_class = StudentFeedbackSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['student', 'category', 'status', 'priority', 'assigned_to']
    search_fields = ['subject', 'description']
    ordering_fields = ['created_at', 'priority', 'status']
    ordering = ['-created_at']

    def get_queryset(self):
        queryset = StudentFeedback.objects.filter(is_deleted=False).select_related(
            'student', 'student__user', 'assigned_to', 'responded_by'
        )
        # Students can only see their own feedback
        if hasattr(self.request.user, 'student_profile'):
            queryset = queryset.filter(student=self.request.user.student_profile)
        return queryset

    @action(detail=True, methods=['post'], permission_classes=[IsAdmin])
    def respond(self, request, pk=None):
        """Respond to student feedback"""
        feedback = self.get_object()
        feedback.response = request.data.get('response', '')
        feedback.responded_by = request.user
        feedback.responded_date = timezone.now()
        feedback.status = StudentFeedback.RESOLVED
        feedback.save()

        return Response(
            StudentFeedbackSerializer(feedback).data,
            status=status.HTTP_200_OK
        )

    @action(detail=True, methods=['post'], permission_classes=[IsAdmin])
    def assign(self, request, pk=None):
        """Assign feedback to a staff member"""
        feedback = self.get_object()
        assigned_to_id = request.data.get('assigned_to')

        from apps.authentication.models import User
        try:
            assigned_to = User.objects.get(id=assigned_to_id)
            feedback.assigned_to = assigned_to
            feedback.status = StudentFeedback.IN_PROGRESS
            feedback.save()

            return Response(
                StudentFeedbackSerializer(feedback).data,
                status=status.HTTP_200_OK
            )
        except User.DoesNotExist:
            return Response(
                {'error': 'User not found'},
                status=status.HTTP_404_NOT_FOUND
            )

    @action(detail=False, methods=['get'])
    def my_feedback(self, request):
        """Get current user's feedback"""
        if not hasattr(request.user, 'student_profile'):
            return Response(
                {'error': 'User is not a student'},
                status=status.HTTP_400_BAD_REQUEST
            )

        feedbacks = self.queryset.filter(student=request.user.student_profile)
        serializer = self.get_serializer(feedbacks, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], permission_classes=[IsAdmin])
    def statistics(self, request):
        """Get feedback statistics"""
        from django.db.models import Count

        stats = {
            'total': self.queryset.count(),
            'by_status': dict(self.queryset.values('status').annotate(count=Count('id')).values_list('status', 'count')),
            'by_category': dict(self.queryset.values('category').annotate(count=Count('id')).values_list('category', 'count')),
            'by_priority': dict(self.queryset.values('priority').annotate(count=Count('id')).values_list('priority', 'count')),
        }
        return Response(stats)


class StudentDocumentViewSet(viewsets.ModelViewSet):
    """ViewSet for student documents"""
    queryset = StudentDocument.objects.filter(is_deleted=False)
    serializer_class = StudentDocumentSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['student', 'document_type', 'is_verified']
    search_fields = ['title', 'notes']
    ordering_fields = ['upload_date', 'document_type']
    ordering = ['-upload_date']

    def get_queryset(self):
        queryset = StudentDocument.objects.filter(is_deleted=False).select_related(
            'student', 'student__user', 'uploaded_by', 'verified_by'
        )
        # Students can only see their own documents
        if hasattr(self.request.user, 'student_profile'):
            queryset = queryset.filter(student=self.request.user.student_profile)
        return queryset

    def perform_create(self, serializer):
        """Auto-set uploaded_by and file_size"""
        file = self.request.FILES.get('file')
        serializer.save(
            uploaded_by=self.request.user,
            file_size=file.size if file else 0
        )

    @action(detail=True, methods=['post'], permission_classes=[IsAdmin])
    def verify(self, request, pk=None):
        """Verify a student document"""
        document = self.get_object()
        document.is_verified = True
        document.verified_by = request.user
        document.verified_date = timezone.now()
        document.notes = request.data.get('notes', document.notes)
        document.save()

        return Response(
            StudentDocumentSerializer(document).data,
            status=status.HTTP_200_OK
        )

    @action(detail=False, methods=['get'])
    def my_documents(self, request):
        """Get current user's documents"""
        if not hasattr(request.user, 'student_profile'):
            return Response(
                {'error': 'User is not a student'},
                status=status.HTTP_400_BAD_REQUEST
            )

        documents = self.queryset.filter(student=request.user.student_profile)
        serializer = self.get_serializer(documents, many=True)
        return Response(serializer.data)


class CourseRegistrationViewSet(viewsets.ModelViewSet):
    """ViewSet for course registration"""
    queryset = CourseRegistration.objects.filter(is_deleted=False)
    serializer_class = CourseRegistrationSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['student', 'semester', 'academic_year', 'status']
    search_fields = ['student__student_id']
    ordering_fields = ['created_at', 'submitted_date']
    ordering = ['-created_at']

    def get_queryset(self):
        queryset = CourseRegistration.objects.filter(is_deleted=False).select_related(
            'student', 'student__user', 'approved_by'
        ).prefetch_related('courses', 'courses__course')

        # Students can only see their own registrations
        if hasattr(self.request.user, 'student_profile'):
            queryset = queryset.filter(student=self.request.user.student_profile)
        return queryset

    @action(detail=True, methods=['post'])
    def submit(self, request, pk=None):
        """Submit course registration for approval"""
        registration = self.get_object()

        if registration.status != CourseRegistration.DRAFT:
            return Response(
                {'error': 'Registration has already been submitted'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Calculate total credits
        total_credits = sum(course.course.credits for course in registration.courses.all())
        registration.total_credits = total_credits
        registration.status = CourseRegistration.SUBMITTED
        registration.submitted_date = timezone.now()
        registration.save()

        return Response(
            CourseRegistrationSerializer(registration).data,
            status=status.HTTP_200_OK
        )

    @action(detail=True, methods=['post'], permission_classes=[IsAdmin])
    def approve(self, request, pk=None):
        """Approve course registration"""
        registration = self.get_object()
        registration.status = CourseRegistration.APPROVED
        registration.approved_by = request.user
        registration.approved_date = timezone.now()
        registration.save()

        # Auto-enroll student in courses
        from .models import Enrollment
        for course_offering in registration.courses.all():
            Enrollment.objects.get_or_create(
                student=registration.student,
                course_offering=course_offering,
                defaults={
                    'semester': registration.semester,
                    'academic_year': registration.academic_year
                }
            )

        return Response(
            CourseRegistrationSerializer(registration).data,
            status=status.HTTP_200_OK
        )

    @action(detail=True, methods=['post'], permission_classes=[IsAdmin])
    def reject(self, request, pk=None):
        """Reject course registration"""
        registration = self.get_object()
        registration.status = CourseRegistration.REJECTED
        registration.rejection_reason = request.data.get('rejection_reason', '')
        registration.save()

        return Response(
            CourseRegistrationSerializer(registration).data,
            status=status.HTTP_200_OK
        )

    @action(detail=False, methods=['get'])
    def my_registrations(self, request):
        """Get current user's course registrations"""
        if not hasattr(request.user, 'student_profile'):
            return Response(
                {'error': 'User is not a student'},
                status=status.HTTP_400_BAD_REQUEST
            )

        registrations = self.queryset.filter(student=request.user.student_profile)
        serializer = self.get_serializer(registrations, many=True)
        return Response(serializer.data)
