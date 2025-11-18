"""
Blueprint para notificaciones de cambios en postulaciones
"""

from flask import Blueprint, jsonify
from utils.db import db
from utils.auth import token_required
from models.modelo_postulacion import Postulacion
from models.modelo_freelancer import Freelancer
from models.modelo_vacante import Vacante
from datetime import datetime, timedelta

notificaciones_bp = Blueprint("notificaciones", __name__)


@notificaciones_bp.route("/api/postulaciones/cambios-recientes", methods=["GET"])
@token_required
def obtener_cambios_recientes(current_user):
    """
    Obtiene postulaciones que cambiaron de estado recientemente (últimas 24 horas)
    para mostrar notificación al freelancer
    """
    try:
        # Obtener el freelancer del usuario actual
        freelancer = Freelancer.query.filter_by(id_usu=current_user.id_usu).first()

        if not freelancer:
            return jsonify({"success": True, "cambios": []}), 200

        # Buscar postulaciones aceptadas o rechazadas en las últimas 24 horas
        # Como no tenemos campo de fecha de actualización, mostraremos todas las aceptadas/rechazadas
        postulaciones_actualizadas = Postulacion.query.filter(
            Postulacion.id_free == freelancer.id_free,
            Postulacion.estado_post.in_(["aceptada", "rechazada"]),
        ).all()

        cambios = []
        for post in postulaciones_actualizadas:
            vacante = Vacante.query.filter_by(id_vac=post.id_vac).first()
            if vacante:
                cambios.append(
                    {
                        "id": post.id_post,
                        "estado": post.estado_post,
                        "vacante": {
                            "nombre": vacante.nomb_vacante,
                            "descripcion": vacante.descripcion,
                        },
                        "fecha": (
                            post.fecha_post.isoformat() if post.fecha_post else None
                        ),
                    }
                )

        return (
            jsonify({"success": True, "cambios": cambios, "total": len(cambios)}),
            200,
        )

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
