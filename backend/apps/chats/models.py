from django.db import models
from django.contrib.auth import get_user_model
from apps.shops.models import Shop

User = get_user_model()


class Chat(models.Model):
    shop = models.ForeignKey(Shop, on_delete=models.CASCADE, related_name='chats')
    customer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='chats')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.customer.get_full_name()} <-> {self.shop.name}"

    class Meta:
        unique_together = ['shop', 'customer']
        ordering = ['-updated_at']

    @property
    def unread_count_for_seller(self):
        return self.messages.filter(is_read=False).exclude(sender=self.shop.owner).count()


class Message(models.Model):
    chat = models.ForeignKey(Chat, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_messages')
    text = models.TextField(blank=True)
    attachment = models.FileField(upload_to='chat/attachments/', blank=True, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.sender.get_full_name()}: {self.text[:50]}"

    class Meta:
        ordering = ['timestamp']
