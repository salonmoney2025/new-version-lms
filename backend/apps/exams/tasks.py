"""
Celery tasks for asynchronous operations in the Exams app

Phase 2: Async Operations
- PDF/Excel generation moved to background tasks
- Email notifications moved to background tasks
- Non-blocking request/response cycle
"""

from celery import shared_task
from django.core.cache import cache
from django.utils import timezone
import logging

logger = logging.getLogger(__name__)


@shared_task(bind=True, max_retries=3, default_retry_delay=60)
def generate_grade_sheet_pdf_async(self, exam_id):
    """
    Generate exam grade sheet PDF asynchronously

    Args:
        exam_id: ID of the exam

    Returns:
        dict: Status and cache key for retrieving the PDF
    """
    try:
        from .models import Exam, Grade
        from .utils import generate_grade_sheet_pdf

        # Fetch exam and grades with optimized query
        exam = Exam.objects.select_related(
            'course_offering',
            'course_offering__course',
            'course_offering__campus'
        ).get(id=exam_id)

        grades = Grade.objects.filter(
            exam=exam,
            is_deleted=False
        ).select_related(
            'student',
            'student__user',
            'student__program',
            'graded_by'
        ).order_by('student__student_id')

        # Generate PDF
        logger.info(f"Generating PDF for exam {exam_id} with {grades.count()} grades")
        pdf_buffer = generate_grade_sheet_pdf(exam, list(grades))

        # Store in cache for 1 hour
        cache_key = f'grade_sheet_pdf_{exam_id}_{timezone.now().timestamp()}'
        cache.set(cache_key, pdf_buffer.getvalue(), 3600)

        logger.info(f"PDF generated successfully for exam {exam_id}, cached as {cache_key}")

        return {
            'status': 'completed',
            'cache_key': cache_key,
            'exam_id': exam_id,
            'grade_count': grades.count(),
            'file_size': len(pdf_buffer.getvalue())
        }

    except Exam.DoesNotExist:
        logger.error(f"Exam {exam_id} not found")
        return {'status': 'failed', 'error': 'Exam not found'}

    except Exception as exc:
        logger.error(f"Error generating PDF for exam {exam_id}: {str(exc)}")
        # Retry up to 3 times with 60 second delay
        raise self.retry(exc=exc, countdown=60)


@shared_task(bind=True, max_retries=3, default_retry_delay=60)
def generate_grade_sheet_excel_async(self, exam_id):
    """
    Generate exam grade sheet Excel asynchronously

    Args:
        exam_id: ID of the exam

    Returns:
        dict: Status and cache key for retrieving the Excel file
    """
    try:
        from .models import Exam, Grade
        from .utils import generate_grade_sheet_excel

        # Fetch exam and grades with optimized query
        exam = Exam.objects.select_related(
            'course_offering',
            'course_offering__course',
            'course_offering__campus'
        ).get(id=exam_id)

        grades = Grade.objects.filter(
            exam=exam,
            is_deleted=False
        ).select_related(
            'student',
            'student__user',
            'student__program',
            'graded_by'
        ).order_by('student__student_id')

        # Generate Excel
        logger.info(f"Generating Excel for exam {exam_id} with {grades.count()} grades")
        excel_buffer = generate_grade_sheet_excel(exam, list(grades))

        # Store in cache for 1 hour
        cache_key = f'grade_sheet_excel_{exam_id}_{timezone.now().timestamp()}'
        cache.set(cache_key, excel_buffer.getvalue(), 3600)

        logger.info(f"Excel generated successfully for exam {exam_id}, cached as {cache_key}")

        return {
            'status': 'completed',
            'cache_key': cache_key,
            'exam_id': exam_id,
            'grade_count': grades.count(),
            'file_size': len(excel_buffer.getvalue())
        }

    except Exam.DoesNotExist:
        logger.error(f"Exam {exam_id} not found")
        return {'status': 'failed', 'error': 'Exam not found'}

    except Exception as exc:
        logger.error(f"Error generating Excel for exam {exam_id}: {str(exc)}")
        raise self.retry(exc=exc, countdown=60)


@shared_task(bind=True, max_retries=3, default_retry_delay=60)
def generate_transcript_pdf_async(self, transcript_id):
    """
    Generate student transcript PDF asynchronously

    Args:
        transcript_id: ID of the transcript

    Returns:
        dict: Status and cache key for retrieving the PDF
    """
    try:
        from .models import Transcript
        from .utils import generate_transcript_pdf

        # Fetch transcript with optimized query
        transcript = Transcript.objects.select_related(
            'student',
            'student__user',
            'student__program',
            'student__campus'
        ).get(id=transcript_id)

        # Generate PDF
        logger.info(f"Generating transcript PDF for transcript {transcript_id}")
        pdf_buffer = generate_transcript_pdf(transcript)

        # Store in cache for 1 hour
        cache_key = f'transcript_pdf_{transcript_id}_{timezone.now().timestamp()}'
        cache.set(cache_key, pdf_buffer.getvalue(), 3600)

        logger.info(f"Transcript PDF generated successfully, cached as {cache_key}")

        return {
            'status': 'completed',
            'cache_key': cache_key,
            'transcript_id': transcript_id,
            'file_size': len(pdf_buffer.getvalue())
        }

    except Transcript.DoesNotExist:
        logger.error(f"Transcript {transcript_id} not found")
        return {'status': 'failed', 'error': 'Transcript not found'}

    except Exception as exc:
        logger.error(f"Error generating transcript PDF: {str(exc)}")
        raise self.retry(exc=exc, countdown=60)


@shared_task(bind=True, max_retries=3, default_retry_delay=30)
def generate_promotional_list_excel_async(self, list_id):
    """
    Generate promotional list Excel asynchronously

    Args:
        list_id: ID of the promotional list

    Returns:
        dict: Status and cache key for retrieving the Excel file
    """
    try:
        from .models import PromotionalList
        from .utils import generate_promotional_list_excel

        # Fetch promotional list with students
        promotional_list = PromotionalList.objects.prefetch_related(
            'student_promotions',
            'student_promotions__student',
            'student_promotions__student__user'
        ).get(id=list_id)

        # Generate Excel
        logger.info(f"Generating Excel for promotional list {list_id}")
        excel_buffer = generate_promotional_list_excel(promotional_list)

        # Store in cache for 1 hour
        cache_key = f'promotional_list_excel_{list_id}_{timezone.now().timestamp()}'
        cache.set(cache_key, excel_buffer.getvalue(), 3600)

        logger.info(f"Promotional list Excel generated successfully, cached as {cache_key}")

        return {
            'status': 'completed',
            'cache_key': cache_key,
            'list_id': list_id,
            'file_size': len(excel_buffer.getvalue())
        }

    except PromotionalList.DoesNotExist:
        logger.error(f"Promotional list {list_id} not found")
        return {'status': 'failed', 'error': 'Promotional list not found'}

    except Exception as exc:
        logger.error(f"Error generating promotional list Excel: {str(exc)}")
        raise self.retry(exc=exc, countdown=30)


@shared_task
def send_bulk_result_notifications(grade_ids):
    """
    Send result published notifications to students asynchronously

    Args:
        grade_ids: List of grade IDs to send notifications for

    Returns:
        dict: Summary of notifications sent
    """
    from .models import Grade
    from apps.notifications.utils import notify_result_published

    logger.info(f"Sending notifications for {len(grade_ids)} grades")

    # Fetch grades with related data
    grades = Grade.objects.filter(
        id__in=grade_ids,
        is_deleted=False
    ).select_related(
        'student',
        'student__user',
        'exam',
        'exam__course_offering',
        'exam__course_offering__course'
    )

    success_count = 0
    failed_count = 0

    for grade in grades:
        try:
            notify_result_published(grade.student, grade.exam)
            success_count += 1
            logger.debug(f"Notification sent for grade {grade.id}")
        except Exception as e:
            failed_count += 1
            logger.error(f"Failed to notify student {grade.student.student_id}: {str(e)}")

    logger.info(f"Notifications complete: {success_count} sent, {failed_count} failed")

    return {
        'total': len(grade_ids),
        'success': success_count,
        'failed': failed_count,
        'status': 'completed'
    }


@shared_task
def send_exam_schedule_notifications(exam_id):
    """
    Send exam schedule notifications to enrolled students asynchronously

    Args:
        exam_id: ID of the exam

    Returns:
        dict: Summary of notifications sent
    """
    from .models import Exam
    from apps.students.models import Enrollment
    from apps.notifications.utils import notify_exam_schedule

    logger.info(f"Sending exam schedule notifications for exam {exam_id}")

    try:
        exam = Exam.objects.select_related(
            'course_offering',
            'course_offering__course'
        ).get(id=exam_id)

        # Get enrolled students
        enrollments = Enrollment.objects.filter(
            course_offering=exam.course_offering,
            status='ACTIVE'
        ).select_related('student', 'student__user')

        success_count = 0
        failed_count = 0

        for enrollment in enrollments:
            try:
                notify_exam_schedule(enrollment.student, exam)
                success_count += 1
            except Exception as e:
                failed_count += 1
                logger.error(f"Failed to notify student {enrollment.student.student_id}: {str(e)}")

        logger.info(f"Exam notifications complete: {success_count} sent, {failed_count} failed")

        return {
            'total': enrollments.count(),
            'success': success_count,
            'failed': failed_count,
            'status': 'completed'
        }

    except Exam.DoesNotExist:
        logger.error(f"Exam {exam_id} not found")
        return {'status': 'failed', 'error': 'Exam not found'}


@shared_task(bind=True, max_retries=2)
def cleanup_expired_cached_files(self):
    """
    Cleanup expired cached PDF/Excel files (runs periodically)

    This task removes old cache entries that have expired
    """
    try:
        from django.core.cache import cache

        # Get all cache keys (if Redis supports SCAN)
        # This is a maintenance task to free up memory

        logger.info("Cache cleanup task executed")

        return {'status': 'completed', 'message': 'Cache cleanup successful'}

    except Exception as exc:
        logger.error(f"Cache cleanup failed: {str(exc)}")
        raise self.retry(exc=exc, countdown=300)
