import json
from asgiref.sync import sync_to_async

from channels.auth import login, logout
from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from django.contrib.auth.models import AnonymousUser
from rest_framework_simplejwt import exceptions
from rest_framework_simplejwt.tokens import AccessToken, Token


class ChatConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        room_name = self.scope['url_route']['kwargs']['room_name']
        headers = dict(self.scope['headers'])
        token = headers[b'bearer'].decode()
        decoded_token = await self.decode_jwt(token)
        print(f" payload: {decoded_token.attributes}")
        user = await self.get_user_from_token(decoded_token)
        print(f"user {user}")





        return;
        if user.is_authenticated:
            self.room_name = self.scope['url_route']['kwargs']['room_name']
            # self.room_group_name = 'chat_%s' % self.room_name
            self.room_group_name = f"chat_{self.room_name}"

            # Join room group
            await self.channel_layer.group_add(
                self.room_group_name,
                self.channel_name
            )
            await self.accept()

        else:
            await self.send({"close": True})

    async def disconnect(self, close_code):
        """
        Disconnect from channel

        :param close_code: optional
        """
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        """
        Receive messages from WebSocket

        :param text_data: message
        """

        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        username = text_data_json['username']
        profile_pic = text_data_json['profile_pic']
        room = text_data_json['room']


        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message,
                'username': username,
                'room': room,
            }
        )

    async def chat_message(self, event):
        """
        Receive messages from room group

        :param event: Events to pick up
        """
        message = event['message']
        username = event['username']
        profile_pic = event['profile_pic']
        room = event['room']

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'message': message,
            'username': username,
            'profile_pic': profile_pic,
            'room': room,
        }))

    @database_sync_to_async
    def decode_jwt(self, token):
        return AccessToken(token)