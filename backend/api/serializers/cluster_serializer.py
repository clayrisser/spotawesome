from marshmallow import fields, pre_load, post_load, ValidationError
from nails import Serializer

class ClusterSerializer(Serializer):
    provider = fields.Str()

class AwsClusterSerializer(ClusterSerializer):
    pass
