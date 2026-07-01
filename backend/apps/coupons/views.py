from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Coupon
from .serializers import CouponSerializer

class CouponViewSet(viewsets.ModelViewSet):
    queryset = Coupon.objects.all()
    serializer_class = CouponSerializer

    def get_permissions(self):
        if self.action == 'validate_coupon':
            return [permissions.IsAuthenticated()]
        return [permissions.IsAdminUser()]

    @action(detail=False, methods=['post'], url_path='validate')
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
