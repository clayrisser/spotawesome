from marshmallow.fields import *
from nails import Serializer

class CreateUserSerializer(Serializer):
    email = Email(required=True)
    password = Str(required=True)

class UpdateUserSerializer(Serializer):
    id = Str(required=True)
    email = Email()

class GetUserSerializer(Serializer):
    id = Str(required=True)
