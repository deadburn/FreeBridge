from flask import request, jsonify, current_app
import jwt
from models.modelo_usuarios import Usuario
from functools import wraps


def token_required(f):
    """Decorador para proteger rutas que requieren autenticación"""

    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get("Authorization")

        if not token:
            return jsonify({"error": "Token faltante"}), 401

        try:
            # Remover 'Bearer ' si está presente
            if token.startswith("Bearer "):
                token = token[7:]

            data = jwt.decode(
                token, current_app.config["SECRET_KEY"], algorithms=["HS256"]
            )
            current_user = Usuario.query.get(data["user_id"])

            if not current_user:
                return jsonify({"error": "Usuario no encontrado"}), 401

        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token expirado"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"error": "Token inválido"}), 401

        return f(current_user, *args, **kwargs)

    return decorated
