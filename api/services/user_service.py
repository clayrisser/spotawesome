from api.exceptions.user_exceptions import UserNotFound, UserWithEmailExists
from api.models import User
from api.services.peewee_service import query_from_dict
from playhouse.shortcuts import model_to_dict

def create(email, password):
    if User.select().where(User.email == email).exists():
        raise UserWithEmailExists(email)
    user = User(email = email)
    user.hash_password(password)
    user.save()
    user_dict = model_to_dict(user)
    del user_dict['password']
    return user_dict

def update(id, data):
    user = User.select().where(User.id == id).first()
    if not user:
        raise UserNotFound(data.keys()[0], data[data.keys()[0]])
    if 'email' in data:
        user = User.select().where(User.email == data['email']).first()
        if user:
            raise UserWithEmailExists(data['email'])
    user = User.update(**data).where(User.id == id)
    user.execute()
    user = User.select().where(User.id == id).first()
    user_dict = model_to_dict(user)
    del user_dict['password']
    return user_dict

def find_one(data):
    user = User.select().where(*query_from_dict(User, data)).first()
    if not user:
        raise UserNotFound(data.keys()[0], data[data.keys()[0]])
    user_dict = model_to_dict(user)
    del user_dict['password']
    return user_dict
