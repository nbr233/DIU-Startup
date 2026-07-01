from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Chat, Message
from .serializers import ChatSerializer, MessageSerializer

class ChatViewSet(viewsets.ModelViewSet):
    serializer_class = ChatSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role in ('admin', 'superadmin'):
            return Chat.objects.all()
        elif user.role == 'seller':
            return Chat.objects.filter(shop__owner=user)
        return Chat.objects.filter(customer=user)

    def perform_create(self, serializer):
        # Allow starting chat room by specifying shop_id
        shop_id = self.request.data.get('shop')
        customer = self.request.user
        # Retrieve or create unique chat between shop and customer
        chat, created = Chat.objects.get_or_create(shop_id=shop_id, customer=customer)
        return chat

    @action(detail=True, methods=['get'])
    def messages(self, request, pk=None):
        chat = self.get_object()
        # Mark all messages sent by the other party as read
        chat.messages.exclude(sender=request.user).update(is_read=True)
        messages = chat.messages.all()
        serializer = MessageSerializer(messages, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'], url_path='send-message')
    def send_message(self, request, pk=None):
        chat = self.get_object()
        text = request.data.get('text', '')
        attachment = request.FILES.get('attachment')
        
        msg = Message.objects.create(
            chat=chat,
            sender=request.user,
            text=text,
            attachment=attachment
        )
        serializer = MessageSerializer(msg)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
