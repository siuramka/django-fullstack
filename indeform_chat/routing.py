"""
This file is for routing to the consumer
"""
from django.urls import path, re_path

from . import consumers

websocket_urlpatterns = [
    re_path(r'^ws/(?P<room_id>[^/]+)$', consumers.ChatConsumer.as_asgi()),
]