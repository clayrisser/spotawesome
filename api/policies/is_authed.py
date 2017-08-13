from functools import wraps
from api.services.auth_service import get_authed_user

def is_authed(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        get_authed_user()
        return func(*args, **kwargs)
    return wrapper
