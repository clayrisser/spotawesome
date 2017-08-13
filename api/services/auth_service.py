import jwt
from jwt.exceptions import ExpiredSignatureError, DecodeError
import datetime
from api.models import User
from api.exceptions.user_exceptions import UserNotFound, UserWithEmailExists
from api.exceptions.auth_exceptions import TokenInvalid, TokenExpired, LoggedOut, PasswordInvalid, RoleInvalid
from playhouse.shortcuts import model_to_dict
from nails import get_config
from flask import request, make_response

def register(email, password):
    if User.select().where(User.email == email).exists():
        raise UserWithEmailExists(email)
    user = User(email = email)
    user.hash_password(password)
    user.save()
    user_dict = model_to_dict(user)
    del user_dict['password']
    return get_access_token(user.id), user_dict

def login(email, password):
    user = User.select().where(User.email == email).first()
    if not user:
        raise UserNotFound('email', email)
    if not user.verify_password(password):
        raise PasswordInvalid(email)
    user_dict = model_to_dict(user)
    del user_dict['password']
    return get_access_token(user.id), user_dict

def renew_access_token():
    user_dict = get_authed_user()
    return get_access_token(user_dict['id']), user_dict

def get_authed_user_model():
    access_token = request.cookies.get('access_token')
    if not access_token:
        raise LoggedOut()
    payload = get_payload(access_token)
    authed_user = User.select().where(User.id == payload['user_id']).first()
    if not authed_user:
        raise LoggedOut()
    return authed_user

def get_authed_user():
    authed_user = get_authed_user_model()
    authed_user_dict = model_to_dict(authed_user)
    del authed_user_dict['password']
    return authed_user_dict

def get_access_token(user_id):
    return jwt.encode({
        'exp': datetime.datetime.utcnow() + datetime.timedelta(seconds=get_config('api', 'jwt.exp')),
        'user_id': user_id
    }, get_config('api', 'jwt.secret'), algorithm='HS256')

def get_payload(access_token):
    try:
        payload = jwt.decode(access_token, get_config('api', 'jwt.secret'), algorithm='HS256')
        if not payload or 'user_id' not in payload:
            raise TokenInvalid()
        return payload
    except ExpiredSignatureError:
        raise TokenExpired()
    except DecodeError:
        raise TokenInvalid()

def resp_with_access_token(data, access_token):
    response = make_response(data)
    domain = get_config('api', 'jwt.domain')
    response.set_cookie(
        key='access_token',
        value=access_token,
        secure=get_config('api', 'jwt.secure'),
        httponly=True,
        expires=datetime.datetime.utcnow() + datetime.timedelta(seconds=get_config('api', 'jwt.exp')),
        domain=(domain if domain else None)
    )
    return response

def update_authed_user(data):
    authed_user = get_authed_user_model()
    if 'email' in data:
        user = User.select().where(User.email == data['email']).first()
        if user:
            raise UserWithEmailExists(data['email'])
    if 'role' in data:
        if authed_user.role != 'super_admin':
            raise RoleInvalid('super_admin')
    if 'password' in data:
        authed_user.hash_password(data['password'])
        del data['password']
        authed_user.save()
    if len(data.keys()) > 0:
        User.update(**data).where(User.id == authed_user.id).execute()
    authed_user = User.select().where(User.id == authed_user.id).first()
    authed_user_dict = model_to_dict(authed_user)
    del authed_user_dict['password']
    return authed_user_dict
