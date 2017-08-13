from marshmallow import fields, pre_load, post_load, ValidationError
from nails import Serializer

class UpdateUserSerializer(Serializer):
    id = fields.Field(required=True)
    email = fields.Email()
    password = fields.Str()

class GetUserSerializer(Serializer):
    id = fields.Field()
    email = fields.Str()

    @post_load
    def post_load(self, data):
        if (not 'id' in data) and (not 'email' in data):
            raise ValidationError('Missing data for required \'email\' or \'id\' field', data)
