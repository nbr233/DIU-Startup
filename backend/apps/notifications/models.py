from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class Notification(models.Model):
    TYPE_CHOICES = [
        ('order', 'Order Update'),
        ('payment', 'Payment'),
        ('review', 'Review'),
        ('shop', 'Shop'),
        ('system', 'System'),
        ('promotion', 'Promotion'),
        ('seller', 'Seller'),
        ('security', 'Security'),
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    notif_type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    title = models.CharField(max_length=200)
    message = models.TextField()
    link = models.CharField(max_length=300, blank=True)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"[{self.notif_type}] {self.title} → {self.user.email}"

    class Meta:
        ordering = ['-created_at']
