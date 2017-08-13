class BadRequest(Exception):
    message = 'Bad request'
    payload = None
    status = 400

    def __init__(self, message=None, payload=None, status=None):
        Exception.__init__(self)
        if message is not None:
            self.message = message
        if status is not None:
            self.status = status
        if payload is not None:
            self.payload = payload

    def to_dict(self):
        response = {
            'message': self.message,
            'status': self.status
        }
        if payload:
            response['payload'] = payload

class Unauthorized(BadRequest):
    message = 'Unauthorized'
    status = 401

class Forbidden(BadRequest):
    message = 'Forbidden'
    status = 403

class NotFound(BadRequest):
    message = 'Not found'
    status = 404

class MethodNotAllowed(BadRequest):
    message = 'Method not allowed'
    status = 405

class BadImplementation(BadRequest):
    message = 'Bad implementation'
    status = 500
