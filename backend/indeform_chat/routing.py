"""
This file is for routing to the consumer
"""
from django.urls import path, re_path

from . import consumers

websocket_urlpatterns = [
    path('ws/<int:room_id>/<str:token>', consumers.ChatConsumer.as_asgi()),
]