from flask import Blueprint, jsonify
from utils.auth import token_required
from models.modelo_vacante import Vacante
from models.modelo_freelancer import Freelancer
from models.modelo_postulacion import Postulacion
from utils.db import db
import uuid

postulacion_bp = Blueprint("postulacion", __name__, url_prefix="/api")


@postulacion_bp.route("/postular/<id_vac>", methods=["POST"])
@token_required
def postular(current_user, id_vac):
    """Postularse a una vacante (solo freelancers)"""
    try:
        if current_user.rol != "FreeLancer":
            return jsonify({"error": "Solo freelancers pueden postularse"}), 403

        freelancer = Freelancer.query.filter_by(id_usu=current_user.id_usu).first()
        if not freelancer:
            return jsonify({"error": "Perfil de freelancer no encontrado"}), 404

        vacante = Vacante.query.get(id_vac)
        if not vacante:
            return jsonify({"error": "Vacante no encontrada"}), 404

        # Verificar si ya se postuló
        postulacion_existente = Postulacion.query.filter_by(
            id_free=freelancer.id_free, id_vac=id_vac
        ).first()

        if postulacion_existente:
            return jsonify({"error": "Ya te has postulado a esta vacante"}), 409

        # Crear nueva postulación
        nueva_postulacion = Postulacion(
            id_post=str(uuid.uuid4())[:10],
            id_free=freelancer.id_free,
            id_vac=id_vac,
            estado_post="pendiente",
        )

        db.session.add(nueva_postulacion)
        db.session.commit()

        return (
            jsonify(
                {
                    "mensaje": "Postulación enviada exitosamente",
                    "postulacion": {
                        "id": nueva_postulacion.id_post,
                        "estado": nueva_postulacion.estado_post,
                    },
                }
            ),
            201,
        )

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
