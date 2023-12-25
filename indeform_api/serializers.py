from rest_framework import serializers  # Import the serializer class
from django.contrib.auth.password_validation import validate_password
from rest_framework.validators import UniqueValidator  # Import the validate_password function
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from indeform_base.models import ChatRoom, CustomUser, Invitation  # Import the TokenObtainPairSerializer class


class ChatRoomInvitationCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Invitation
        fields = ['id', 'sender', 'receiver', 'chat_room']


class ChatRoomCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatRoom
        fields = ['id', 'name']
        read_only_fields = ['creator']


class ChatRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatRoom
        fields = ['id', 'name', 'created_at']


class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email']


class ChatRoomParticipantsSerializer(serializers.ModelSerializer):
    participants = CustomUserSerializer(many=True)

    class Meta:
        model = ChatRoom
        fields = ['participants']


class InvitationUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Invitation
        fields = ['id', 'accepted']


class InvitationSerializer(serializers.ModelSerializer):
    sender = CustomUserSerializer()
    chat_room = ChatRoomSerializer()

    class Meta:
        model = Invitation
        fields = ['id', 'sender', 'accepted', 'chat_room']


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super(CustomTokenObtainPairSerializer, cls).get_token(user)

        token['username'] = user.username
        token['email'] = user.email

        return token


class RegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        required=True,
        validators=[UniqueValidator(queryset=CustomUser.objects.all())]
    )
    username = serializers.CharField(
        validators=[UniqueValidator(queryset=CustomUser.objects.all())]
    )
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = CustomUser
        fields = ('id', 'username', 'email', 'password', 'password2')
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs

    def create(self, validated_data):
        user = CustomUser.objects.create_user(validated_data['username'], validated_data['email'],
                                              validated_data['password'])

        return user
