from api.services.auth_service import get_authed_user_model
from api.exceptions.auth_exceptions import RoleInvalid

def is_admin(func):
    def decorator(*args, **kwargs):
        user = get_authed_user_model()
        if not user.role or user.role != 'admin':
            raise RoleInvalid('admin')
        return func(*args, **kwargs)
    return decorator
