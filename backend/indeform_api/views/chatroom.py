from venv import create
from django.dispatch import receiver
from django.http import Http404
from rest_framework import generics, status
from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from indeform_api.permissions import CanRetrieveChatRoomPermission, IsChatRoomOwner
from indeform_api.serializers import (ChatRoomCreateSerializer, ChatRoomInvitationCreateSerializer,
                                      ChatRoomParticipantsSerializer, ChatRoomSerializer)

from indeform_base.models import ChatRoom, CustomUser, Invitation

class ChatRoomListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return ChatRoomCreateSerializer
        elif self.request.method == 'GET':
            return ChatRoomSerializer
        
    def get_queryset(self):
        user = self.request.user
        return ChatRoom.objects.filter(participants=user)

    def perform_create(self, serializer):
        participants = [self.request.user]
        serializer.save(creator=self.request.user, participants=participants)


class ChatRoomParticipantsView(APIView):
    permission_classes = [IsAuthenticated, CanRetrieveChatRoomPermission]

    def get(self, request, pk, format=None):
        chatroom = ChatRoom.objects.get(pk=pk)
        serializer = ChatRoomParticipantsSerializer(instance=chatroom)
        self.check_object_permissions(self.request, chatroom)
        return Response(serializer.data, status=status.HTTP_200_OK)

