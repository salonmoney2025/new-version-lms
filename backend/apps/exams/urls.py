from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    ExamViewSet, GradeViewSet, TranscriptViewSet,
    GradeScaleViewSet, ScriptCollectionViewSet,
    PromotionalListViewSet, StudentPromotionViewSet,
    GraduationListViewSet, GraduatingStudentViewSet
)

app_name = 'exams'

router = DefaultRouter()
router.register(r'exams', ExamViewSet, basename='exam')
router.register(r'grades', GradeViewSet, basename='grade')
router.register(r'transcripts', TranscriptViewSet, basename='transcript')
router.register(r'grade-scales', GradeScaleViewSet, basename='gradescale')
router.register(r'script-collections', ScriptCollectionViewSet, basename='scriptcollection')
router.register(r'promotional-lists', PromotionalListViewSet, basename='promotionallist')
router.register(r'student-promotions', StudentPromotionViewSet, basename='studentpromotion')
router.register(r'graduation-lists', GraduationListViewSet, basename='graduationlist')
router.register(r'graduating-students', GraduatingStudentViewSet, basename='graduatingstudent')

urlpatterns = [
    path('', include(router.urls)),
]
