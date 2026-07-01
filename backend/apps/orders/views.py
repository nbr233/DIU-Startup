from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from django.db import transaction
from django_filters.rest_framework import DjangoFilterBackend
from .models import Order, OrderItem
from .serializers import OrderSerializer, OrderItemSerializer
from apps.products.models import Product, ProductVariant
from apps.coupons.models import Coupon

class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['status', 'payment_method', 'shop__slug']

    def get_permissions(self):
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        user = self.request.user
        if user.role in ('admin', 'superadmin'):
            return Order.objects.all()
        elif user.role == 'seller':
            return Order.objects.filter(shop__owner=user)
        return Order.objects.filter(customer=user)

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        data = request.data
        items_data = data.get('items', [])
        if not items_data:
            return Response({'error': 'No items in order'}, status=status.HTTP_400_BAD_REQUEST)

        # We assume checkout happens per-shop or split. For now, we resolve the first product's shop.
        first_product_id = items_data[0].get('product')
        try:
            first_product = Product.objects.get(id=first_product_id)
            shop = first_product.shop
        except Product.DoesNotExist:
            return Response({'error': 'Invalid product ID'}, status=status.HTTP_400_BAD_REQUEST)

        subtotal = 0
        order_items = []

        # Validate items and calculate prices
        for item in items_data:
            try:
                product = Product.objects.get(id=item.get('product'))
                if product.shop != shop:
                    return Response({'error': 'All products in one checkout must belong to the same shop'}, status=status.HTTP_400_BAD_REQUEST)
                
                qty = int(item.get('quantity', 1))
                if product.stock < qty:
                    return Response({'error': f'Insufficient stock for product: {product.name}'}, status=status.HTTP_400_BAD_REQUEST)

                variant = None
                variant_id = item.get('variant')
                if variant_id:
                    try:
                        variant = ProductVariant.objects.get(id=variant_id, product=product)
                        if variant.stock < qty:
                            return Response({'error': f'Insufficient stock for variant: {variant}'}, status=status.HTTP_400_BAD_REQUEST)
                    except ProductVariant.DoesNotExist:
                        return Response({'error': 'Invalid variant ID'}, status=status.HTTP_400_BAD_REQUEST)

                # Price calculations
                price = product.discount_price if product.discount_price else product.price
                if variant:
                    price += variant.price_modifier

                subtotal += price * qty
                order_items.append({
                    'product': product,
                    'variant': variant,
                    'qty': qty,
                    'unit_price': price,
                    'product_name': product.name,
                    'product_image': product.images.filter(is_primary=True).first().image.url if product.images.filter(is_primary=True).exists() else ""
                })

            except Product.DoesNotExist:
                return Response({'error': 'Product not found'}, status=status.HTTP_400_BAD_REQUEST)

        # Coupon calculations
        discount = 0
        coupon_code = data.get('coupon_code')
        if coupon_code:
            try:
                coupon = Coupon.objects.get(code=coupon_code)
                valid, msg = coupon.is_valid()
                if valid:
                    # Check min order
                    if subtotal >= coupon.min_order:
                        if coupon.discount_type == 'percent':
                            discount = (subtotal * coupon.value) / 100
                            if coupon.max_discount:
                                discount = min(discount, coupon.max_discount)
                        else:
                            discount = coupon.value
                        coupon.used_count += 1
                        coupon.save()
            except Coupon.DoesNotExist:
                pass

        delivery_charge = data.get('delivery_charge', 60)
        total = subtotal + delivery_charge - discount

        order = Order.objects.create(
            customer=request.user,
            shop=shop,
            payment_method=data.get('payment_method', 'cod'),
            subtotal=subtotal,
            delivery_charge=delivery_charge,
            discount=discount,
            total=total,
            delivery_address=data.get('delivery_address'),
            notes=data.get('notes', ''),
            coupon_code=coupon_code or ''
        )

        for item in order_items:
            # Save item
            OrderItem.objects.create(
                order=order,
                product=item['product'],
                variant=item['variant'],
                product_name=item['product_name'],
                product_image=item['product_image'],
                quantity=item['qty'],
                unit_price=item['unit_price']
            )

            # Deduct stock
            item['product'].stock -= item['qty']
            item['product'].save()
            if item['variant']:
                item['variant'].stock -= item['qty']
                item['variant'].save()

        serializer = self.get_serializer(order)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
