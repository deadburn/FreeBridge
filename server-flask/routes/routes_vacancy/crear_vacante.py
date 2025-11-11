from flask import Blueprint, request, jsonify
from utils.auth import token_required
from utils.db import db
from models.modelo_vacante import Vacante
from models.modelo_empresa import Empresa
import uuid

crear_vacante_bp = Blueprint("crear_vacante", __name__, url_prefix="/api")


@crear_vacante_bp.route("/crear-vacantes", methods=["POST"])
@token_required
def crear_vacante(current_user):
    """Crear una nueva vacante"""
    try:
        if current_user.rol != "Empresa":
            return jsonify({"error": "Solo empresas pueden crear vacantes"}), 403

        data = request.get_json()

        empresa = Empresa.query.filter_by(id_usu=current_user.id_usu).first()
        if not empresa:
            return jsonify({"error": "Perfil de empresa no encontrado"}), 404

        nueva_vacante = Vacante(
            id_vac=str(uuid.uuid4())[:11],
            id_emp=empresa.id_emp,
            nomb_vacante=data["nombre"],
            descripcion=data["descripcion"],
            requisitos=data["requisitos"],
            salario=data.get("salario"),
            estado_vac="abierta",
        )

        db.session.add(nueva_vacante)
        db.session.commit()

        return (
            jsonify(
                {
                    "mensaje": "Vacante creada exitosamente",
                    "vacante": {
                        "id": nueva_vacante.id_vac,
                        "nombre": nueva_vacante.nomb_vacante,
                    },
                }
            ),
            201,
        )

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
