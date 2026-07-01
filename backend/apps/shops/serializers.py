from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Shop, PaymentAccount, ShippingZone

User = get_user_model()

class PaymentAccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentAccount
        fields = '__all__'
        read_only_fields = ['shop']

class ShippingZoneSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShippingZone
        fields = '__all__'
        read_only_fields = ['shop']

class ShopSerializer(serializers.ModelSerializer):
    owner_name = serializers.ReadOnlyField(source='owner.get_full_name')
    owner_email = serializers.ReadOnlyField(source='owner.email')
    payment_accounts = PaymentAccountSerializer(many=True, read_only=True)
    shipping_zones = ShippingZoneSerializer(many=True, read_only=True)

    class Meta:
        model = Shop
        fields = '__all__'
        read_only_fields = ['owner', 'status', 'commission_rate', 'created_at']
