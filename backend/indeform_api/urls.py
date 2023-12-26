from django.urls import path

from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

from .views.chatroom import ChatRoomListCreateView, \
    ChatRoomParticipantsView

from .views.auth import CustomTokenObtainPairView, RegisterView
from .views.invitation import InvitationsView,  InvitationsAcceptDenyView, ChatRoomCreateInvitationView

urlpatterns = [
    path('auth/register', RegisterView.as_view(), name='register'),
    path('auth/login', CustomTokenObtainPairView.as_view(), name='obtain_token'),
    path('auth/refresh', TokenRefreshView.as_view(), name='refresh_token'),
    path('chatrooms', ChatRoomListCreateView.as_view(), name='chatroom_create'),
    path('chatrooms/<int:pk>/participants', ChatRoomParticipantsView.as_view(), name='chatroom_participants'),
    path('chatrooms/<int:pk>/invitations', ChatRoomCreateInvitationView.as_view(), name='chatroom_invitation'),
    path('chatrooms/<int:pk>/invitations/<int:invitation_pk>', InvitationsAcceptDenyView.as_view(),
         name='chatroom_invitation_accept_deny'),
    path('chatrooms/invitations', InvitationsView.as_view(), name='chatroom_invitations'),
]