from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    NotificationViewSet, SMSLogViewSet, EmailLogViewSet,
    SMSTemplateViewSet, SignatureViewSet
)

app_name = 'communications'

router = DefaultRouter()
router.register(r'notifications', NotificationViewSet, basename='notification')
router.register(r'sms-logs', SMSLogViewSet, basename='sms_log')
router.register(r'email-logs', EmailLogViewSet, basename='email_log')
router.register(r'sms-templates', SMSTemplateViewSet, basename='sms_template')
router.register(r'signatures', SignatureViewSet, basename='signature')

urlpatterns = [
    path('', include(router.urls)),
]
