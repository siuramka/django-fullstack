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


# chatroom - post
# chatroom - get -> all user chatrooms
# chatroom/id - get -> get chatroom info
# chatroom/id/participants - get -> get chatroom participants
# chatroom/id/invitations - post -> send invitation


class ChatRoomListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return ChatRoomCreateSerializer
        elif self.request.method == 'GET':
            return ChatRoomSerializer

    def get_queryset(self):
        user = self.request.user
        return ChatRoom.objects.filter(creator=user) | ChatRoom.objects.filter(participants=user)

    def perform_create(self, serializer):
        participants = [self.request.user]
        serializer.save(creator=self.request.user,participants=participants)


class ChatRoomRetrieveView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated, CanRetrieveChatRoomPermission]
    queryset = ChatRoom.objects.all()
    serializer_class = ChatRoomSerializer


class ChatRoomCreateInvitationView(APIView):
    permission_classes = [IsAuthenticated, IsChatRoomOwner]

    def get_chatroom(self, pk):
        try:
            return ChatRoom.objects.get(pk=pk)
        except ChatRoom.DoesNotExist:
            raise Http404

    """_summary_
    Checks if invitation from user to receiver to chat room already exists
    """

    def get_invitation(self, sender_pk, receiver_pk, chat_room_pk):
        return Invitation.objects.get(chat_room=chat_room_pk, sender=sender_pk, receiver=receiver_pk)

    def get_user_by_email(self, email, sender_pk):
        return CustomUser.objects.exclude(pk=sender_pk).get(email=email)

    def post(self, request, pk, format=None):
        chatroom = self.get_chatroom(pk)
        sender_user = self.request.user

        try:
            invitation_receiver = self.get_user_by_email(request.data.get('email'), sender_user.pk)
        except CustomUser.DoesNotExist:
            return Response(status=status.HTTP_400_BAD_REQUEST)  # User not found

        try:
            self.get_invitation(sender_user.pk, invitation_receiver.pk, chatroom.pk)
            return Response(status=status.HTTP_400_BAD_REQUEST)  # Invitation already sent
        except Invitation.DoesNotExist:
            pass

        serializer = ChatRoomInvitationCreateSerializer(data={
            'chat_room': chatroom.pk,
            'sender': sender_user.pk,
            'receiver': invitation_receiver.pk
        })

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ChatRoomParticipantsView(APIView):
    permission_classes = [IsAuthenticated, CanRetrieveChatRoomPermission]

    def get(self, request, pk, format=None):
        chatroom = ChatRoom.objects.get(pk=pk)
        serializer = ChatRoomParticipantsSerializer(instance=chatroom)

        return Response(serializer.data, status=status.HTTP_200_OK)

