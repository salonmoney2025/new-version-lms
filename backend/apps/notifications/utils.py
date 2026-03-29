"""
Notification Helper Utilities
Use these functions to send notifications from other modules
"""
from django.utils import timezone
from .models import Notification, NotificationPreference
from apps.authentication.models import User


def send_notification(
    recipient,
    title,
    message,
    notification_type='CUSTOM',
    priority='MEDIUM',
    action_url=None,
    action_text=None,
    related_object_type=None,
    related_object_id=None
):
    """
    Send a notification to a user

    Args:
        recipient: User object
        title: Notification title
        message: Notification message
        notification_type: Type of notification (from NotificationTemplate.NOTIFICATION_TYPES)
        priority: Priority level (LOW, MEDIUM, HIGH, URGENT)
        action_url: URL to navigate to when notification is clicked
        action_text: Text for action button
        related_object_type: Type of related object (e.g., 'payment', 'exam')
        related_object_id: ID of related object

    Returns:
        Notification object
    """
    # Check if user has disabled this notification type
    try:
        prefs = NotificationPreference.objects.get(user=recipient)
        if notification_type in prefs.disabled_notification_types:
            return None

        # Check if user has disabled in-app notifications
        if not prefs.enable_in_app:
            return None

        # Check quiet hours
        if prefs.enable_quiet_hours and prefs.quiet_hours_start and prefs.quiet_hours_end:
            current_time = timezone.now().time()
            if prefs.quiet_hours_start <= current_time <= prefs.quiet_hours_end:
                return None
    except NotificationPreference.DoesNotExist:
        # If no preferences set, send notification
        pass

    # Create notification
    notification = Notification.objects.create(
        recipient=recipient,
        title=title,
        message=message,
        notification_type=notification_type,
        priority=priority,
        action_url=action_url,
        action_text=action_text,
        related_object_type=related_object_type,
        related_object_id=related_object_id,
        status='SENT',
        sent_at=timezone.now()
    )

    return notification


def send_bulk_notification(
    recipients,
    title,
    message,
    notification_type='CUSTOM',
    priority='MEDIUM',
    action_url=None,
    action_text=None
):
    """
    Send notification to multiple users

    Args:
        recipients: List of User objects
        title: Notification title
        message: Notification message
        notification_type: Type of notification
        priority: Priority level
        action_url: URL to navigate to
        action_text: Text for action button

    Returns:
        List of created Notification objects
    """
    notifications = []
    for recipient in recipients:
        notification = send_notification(
            recipient=recipient,
            title=title,
            message=message,
            notification_type=notification_type,
            priority=priority,
            action_url=action_url,
            action_text=action_text
        )
        if notification:
            notifications.append(notification)

    return notifications


# Specific notification functions for different modules

def notify_fee_payment(student, payment):
    """Send notification when student pays fees"""
    return send_notification(
        recipient=student.user,
        title="Payment Received",
        message=f"Your payment of Le {payment.amount:,.2f} has been received successfully. Receipt #: {payment.receipt_number}",
        notification_type='FEE_PAYMENT',
        priority='MEDIUM',
        action_url=f'/financial/receipt/{payment.id}',
        action_text='View Receipt',
        related_object_type='payment',
        related_object_id=payment.id
    )


def notify_fee_reminder(student, fee_balance):
    """Send fee payment reminder"""
    return send_notification(
        recipient=student.user,
        title="Fee Payment Reminder",
        message=f"You have an outstanding balance of Le {fee_balance:,.2f}. Please make payment to avoid penalties.",
        notification_type='FEE_REMINDER',
        priority='HIGH',
        action_url='/financial/payments',
        action_text='Pay Now'
    )


def notify_exam_schedule(student, exam):
    """Notify student about exam schedule"""
    return send_notification(
        recipient=student.user,
        title="Exam Scheduled",
        message=f"Your {exam.course.code} exam is scheduled for {exam.exam_date.strftime('%B %d, %Y at %I:%M %p')}. Venue: {exam.venue}",
        notification_type='EXAM_SCHEDULE',
        priority='HIGH',
        action_url=f'/academic/exams/{exam.id}',
        action_text='View Details',
        related_object_type='exam',
        related_object_id=exam.id
    )


def notify_result_published(student, exam):
    """Notify student when exam results are published"""
    return send_notification(
        recipient=student.user,
        title="Results Published",
        message=f"Your results for {exam.course.name} ({exam.course.code}) have been published.",
        notification_type='RESULT_PUBLISHED',
        priority='HIGH',
        action_url=f'/academic/results/{exam.id}',
        action_text='View Results',
        related_object_type='exam',
        related_object_id=exam.id
    )


def notify_course_registration(student, course):
    """Notify student about course registration"""
    return send_notification(
        recipient=student.user,
        title="Course Registration Successful",
        message=f"You have successfully registered for {course.name} ({course.code}).",
        notification_type='COURSE_REGISTRATION',
        priority='MEDIUM',
        action_url='/academic/courses',
        action_text='View Courses',
        related_object_type='course',
        related_object_id=course.id
    )


def notify_admission(student):
    """Notify student about admission"""
    return send_notification(
        recipient=student.user,
        title="Admission Confirmed",
        message=f"Congratulations! Your admission has been confirmed. Student ID: {student.student_id}",
        notification_type='ADMISSION',
        priority='HIGH',
        action_url='/dashboard',
        action_text='Go to Dashboard'
    )


def notify_general_announcement(users, title, message):
    """Send general announcement to multiple users"""
    return send_bulk_notification(
        recipients=users,
        title=title,
        message=message,
        notification_type='GENERAL_ANNOUNCEMENT',
        priority='MEDIUM'
    )
