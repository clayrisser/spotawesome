from nails.exceptions import Unauthorized

class TokenInvalid(Unauthorized):
    def __init__(self):
        self.message = 'Token invalid'
        Unauthorized.__init__(self)

class TokenExpired(Unauthorized):
    def __init__(self):
        self.message = 'Token expired'
        Unauthorized.__init__(self)
