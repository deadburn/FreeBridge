from flask import Blueprint, jsonify
from utils.auth import token_required
from models.modelo_freelancer import Freelancer
from models.modelo_postulacion import Postulacion

ver_postulacion_bp = Blueprint("ver_postulacion", __name__, url_prefix="/api")


@ver_postulacion_bp.route("/mis-postulaciones", methods=["GET"])
@token_required
def mis_postulaciones(current_user):
    """Ver postulaciones del freelancer autenticado"""
    try:
        if current_user.rol != "FreeLancer":
            return jsonify({"error": "Solo para freelancers"}), 403

        freelancer = Freelancer.query.filter_by(id_usu=current_user.id_usu).first()
        if not freelancer:
            return jsonify({"error": "Perfil no encontrado"}), 404

        postulaciones = Postulacion.query.filter_by(id_free=freelancer.id_free).all()

        resultado = [
            {
                "id": p.id_post,
                "estado": p.estado_post,
                "fecha": p.fecha_post.isoformat() if p.fecha_post else None,
                "vacante": (
                    {
                        "id": p.vacante.id_vac,
                        "nombre": p.vacante.nomb_vacante,
                        "empresa": (
                            p.vacante.empresa.usuario.nombre
                            if p.vacante.empresa
                            else None
                        ),
                    }
                    if p.vacante
                    else None
                ),
            }
            for p in postulaciones
        ]

        return jsonify({"postulaciones": resultado}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
