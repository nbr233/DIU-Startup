from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class Shop(models.Model):
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('pending', 'Pending Approval'),
        ('suspended', 'Suspended'),
    ]
    name = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    owner = models.OneToOneField(User, on_delete=models.CASCADE, related_name='shop')
    logo = models.ImageField(upload_to='shops/logos/', blank=True, null=True)
    banner = models.ImageField(upload_to='shops/banners/', blank=True, null=True)
    description = models.TextField(blank=True)
    category = models.CharField(max_length=100, blank=True)
    contact_email = models.EmailField(blank=True)
    contact_phone = models.CharField(max_length=20, blank=True)
    address = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    commission_rate = models.DecimalField(max_digits=5, decimal_places=2, default=6.00)
    social_links = models.JSONField(default=dict, blank=True)
    business_hours = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

    @property
    def total_revenue(self):
        from apps.orders.models import Order
        return Order.objects.filter(shop=self, status='delivered').aggregate(
            total=models.Sum('total'))['total'] or 0

    class Meta:
        ordering = ['-created_at']


class PaymentAccount(models.Model):
    METHOD_CHOICES = [
        ('bkash', 'bKash'),
        ('nagad', 'Nagad'),
        ('rocket', 'Rocket'),
        ('bank', 'Bank Transfer'),
    ]
    shop = models.ForeignKey(Shop, on_delete=models.CASCADE, related_name='payment_accounts')
    method = models.CharField(max_length=20, choices=METHOD_CHOICES)
    account_number = models.CharField(max_length=50)
    account_holder = models.CharField(max_length=200, blank=True)
    bank_name = models.CharField(max_length=200, blank=True)
    branch_name = models.CharField(max_length=200, blank=True)
    is_primary = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.shop.name} – {self.method} – {self.account_number}"


class ShippingZone(models.Model):
    shop = models.ForeignKey(Shop, on_delete=models.CASCADE, related_name='shipping_zones')
    zone_name = models.CharField(max_length=100)
    areas = models.TextField(help_text='Comma-separated list of areas')
    charge = models.DecimalField(max_digits=10, decimal_places=2)
    free_above = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    delivery_time = models.CharField(max_length=100)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.shop.name} – {self.zone_name}"
