from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.utils.text import slugify
from .models import Shop, PaymentAccount, ShippingZone
from .serializers import ShopSerializer, PaymentAccountSerializer, ShippingZoneSerializer

class IsShopOwnerOrAdmin(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.user.role in ('admin', 'superadmin'):
            return True
        # For PaymentAccount or ShippingZone, check shop owner
        if hasattr(obj, 'shop'):
            return obj.shop.owner == request.user
        return obj.owner == request.user

class ShopViewSet(viewsets.ModelViewSet):
    queryset = Shop.objects.all()
    serializer_class = ShopSerializer
    lookup_field = 'slug'

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        if self.action == 'create':
            return [permissions.IsAuthenticated()]
        return [permissions.IsAuthenticated(), IsShopOwnerOrAdmin()]

    def perform_create(self, serializer):
        slug = slugify(serializer.validated_data['name'])
        # Ensure unique slug
        original_slug = slug
        counter = 1
        while Shop.objects.filter(slug=slug).exists():
            slug = f"{original_slug}-{counter}"
            counter += 1
        serializer.save(owner=self.request.user, slug=slug)

        # Auto-promote user to seller role
        user = self.request.user
        if user.role != 'seller':
            user.role = 'seller'
            user.save()

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAdminUser])
    def approve(self, request, slug=None):
        shop = self.get_object()
        shop.status = 'active'
        shop.save()
        return Response({'status': 'shop approved'})

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAdminUser])
    def suspend(self, request, slug=None):
        shop = self.get_object()
        shop.status = 'suspended'
        shop.save()
        return Response({'status': 'shop suspended'})

class PaymentAccountViewSet(viewsets.ModelViewSet):
    serializer_class = PaymentAccountSerializer
    permission_classes = [permissions.IsAuthenticated, IsShopOwnerOrAdmin]

    def get_queryset(self):
        return PaymentAccount.objects.filter(shop__owner=self.request.user)

    def perform_create(self, serializer):
        shop = self.request.user.shop
        serializer.save(shop=shop)

class ShippingZoneViewSet(viewsets.ModelViewSet):
    serializer_class = ShippingZoneSerializer
    permission_classes = [permissions.IsAuthenticated, IsShopOwnerOrAdmin]

    def get_queryset(self):
        return ShippingZone.objects.filter(shop__owner=self.request.user)

    def perform_create(self, serializer):
        shop = self.request.user.shop
        serializer.save(shop=shop)
