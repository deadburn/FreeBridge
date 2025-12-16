from flask import Blueprint, jsonify
from utils.auth import token_required

perfil_bp = Blueprint("ver_perfil", __name__, url_prefix="/api")


@perfil_bp.route("/perfil", methods=["GET"])
@token_required
def obtener_perfil(current_user):
    """Obtener datos del usuario autenticado"""
    try:
        perfil = {
            "id": current_user.id_usu,
            "nombre": current_user.nombre,
            "correo": current_user.correo,
            "rol": current_user.rol,
            "estado": current_user.estado,
        }

        if current_user.rol == "FreeLancer" and current_user.freelancer:
            perfil["freelancer"] = {
                "profesion": current_user.freelancer.profesion,
                "experiencia": current_user.freelancer.experiencia,
                "hoja_vida": current_user.freelancer.hoja_vida,
            }
        elif current_user.rol == "Empresa" and current_user.empresa:
            perfil["empresa"] = {
                "nombre": current_user.nombre,  # El nombre viene del usuario, no de empresa
                "nit": current_user.empresa.NIT,
                "tamaño": current_user.empresa.tamaño,
                "descripcion": current_user.empresa.desc_emp,
            }

        return jsonify(perfil), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
