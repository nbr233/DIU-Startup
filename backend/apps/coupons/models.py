from django.db import models
from apps.shops.models import Shop


class Coupon(models.Model):
    TYPE_CHOICES = [
        ('percent', 'Percentage'),
        ('fixed', 'Fixed Amount'),
    ]
    code = models.CharField(max_length=50, unique=True)
    discount_type = models.CharField(max_length=10, choices=TYPE_CHOICES)
    value = models.DecimalField(max_digits=10, decimal_places=2)
    min_order = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    max_discount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    usage_limit = models.PositiveIntegerField(null=True, blank=True)
    used_count = models.PositiveIntegerField(default=0)
    start_date = models.DateTimeField(null=True, blank=True)
    expiry_date = models.DateTimeField()
    is_active = models.BooleanField(default=True)
    applicable_shops = models.ManyToManyField(Shop, blank=True, related_name='coupons',
                                               help_text='Leave empty for platform-wide coupon')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.code} – {self.value}{'%' if self.discount_type == 'percent' else '৳'}"

    def is_valid(self):
        from django.utils import timezone
        if not self.is_active:
            return False, 'Coupon is inactive.'
        if self.expiry_date < timezone.now():
            return False, 'Coupon has expired.'
        if self.usage_limit and self.used_count >= self.usage_limit:
            return False, 'Coupon usage limit reached.'
        return True, 'Valid'
