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
        email = data['email']
        password = data['password']
        if User.select().where(User.email == email).exists():
            raise Forbidden('User with email \'' + email + '\' already exists', {
                'email': email
            })
        user = User(email = email)
        user.hash_password(password)
        user.save()
        user_dict = model_to_dict(user)
        del user_dict['password']
        return jsonify(user_dict)

    def get(self):
        data, err = GetUserSerializer().load(request.args.to_dict())
        email = data['email']
        user = User.select().where(User.email == email).first()
        if not user:
            raise UserNotFound(email)
        user_dict = model_to_dict(user)
        del user_dict['password']
        return jsonify(user_dict)

class UserList(Controller):
    def get(self):
        return 'a list of users'
