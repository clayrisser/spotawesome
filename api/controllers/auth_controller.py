from api.services import auth_service
from api.serializers.auth_serializer import (
    LoginSerializer,
    RegisterSerializer
)
from flask import jsonify, request, make_response
from nails import Controller

class Register(Controller):
    def post(self):
        data, err = RegisterSerializer().load(request.json)
        access_token, user = auth_service.register(data['email'], data['password'])
        response = make_response(jsonify(user))
        response.set_cookie('access_token', access_token)
        return response

class Login(Controller):
    def post(self):
        data, err = LoginSerializer().load(request.json)
        access_token, user = auth_service.login(data['email'], data['password'])
        response = make_response(jsonify(user))
        response.set_cookie('access_token', access_token)
        return response

    def get(self):
        access_token, user = auth_service.renew_access_token()
        response = make_response(jsonify(user))
        response.set_cookie('access_token', access_token)
        return response
