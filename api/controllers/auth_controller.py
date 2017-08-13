from api.services import auth_service
from api.serializers.auth_serializer import (
    LoginSerializer,
    RegisterSerializer
)
from flask import jsonify, request
from nails import Controller, get_config

class Register(Controller):
    def post(self):
        data, err = RegisterSerializer().load(request.json)
        access_token, user = auth_service.register(data['email'], data['password'])
        return auth_service.resp_with_access_token(jsonify(user), access_token)

class Login(Controller):
    def post(self):
        data, err = LoginSerializer().load(request.json)
        access_token, user = auth_service.login(data['email'], data['password'])
        return auth_service.resp_with_access_token(jsonify(user), access_token)

    def get(self):
        access_token, user = auth_service.renew_access_token()
        return auth_service.resp_with_access_token(jsonify(user), access_token)
