from api.services import user_service, auth_service
from api.serializers.user_serializer import (
    UpdateUserSerializer,
    GetUserSerializer,
    UserSerializer
)
from api.policies import is_authed, is_admin
from flask import jsonify, request
from nails import Controller
from playhouse.shortcuts import model_to_dict

class UserInstance(Controller):
    method_decorators = [is_authed]

    @is_admin
    def put(self):
        data, err = UpdateUserSerializer().load(request.json)
        user = user_service.update(data['id'], data)
        return jsonify(UserSerializer.load(model_to_dict(user))[0])

    def get(self):
        load_only = list()
        if not auth_service.has_admin_role():
            load_only.append('email')
        data, err = GetUserSerializer(load_only=load_only).load(request.args.to_dict())
        user = user_service.find_one(data)
        return jsonify(UserSerializer().load(model_to_dict(user))[0])

class UserList(Controller):
    method_decorators = [is_authed]

    def get(self):
        load_only = list()
        if not auth_service.has_admin_role():
            load_only.append('email')
        users = user_service.find();
        return jsonify(UserSerializer(many=True, load_only=load_only).dump(users)[0])
