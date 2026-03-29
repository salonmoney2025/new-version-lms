"""
Cache Invalidation Signals

PHASE 3: Caching Layer
Automatically invalidate caches when models are updated to prevent stale data.
"""

from django.db.models.signals import post_save, post_delete, pre_save
from django.dispatch import receiver
from django.core.cache import cache
import logging

logger = logging.getLogger(__name__)


# =====================
# GRADE CACHE INVALIDATION
# =====================

@receiver([post_save, post_delete], sender='exams.Grade')
def invalidate_grade_caches(sender, instance, **kwargs):
    """
    Invalidate grade-related caches when grades are created/updated/deleted.

    This ensures exam statistics, student transcripts, and grade sheets
    are always up-to-date.
    """
    try:
        # Invalidate exam statistics cache
        exam_stats_key = f"exam_stats_{instance.exam_id}"
        cache.delete(exam_stats_key)

        # Invalidate student transcript cache
        student_transcript_key = f"student_transcript_{instance.student_id}"
        cache.delete(student_transcript_key)

        # Invalidate exam-specific view cache (from @cache_page)
        # This clears the cached statistics endpoint
        cache.delete(f'views.decorators.cache.cache_page.*.exams.{instance.exam_id}.statistics.*')

        logger.debug(f"Invalidated grade caches for exam {instance.exam_id} and student {instance.student_id}")

    except Exception as e:
        logger.error(f"Failed to invalidate grade caches: {str(e)}")


# =====================
# EXAM CACHE INVALIDATION
# =====================

@receiver([post_save, post_delete], sender='exams.Exam')
def invalidate_exam_caches(sender, instance, **kwargs):
    """
    Invalidate exam-related caches when exams are created/updated/deleted.
    """
    try:
        # Invalidate exam list cache for course offering
        exam_list_key = f"exam_list_{instance.course_offering_id}"
        cache.delete(exam_list_key)

        # Invalidate exam statistics
        exam_stats_key = f"exam_stats_{instance.id}"
        cache.delete(exam_stats_key)

        logger.debug(f"Invalidated exam caches for exam {instance.id}")

    except Exception as e:
        logger.error(f"Failed to invalidate exam caches: {str(e)}")


# =====================
# STUDENT CACHE INVALIDATION
# =====================

@receiver([post_save, post_delete], sender='students.Student')
def invalidate_student_caches(sender, instance, **kwargs):
    """
    Invalidate student-related caches when students are created/updated/deleted.
    """
    try:
        # Invalidate student detail cache
        student_detail_key = f"student_detail_{instance.id}"
        cache.delete(student_detail_key)

        # Invalidate student transcript cache
        student_transcript_key = f"student_transcript_{instance.id}"
        cache.delete(student_transcript_key)

        # Invalidate program/department student counts
        if instance.program_id:
            program_stats_key = f"program_stats_{instance.program_id}"
            cache.delete(program_stats_key)

        if instance.department_id:
            dept_stats_key = f"department_stats_{instance.department_id}"
            cache.delete(dept_stats_key)

        logger.debug(f"Invalidated student caches for student {instance.id}")

    except Exception as e:
        logger.error(f"Failed to invalidate student caches: {str(e)}")


# =====================
# CAMPUS/DEPARTMENT/FACULTY CACHE INVALIDATION
# =====================

@receiver([post_save, post_delete], sender='campuses.Campus')
def invalidate_campus_caches(sender, instance, **kwargs):
    """
    Invalidate campus list cache when campuses are created/updated/deleted.
    """
    try:
        # These are already handled by perform_create/update/destroy in views
        # but we add signal as backup
        cache.delete('campus_list_all')

        # Invalidate campus statistics
        campus_stats_key = f"campus_stats_{instance.id}"
        cache.delete(campus_stats_key)

        logger.debug(f"Invalidated campus caches for campus {instance.id}")

    except Exception as e:
        logger.error(f"Failed to invalidate campus caches: {str(e)}")


@receiver([post_save, post_delete], sender='campuses.Department')
def invalidate_department_caches(sender, instance, **kwargs):
    """
    Invalidate department list cache when departments are created/updated/deleted.
    """
    try:
        cache.delete('department_list_all')

        # Invalidate department-specific caches
        dept_courses_key = f"department_courses_{instance.id}"
        cache.delete(dept_courses_key)

        logger.debug(f"Invalidated department caches for department {instance.id}")

    except Exception as e:
        logger.error(f"Failed to invalidate department caches: {str(e)}")


@receiver([post_save, post_delete], sender='campuses.Faculty')
def invalidate_faculty_caches(sender, instance, **kwargs):
    """
    Invalidate faculty list cache when faculties are created/updated/deleted.
    """
    try:
        cache.delete('faculty_list_all')

        logger.debug(f"Invalidated faculty caches for faculty {instance.id}")

    except Exception as e:
        logger.error(f"Failed to invalidate faculty caches: {str(e)}")


# =====================
# COURSE/PROGRAM CACHE INVALIDATION
# =====================

@receiver([post_save, post_delete], sender='courses.Course')
def invalidate_course_caches(sender, instance, **kwargs):
    """
    Invalidate course-related caches when courses are created/updated/deleted.
    """
    try:
        # Invalidate department courses cache
        if instance.department_id:
            dept_courses_key = f"department_courses_{instance.department_id}"
            cache.delete(dept_courses_key)

        logger.debug(f"Invalidated course caches for course {instance.id}")

    except Exception as e:
        logger.error(f"Failed to invalidate course caches: {str(e)}")


@receiver([post_save, post_delete], sender='courses.Program')
def invalidate_program_caches(sender, instance, **kwargs):
    """
    Invalidate program-related caches when programs are created/updated/deleted.
    """
    try:
        # Invalidate program statistics
        program_stats_key = f"program_stats_{instance.id}"
        cache.delete(program_stats_key)

        logger.debug(f"Invalidated program caches for program {instance.id}")

    except Exception as e:
        logger.error(f"Failed to invalidate program caches: {str(e)}")


# =====================
# ENROLLMENT CACHE INVALIDATION
# =====================

@receiver([post_save, post_delete], sender='students.Enrollment')
def invalidate_enrollment_caches(sender, instance, **kwargs):
    """
    Invalidate enrollment-related caches when enrollments change.
    """
    try:
        # Invalidate course offering enrollment count
        if instance.course_offering_id:
            offering_cache_key = f"course_offering_enrollments_{instance.course_offering_id}"
            cache.delete(offering_cache_key)

        # Invalidate student enrollments
        if instance.student_id:
            student_enrollments_key = f"student_enrollments_{instance.student_id}"
            cache.delete(student_enrollments_key)

        logger.debug(f"Invalidated enrollment caches for enrollment {instance.id}")

    except Exception as e:
        logger.error(f"Failed to invalidate enrollment caches: {str(e)}")
