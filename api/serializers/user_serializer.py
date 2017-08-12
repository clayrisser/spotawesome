from marshmallow.fields import *
from nails import Serializer

class CreateUserSerializer(Serializer):
    email = Email(required=True)
    password = Str(required=True)

class GetUserSerializer(Serializer):
    email = Email(required=True)
