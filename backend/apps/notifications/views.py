"""
Notifications Views
"""
from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from django.utils import timezone
from django.db.models import Q

from .models import (
    NotificationTemplate, Notification, EmailLog, SMSLog, NotificationPreference
)
from .serializers import (
    NotificationTemplateSerializer, NotificationSerializer, SendNotificationSerializer,
    EmailLogSerializer, SMSLogSerializer, NotificationPreferenceSerializer
)
from apps.authentication.models import User


class NotificationTemplateViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing Notification Templates
    """
    serializer_class = NotificationTemplateSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['notification_type', 'channel', 'is_active']
    search_fields = ['name', 'subject']
    ordering_fields = ['name', 'created_at']
    ordering = ['name']

    def get_queryset(self):
        return NotificationTemplate.objects.filter(is_deleted=False)


class NotificationViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing Notifications
    """
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'priority', 'notification_type', 'recipient']
    search_fields = ['title', 'message']
    ordering_fields = ['created_at', 'priority']
    ordering = ['-created_at']

    def get_queryset(self):
        user = self.request.user

        # Admin users can see all notifications
        if user.role in ['SUPER_ADMIN', 'ADMIN']:
            return Notification.objects.filter(is_deleted=False)

        # Regular users see only their notifications
        return Notification.objects.filter(recipient=user, is_deleted=False)

    @action(detail=False, methods=['post'])
    def send_notification(self, request):
        """Send notification to multiple recipients"""
        serializer = SendNotificationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        recipient_ids = serializer.validated_data['recipient_ids']
        recipients = User.objects.filter(id__in=recipient_ids)

        if not recipients.exists():
            return Response(
                {'error': 'No valid recipients found'},
                status=status.HTTP_404_NOT_FOUND
            )

        notifications = []
        for recipient in recipients:
            notification = Notification.objects.create(
                recipient=recipient,
                title=serializer.validated_data['title'],
                message=serializer.validated_data['message'],
                notification_type=serializer.validated_data['notification_type'],
                priority=serializer.validated_data.get('priority', 'MEDIUM'),
                action_url=serializer.validated_data.get('action_url', ''),
                action_text=serializer.validated_data.get('action_text', ''),
                status='SENT',
                sent_at=timezone.now()
            )
            notifications.append(notification)

        return Response({
            'message': f'Sent {len(notifications)} notifications successfully',
            'notification_ids': [n.id for n in notifications]
        }, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'])
    def mark_as_read(self, request, pk=None):
        """Mark notification as read"""
        notification = self.get_object()
        notification.mark_as_read()
        serializer = self.get_serializer(notification)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def mark_all_as_read(self, request):
        """Mark all user's notifications as read"""
        updated = Notification.objects.filter(
            recipient=request.user,
            read_at__isnull=True,
            is_deleted=False
        ).update(
            read_at=timezone.now(),
            status='READ'
        )
        return Response({'message': f'Marked {updated} notifications as read'})

    @action(detail=False, methods=['get'])
    def unread(self, request):
        """Get unread notifications"""
        notifications = self.get_queryset().filter(read_at__isnull=True)
        serializer = self.get_serializer(notifications, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def unread_count(self, request):
        """Get count of unread notifications"""
        count = self.get_queryset().filter(read_at__isnull=True).count()
        return Response({'count': count})


class EmailLogViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for viewing Email Logs
    """
    serializer_class = EmailLogSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'recipient_email']
    search_fields = ['recipient_email', 'subject']
    ordering_fields = ['sent_at', 'created_at']
    ordering = ['-created_at']

    def get_queryset(self):
        user = self.request.user

        if user.role in ['SUPER_ADMIN', 'ADMIN']:
            return EmailLog.objects.filter(is_deleted=False)

        return EmailLog.objects.filter(recipient_user=user, is_deleted=False)


class SMSLogViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for viewing SMS Logs
    """
    serializer_class = SMSLogSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'recipient_phone']
    search_fields = ['recipient_phone']
    ordering_fields = ['sent_at', 'created_at']
    ordering = ['-created_at']

    def get_queryset(self):
        user = self.request.user

        if user.role in ['SUPER_ADMIN', 'ADMIN']:
            return SMSLog.objects.filter(is_deleted=False)

        return SMSLog.objects.filter(recipient_user=user, is_deleted=False)


class NotificationPreferenceViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing Notification Preferences
    """
    serializer_class = NotificationPreferenceSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        if user.role in ['SUPER_ADMIN', 'ADMIN']:
            return NotificationPreference.objects.filter(is_deleted=False)

        # Users can only access their own preferences
        return NotificationPreference.objects.filter(user=user, is_deleted=False)

    @action(detail=False, methods=['get'])
    def my_preferences(self, request):
        """Get current user's notification preferences"""
        preferences, created = NotificationPreference.objects.get_or_create(
            user=request.user
        )
        serializer = self.get_serializer(preferences)
        return Response(serializer.data)

    @action(detail=False, methods=['patch'])
    def update_my_preferences(self, request):
        """Update current user's notification preferences"""
        preferences, created = NotificationPreference.objects.get_or_create(
            user=request.user
        )
        serializer = self.get_serializer(preferences, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
