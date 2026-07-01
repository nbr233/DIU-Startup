from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ShopViewSet, PaymentAccountViewSet, ShippingZoneViewSet

router = DefaultRouter()
router.register(r'accounts', PaymentAccountViewSet, basename='shop-payment-account')
router.register(r'shipping-zones', ShippingZoneViewSet, basename='shop-shipping-zone')
router.register(r'', ShopViewSet, basename='shop')

urlpatterns = [
    path('', include(router.urls)),
]
