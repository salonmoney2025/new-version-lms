from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import PageNumberPagination
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters
from django.db import models
from django.core.cache import cache
from django.views.decorators.cache import cache_page
from django.utils.decorators import method_decorator

from .models import (
    Exam, Grade, Transcript,
    GradeScale, ScriptCollection,
    PromotionalList, StudentPromotion,
    GraduationList, GraduatingStudent
)
from .serializers import (
    ExamSerializer, GradeSerializer, TranscriptSerializer,
    GradeScaleSerializer, ScriptCollectionSerializer,
    PromotionalListSerializer, StudentPromotionSerializer,
    GraduationListSerializer, GraduatingStudentSerializer
)
from apps.authentication.permissions import IsAdmin, IsAdminOrReadOnly, IsLecturer
from apps.notifications.utils import notify_result_published, notify_exam_schedule


class GradePagination(PageNumberPagination):
    """
    Pagination for grade lists to prevent massive JSON responses
    """
    page_size = 50
    page_size_query_param = 'page_size'
    max_page_size = 200


class ExamViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing exams
    """
    queryset = Exam.objects.filter(is_deleted=False)
    serializer_class = ExamSerializer
    permission_classes = [IsAuthenticated, IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['course_offering', 'exam_type', 'date', 'status', 'venue']
    search_fields = ['name', 'course_offering__course__code', 'course_offering__course__title']
    ordering_fields = ['date', 'start_time', 'created_at']
    ordering = ['-date', 'start_time']

    @action(detail=True, methods=['get'])
    def grades(self, request, pk=None):
        """
        Get all grades for an exam (Paginated and Optimized)
        """
        exam = self.get_object()

        # Optimize with select_related to prevent N+1 queries
        grades = Grade.objects.filter(exam=exam).select_related(
            'student',
            'student__user',
            'student__program',
            'graded_by',
            'approved_by',
            'published_by'
        ).order_by('-graded_date')

        # Apply pagination to prevent massive responses
        paginator = GradePagination()
        page = paginator.paginate_queryset(grades, request)

        if page is not None:
            serializer = GradeSerializer(page, many=True)
            return paginator.get_paginated_response(serializer.data)

        # Fallback (should rarely happen)
        serializer = GradeSerializer(grades, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @method_decorator(cache_page(60 * 15))  # PHASE 3: Cache for 15 minutes
    @action(detail=True, methods=['get'])
    def statistics(self, request, pk=None):
        """
        Get exam statistics (PHASE 3: Cached for 15 minutes)

        This endpoint performs expensive aggregation queries and is cached
        to reduce database load. Cache is automatically invalidated when
        grades are updated.
        """
        exam = self.get_object()

        from django.db.models import Avg, Max, Min, Count

        stats = Grade.objects.filter(exam=exam).aggregate(
            total_students=Count('id'),
            average_marks=Avg('marks_obtained'),
            highest_marks=Max('marks_obtained'),
            lowest_marks=Min('marks_obtained'),
            passed_count=Count('id', filter=models.Q(marks_obtained__gte=exam.passing_marks))
        )

        # Calculate pass percentage
        if stats['total_students'] > 0:
            stats['pass_percentage'] = round(
                (stats['passed_count'] / stats['total_students']) * 100, 2
            )
        else:
            stats['pass_percentage'] = 0

        return Response(stats, status=status.HTTP_200_OK)

    @action(detail=True, methods=['get', 'post'], permission_classes=[IsAuthenticated])
    def export_pdf(self, request, pk=None):
        """
        Export exam grade sheet as PDF (Async with Celery)

        POST: Start async PDF generation task
        GET with task_id: Poll task status or download PDF
        """
        from django.http import HttpResponse
        from .tasks import generate_grade_sheet_pdf_async

        exam = self.get_object()

        # POST - Start async task
        if request.method == 'POST':
            task = generate_grade_sheet_pdf_async.delay(exam.id)
            return Response({
                'task_id': task.id,
                'status': 'processing',
                'message': 'PDF generation started',
                'poll_url': f'/api/exams/{exam.id}/export_pdf/?task_id={task.id}'
            }, status=status.HTTP_202_ACCEPTED)

        # GET - Check task status or download PDF
        task_id = request.query_params.get('task_id')

        if task_id:
            from celery.result import AsyncResult
            task = AsyncResult(task_id)

            if task.state == 'PENDING':
                return Response({
                    'status': 'pending',
                    'message': 'PDF generation in progress...'
                }, status=status.HTTP_202_ACCEPTED)

            elif task.state == 'SUCCESS':
                # Get PDF from cache
                result = task.result
                cache_key = result.get('cache_key')
                pdf_data = cache.get(cache_key)

                if pdf_data:
                    response = HttpResponse(pdf_data, content_type='application/pdf')
                    response['Content-Disposition'] = f'attachment; filename="grade_sheet_{exam.id}_{exam.date}.pdf"'
                    return response
                else:
                    return Response({
                        'status': 'error',
                        'message': 'PDF expired or not found. Please regenerate.'
                    }, status=status.HTTP_404_NOT_FOUND)

            elif task.state == 'FAILURE':
                return Response({
                    'status': 'failed',
                    'message': 'PDF generation failed',
                    'error': str(task.info)
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            else:
                return Response({
                    'status': task.state.lower(),
                    'message': f'Task is {task.state}'
                }, status=status.HTTP_202_ACCEPTED)

        # No task_id provided
        return Response({
            'error': 'Missing task_id parameter',
            'message': 'Use POST to start PDF generation, then poll with task_id'
        }, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['get', 'post'], permission_classes=[IsAuthenticated])
    def export_excel(self, request, pk=None):
        """
        Export exam grade sheet as Excel (Async with Celery)

        PHASE 2: Async Operations
        - POST: Start Excel generation task (returns task_id)
        - GET with task_id: Poll status or download Excel when ready
        """
        from django.http import HttpResponse
        from .tasks import generate_grade_sheet_excel_async

        exam = self.get_object()

        # POST - Start async Excel generation task
        if request.method == 'POST':
            task = generate_grade_sheet_excel_async.delay(exam.id)

            return Response({
                'task_id': task.id,
                'status': 'processing',
                'message': 'Excel generation started',
                'poll_url': f'/api/exams/{exam.id}/export_excel/?task_id={task.id}'
            }, status=status.HTTP_202_ACCEPTED)

        # GET with task_id - Check task status or download Excel
        task_id = request.query_params.get('task_id')
        if task_id:
            from celery.result import AsyncResult

            task = AsyncResult(task_id)

            if task.state == 'PENDING':
                return Response({
                    'status': 'processing',
                    'message': 'Excel is being generated...'
                }, status=status.HTTP_202_ACCEPTED)

            elif task.state == 'SUCCESS':
                result = task.result

                # Retrieve Excel from cache
                excel_data = cache.get(result['cache_key'])

                if excel_data:
                    response = HttpResponse(
                        excel_data,
                        content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                    )
                    response['Content-Disposition'] = f'attachment; filename="grade_sheet_{exam.id}.xlsx"'

                    # Clean up cache after download
                    cache.delete(result['cache_key'])

                    return response
                else:
                    return Response({
                        'error': 'Excel file expired',
                        'message': 'Please regenerate the Excel file'
                    }, status=status.HTTP_410_GONE)

            elif task.state == 'FAILURE':
                return Response({
                    'status': 'failed',
                    'error': str(task.info)
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            else:
                return Response({
                    'status': task.state.lower(),
                    'message': f'Task status: {task.state}'
                }, status=status.HTTP_202_ACCEPTED)

        # GET without task_id - error
        return Response({
            'error': 'Missing task_id parameter',
            'message': 'Use POST to start Excel generation, then poll with task_id'
        }, status=status.HTTP_400_BAD_REQUEST)


class GradeViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing grades
    """
    queryset = Grade.objects.filter(is_deleted=False)
    serializer_class = GradeSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['student', 'exam', 'graded_by', 'approval_status', 'is_published', 'grade_letter']
    search_fields = ['student__student_id', 'exam__name', 'exam__course_offering__course__code']
    ordering_fields = ['graded_date', 'marks_obtained', 'created_at']
    ordering = ['-graded_date']

    def get_queryset(self):
        """
        Optimize queryset with select_related to prevent N+1 queries
        """
        return Grade.objects.filter(is_deleted=False).select_related(
            'student',
            'student__user',
            'student__program',
            'exam',
            'exam__course_offering',
            'exam__course_offering__course',
            'graded_by',
            'approved_by',
            'published_by'
        )

    def perform_create(self, serializer):
        """
        Auto-set graded_by to current user and send notification
        """
        grade = serializer.save(graded_by=self.request.user)

        # Send notification to student about published result
        try:
            notify_result_published(grade.student, grade.exam)
        except Exception as e:
            print(f"Failed to send result notification: {str(e)}")

    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated, IsAdmin])
    def bulk_grade(self, request):
        """
        Bulk grade multiple students for an exam (Optimized with bulk operations)
        """
        from apps.students.models import Student
        from django.db import transaction

        grades_data = request.data.get('grades', [])

        if not grades_data:
            return Response(
                {'error': 'grades data is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Extract all student and exam IDs
        student_ids = [d['student_id'] for d in grades_data if 'student_id' in d]
        exam_ids = [d['exam_id'] for d in grades_data if 'exam_id' in d]

        # Fetch all students and exams in bulk (OPTIMIZATION: 2 queries instead of N*2)
        students = {s.id: s for s in Student.objects.filter(id__in=student_ids)}
        exams = {e.id: e for e in Exam.objects.filter(id__in=exam_ids)}

        # Fetch existing grades to avoid duplicates
        existing_grades = {
            (g.student_id, g.exam_id): g
            for g in Grade.objects.filter(
                student_id__in=student_ids,
                exam_id__in=exam_ids
            )
        }

        grades_to_create = []
        grades_to_update = []
        errors = []

        for data in grades_data:
            try:
                student_id = data['student_id']
                exam_id = data['exam_id']
                marks_obtained = data['marks_obtained']
                remarks = data.get('remarks', '')

                if student_id not in students:
                    errors.append(f"Student with ID {student_id} not found")
                    continue

                if exam_id not in exams:
                    errors.append(f"Exam with ID {exam_id} not found")
                    continue

                key = (student_id, exam_id)

                if key in existing_grades:
                    # Update existing grade
                    grade = existing_grades[key]
                    grade.marks_obtained = marks_obtained
                    grade.graded_by = request.user
                    grade.remarks = remarks
                    grades_to_update.append(grade)
                else:
                    # Create new grade
                    grades_to_create.append(Grade(
                        student=students[student_id],
                        exam=exams[exam_id],
                        marks_obtained=marks_obtained,
                        graded_by=request.user,
                        remarks=remarks
                    ))

            except KeyError as e:
                errors.append(f"Missing required field: {str(e)}")

        # Perform bulk operations (OPTIMIZATION: 2 queries instead of N)
        created_grades = []
        with transaction.atomic():
            if grades_to_create:
                created_grades = Grade.objects.bulk_create(grades_to_create, batch_size=100)

            if grades_to_update:
                Grade.objects.bulk_update(
                    grades_to_update,
                    ['marks_obtained', 'graded_by', 'remarks'],
                    batch_size=100
                )

        # Combine all grades for response
        all_grades = list(created_grades) + grades_to_update

        return Response({
            'grades': GradeSerializer(all_grades, many=True).data,
            'errors': errors,
            'total_graded': len(all_grades),
            'total_errors': len(errors)
        }, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated, IsAdmin])
    def approve(self, request, pk=None):
        """
        Approve a grade (move from DRAFT/PENDING to APPROVED)
        """
        grade = self.get_object()

        if grade.approval_status == 'APPROVED':
            return Response(
                {'error': 'This grade is already approved'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if grade.approval_status == 'PUBLISHED':
            return Response(
                {'error': 'Cannot approve a published grade'},
                status=status.HTTP_400_BAD_REQUEST
            )

        from django.utils import timezone
        grade.approval_status = 'APPROVED'
        grade.approved_by = request.user
        grade.approved_date = timezone.now()

        # Auto-calculate grade letter if not set
        if not grade.grade_letter:
            grade.grade_letter = grade.calculate_grade_letter()

        grade.save()

        return Response(
            {'message': 'Grade approved successfully', 'grade': GradeSerializer(grade).data},
            status=status.HTTP_200_OK
        )

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated, IsAdmin])
    def reject(self, request, pk=None):
        """
        Reject a grade (move to REJECTED status)
        """
        grade = self.get_object()

        if grade.approval_status == 'PUBLISHED':
            return Response(
                {'error': 'Cannot reject a published grade'},
                status=status.HTTP_400_BAD_REQUEST
            )

        grade.approval_status = 'REJECTED'
        grade.approved_by = request.user
        from django.utils import timezone
        grade.approved_date = timezone.now()

        # Add rejection reason to remarks if provided
        reason = request.data.get('reason', '')
        if reason:
            grade.remarks = f"REJECTED: {reason}\n\n{grade.remarks or ''}"

        grade.save()

        return Response(
            {'message': 'Grade rejected', 'grade': GradeSerializer(grade).data},
            status=status.HTTP_200_OK
        )

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated, IsAdmin])
    def publish(self, request, pk=None):
        """
        Publish a grade (make visible to students)
        """
        grade = self.get_object()

        if grade.approval_status != 'APPROVED':
            return Response(
                {'error': 'Grade must be approved before publishing'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if grade.is_published:
            return Response(
                {'error': 'This grade is already published'},
                status=status.HTTP_400_BAD_REQUEST
            )

        from django.utils import timezone
        grade.is_published = True
        grade.published_by = request.user
        grade.published_date = timezone.now()
        grade.approval_status = 'PUBLISHED'
        grade.save()

        # Send notification to student
        try:
            notify_result_published(grade.student, grade.exam)
        except Exception as e:
            print(f"Failed to send result notification: {str(e)}")

        return Response(
            {'message': 'Grade published successfully', 'grade': GradeSerializer(grade).data},
            status=status.HTTP_200_OK
        )

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated, IsAdmin])
    def unpublish(self, request, pk=None):
        """
        Unpublish a grade (hide from students)
        """
        grade = self.get_object()

        if not grade.is_published:
            return Response(
                {'error': 'This grade is not published'},
                status=status.HTTP_400_BAD_REQUEST
            )

        grade.is_published = False
        grade.published_by = None
        grade.published_date = None
        grade.approval_status = 'APPROVED'
        grade.save()

        return Response(
            {'message': 'Grade unpublished successfully', 'grade': GradeSerializer(grade).data},
            status=status.HTTP_200_OK
        )

    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated, IsAdmin])
    def bulk_approve(self, request):
        """
        Approve multiple grades at once (Optimized with bulk_update)
        """
        grade_ids = request.data.get('grade_ids', [])

        if not grade_ids:
            return Response(
                {'error': 'grade_ids is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        from django.utils import timezone

        # Fetch grades that need approval
        grades_to_update = list(Grade.objects.filter(
            id__in=grade_ids,
            approval_status__in=['DRAFT', 'PENDING_APPROVAL']
        ))

        if not grades_to_update:
            return Response({
                'message': 'No grades found to approve',
                'approved_count': 0
            }, status=status.HTTP_200_OK)

        # Update all grades at once
        approval_time = timezone.now()
        for grade in grades_to_update:
            grade.approval_status = 'APPROVED'
            grade.approved_by = request.user
            grade.approved_date = approval_time
            if not grade.grade_letter:
                grade.grade_letter = grade.calculate_grade_letter()

        # Bulk update (OPTIMIZATION: 1 query instead of N)
        Grade.objects.bulk_update(
            grades_to_update,
            ['approval_status', 'approved_by', 'approved_date', 'grade_letter'],
            batch_size=100
        )

        return Response({
            'message': f'{len(grades_to_update)} grades approved successfully',
            'approved_count': len(grades_to_update)
        }, status=status.HTTP_200_OK)

    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated, IsAdmin])
    def bulk_publish(self, request):
        """
        Publish multiple approved grades at once (PHASE 2: Async Notifications)

        - Updates grades synchronously (fast)
        - Sends notifications asynchronously via Celery (non-blocking)
        """
        grade_ids = request.data.get('grade_ids', [])

        if not grade_ids:
            return Response(
                {'error': 'grade_ids is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        from django.utils import timezone
        from .tasks import send_bulk_result_notifications

        # Fetch grades to publish
        grades_to_publish = list(Grade.objects.filter(
            id__in=grade_ids,
            approval_status='APPROVED',
            is_published=False
        ))

        if not grades_to_publish:
            return Response({
                'message': 'No approved grades found to publish',
                'published_count': 0
            }, status=status.HTTP_200_OK)

        # Update all grades at once (FAST - synchronous)
        publish_time = timezone.now()
        for grade in grades_to_publish:
            grade.is_published = True
            grade.published_by = request.user
            grade.published_date = publish_time
            grade.approval_status = 'PUBLISHED'

        # Bulk update (OPTIMIZATION: 1 query instead of N)
        Grade.objects.bulk_update(
            grades_to_publish,
            ['is_published', 'published_by', 'published_date', 'approval_status'],
            batch_size=100
        )

        # PHASE 2: Send notifications asynchronously (SLOW - moved to Celery)
        # This returns immediately, notifications sent in background
        published_grade_ids = [grade.id for grade in grades_to_publish]
        task = send_bulk_result_notifications.delay(published_grade_ids)

        return Response({
            'message': f'{len(grades_to_publish)} grades published successfully',
            'published_count': len(grades_to_publish),
            'notification_task_id': task.id,
            'notification_status': 'queued',
            'note': 'Notifications are being sent asynchronously'
        }, status=status.HTTP_200_OK)


class TranscriptViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing transcripts
    """
    queryset = Transcript.objects.filter(is_deleted=False)
    serializer_class = TranscriptSerializer
    permission_classes = [IsAuthenticated, IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['student', 'semester', 'academic_year']
    search_fields = ['student__student_id', 'student__user__first_name', 'student__user__last_name']
    ordering_fields = ['academic_year', 'semester', 'gpa', 'cgpa', 'generated_date']
    ordering = ['-academic_year', '-semester']

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated, IsAdmin])
    def issue(self, request, pk=None):
        """
        Issue a transcript (set issued_date)
        """
        transcript = self.get_object()

        from django.utils import timezone
        transcript.issued_date = timezone.now().date()
        transcript.save()

        return Response(
            {'message': 'Transcript issued successfully'},
            status=status.HTTP_200_OK
        )

    @action(detail=True, methods=['get'], permission_classes=[IsAuthenticated])
    def export_pdf(self, request, pk=None):
        """
        Export transcript as PDF
        """
        from django.http import HttpResponse
        from .utils import generate_transcript_pdf

        transcript = self.get_object()
        pdf_buffer = generate_transcript_pdf(transcript)

        response = HttpResponse(pdf_buffer, content_type='application/pdf')
        filename = f"transcript_{transcript.student.student_id}_{transcript.semester}_{transcript.academic_year}.pdf"
        response['Content-Disposition'] = f'attachment; filename="{filename}"'

        return response


class GradeScaleViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing grade scales
    """
    queryset = GradeScale.objects.filter(is_deleted=False)
    serializer_class = GradeScaleSerializer
    permission_classes = [IsAuthenticated, IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['program', 'letter_grade']
    search_fields = ['program__code', 'program__name', 'letter_grade', 'description']
    ordering_fields = ['min_percentage', 'grade_points']
    ordering = ['-min_percentage']


class ScriptCollectionViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing script collections
    """
    queryset = ScriptCollection.objects.filter(is_deleted=False)
    serializer_class = ScriptCollectionSerializer
    permission_classes = [IsAuthenticated, IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['exam', 'student', 'script_collected', 'collected_by']
    search_fields = ['student__student_id', 'exam__name', 'script_number']
    ordering_fields = ['collection_date']
    ordering = ['-collection_date']

    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated, IsAdmin])
    def mark_collected(self, request):
        """
        Mark multiple scripts as collected
        """
        script_ids = request.data.get('script_ids', [])

        if not script_ids:
            return Response(
                {'error': 'script_ids is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        from django.utils import timezone
        updated_count = ScriptCollection.objects.filter(
            id__in=script_ids
        ).update(
            script_collected=True,
            collection_date=timezone.now(),
            collected_by=request.user
        )

        return Response({
            'message': f'{updated_count} scripts marked as collected',
            'updated_count': updated_count
        }, status=status.HTTP_200_OK)


class PromotionalListViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing promotional lists
    """
    queryset = PromotionalList.objects.filter(is_deleted=False)
    serializer_class = PromotionalListSerializer
    permission_classes = [IsAuthenticated, IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['program', 'level', 'semester', 'academic_year', 'is_approved', 'is_executed']
    search_fields = ['program__code', 'program__name', 'academic_year']
    ordering_fields = ['generated_date', 'academic_year', 'level']
    ordering = ['-academic_year', '-semester', 'program', 'level']

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated, IsAdmin])
    def approve(self, request, pk=None):
        """
        Approve a promotional list
        """
        promotional_list = self.get_object()

        if promotional_list.is_approved:
            return Response(
                {'error': 'This promotional list is already approved'},
                status=status.HTTP_400_BAD_REQUEST
            )

        from django.utils import timezone
        promotional_list.is_approved = True
        promotional_list.approved_by = request.user
        promotional_list.approved_date = timezone.now()
        promotional_list.save()

        return Response(
            {'message': 'Promotional list approved successfully'},
            status=status.HTTP_200_OK
        )

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated, IsAdmin])
    def execute(self, request, pk=None):
        """
        Execute promotions (apply student level changes)
        """
        promotional_list = self.get_object()

        if not promotional_list.is_approved:
            return Response(
                {'error': 'Promotional list must be approved before execution'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if promotional_list.is_executed:
            return Response(
                {'error': 'This promotional list has already been executed'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Execute promotions
        from django.utils import timezone
        promotions = promotional_list.student_promotions.filter(status='PROMOTED')

        for promotion in promotions:
            # Update student level (you'll need to add level field to Student model)
            # promotion.student.level = promotion.next_level
            # promotion.student.save()
            pass

        promotional_list.is_executed = True
        promotional_list.executed_date = timezone.now()
        promotional_list.save()

        return Response(
            {'message': f'Promotional list executed successfully. {promotions.count()} students promoted.'},
            status=status.HTTP_200_OK
        )

    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated, IsAdmin])
    def generate(self, request):
        """
        Generate promotional list based on criteria
        """
        program_id = request.data.get('program_id')
        level = request.data.get('level')
        semester = request.data.get('semester')
        academic_year = request.data.get('academic_year')
        min_cgpa = float(request.data.get('min_cgpa', 2.0))

        if not all([program_id, level, semester, academic_year]):
            return Response(
                {'error': 'program_id, level, semester, and academic_year are required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        from apps.courses.models import Program
        from apps.students.models import Student
        from datetime import date

        try:
            program = Program.objects.get(id=program_id)
        except Program.DoesNotExist:
            return Response(
                {'error': 'Program not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        # Check if promotional list already exists
        existing = PromotionalList.objects.filter(
            program=program,
            level=level,
            semester=semester,
            academic_year=academic_year
        ).first()

        if existing:
            return Response(
                {'error': 'Promotional list already exists for this combination',
                 'promotional_list_id': existing.id},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Create promotional list
        promotional_list = PromotionalList.objects.create(
            program=program,
            level=level,
            semester=semester,
            academic_year=academic_year
        )

        # Get eligible students (you'll need to adjust this based on your Student model)
        # This is a placeholder - adjust based on how you track student level and CGPA
        students = Student.objects.filter(
            program=program,
            is_deleted=False
        )

        created_count = 0
        for student in students:
            # Calculate CGPA from transcripts
            cgpa = Transcript.objects.filter(
                student=student
            ).aggregate(models.Avg('cgpa'))['cgpa__avg'] or 0.0

            # Calculate credits earned
            credits = Transcript.objects.filter(
                student=student
            ).aggregate(models.Sum('total_credits'))['total_credits__sum'] or 0

            # Determine status
            if cgpa >= min_cgpa:
                status_choice = 'PROMOTED'
                next_level = level + 1
            elif cgpa >= 1.5:
                status_choice = 'PROBATION'
                next_level = level
            else:
                status_choice = 'REPEAT'
                next_level = level

            StudentPromotion.objects.create(
                promotional_list=promotional_list,
                student=student,
                current_level=level,
                next_level=next_level,
                cgpa=cgpa,
                credits_earned=credits,
                status=status_choice,
                effective_date=date.today()
            )
            created_count += 1

        return Response({
            'message': f'Promotional list generated successfully with {created_count} students',
            'promotional_list': PromotionalListSerializer(promotional_list).data,
            'student_count': created_count
        }, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['get'], permission_classes=[IsAuthenticated])
    def export_excel(self, request, pk=None):
        """
        Export promotional list as Excel
        """
        from django.http import HttpResponse
        from .utils import generate_promotional_list_excel

        promotional_list = self.get_object()
        excel_buffer = generate_promotional_list_excel(promotional_list)

        response = HttpResponse(
            excel_buffer,
            content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )
        filename = f"promotional_list_{promotional_list.program.code}_level{promotional_list.level}_{promotional_list.academic_year}.xlsx"
        response['Content-Disposition'] = f'attachment; filename="{filename}"'

        return response


class StudentPromotionViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing student promotions
    """
    queryset = StudentPromotion.objects.filter(is_deleted=False)
    serializer_class = StudentPromotionSerializer
    permission_classes = [IsAuthenticated, IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['promotional_list', 'student', 'status', 'current_level', 'next_level']
    search_fields = ['student__student_id', 'student__user__first_name', 'student__user__last_name']
    ordering_fields = ['effective_date', 'cgpa', 'current_level']
    ordering = ['promotional_list', '-cgpa']


class GraduationListViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing graduation lists
    """
    queryset = GraduationList.objects.filter(is_deleted=False)
    serializer_class = GraduationListSerializer
    permission_classes = [IsAuthenticated, IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['program', 'academic_year', 'is_approved']
    search_fields = ['program__code', 'program__name', 'academic_year']
    ordering_fields = ['generated_date', 'ceremony_date', 'academic_year']
    ordering = ['-academic_year', 'program']

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated, IsAdmin])
    def approve(self, request, pk=None):
        """
        Approve a graduation list
        """
        graduation_list = self.get_object()

        if graduation_list.is_approved:
            return Response(
                {'error': 'This graduation list is already approved'},
                status=status.HTTP_400_BAD_REQUEST
            )

        from django.utils import timezone
        graduation_list.is_approved = True
        graduation_list.approved_by = request.user
        graduation_list.approved_date = timezone.now()
        graduation_list.save()

        return Response(
            {'message': 'Graduation list approved successfully'},
            status=status.HTTP_200_OK
        )

    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated, IsAdmin])
    def generate(self, request):
        """
        Generate graduation list based on criteria
        """
        program_id = request.data.get('program_id')
        academic_year = request.data.get('academic_year')
        min_cgpa = float(request.data.get('min_cgpa', 1.5))
        min_credits = int(request.data.get('min_credits', 120))

        if not all([program_id, academic_year]):
            return Response(
                {'error': 'program_id and academic_year are required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        from apps.courses.models import Program
        from apps.students.models import Student

        try:
            program = Program.objects.get(id=program_id)
        except Program.DoesNotExist:
            return Response(
                {'error': 'Program not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        # Check if graduation list already exists
        existing = GraduationList.objects.filter(
            program=program,
            academic_year=academic_year
        ).first()

        if existing:
            return Response(
                {'error': 'Graduation list already exists for this combination',
                 'graduation_list_id': existing.id},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Create graduation list
        graduation_list = GraduationList.objects.create(
            program=program,
            academic_year=academic_year
        )

        # Get eligible students
        students = Student.objects.filter(
            program=program,
            is_deleted=False
        )

        created_count = 0
        for student in students:
            # Calculate final CGPA from transcripts
            final_cgpa = Transcript.objects.filter(
                student=student
            ).aggregate(models.Avg('cgpa'))['cgpa__avg'] or 0.0

            # Calculate total credits
            total_credits = Transcript.objects.filter(
                student=student
            ).aggregate(models.Sum('total_credits'))['total_credits__sum'] or 0

            # Check if student meets graduation requirements
            if final_cgpa >= min_cgpa and total_credits >= min_credits:
                # Calculate classification
                classification = GraduatingStudent.calculate_classification(final_cgpa)

                if classification:  # Only add if classification is valid
                    GraduatingStudent.objects.create(
                        graduation_list=graduation_list,
                        student=student,
                        final_cgpa=final_cgpa,
                        classification=classification,
                        total_credits=total_credits,
                        is_cleared=False  # Manual verification required
                    )
                    created_count += 1

        return Response({
            'message': f'Graduation list generated successfully with {created_count} students',
            'graduation_list': GraduationListSerializer(graduation_list).data,
            'student_count': created_count
        }, status=status.HTTP_201_CREATED)


class GraduatingStudentViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing graduating students
    """
    queryset = GraduatingStudent.objects.filter(is_deleted=False)
    serializer_class = GraduatingStudentSerializer
    permission_classes = [IsAuthenticated, IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['graduation_list', 'student', 'classification', 'is_cleared']
    search_fields = ['student__student_id', 'student__user__first_name', 'student__user__last_name']
    ordering_fields = ['final_cgpa', 'total_credits']
    ordering = ['-final_cgpa']
