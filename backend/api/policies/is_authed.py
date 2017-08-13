from api.services.auth_service import get_authed_user_model

def is_authed(func):
    def decorator(*args, **kwargs):
        get_authed_user_model()
        return func(*args, **kwargs)
    return decorator
