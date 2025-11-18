"""
Blueprint para cancelar/eliminar postulaciones
"""

from flask import Blueprint, jsonify
from utils.db import db
from utils.auth import token_required
from models.modelo_postulacion import Postulacion
from models.modelo_freelancer import Freelancer

cancelar_postulacion_bp = Blueprint("cancelar_postulacion", __name__)


@cancelar_postulacion_bp.route(
    "/api/postulacion/cancelar/<id_post>", methods=["DELETE"]
)
@token_required
def cancelar_postulacion(current_user, id_post):
    """
    Permite al freelancer cancelar/eliminar una postulación
    Solo se pueden cancelar postulaciones pendientes
    """
    try:
        # Verificar que el usuario es freelancer
        freelancer = Freelancer.query.filter_by(id_usu=current_user.id_usu).first()
        if not freelancer:
            return (
                jsonify(
                    {
                        "success": False,
                        "error": "Solo los freelancers pueden cancelar postulaciones",
                    }
                ),
                403,
            )

        # Buscar la postulación
        postulacion = Postulacion.query.filter_by(id_post=id_post).first()
        if not postulacion:
            return (
                jsonify({"success": False, "error": "Postulación no encontrada"}),
                404,
            )

        # Verificar que la postulación pertenece al freelancer
        if postulacion.id_free != freelancer.id_free:
            return (
                jsonify(
                    {
                        "success": False,
                        "error": "No tienes permiso para cancelar esta postulación",
                    }
                ),
                403,
            )

        # Verificar que la postulación esté pendiente
        if postulacion.estado_post != "pendiente":
            return (
                jsonify(
                    {
                        "success": False,
                        "error": f"No puedes cancelar una postulación {postulacion.estado_post}",
                    }
                ),
                400,
            )

        # Eliminar la postulación
        db.session.delete(postulacion)
        db.session.commit()

        return (
            jsonify({"success": True, "message": "Postulación cancelada exitosamente"}),
            200,
        )

    except Exception as e:
        db.session.rollback()
        print(f"Error al cancelar postulación: {str(e)}")
        return jsonify({"success": False, "error": str(e)}), 500
