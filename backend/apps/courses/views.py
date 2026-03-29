from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters

from .models import Program, Course, CourseOffering
from .serializers import ProgramSerializer, CourseSerializer, CourseOfferingSerializer
from apps.authentication.permissions import IsAdmin, IsAdminOrReadOnly


class ProgramViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing academic programs
    """
    queryset = Program.objects.filter(is_deleted=False)
    serializer_class = ProgramSerializer
    permission_classes = [IsAuthenticated, IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['campus', 'department', 'degree_type', 'is_active']
    search_fields = ['name', 'code', 'description']
    ordering_fields = ['name', 'code', 'degree_type', 'created_at']
    ordering = ['campus', 'degree_type', 'name']

    def get_queryset(self):
        """
        Optimize queryset with select_related to prevent N+1 queries
        """
        return Program.objects.filter(is_deleted=False).select_related(
            'campus',
            'department',
            'department__faculty'
        )

    @action(detail=True, methods=['get'])
    def students(self, request, pk=None):
        """
        Get all students enrolled in a program
        """
        program = self.get_object()

        from apps.students.models import Student
        from apps.students.serializers import StudentSerializer

        students = Student.objects.filter(program=program, user__is_active=True)
        serializer = StudentSerializer(students, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)


class CourseViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing courses
    """
    queryset = Course.objects.filter(is_deleted=False)
    serializer_class = CourseSerializer
    permission_classes = [IsAuthenticated, IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['campus', 'department', 'is_elective', 'is_active']
    search_fields = ['code', 'title', 'description']
    ordering_fields = ['code', 'title', 'credits', 'created_at']
    ordering = ['code']

    def get_queryset(self):
        """
        Optimize queryset with select_related to prevent N+1 queries
        """
        return Course.objects.filter(is_deleted=False).select_related(
            'campus',
            'department',
            'department__faculty'
        )

    @action(detail=True, methods=['get'])
    def offerings(self, request, pk=None):
        """
        Get all offerings of a course
        """
        course = self.get_object()
        offerings = CourseOffering.objects.filter(course=course)
        serializer = CourseOfferingSerializer(offerings, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)


class CourseOfferingViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing course offerings
    """
    queryset = CourseOffering.objects.filter(is_deleted=False)
    serializer_class = CourseOfferingSerializer
    permission_classes = [IsAuthenticated, IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['course', 'semester', 'academic_year', 'campus', 'instructor', 'status']
    search_fields = ['course__code', 'course__title', 'room']
    ordering_fields = ['academic_year', 'semester', 'enrolled_count', 'created_at']
    ordering = ['-academic_year', 'semester']

    def get_queryset(self):
        """
        Optimize queryset with select_related to prevent N+1 queries
        """
        return CourseOffering.objects.filter(is_deleted=False).select_related(
            'course',
            'course__department',
            'course__campus',
            'campus',
            'instructor',
            'instructor__user'
        )

    @action(detail=True, methods=['get'])
    def enrollments(self, request, pk=None):
        """
        Get all enrollments for a course offering
        """
        offering = self.get_object()

        from apps.students.models import Enrollment
        from apps.students.serializers import EnrollmentSerializer

        enrollments = Enrollment.objects.filter(course_offering=offering)
        serializer = EnrollmentSerializer(enrollments, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=True, methods=['get'])
    def attendance(self, request, pk=None):
        """
        Get attendance records for a course offering
        """
        offering = self.get_object()

        from apps.students.models import Attendance
        from apps.students.serializers import AttendanceSerializer

        attendance_records = Attendance.objects.filter(course_offering=offering)
        serializer = AttendanceSerializer(attendance_records, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated, IsAdmin])
    def close_enrollment(self, request, pk=None):
        """
        Close enrollment for a course offering
        """
        offering = self.get_object()
        offering.status = 'CLOSED'
        offering.save()

        return Response(
            {'message': 'Course offering enrollment closed successfully'},
            status=status.HTTP_200_OK
        )

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated, IsAdmin])
    def open_enrollment(self, request, pk=None):
        """
        Open enrollment for a course offering
        """
        offering = self.get_object()
        offering.status = 'OPEN'
        offering.save()

        return Response(
            {'message': 'Course offering enrollment opened successfully'},
            status=status.HTTP_200_OK
        )

    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated, IsAdmin])
    def rollover(self, request):
        """
        Rollover course offerings from one semester to another.
        This copies all course offerings from a source semester/year to a target semester/year.

        Parameters:
        - source_semester: Source semester (e.g., "FALL", "SPRING", "SUMMER")
        - source_academic_year: Source academic year (e.g., "2024-2025")
        - target_semester: Target semester
        - target_academic_year: Target academic year
        - campus_id: Campus ID (optional - if not provided, rollover all campuses)
        - copy_instructors: Boolean - whether to copy instructor assignments (default: True)
        - copy_schedules: Boolean - whether to copy schedules (default: True)
        - copy_rooms: Boolean - whether to copy room assignments (default: False)
        """
        source_semester = request.data.get('source_semester')
        source_academic_year = request.data.get('source_academic_year')
        target_semester = request.data.get('target_semester')
        target_academic_year = request.data.get('target_academic_year')
        campus_id = request.data.get('campus_id')
        copy_instructors = request.data.get('copy_instructors', True)
        copy_schedules = request.data.get('copy_schedules', True)
        copy_rooms = request.data.get('copy_rooms', False)

        # Validate required fields
        if not all([source_semester, source_academic_year, target_semester, target_academic_year]):
            return Response(
                {
                    'error': 'source_semester, source_academic_year, target_semester, and target_academic_year are required'
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # Get source offerings
        source_offerings_query = CourseOffering.objects.filter(
            semester=source_semester,
            academic_year=source_academic_year,
            is_deleted=False
        )

        if campus_id:
            source_offerings_query = source_offerings_query.filter(campus_id=campus_id)

        source_offerings = list(source_offerings_query)

        if not source_offerings:
            return Response(
                {'error': 'No course offerings found for the specified source semester and academic year'},
                status=status.HTTP_404_NOT_FOUND
            )

        # Check if target offerings already exist
        existing_offerings = CourseOffering.objects.filter(
            semester=target_semester,
            academic_year=target_academic_year,
            is_deleted=False
        )

        if campus_id:
            existing_offerings = existing_offerings.filter(campus_id=campus_id)

        if existing_offerings.exists():
            return Response(
                {
                    'error': f'Course offerings already exist for {target_semester} {target_academic_year}. '
                             'Please delete them first or choose a different target semester/year.'
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # Perform rollover
        created_offerings = []
        for source_offering in source_offerings:
            new_offering = CourseOffering(
                course=source_offering.course,
                semester=target_semester,
                academic_year=target_academic_year,
                campus=source_offering.campus,
                instructor=source_offering.instructor if copy_instructors else None,
                schedule=source_offering.schedule if copy_schedules else {},
                room=source_offering.room if copy_rooms else None,
                max_students=source_offering.max_students,
                enrolled_count=0,  # Reset enrollment count
                status='OPEN'  # Reset status to OPEN
            )
            new_offering.save()
            created_offerings.append(new_offering)

        serializer = self.get_serializer(created_offerings, many=True)

        return Response({
            'message': f'Successfully rolled over {len(created_offerings)} course offerings',
            'count': len(created_offerings),
            'offerings': serializer.data
        }, status=status.HTTP_201_CREATED)
