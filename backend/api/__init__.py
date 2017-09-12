from nails import init_app
from flask_cors import CORS, cross_origin

app = None
app = init_app(__file__, '/api/v1/')
CORS(
    app,
    origins=['http://localhost:3000'],
    allow_headers='*',
    methods='*',
    supports_credentials=True
)

@app.route('/api/')
def app_api():
    return 'Hello, Nails.py!'

@app.route('/api/v1/')
def app_v1():
    return 'Hello, Nails.py v1!'
