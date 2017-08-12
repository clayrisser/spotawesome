from api.services import user_service
from api.serializers.user_serializer import *
from flask import jsonify, request
from nails import Controller

class UserInstance(Controller):
    def post(self):
        data, err = CreateUserSerializer().load(request.json)
        user = user_service.create(data['email'], data['password'])
        return jsonify(user)

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
        return 'a list of users'
