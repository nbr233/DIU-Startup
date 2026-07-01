import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from .models import Chat, Message

User = get_user_model()


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.chat_id = self.scope['url_route']['kwargs']['chat_id']
        self.room_group_name = f'chat_{self.chat_id}'

        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        message_text = data.get('message', '')
        sender_id = data.get('sender_id')

        saved = await self.save_message(sender_id, message_text)

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message_text,
                'sender_id': sender_id,
                'sender_name': saved['sender_name'],
                'timestamp': saved['timestamp'],
                'id': saved['id'],
            }
        )

    async def chat_message(self, event):
        await self.send(text_data=json.dumps(event))

    @database_sync_to_async
    def save_message(self, sender_id, text):
        try:
            chat = Chat.objects.get(id=self.chat_id)
            sender = User.objects.get(id=sender_id)
            msg = Message.objects.create(chat=chat, sender=sender, text=text)
            return {
                'id': msg.id,
                'sender_name': sender.get_full_name(),
                'timestamp': msg.timestamp.isoformat(),
            }
        except Exception as e:
            return {'id': None, 'sender_name': 'Unknown', 'timestamp': '', 'error': str(e)}
