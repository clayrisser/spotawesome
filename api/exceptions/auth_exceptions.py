from nails.exceptions import Unauthorized

class TokenInvalid(Unauthorized):
    def __init__(self):
        self.message = 'Token invalid'
        Unauthorized.__init__(self)

class TokenExpired(Unauthorized):
    def __init__(self):
        self.message = 'Token expired'
        Unauthorized.__init__(self)

class LoggedOut(Unauthorized):
    def __init__(self):
        self.message = 'Not logged in'
        Unauthorized.__init__(self)

class PasswordInvalid(Unauthorized):
    def __init__(self, email):
        Unauthorized.__init__(self, 'Invalid password for user with email \'' + email + '\'', {
            'email': email
        })

class RoleInvalid(Unauthorized):
    def __init__(self, role):
        Unauthorized.__init__(self, 'User must have role \'' + role + '\'', {
            'role': role
        })
