from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters

from .models import Student, Enrollment, Attendance
from .serializers import StudentSerializer, EnrollmentSerializer, AttendanceSerializer
from apps.authentication.permissions import IsAdmin, IsAdminOrReadOnly, IsOwnerOrAdmin


class StudentViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing students
    """
    queryset = Student.objects.filter(is_deleted=False)
    serializer_class = StudentSerializer
    permission_classes = [IsAuthenticated, IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['campus', 'department', 'program', 'enrollment_status', 'current_semester']
    search_fields = ['student_id', 'user__email', 'user__first_name', 'user__last_name', 'guardian_name']
    ordering_fields = ['student_id', 'admission_date', 'gpa', 'created_at']
    ordering = ['-admission_date']

    def get_queryset(self):
        """
        Optimize queryset with select_related to prevent N+1 queries
        """
        return Student.objects.filter(is_deleted=False).select_related(
            'user',
            'campus',
            'department',
            'program',
            'program__department',
            'program__faculty'
        )

    def perform_create(self, serializer):
        """
        Auto-generate student ID when creating a student
        """
        # Generate student ID based on campus and year
        import datetime
        campus = serializer.validated_data['campus']
        year = datetime.datetime.now().year

        # Get the last student ID for this campus
        last_student = Student.objects.filter(
            campus=campus,
            student_id__startswith=f"{campus.code}{year}"
        ).order_by('-student_id').first()

        if last_student:
            # Extract the sequence number and increment
            sequence = int(last_student.student_id[-4:]) + 1
        else:
            sequence = 1

        student_id = f"{campus.code}{year}{sequence:04d}"
        serializer.save(student_id=student_id)

    @action(detail=True, methods=['post'])
    def enroll_course(self, request, pk=None):
        """
        Enroll student in a course offering
        """
        student = self.get_object()
        course_offering_id = request.data.get('course_offering_id')

        if not course_offering_id:
            return Response(
                {'error': 'course_offering_id is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        from apps.courses.models import CourseOffering

        try:
            course_offering = CourseOffering.objects.get(id=course_offering_id)
        except CourseOffering.DoesNotExist:
            return Response(
                {'error': 'Course offering not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        # Check if already enrolled
        if Enrollment.objects.filter(student=student, course_offering=course_offering).exists():
            return Response(
                {'error': 'Student is already enrolled in this course'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Check if course is full
        if course_offering.is_full:
            return Response(
                {'error': 'Course offering is full'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Create enrollment
        enrollment = Enrollment.objects.create(
            student=student,
            course_offering=course_offering,
            semester=course_offering.semester,
            academic_year=course_offering.academic_year
        )

        # Update enrolled count
        course_offering.enrolled_count += 1
        course_offering.save()

        return Response(
            EnrollmentSerializer(enrollment).data,
            status=status.HTTP_201_CREATED
        )

    @action(detail=True, methods=['get'])
    def get_transcript(self, request, pk=None):
        """
        Get student's academic transcript
        """
        student = self.get_object()

        from apps.exams.models import Transcript
        from apps.exams.serializers import TranscriptSerializer

        transcripts = Transcript.objects.filter(student=student).order_by('-academic_year', '-semester')
        serializer = TranscriptSerializer(transcripts, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=True, methods=['get'])
    def enrollments(self, request, pk=None):
        """
        Get all enrollments for a student
        """
        student = self.get_object()
        enrollments = Enrollment.objects.filter(student=student)
        serializer = EnrollmentSerializer(enrollments, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=True, methods=['get'])
    def attendance_summary(self, request, pk=None):
        """
        Get attendance summary for a student
        """
        student = self.get_object()

        from django.db.models import Count, Q

        summary = Attendance.objects.filter(student=student).aggregate(
            total=Count('id'),
            present=Count('id', filter=Q(status='PRESENT')),
            absent=Count('id', filter=Q(status='ABSENT')),
            late=Count('id', filter=Q(status='LATE')),
            excused=Count('id', filter=Q(status='EXCUSED'))
        )

        # Calculate attendance percentage
        if summary['total'] > 0:
            summary['attendance_percentage'] = round(
                (summary['present'] + summary['late']) / summary['total'] * 100, 2
            )
        else:
            summary['attendance_percentage'] = 0

        return Response(summary, status=status.HTTP_200_OK)


class EnrollmentViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing course enrollments
    """
    queryset = Enrollment.objects.filter(is_deleted=False)
    serializer_class = EnrollmentSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['student', 'course_offering', 'semester', 'academic_year', 'status']
    search_fields = ['student__student_id', 'course_offering__course__code', 'course_offering__course__title']
    ordering_fields = ['enrollment_date', 'grade_point', 'created_at']
    ordering = ['-enrollment_date']

    @action(detail=False, methods=['post'])
    def bulk_enroll(self, request):
        """
        Bulk enroll students in a course offering
        """
        student_ids = request.data.get('student_ids', [])
        course_offering_id = request.data.get('course_offering_id')

        if not student_ids or not course_offering_id:
            return Response(
                {'error': 'student_ids and course_offering_id are required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        from apps.courses.models import CourseOffering

        try:
            course_offering = CourseOffering.objects.get(id=course_offering_id)
        except CourseOffering.DoesNotExist:
            return Response(
                {'error': 'Course offering not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        enrollments = []
        errors = []

        for student_id in student_ids:
            try:
                student = Student.objects.get(id=student_id)

                # Check if already enrolled
                if Enrollment.objects.filter(student=student, course_offering=course_offering).exists():
                    errors.append(f"Student {student.student_id} is already enrolled")
                    continue

                # Create enrollment
                enrollment = Enrollment.objects.create(
                    student=student,
                    course_offering=course_offering,
                    semester=course_offering.semester,
                    academic_year=course_offering.academic_year
                )
                enrollments.append(enrollment)

                # Update enrolled count
                course_offering.enrolled_count += 1
                course_offering.save()

            except Student.DoesNotExist:
                errors.append(f"Student with ID {student_id} not found")

        return Response({
            'enrolled': EnrollmentSerializer(enrollments, many=True).data,
            'errors': errors,
            'total_enrolled': len(enrollments),
            'total_errors': len(errors)
        }, status=status.HTTP_201_CREATED)


class AttendanceViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing student attendance
    """
    queryset = Attendance.objects.filter(is_deleted=False)
    serializer_class = AttendanceSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['student', 'course_offering', 'date', 'status']
    search_fields = ['student__student_id', 'course_offering__course__code']
    ordering_fields = ['date', 'created_at']
    ordering = ['-date']

    def perform_create(self, serializer):
        """
        Auto-set marked_by to current user
        """
        serializer.save(marked_by=self.request.user)

    @action(detail=False, methods=['post'])
    def bulk_mark(self, request):
        """
        Bulk mark attendance for multiple students
        """
        attendances_data = request.data.get('attendances', [])

        if not attendances_data:
            return Response(
                {'error': 'attendances data is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        attendances = []
        errors = []

        for data in attendances_data:
            try:
                student = Student.objects.get(id=data['student_id'])
                course_offering_id = data['course_offering_id']
                date = data['date']
                status_value = data.get('status', 'ABSENT')

                from apps.courses.models import CourseOffering
                course_offering = CourseOffering.objects.get(id=course_offering_id)

                # Check if attendance already exists
                attendance, created = Attendance.objects.get_or_create(
                    student=student,
                    course_offering=course_offering,
                    date=date,
                    defaults={
                        'status': status_value,
                        'marked_by': request.user
                    }
                )

                if not created:
                    # Update existing attendance
                    attendance.status = status_value
                    attendance.marked_by = request.user
                    attendance.save()

                attendances.append(attendance)

            except (Student.DoesNotExist, KeyError) as e:
                errors.append(f"Error processing attendance: {str(e)}")

        return Response({
            'attendances': AttendanceSerializer(attendances, many=True).data,
            'errors': errors,
            'total_marked': len(attendances),
            'total_errors': len(errors)
        }, status=status.HTTP_201_CREATED)
