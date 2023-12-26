from django.http import Http404
from django.shortcuts import get_object_or_404
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from indeform_api.permissions import CanRetrieveChatRoomPermission, IsInvitationReceiver
from indeform_api.serializers import ChatRoomInvitationCreateSerializer, InvitationSerializer, InvitationUpdateSerializer
from indeform_base.models import ChatRoom, CustomUser, Invitation


class InvitationsView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = InvitationSerializer

    def get_queryset(self):
        return Invitation.objects.filter(receiver=self.request.user, accepted=False)


class InvitationsAcceptDenyView(APIView):
    permission_classes = [IsAuthenticated, IsInvitationReceiver]

    def add_user_to_channel_participant(self, user, channel): 
        channel.participants.add(user)
        channel.save()

    def put(self, request, pk, invitation_pk):
        invitation = get_object_or_404(Invitation, pk=invitation_pk, chat_room=pk, accepted=False)
        chat_room = get_object_or_404(ChatRoom, pk=pk)
        serializer = InvitationUpdateSerializer(invitation, data=request.data)

        self.check_object_permissions(request, invitation)

        if serializer.is_valid():
            serializer.save()
            self.add_user_to_channel_participant(self.request.user, chat_room)
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.error_messages, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, invitation_pk):
        invitation = get_object_or_404(Invitation, pk=invitation_pk, chat_room=pk, accepted=False)
        invitation.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class ChatRoomCreateInvitationView(APIView):
    """
    Checks if invitation from user to receiver to chat room already exists
    """
    permission_classes = [IsAuthenticated, CanRetrieveChatRoomPermission]
    def get_invitation(self, sender_pk, receiver_pk, chat_room_pk):
        return Invitation.objects.get(chat_room=chat_room_pk, sender=sender_pk, receiver=receiver_pk)

    def get_user_by_username(self, username, sender_pk):
        return CustomUser.objects.exclude(pk=sender_pk).get(username=username)

    def post(self, request, pk, format=None):
        chatroom = get_object_or_404(ChatRoom, pk=pk)
        sender_user = self.request.user
        
        self.check_object_permissions(request, chatroom)

        try:
            invitation_receiver = self.get_user_by_username(request.data.get('username'), sender_user.pk)
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