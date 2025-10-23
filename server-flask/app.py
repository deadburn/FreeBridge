from flask import Flask
from flask_cors import CORS
from utils.db import db
from utils.config import Config

app = Flask(__name__)
app.config.from_object(Config)

CORS(
    app,
    resources={
        r"/api/*": {
            "origins": ["http://localhost:3000"],  # URL de React
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"],
        }
    },
)

db.init_app(app)

with app.app_context():
    db.create_all()
    print("✅ Base de datos conectada exitosamente")
    print("✅ API REST lista para React")
