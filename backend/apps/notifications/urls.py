"""
Notifications URLs
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    NotificationTemplateViewSet, NotificationViewSet,
    EmailLogViewSet, SMSLogViewSet, NotificationPreferenceViewSet
)

router = DefaultRouter()
router.register(r'templates', NotificationTemplateViewSet, basename='template')
router.register(r'notifications', NotificationViewSet, basename='notification')
router.register(r'email-logs', EmailLogViewSet, basename='email-log')
router.register(r'sms-logs', SMSLogViewSet, basename='sms-log')
router.register(r'preferences', NotificationPreferenceViewSet, basename='preference')

urlpatterns = [
    path('', include(router.urls)),
]
