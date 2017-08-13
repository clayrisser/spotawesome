from api.services import auth_service
from api.policies import is_authed
from api.serializers.auth_serializer import (
    GitHubCallbackSerializer,
    UpdateAuthedUserSerializer
)
from api.exceptions.auth_exceptions import ProviderInvalid
from flask import jsonify, request, redirect, session
from nails import Controller, get_config
from api.services.oauth_service import github, github_to_user

class Login(Controller):
    @is_authed
    def get(self):
        access_token, user = auth_service.renew_access_token()
        return auth_service.resp_with_access_token(jsonify(user), access_token)

class User(Controller):
    method_decorators = [is_authed]

    def get(self):
        user = auth_service.get_authed_user()
        return jsonify(user)

    def put(self):
        data, err = UpdateAuthedUserSerializer().load(request.json)
        user = auth_service.update_authed_user(data)
        return jsonify(user)

class Provider(Controller):
    def get(self, provider):
        if provider == 'github':
            return github.authorize(callback=request.url_root + 'api/v1/auth/callback/github')
        raise ProviderInvalid(provider)

class Callback(Controller):
    def get(self, provider):
        if provider == 'github':
            data, err = GitHubCallbackSerializer().load(github.authorized_response())
            session['github_token'] = (data['access_token'], '')
            github_user = github.get('user')
            user_data = github_to_user(github_user.data)
            access_token, user = auth_service.oauth_register_or_login(user_data, 'github')
            return auth_service.resp_with_access_token(jsonify(user), access_token)
        raise ProviderInvalid(provider)
