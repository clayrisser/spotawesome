from nails.exceptions import NotFound, Forbidden

class UserNotFound(NotFound):
    def __init__(self, field_name, field_data):
        self.message = 'User with ' + field_name + ' \'' + field_data + '\' not found'
        payload = {}
        payload[field_name] = field_data
        NotFound.__init__(
            self,
            self.message,
            payload
        )

class UserWithEmailExists(Forbidden):
    def __init__(self, email):
        self.message = 'User with email \'' + email + '\' already exists'
        payload = {
            'email': email
        }
        Forbidden.__init__(
            self,
            self.message,
            payload
        )
