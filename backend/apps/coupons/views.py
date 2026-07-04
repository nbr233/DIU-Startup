from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from .models import Coupon
from .serializers import CouponSerializer

class CouponViewSet(viewsets.ModelViewSet):
    serializer_class = CouponSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role in ('admin', 'superadmin'):
            return Coupon.objects.all()
        elif user.role == 'seller':
            return Coupon.objects.filter(Q(applicable_shops__owner=user) | Q(applicable_shops__isnull=True)).distinct()
        return Coupon.objects.filter(is_active=True)

    def check_object_permissions(self, request, obj):
        super().check_object_permissions(request, obj)
        user = request.user
        if self.action == 'validate_coupon':
            return
        if user.role in ('admin', 'superadmin'):
            return
        if user.role == 'seller':
            # If the coupon is applicable to this seller's shop, permit them
            if obj.applicable_shops.filter(owner=user).exists():
                return
        self.permission_denied(request, message="You do not have permission to manage this coupon.")

    def perform_create(self, serializer):
        coupon = serializer.save()
        if self.request.user.role == 'seller':
            try:
                shop = self.request.user.shop
                coupon.applicable_shops.add(shop)
            except:
                pass

    @action(detail=False, methods=['post'], url_path='validate', permission_classes=[permissions.IsAuthenticated])
    def validate_coupon(self, request):
        code = request.data.get('code')
        subtotal = float(request.data.get('subtotal', 0))
        shop_id = request.data.get('shop_id')

        try:
            coupon = Coupon.objects.get(code__iexact=code)
            valid, msg = coupon.is_valid()
            if not valid:
                return Response({'error': msg}, status=status.HTTP_400_BAD_REQUEST)

            if subtotal < coupon.min_order:
                return Response({'error': f'Minimum order amount of ৳{coupon.min_order} required.'}, status=status.HTTP_400_BAD_REQUEST)

            # Check if applicable to the shop
            if coupon.applicable_shops.exists() and shop_id:
                if not coupon.applicable_shops.filter(id=shop_id).exists():
                    return Response({'error': 'Coupon is not applicable to this shop.'}, status=status.HTTP_400_BAD_REQUEST)

            return Response({
                'code': coupon.code,
                'discount_type': coupon.discount_type,
                'value': coupon.value,
                'max_discount': coupon.max_discount,
            })

        except Coupon.DoesNotExist:
            return Response({'error': 'Invalid coupon code.'}, status=status.HTTP_404_NOT_FOUND)

