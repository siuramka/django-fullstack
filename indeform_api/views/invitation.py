from django.shortcuts import get_object_or_404
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from indeform_api.permissions import IsInvitationReceiver
from indeform_api.serializers import InvitationSerializer, InvitationUpdateSerializer
from indeform_base.models import Invitation


class InvitationsView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = InvitationSerializer

    def get_queryset(self):
        return Invitation.objects.filter(receiver=self.request.user)


class InvitationsAcceptDenyView(APIView):
    permission_classes = [IsAuthenticated, IsInvitationReceiver]

    def put(self, request, pk, invitation_pk):
        invitation = get_object_or_404(Invitation, pk=invitation_pk, chat_room=pk, accepted=False)
        serializer = InvitationUpdateSerializer(invitation, data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.error_messages, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, invitation_pk):
        invitation = get_object_or_404(Invitation, pk=invitation_pk, chat_room=pk, accepted=False)
        invitation.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
