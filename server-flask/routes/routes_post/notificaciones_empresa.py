"""
Blueprint para notificaciones de nuevas postulaciones para empresas
"""

from flask import Blueprint, jsonify
from utils.auth import token_required
from models.modelo_empresa import Empresa
from models.modelo_postulacion import Postulacion
from models.modelo_vacante import Vacante
from models.modelo_freelancer import Freelancer

notificaciones_empresa_bp = Blueprint("notificaciones_empresa", __name__)


@notificaciones_empresa_bp.route(
    "/api/empresa/notificaciones/nuevas-postulaciones", methods=["GET"]
)
@token_required
def nuevas_postulaciones(current_user):
    """
    Obtiene las postulaciones pendientes más recientes para las vacantes de la empresa
    """
    try:
        # Verificar que el usuario es empresa
        empresa = Empresa.query.filter_by(id_usu=current_user.id_usu).first()
        if not empresa:
            return (
                jsonify(
                    {
                        "success": False,
                        "error": "Solo las empresas pueden ver estas notificaciones",
                    }
                ),
                403,
            )

        # Obtener todas las vacantes de la empresa
        vacantes = Vacante.query.filter_by(id_emp=empresa.id_emp).all()
        vacantes_ids = [v.id_vac for v in vacantes]

        # Obtener postulaciones pendientes para estas vacantes
        postulaciones_pendientes = (
            Postulacion.query.filter(
                Postulacion.id_vac.in_(vacantes_ids),
                Postulacion.estado_post == "pendiente",
            )
            .order_by(Postulacion.fecha_post.desc())
            .all()
        )

        # Formatear las notificaciones
        notificaciones = []
        for p in postulaciones_pendientes:
            # Obtener información del freelancer
            freelancer = Freelancer.query.filter_by(id_free=p.id_free).first()

            # Obtener información de la vacante
            vacante = Vacante.query.filter_by(id_vac=p.id_vac).first()

            notificaciones.append(
                {
                    "id": p.id_post,
                    "fecha": p.fecha_post.isoformat() if p.fecha_post else None,
                    "vacante": {
                        "id": vacante.id_vac if vacante else None,
                        "nombre": vacante.nomb_vacante if vacante else "Vacante",
                    },
                    "freelancer": {
                        "id": freelancer.id_free if freelancer else None,
                        "nombre": (
                            freelancer.usuario.nombre
                            if freelancer and freelancer.usuario
                            else "N/A"
                        ),
                        "email": (
                            freelancer.usuario.correo
                            if freelancer and freelancer.usuario
                            else "N/A"
                        ),
                    },
                }
            )

        return (
            jsonify(
                {
                    "success": True,
                    "notificaciones": notificaciones,
                    "total": len(notificaciones),
                }
            ),
            200,
        )

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
