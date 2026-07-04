from rest_framework import viewsets, permissions, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils.text import slugify
from django_filters.rest_framework import DjangoFilterBackend
from .models import Category, Brand, Product, ProductImage, ProductVariant
from .serializers import (
    CategorySerializer, BrandSerializer, ProductSerializer,
    ProductImageSerializer, ProductVariantSerializer
)

class IsProductOwnerOrAdmin(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.user.role in ('admin', 'superadmin'):
            return True
        if hasattr(obj, 'product'):
            return obj.product.shop.owner == request.user
        return obj.shop.owner == request.user

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.filter(parent=None)
    serializer_class = CategorySerializer
    lookup_field = 'slug'

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

class BrandViewSet(viewsets.ModelViewSet):
    queryset = Brand.objects.all()
    serializer_class = BrandSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    lookup_field = 'slug'
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category__slug', 'brand', 'is_featured', 'is_flash_sale', 'is_new_arrival', 'is_trending', 'status', 'shop__slug']
    search_fields = ['name', 'description', 'sku']
    ordering_fields = ['price', 'created_at', 'stock']

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated(), IsProductOwnerOrAdmin()]

    def perform_create(self, serializer):
        name = serializer.validated_data['name']
        slug = slugify(name)
        original_slug = slug
        counter = 1
        while Product.objects.filter(slug=slug).exists():
            slug = f"{original_slug}-{counter}"
            counter += 1
        serializer.save(shop=self.request.user.shop, slug=slug)

class ProductImageViewSet(viewsets.ModelViewSet):
    serializer_class = ProductImageSerializer
    permission_classes = [permissions.IsAuthenticated, IsProductOwnerOrAdmin]

    def get_queryset(self):
        return ProductImage.objects.filter(product__shop__owner=self.request.user)

    def perform_create(self, serializer):
        product_id = self.request.data.get('product')
        product = Product.objects.get(id=product_id, shop__owner=self.request.user)
        serializer.save(product=product)

class ProductVariantViewSet(viewsets.ModelViewSet):
    serializer_class = ProductVariantSerializer
    permission_classes = [permissions.IsAuthenticated, IsProductOwnerOrAdmin]

    def get_queryset(self):
        return ProductVariant.objects.filter(product__shop__owner=self.request.user)

    def perform_create(self, serializer):
        product_id = self.request.data.get('product')
        product = Product.objects.get(id=product_id, shop__owner=self.request.user)
        serializer.save(product=product)
