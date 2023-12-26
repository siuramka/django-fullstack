"""
ASGI config for chat_app_django project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.0/howto/deployment/asgi/
"""


import os

from django.core.asgi import get_asgi_application

# ******************** #
import indeform_chat.routing

from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import AllowedHostsOriginValidator
from django.core.asgi import get_asgi_application

# ******************** #


os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'indeform.settings')

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket":
        URLRouter(
            indeform_chat.routing.websocket_urlpatterns
        )
})
