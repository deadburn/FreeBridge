from flask import Blueprint, request, jsonify
from models.modelo_usuarios import Usuario
from werkzeug.security import check_password_hash
import jwt
from datetime import datetime, timedelta
import app

login_bp = Blueprint("login", __name__, url_prefix="/api")


@login_bp.route("/login", methods=["POST"])
def login():
    """Inicio de sesión - Devuelve JWT token"""
    try:
        data = request.get_json()

        if not data or not data.get("correo") or not data.get("contraseña"):
            return jsonify({"error": "Correo y contraseña requeridos"}), 400

        usuario = Usuario.query.filter_by(correo=data["correo"]).first()

        if not usuario or not check_password_hash(
            usuario.contraseña, data["contraseña"]
        ):
            return jsonify({"error": "Credenciales incorrectas"}), 401

        # Generar JWT token
        token = jwt.encode(
            {
                "user_id": usuario.id_usu,
                "rol": usuario.rol,
                "exp": datetime.utcnow() + timedelta(hours=24),
            },
            app.config["SECRET_KEY"],
            algorithm="HS256",
        )

        return (
            jsonify(
                {
                    "mensaje": "Inicio de sesión exitoso",
                    "token": token,
                    "usuario": {
                        "id": usuario.id_usu,
                        "nombre": usuario.nombre,
                        "correo": usuario.correo,
                        "rol": usuario.rol,
                    },
                }
            ),
            200,
        )

    except Exception as e:
        return jsonify({"error": str(e)}), 500
