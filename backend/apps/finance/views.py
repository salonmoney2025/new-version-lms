from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters
from decimal import Decimal

from .models import FeeStructure, StudentFee, Payment, Scholarship, StudentScholarship
from .serializers import (
    FeeStructureSerializer, StudentFeeSerializer, PaymentSerializer,
    ScholarshipSerializer, StudentScholarshipSerializer
)
from apps.authentication.permissions import IsAdmin, IsAdminOrReadOnly
from apps.notifications.utils import notify_fee_payment


class FeeStructureViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing fee structures
    """
    queryset = FeeStructure.objects.filter(is_deleted=False)
    serializer_class = FeeStructureSerializer
    permission_classes = [IsAuthenticated, IsAdmin]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['program', 'campus', 'semester', 'academic_year']
    search_fields = ['program__name', 'program__code']
    ordering_fields = ['academic_year', 'semester', 'total_amount', 'due_date']
    ordering = ['-academic_year', 'semester']


class StudentFeeViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing student fees
    """
    queryset = StudentFee.objects.filter(is_deleted=False)
    serializer_class = StudentFeeSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['student', 'fee_structure', 'status']
    search_fields = ['student__student_id', 'student__user__first_name', 'student__user__last_name']
    ordering_fields = ['due_date', 'total_amount', 'balance', 'created_at']
    ordering = ['-due_date']

    @action(detail=True, methods=['get'])
    def payment_history(self, request, pk=None):
        """
        Get payment history for a student fee
        """
        student_fee = self.get_object()
        payments = Payment.objects.filter(student_fee=student_fee)
        serializer = PaymentSerializer(payments, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)


class PaymentViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing payments
    """
    queryset = Payment.objects.filter(is_deleted=False)
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated, IsAdmin]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['student_fee', 'payment_method', 'status']
    search_fields = ['transaction_id', 'receipt_number', 'student_fee__student__student_id']
    ordering_fields = ['payment_date', 'amount', 'created_at']
    ordering = ['-payment_date']

    def perform_create(self, serializer):
        """
        Process payment and update student fee
        """
        payment = serializer.save(processed_by=self.request.user)

        # Update student fee if payment is successful
        if payment.status == 'SUCCESS':
            student_fee = payment.student_fee
            student_fee.paid_amount += payment.amount
            student_fee.save()

            # Send notification to student
            try:
                notify_fee_payment(student_fee.student, payment)
            except Exception as e:
                # Log error but don't fail the payment
                print(f"Failed to send payment notification: {str(e)}")

    @action(detail=False, methods=['post'])
    def process_payment(self, request):
        """
        Process a new payment
        """
        student_fee_id = request.data.get('student_fee_id')
        amount = Decimal(str(request.data.get('amount', 0)))
        payment_method = request.data.get('payment_method')
        transaction_id = request.data.get('transaction_id')

        if not all([student_fee_id, amount, payment_method, transaction_id]):
            return Response(
                {'error': 'student_fee_id, amount, payment_method, and transaction_id are required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            student_fee = StudentFee.objects.get(id=student_fee_id)
        except StudentFee.DoesNotExist:
            return Response(
                {'error': 'Student fee not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        # Validate amount
        if amount > student_fee.balance:
            return Response(
                {'error': f'Payment amount cannot exceed balance ({student_fee.balance})'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Check for duplicate transaction
        if Payment.objects.filter(transaction_id=transaction_id).exists():
            return Response(
                {'error': 'Payment with this transaction ID already exists'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Create payment
        payment = Payment.objects.create(
            student_fee=student_fee,
            amount=amount,
            payment_method=payment_method,
            transaction_id=transaction_id,
            status='SUCCESS',
            processed_by=request.user,
            receipt_number=f"RCP{transaction_id[:10]}"
        )

        # Send notification to student
        try:
            notify_fee_payment(student_fee.student, payment)
        except Exception as e:
            # Log error but don't fail the payment
            print(f"Failed to send payment notification: {str(e)}")

        # Update student fee
        student_fee.paid_amount += amount
        student_fee.save()

        return Response(
            PaymentSerializer(payment).data,
            status=status.HTTP_201_CREATED
        )

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated, IsAdmin])
    def refund(self, request, pk=None):
        """
        Refund a payment
        """
        payment = self.get_object()

        if payment.status == 'REFUNDED':
            return Response(
                {'error': 'Payment is already refunded'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Update payment status
        payment.status = 'REFUNDED'
        payment.save()

        # Update student fee
        student_fee = payment.student_fee
        student_fee.paid_amount -= payment.amount
        student_fee.save()

        return Response(
            {'message': 'Payment refunded successfully'},
            status=status.HTTP_200_OK
        )


class ScholarshipViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing scholarships
    """
    queryset = Scholarship.objects.filter(is_deleted=False)
    serializer_class = ScholarshipSerializer
    permission_classes = [IsAuthenticated, IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['type', 'is_active']
    search_fields = ['name', 'type', 'criteria']
    ordering_fields = ['name', 'amount', 'created_at']
    ordering = ['name']

    @action(detail=True, methods=['get'])
    def recipients(self, request, pk=None):
        """
        Get all recipients of a scholarship
        """
        scholarship = self.get_object()
        recipients = StudentScholarship.objects.filter(scholarship=scholarship)
        serializer = StudentScholarshipSerializer(recipients, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)


class StudentScholarshipViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing student scholarships
    """
    queryset = StudentScholarship.objects.filter(is_deleted=False)
    serializer_class = StudentScholarshipSerializer
    permission_classes = [IsAuthenticated, IsAdmin]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['student', 'scholarship', 'academic_year', 'status']
    search_fields = ['student__student_id', 'scholarship__name']
    ordering_fields = ['awarded_date', 'amount_awarded', 'created_at']
    ordering = ['-awarded_date']
