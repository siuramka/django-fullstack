import json

from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from django.contrib.auth.models import User
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import AccessToken

from indeform_base.models import CustomUser, ChatRoom


class ChatConsumer(AsyncWebsocketConsumer):

    def __init__(self, *args, **kwargs):
        super().__init__(args, kwargs)
        self.room_group_name = None

    async def connect(self):
        room_id = self.scope['url_route']['kwargs']['room_id']
        headers = dict(self.scope['headers'])
        token = headers[b'bearer'].decode()
        decoded_token = await self.decode_jwt(token)

        try:
            user = await self.get_user_from_token(decoded_token)
            await self.get_participating_sender_user(room_id, user.id)
        except User.DoesNotExist:
            await self.send({"close": True})
        except TokenError:
            await self.send({"close": True})
        except ChatRoom.DoesNotExist:
            await self.send({"close": True})
        except CustomUser.DoesNotExist:
            await self.send({"close": True})

        self.room_group_name = f"chat_{room_id}"

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        sender_email = text_data_json['sender_email']

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message,
                'sender_email': sender_email
            }
        )

    async def chat_message(self, event):
        message = event['message']
        sender_email = event['sender_email']

        await self.send(text_data=json.dumps({
            'text': message,
            'sender_email': sender_email
        }))

    @database_sync_to_async
    def decode_jwt(self, token):
        return AccessToken(token)

    @database_sync_to_async
    def get_user_from_token(self, token):
        user_id = token.payload['user_id']
        email = token.payload['email']
        username = token.payload['username']
        return CustomUser.objects.get(pk=user_id, email=email, username=username)

    @database_sync_to_async
    def get_participating_sender_user(self, chatroom_id, sender_user_id):
        """
        Check if user is a chatroom participant / Check if Chatroom exists
        """
        return ChatRoom.objects.get(pk=chatroom_id).participants.get(id=sender_user_id)
