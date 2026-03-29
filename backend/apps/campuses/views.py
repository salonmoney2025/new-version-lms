from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters
from django.core.cache import cache
from django.views.decorators.cache import cache_page
from django.utils.decorators import method_decorator

from .models import Campus, Department, Faculty
from .serializers import CampusSerializer, DepartmentSerializer, FacultySerializer
from apps.authentication.permissions import IsAdmin, IsAdminOrReadOnly


class CampusViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing campuses (PHASE 3: Cached)
    """
    queryset = Campus.objects.filter(is_deleted=False)
    serializer_class = CampusSerializer
    permission_classes = [IsAuthenticated, IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['is_active', 'city', 'state', 'country']
    search_fields = ['name', 'code', 'city', 'email']
    ordering_fields = ['name', 'code', 'created_at']
    ordering = ['name']

    def list(self, request, *args, **kwargs):
        """
        List all campuses (PHASE 3: Cached for 1 hour)

        Campuses are relatively static data, so we cache them
        to reduce database load. Cache is invalidated on create/update/delete.
        """
        # Check for filters - don't cache filtered results
        if request.query_params:
            return super().list(request, *args, **kwargs)

        # Try to get from cache
        cache_key = 'campus_list_all'
        cached_data = cache.get(cache_key)

        if cached_data:
            return Response(cached_data)

        # Cache miss - fetch from database
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)

        # Cache for 1 hour
        cache.set(cache_key, serializer.data, 3600)

        return Response(serializer.data)

    def perform_create(self, serializer):
        """Invalidate cache on create"""
        cache.delete('campus_list_all')
        serializer.save()

    def perform_update(self, serializer):
        """Invalidate cache on update"""
        cache.delete('campus_list_all')
        serializer.save()

    def perform_destroy(self, instance):
        """Invalidate cache on delete"""
        cache.delete('campus_list_all')
        instance.is_deleted = True
        instance.save()

    @method_decorator(cache_page(60 * 15))  # PHASE 3: Cache for 15 minutes
    @action(detail=True, methods=['get'])
    def statistics(self, request, pk=None):
        """
        Get campus statistics (PHASE 3: Cached for 15 minutes)
        """
        campus = self.get_object()

        from apps.students.models import Student
        from apps.staff.models import StaffMember

        stats = {
            'total_students': campus.users.filter(role='STUDENT', is_active=True).count(),
            'total_staff': campus.users.filter(role='LECTURER', is_active=True).count(),
            'total_departments': campus.departments.filter(is_active=True).count(),
            'total_faculties': campus.faculties.count(),
            'active_students': Student.objects.filter(
                campus=campus,
                enrollment_status='ACTIVE'
            ).count(),
            'active_staff': StaffMember.objects.filter(
                campus=campus,
                status='ACTIVE'
            ).count(),
        }

        return Response(stats, status=status.HTTP_200_OK)


class DepartmentViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing departments (PHASE 3: Cached)
    """
    queryset = Department.objects.filter(is_deleted=False)
    serializer_class = DepartmentSerializer
    permission_classes = [IsAuthenticated, IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['campus', 'is_active', 'head']
    search_fields = ['name', 'code', 'description']
    ordering_fields = ['name', 'code', 'created_at']
    ordering = ['campus', 'name']

    def list(self, request, *args, **kwargs):
        """
        List all departments (PHASE 3: Cached for 1 hour)
        """
        # Check for filters - don't cache filtered results
        if request.query_params:
            return super().list(request, *args, **kwargs)

        cache_key = 'department_list_all'
        cached_data = cache.get(cache_key)

        if cached_data:
            return Response(cached_data)

        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        cache.set(cache_key, serializer.data, 3600)

        return Response(serializer.data)

    def perform_create(self, serializer):
        """Invalidate cache on create"""
        cache.delete('department_list_all')
        serializer.save()

    def perform_update(self, serializer):
        """Invalidate cache on update"""
        cache.delete('department_list_all')
        serializer.save()

    def perform_destroy(self, instance):
        """Invalidate cache on delete"""
        cache.delete('department_list_all')
        instance.is_deleted = True
        instance.save()

    @method_decorator(cache_page(60 * 30))  # PHASE 3: Cache for 30 minutes
    @action(detail=True, methods=['get'])
    def courses(self, request, pk=None):
        """
        Get all courses in a department (PHASE 3: Cached)
        """
        department = self.get_object()
        from apps.courses.models import Course
        from apps.courses.serializers import CourseSerializer

        courses = Course.objects.filter(department=department, is_active=True)
        serializer = CourseSerializer(courses, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=True, methods=['get'])
    def students(self, request, pk=None):
        """
        Get all students in a department (Not cached - frequently changing)
        """
        department = self.get_object()
        from apps.students.models import Student
        from apps.students.serializers import StudentSerializer

        students = Student.objects.filter(department=department, user__is_active=True)
        serializer = StudentSerializer(students, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)


class FacultyViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing faculties (PHASE 3: Cached)
    """
    queryset = Faculty.objects.filter(is_deleted=False)
    serializer_class = FacultySerializer
    permission_classes = [IsAuthenticated, IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['campus', 'dean']
    search_fields = ['name', 'code', 'description']
    ordering_fields = ['name', 'code', 'created_at']
    ordering = ['campus', 'name']

    def list(self, request, *args, **kwargs):
        """
        List all faculties (PHASE 3: Cached for 1 hour)
        """
        # Check for filters - don't cache filtered results
        if request.query_params:
            return super().list(request, *args, **kwargs)

        cache_key = 'faculty_list_all'
        cached_data = cache.get(cache_key)

        if cached_data:
            return Response(cached_data)

        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        cache.set(cache_key, serializer.data, 3600)

        return Response(serializer.data)

    def perform_create(self, serializer):
        """Invalidate cache on create"""
        cache.delete('faculty_list_all')
        serializer.save()

    def perform_update(self, serializer):
        """Invalidate cache on update"""
        cache.delete('faculty_list_all')
        serializer.save()

    def perform_destroy(self, instance):
        """Invalidate cache on delete"""
        cache.delete('faculty_list_all')
        instance.is_deleted = True
        instance.save()
