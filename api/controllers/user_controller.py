from api.exceptions.user_exceptions import UserNotFound
from api.models import User
from api.serializers.user_serializer import *
from api.services import auth_service
from flask import jsonify, request
from nails import Controller
from nails.exceptions import Forbidden, BadRequest
from playhouse.shortcuts import model_to_dict

class UserInstance(Controller):
    def post(self):
        data, err = CreateUserSerializer().load(request.json)
        if User.select().where(User.email == data['email']).exists():
            raise Forbidden('User with email \'' + data['email'] + '\' already exists', {
                'email': data['email']
            })
        user = User(email = data['email'])
        user.hash_password(data['password'])
        user.save()
        user_dict = model_to_dict(user)
        del user_dict['password']
        return jsonify(user_dict)

    def put(self):
        data, err = UpdateUserSerializer().load(request.json)
        user = User.update(**data).where(User.id == data['id'])
        user.execute()
        user = User.select().where(User.id == data['id']).first()
        user_dict = model_to_dict(user)
        del user_dict['password']
        return jsonify(user_dict)

    def get(self):
        data, err = GetUserSerializer().load(request.args.to_dict())
        user = User.select().where(User.id == data['id']).first()
        if not user:
            raise UserNotFound(data['email'])
        user_dict = model_to_dict(user)
        del user_dict['password']
        return jsonify(user_dict)

class UserList(Controller):
    def get(self):
        return 'a list of users'
