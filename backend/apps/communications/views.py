from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters

from .models import Notification, SMSLog, EmailLog, SMSTemplate, Signature
from .serializers import NotificationSerializer, SMSLogSerializer, EmailLogSerializer, SMSTemplateSerializer, SignatureSerializer
from apps.authentication.permissions import IsAdmin, IsAdminOrReadOnly


class NotificationViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing notifications
    """
    queryset = Notification.objects.filter(is_deleted=False)
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['recipient_user', 'sender_user', 'notification_type', 'priority', 'is_read']
    search_fields = ['title', 'message']
    ordering_fields = ['sent_at', 'priority', 'created_at']
    ordering = ['-sent_at']

    def get_queryset(self):
        """
        Filter notifications by current user unless admin
        """
        user = self.request.user
        if user.is_admin_user:
            return super().get_queryset()
        return super().get_queryset().filter(recipient_user=user)

    @action(detail=True, methods=['post'])
    def mark_as_read(self, request, pk=None):
        """
        Mark a notification as read
        """
        notification = self.get_object()

        if notification.is_read:
            return Response(
                {'message': 'Notification is already marked as read'},
                status=status.HTTP_200_OK
            )

        from django.utils import timezone
        notification.is_read = True
        notification.read_at = timezone.now()
        notification.save()

        return Response(
            {'message': 'Notification marked as read'},
            status=status.HTTP_200_OK
        )

    @action(detail=False, methods=['post'])
    def mark_all_as_read(self, request):
        """
        Mark all notifications as read for current user
        """
        from django.utils import timezone
        updated = Notification.objects.filter(
            recipient_user=request.user,
            is_read=False
        ).update(is_read=True, read_at=timezone.now())

        return Response(
            {'message': f'{updated} notifications marked as read'},
            status=status.HTTP_200_OK
        )

    @action(detail=False, methods=['get'])
    def unread_count(self, request):
        """
        Get count of unread notifications for current user
        """
        count = Notification.objects.filter(
            recipient_user=request.user,
            is_read=False
        ).count()

        return Response({'unread_count': count}, status=status.HTTP_200_OK)

    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated, IsAdmin])
    def broadcast(self, request):
        """
        Send a notification to multiple users
        """
        user_ids = request.data.get('user_ids', [])
        title = request.data.get('title')
        message = request.data.get('message')
        notification_type = request.data.get('notification_type', 'INFO')
        priority = request.data.get('priority', 'MEDIUM')

        if not all([user_ids, title, message]):
            return Response(
                {'error': 'user_ids, title, and message are required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        from apps.authentication.models import User

        notifications = []
        for user_id in user_ids:
            try:
                user = User.objects.get(id=user_id)
                notification = Notification.objects.create(
                    recipient_user=user,
                    sender_user=request.user,
                    title=title,
                    message=message,
                    notification_type=notification_type,
                    priority=priority
                )
                notifications.append(notification)
            except User.DoesNotExist:
                continue

        return Response({
            'message': f'{len(notifications)} notifications sent successfully',
            'notifications': NotificationSerializer(notifications, many=True).data
        }, status=status.HTTP_201_CREATED)


class SMSLogViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for viewing SMS logs (read-only)
    """
    queryset = SMSLog.objects.filter(is_deleted=False)
    serializer_class = SMSLogSerializer
    permission_classes = [IsAuthenticated, IsAdmin]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'recipient_phone']
    search_fields = ['recipient_phone', 'message']
    ordering_fields = ['sent_at', 'created_at']
    ordering = ['-sent_at']


class EmailLogViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for viewing email logs (read-only)
    """
    queryset = EmailLog.objects.filter(is_deleted=False)
    serializer_class = EmailLogSerializer
    permission_classes = [IsAuthenticated, IsAdmin]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'recipient_email']
    search_fields = ['recipient_email', 'subject', 'body']
    ordering_fields = ['sent_at', 'opened_at', 'created_at']
    ordering = ['-sent_at']


class SMSTemplateViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing SMS templates
    """
    queryset = SMSTemplate.objects.filter(is_deleted=False)
    serializer_class = SMSTemplateSerializer
    permission_classes = [IsAuthenticated, IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['template_type', 'is_active']
    search_fields = ['name', 'message', 'description']
    ordering_fields = ['name', 'template_type', 'created_at']
    ordering = ['template_type', 'name']

    @action(detail=True, methods=['post'])
    def preview(self, request, pk=None):
        """
        Preview a template with sample data
        """
        template = self.get_object()
        context = request.data.get('context', {})

        try:
            rendered_message = template.render(context)
            return Response({
                'message': rendered_message,
                'length': len(rendered_message),
                'sms_count': (len(rendered_message) // 160) + 1  # SMS is typically 160 chars
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {'error': f'Error rendering template: {str(e)}'},
                status=status.HTTP_400_BAD_REQUEST
            )

    @action(detail=False, methods=['get'])
    def types(self, request):
        """
        Get all available template types
        """
        from .models import SMSTemplate as SMSTemplateModel
        types = [
            {'value': choice[0], 'label': choice[1]}
            for choice in SMSTemplateModel.TEMPLATE_TYPE_CHOICES
        ]
        return Response(types, status=status.HTTP_200_OK)


class SignatureViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing signatures
    """
    queryset = Signature.objects.filter(is_deleted=False)
    serializer_class = SignatureSerializer
    permission_classes = [IsAuthenticated, IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['campus', 'is_default', 'is_active']
    search_fields = ['official_name', 'title', 'department']
    ordering_fields = ['official_name', 'title', 'created_at']
    ordering = ['official_name']

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated, IsAdmin])
    def set_as_default(self, request, pk=None):
        """
        Set this signature as the default for its campus
        """
        signature = self.get_object()

        # Remove default flag from other signatures in the same campus
        Signature.objects.filter(
            campus=signature.campus,
            is_default=True
        ).exclude(id=signature.id).update(is_default=False)

        signature.is_default = True
        signature.save()

        return Response(
            {'message': 'Signature set as default successfully'},
            status=status.HTTP_200_OK
        )

    @action(detail=False, methods=['get'])
    def default(self, request):
        """
        Get the default signature for a campus
        """
        campus_id = request.query_params.get('campus_id')

        if not campus_id:
            return Response(
                {'error': 'campus_id parameter is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            signature = Signature.objects.get(
                campus_id=campus_id,
                is_default=True,
                is_active=True
            )
            serializer = self.get_serializer(signature)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Signature.DoesNotExist:
            return Response(
                {'error': 'No default signature found for this campus'},
                status=status.HTTP_404_NOT_FOUND
            )
