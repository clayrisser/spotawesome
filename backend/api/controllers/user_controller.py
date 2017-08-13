from api.services import user_service
from api.serializers.user_serializer import (
    UpdateUserSerializer,
    GetUserSerializer
)
from api.policies import is_authed, is_admin
from flask import jsonify, request
from nails import Controller

class UserInstance(Controller):
    method_decorators = [is_authed]

    @is_admin
    def put(self):
        data, err = UpdateUserSerializer().load(request.json)
        user = user_service.update(data['id'], data)
        return jsonify(user)

    def get(self):
        data, err = GetUserSerializer().load(request.args.to_dict())
        user = user_service.find_one(data)
        return jsonify(user)

class UserList(Controller):
    def get(self):
        self.method_decorators = [is_authed, is_admin]
        return 'a list of users'
