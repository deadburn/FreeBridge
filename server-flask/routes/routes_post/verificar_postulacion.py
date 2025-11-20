from flask import Blueprint, jsonify
from utils.auth import token_required
from models.modelo_freelancer import Freelancer
from models.modelo_postulacion import Postulacion

verificar_postulacion_bp = Blueprint(
    "verificar_postulacion", __name__, url_prefix="/api"
)


@verificar_postulacion_bp.route("/verificar-postulacion/<id_vac>", methods=["GET"])
@token_required
def verificar_postulacion(current_user, id_vac):
    """Verificar si el freelancer ya se postuló a una vacante específica"""
    try:
        if current_user.rol != "FreeLancer":
            return jsonify({"postulado": False}), 200

        freelancer = Freelancer.query.filter_by(id_usu=current_user.id_usu).first()
        if not freelancer:
            return jsonify({"postulado": False}), 200

        # Verificar si existe postulación
        postulacion = Postulacion.query.filter_by(
            id_free=freelancer.id_free, id_vac=id_vac
        ).first()

        return (
            jsonify(
                {
                    "postulado": postulacion is not None,
                    "estado": postulacion.estado_post if postulacion else None,
                }
            ),
            200,
        )

    except Exception as e:
        return jsonify({"error": str(e)}), 500
