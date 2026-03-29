from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import StudentViewSet, EnrollmentViewSet, AttendanceViewSet
from .views_enhanced import (
    LeaveApplicationViewSet, StudentFeedbackViewSet,
    StudentDocumentViewSet, CourseRegistrationViewSet
)

app_name = 'students'

router = DefaultRouter()
router.register(r'students', StudentViewSet, basename='student')
router.register(r'enrollments', EnrollmentViewSet, basename='enrollment')
router.register(r'attendance', AttendanceViewSet, basename='attendance')

# New enhanced features
router.register(r'leave-applications', LeaveApplicationViewSet, basename='leave-application')
router.register(r'feedback', StudentFeedbackViewSet, basename='student-feedback')
router.register(r'documents', StudentDocumentViewSet, basename='student-document')
router.register(r'course-registrations', CourseRegistrationViewSet, basename='course-registration')

urlpatterns = [
    path('', include(router.urls)),
]
