from flask import Blueprint, jsonify
from utils.auth import token_required
from models.modelo_empresa import Empresa
from models.modelo_postulacion import Postulacion
from models.modelo_vacante import Vacante

postulacion_empresa_bp = Blueprint("postulacion_empresa", __name__, url_prefix="/api")


@postulacion_empresa_bp.route("/empresa/postulaciones", methods=["GET"])
@token_required
def postulaciones_empresa(current_user):
    """Ver todas las postulaciones a las vacantes de la empresa autenticada"""
    try:
        if current_user.rol != "Empresa":
            return jsonify({"error": "Solo para empresas"}), 403

        empresa = Empresa.query.filter_by(id_usu=current_user.id_usu).first()
        if not empresa:
            return jsonify({"error": "Perfil de empresa no encontrado"}), 404

        # Obtener todas las postulaciones a las vacantes de esta empresa
        postulaciones = (
            Postulacion.query.join(Vacante)
            .filter(Vacante.id_emp == empresa.id_emp)
            .all()
        )

        resultado = []
        for p in postulaciones:
            freelancer = p.freelancer
            vacante = p.vacante

            # Construir URL de hoja de vida si existe
            hoja_vida_url = None
            if freelancer and freelancer.hoja_vida:
                # Extraer solo el nombre del archivo de la ruta almacenada
                import os

                filename = os.path.basename(freelancer.hoja_vida)
                hoja_vida_url = f"/api/uploads/hojas_vida/{filename}"

            postulacion_data = {
                "id": p.id_post,
                "estado": p.estado_post,
                "fecha": p.fecha_post.isoformat() if p.fecha_post else None,
                "nombre": (
                    freelancer.usuario.nombre
                    if freelancer and freelancer.usuario
                    else "Sin nombre"
                ),
                "puesto": freelancer.profesion if freelancer else "No especificado",
                "rating": 0,  # Por ahora sin rating
                "avatar": freelancer.avatar if freelancer else None,
                "experiencia": freelancer.experiencia if freelancer else "",
                "hoja_vida": hoja_vida_url,
                "freelancer": {
                    "id": freelancer.id_free if freelancer else None,
                },
                "vacante": (
                    {
                        "id": vacante.id_vac if vacante else None,
                        "nombre": vacante.nomb_vacante if vacante else "Sin nombre",
                    }
                    if vacante
                    else None
                ),
            }
            resultado.append(postulacion_data)

        return jsonify(resultado), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
