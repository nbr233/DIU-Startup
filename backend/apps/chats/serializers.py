from rest_framework import serializers
from .models import Chat, Message

class MessageSerializer(serializers.ModelSerializer):
    sender_name = serializers.ReadOnlyField(source='sender.get_full_name')

    class Meta:
        model = Message
        fields = '__all__'
        read_only_fields = ['sender', 'timestamp']

class ChatSerializer(serializers.ModelSerializer):
    customer_name = serializers.ReadOnlyField(source='customer.get_full_name')
    shop_name = serializers.ReadOnlyField(source='shop.name')
    unread_count = serializers.ReadOnlyField(source='unread_count_for_seller')
    last_message = serializers.SerializerMethodField()

    class Meta:
        model = Chat
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']

    def get_last_message(self, obj):
        last = obj.messages.last()
        if last:
            return {
                'text': last.text,
                'sender': last.sender.get_full_name(),
                'timestamp': last.timestamp
            }
        return None
