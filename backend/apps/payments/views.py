from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from .models import Payment
from .serializers import PaymentSerializer

class PaymentViewSet(viewsets.ModelViewSet):
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role in ('admin', 'superadmin'):
            return Payment.objects.all()
        elif user.role == 'seller':
            return Payment.objects.filter(order__shop__owner=user)
        return Payment.objects.filter(order__customer=user)

    def perform_create(self, serializer):
        serializer.save()

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def verify(self, request, pk=None):
        payment = self.get_object()
        user = request.user
        
        # Check permissions: only order shop owner or platform admin can verify
        if user.role not in ('admin', 'superadmin') and payment.order.shop.owner != user:
            return Response({'error': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)

        status_value = request.data.get('status')
        if status_value not in ('received', 'rejected', 'refunded'):
            return Response({'error': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)

        payment.status = status_value
        payment.rejection_reason = request.data.get('rejection_reason', '')
        payment.verified_at = timezone.now()
        payment.verified_by = user
        payment.save()

        # Update order status if payment is verified
        if status_value == 'received':
            payment.order.status = 'confirmed'
            payment.order.save()

        return Response({'status': f'payment marked as {status_value}'})
