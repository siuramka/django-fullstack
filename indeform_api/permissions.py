from rest_framework.permissions import BasePermission

'''
Checks if user is the creator of the chat room or is a participant of the chat room
'''
class CanRetrieveChatRoomPermission(BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.creator == request.user or request.user in obj.participants.all()
    
class IsChatRoomOwner(BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.creator == request.user

class IsInvitationReceiver(BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.receiver == request.user