from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app) #Permite CORS en todas las rutas

@app.route('/')
def hello_world():
    return "Hello World!"

@app.route('/api/users')
def get_users():
    return{
        'users' : ['Alice', 'Dylan', 'Danger'] 
    }

if __name__== '__main__':
    app.run(debug=True)
