from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class Banner(models.Model):
    TYPE_CHOICES = [
        ('hero', 'Hero Slider'),
        ('offer', 'Offer Banner'),
        ('popup', 'Popup Banner'),
    ]
    title = models.CharField(max_length=200)
    image = models.ImageField(upload_to='banners/')
    banner_type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='hero')
    link_url = models.URLField(blank=True)
    subtitle = models.CharField(max_length=300, blank=True)
    button_text = models.CharField(max_length=50, blank=True, default='Shop Now')
    display_order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} ({self.banner_type})"

    class Meta:
        ordering = ['display_order', '-created_at']
