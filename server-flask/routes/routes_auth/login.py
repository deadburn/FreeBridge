from flask import Blueprint, request, jsonify, current_app
from models.modelo_usuarios import Usuario
from werkzeug.security import check_password_hash
import jwt
from datetime import datetime, timedelta

login_bp = Blueprint("login", __name__)


@login_bp.route("/api/login", methods=["POST", "OPTIONS"])
def login():
    """Inicio de sesión - Devuelve JWT token"""
    if request.method == "OPTIONS":
        return "", 200

    try:
        print("Iniciando proceso de login")
        data = request.get_json()
        print("Datos recibidos:", data)

        if not data:
            return jsonify({"error": "No se recibieron datos"}), 400

        correo = data.get("correo")
        contraseña = data.get("contraseña")

        if not correo or not contraseña:
            return jsonify({"error": "Correo y contraseña son requeridos"}), 400

        # Buscar usuario y loggear el resultado
        usuario = Usuario.query.filter_by(correo=correo).first()
        print("Usuario encontrado:", usuario)

        if not usuario:
            return jsonify({"error": "Usuario no encontrado"}), 401

        if not check_password_hash(usuario.contraseña, contraseña):
            return jsonify({"error": "Contraseña incorrecta"}), 401  # Generar JWT token
        token = jwt.encode(
            {
                "user_id": usuario.id_usu,
                "rol": usuario.rol,
                "exp": datetime.utcnow() + timedelta(hours=24),
            },
            current_app.config["SECRET_KEY"],
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
