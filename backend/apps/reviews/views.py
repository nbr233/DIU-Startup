from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Review
from .serializers import ReviewSerializer

class ReviewViewSet(viewsets.ModelViewSet):
    serializer_class = ReviewSerializer

    def get_queryset(self):
        # Allow anyone to view non-hidden reviews
        if self.request.user.is_anonymous:
            return Review.objects.filter(is_hidden=False)
        user = self.request.user
        if user.role in ('admin', 'superadmin'):
            return Review.objects.all()
        elif user.role == 'seller':
            return Review.objects.filter(product__shop__owner=user)
        return Review.objects.filter(is_hidden=False)

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def reply(self, request, pk=None):
        review = self.get_object()
        # Only product owner can reply
        if review.product.shop.owner != request.user:
            return Response({'error': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)
        
        reply_text = request.data.get('reply', '')
        review.reply = reply_text
        review.save()
        return Response({'status': 'reply saved'})

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAdminUser])
    def toggle_hidden(self, request, pk=None):
        review = self.get_object()
        review.is_hidden = not review.is_hidden
        review.save()
        return Response({'status': f'review hidden is now {review.is_hidden}'})
