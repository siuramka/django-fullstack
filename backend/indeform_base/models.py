from django.db import models
from django.contrib.auth.models import AbstractUser


class CustomUser(AbstractUser):
    pass


class ChatRoom(models.Model):
    name = models.CharField(max_length=100)
    creator = models.ForeignKey(CustomUser, related_name='chat_room_creator', on_delete=models.CASCADE)
    participants = models.ManyToManyField(CustomUser, related_name='chat_room_participants', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.creator.username} {self.id} {self.name}"


class Invitation(models.Model):
    sender = models.ForeignKey(CustomUser, related_name='invitation_sender', on_delete=models.CASCADE)
    receiver = models.ForeignKey(CustomUser, related_name='invitation_receiver', on_delete=models.CASCADE)
    accepted = models.BooleanField(default=False)
    chat_room = models.ForeignKey(ChatRoom, related_name='invitation_chat_room', on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.sender.username} -> {self.receiver.username} to {self.chat_room.name}"