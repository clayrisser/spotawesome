import jwt
from jwt.exceptions import ExpiredSignatureError, DecodeError
import datetime
from api.models import User
from api.exceptions.user_exceptions import UserNotFound, UserWithEmailExists
from api.exceptions.auth_exceptions import TokenInvalid, TokenExpired
from nails.exceptions import Unauthorized
from playhouse.shortcuts import model_to_dict
from nails import get_config
from flask import request

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
        raise Unauthorized('Invalid password for user with email \'' + email + '\'', {
            'email': email
        })
    user_dict = model_to_dict(user)
    del user_dict['password']
    return get_access_token(user.id), user_dict

def renew_access_token():
    user = get_authed_user()
    user_dict = model_to_dict(user)
    del user_dict['password']
    return get_access_token(user.id), user_dict

def get_authed_user():
    access_token = request.cookies.get('access_token')
    if not access_token:
        raise Unauthorized()
    payload = get_payload(access_token)
    user = User.select().where(User.id == payload['user_id']).first()
    if not user:
        raise Unauthorized()
    return user

def get_access_token(user_id):
    print(get_config('api', 'jwt.secret'))
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
