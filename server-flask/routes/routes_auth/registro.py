from flask import Blueprint, request, jsonify
from utils.db import db
from models.modelo_usuarios import Usuario
from werkzeug.security import generate_password_hash
import uuid

registro_bp = Blueprint("registro", __name__, url_prefix="/api")


@registro_bp.route("/registro", methods=["POST"])
def registro():
    """Registro de usuario - Devuelve JSON"""
    try:
        data = request.get_json()

        # Validar datos
        if (
            not data
            or not data.get("nombre")
            or not data.get("correo")
            or not data.get("contraseña")
        ):
            return jsonify({"error": "Datos incompletos"}), 400

        # Verificar si el usuario ya existe
        usuario_existente = Usuario.query.filter_by(correo=data["correo"]).first()
        if usuario_existente:
            return jsonify({"error": "El correo ya está registrado"}), 409

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
        return jsonify({"error": str(e)}), 500
