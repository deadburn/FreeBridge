from flask import Blueprint, request, jsonify
from utils.db import db
from models.modelo_usuarios import Usuario
from werkzeug.security import generate_password_hash
import uuid

registro_bp = Blueprint("registro", __name__)


@registro_bp.route("/api/registro", methods=["POST", "OPTIONS"])
def registro():
    if request.method == "OPTIONS":
        return "", 200

    """Registro de usuario - Devuelve JSON"""
    try:
        print("Starting registration process")
        print("Request Headers:", dict(request.headers))
        print("Request Method:", request.method)

        if not request.is_json:
            print("Request is not JSON")
            return jsonify({"error": "Content-Type must be application/json"}), 400

        data = request.get_json()
        print("Received data:", data)  # Debug print

        # Validate data
        if not data or not all(k in data for k in ["nombre", "correo", "contraseña"]):
            print("Missing required fields")
            return jsonify({"error": "Missing required fields"}), 400

        # Crear nuevo usuario
        nuevo_usuario = Usuario(
            id_usu=str(uuid.uuid4())[:10],
            nombre=data["nombre"],
            correo=data["correo"],
            contraseña=generate_password_hash(data["contraseña"]),
            rol=data.get("rol", "FreeLancer"),
            estado="Activo",
        )

        db.session.add(nuevo_usuario)
        db.session.commit()

        return (
            jsonify(
                {
                    "mensaje": "Usuario registrado exitosamente",
                    "usuario": {
                        "id": nuevo_usuario.id_usu,
                        "nombre": nuevo_usuario.nombre,
                        "correo": nuevo_usuario.correo,
                        "rol": nuevo_usuario.rol,
                    },
                }
            ),
            201,
        )

    except Exception as e:
        db.session.rollback()
        print("Error in registration:", str(e))  # Debug print
        return jsonify({"error": str(e)}), 500
