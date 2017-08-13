from api.services.auth_service import get_authed_user_model
from api.exceptions.auth_exceptions import RoleInvalid

def is_admin(func):
    def decorator(*args, **kwargs):
        authed_user = get_authed_user_model()
        if not authed_user.role or authed_user.role != 'admin':
            raise RoleInvalid('admin')
        return func(*args, **kwargs)
    return decorator