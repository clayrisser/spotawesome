from api.services.auth_service import has_admin_role
from api.exceptions.auth_exceptions import RoleInvalid

def is_admin(func):
    def decorator(*args, **kwargs):
        if not has_admin_role():
            raise RoleInvalid('admin')
        return func(*args, **kwargs)
    return decorator
