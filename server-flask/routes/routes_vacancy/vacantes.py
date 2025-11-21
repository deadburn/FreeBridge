from flask import Blueprint, request, jsonify
from models.modelo_vacante import Vacante
from utils.db import db
from utils.auth import token_required

vacantes_bp = Blueprint("vacantes", __name__, url_prefix="/api")


@vacantes_bp.route("/vacantes", methods=["GET"])
def listar_vacantes():
    """Listar todas las vacantes disponibles"""
    try:
        estado = request.args.get("estado", "abierta")
        vacantes = Vacante.query.filter_by(estado_vac=estado).all()

        resultado = [
            {
                "id": v.id_vac,
                "nombre": v.nomb_vacante,
                "descripcion": v.descripcion,
                "requisitos": v.requisitos,
                "salario": float(v.salario) if v.salario else None,
                "duracion_proyecto": v.duracion_proyecto,
                "fecha_publicacion": (
                    v.fecha_publicacion.isoformat() if v.fecha_publicacion else None
                ),
                "estado": v.estado_vac,
                "empresa": (
                    {"id": v.empresa.id_emp, "nombre": v.empresa.usuario.nombre}
                    if v.empresa
                    else None
                ),
            }
            for v in vacantes
        ]

        return jsonify(resultado), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@vacantes_bp.route("/vacantes/empresa/<string:empresa_id>", methods=["GET"])
@token_required
def listar_vacantes_empresa(current_user, empresa_id):
    """Listar vacantes de una empresa específica"""
    try:
        # Verificar que el usuario sea empresa
        if current_user.rol != "Empresa" or current_user.id_usu != empresa_id:
            return jsonify({"error": "No autorizado"}), 403

        # Obtener el id_emp del usuario
        from models.modelo_empresa import Empresa

        empresa = Empresa.query.filter_by(id_usu=empresa_id).first()

        if not empresa:
            return jsonify({"error": "Perfil de empresa no encontrado"}), 404

        # Buscar vacantes usando id_emp
        vacantes = Vacante.query.filter_by(id_emp=empresa.id_emp).all()

        resultado = [
            {
                "id": v.id_vac,
                "nombre": v.nomb_vacante,
                "descripcion": v.descripcion,
                "requisitos": v.requisitos,
                "salario": float(v.salario) if v.salario else None,
                "duracion_proyecto": v.duracion_proyecto,
                "fecha_publicacion": (
                    v.fecha_publicacion.isoformat() if v.fecha_publicacion else None
                ),
                "estado": v.estado_vac,
            }
            for v in vacantes
        ]

        return jsonify(resultado), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@vacantes_bp.route("/vacantes/<string:vacante_id>/estado", methods=["PATCH"])
@token_required
def cambiar_estado_vacante(current_user, vacante_id):
    """Cambiar el estado de una vacante (abierta/cerrada)"""
    try:
        vacante = Vacante.query.get(vacante_id)

        if not vacante:
            return jsonify({"error": "Vacante no encontrada"}), 404

        # Verificar que el usuario sea la empresa dueña de la vacante
        from models.modelo_empresa import Empresa

        empresa = Empresa.query.filter_by(id_usu=current_user.id_usu).first()

        if not empresa or vacante.id_emp != empresa.id_emp:
            return jsonify({"error": "No autorizado para modificar esta vacante"}), 403

        data = request.json
        nuevo_estado = data.get("estado")

        if nuevo_estado not in ["abierta", "cerrada"]:
            return jsonify({"error": "Estado inválido. Use 'abierta' o 'cerrada'"}), 400

        vacante.estado_vac = nuevo_estado
        db.session.commit()

        return (
            jsonify(
                {
                    "mensaje": f"Vacante {nuevo_estado} exitosamente",
                    "vacante": {
                        "id": vacante.id_vac,
                        "nombre": vacante.nomb_vacante,
                        "estado": vacante.estado_vac,
                    },
                }
            ),
            200,
        )

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@vacantes_bp.route("/vacantes/<string:vacante_id>", methods=["PUT"])
@token_required
def actualizar_vacante(current_user, vacante_id):
    """Actualizar una vacante existente"""
    try:
        vacante = Vacante.query.get(vacante_id)

        if not vacante:
            return jsonify({"error": "Vacante no encontrada"}), 404

        # Verificar que el usuario sea la empresa dueña de la vacante
        from models.modelo_empresa import Empresa

        empresa = Empresa.query.filter_by(id_usu=current_user.id_usu).first()

        if not empresa or vacante.id_emp != empresa.id_emp:
            return jsonify({"error": "No autorizado para modificar esta vacante"}), 403

        data = request.json

        # Actualizar campos
        if "nombre" in data:
            vacante.nomb_vacante = data["nombre"]
        if "descripcion" in data:
            vacante.descripcion = data["descripcion"]
        if "requisitos" in data:
            vacante.requisitos = data["requisitos"]
        if "salario" in data:
            vacante.salario = data["salario"]
        if "duracion_proyecto" in data:
            vacante.duracion_proyecto = data["duracion_proyecto"]
        if "estado" in data:
            vacante.estado_vac = data["estado"]

        db.session.commit()

        return (
            jsonify(
                {
                    "mensaje": "Vacante actualizada exitosamente",
                    "vacante": {
                        "id": vacante.id_vac,
                        "nombre": vacante.nomb_vacante,
                        "descripcion": vacante.descripcion,
                        "requisitos": vacante.requisitos,
                        "salario": float(vacante.salario) if vacante.salario else None,
                        "duracion_proyecto": vacante.duracion_proyecto,
                        "estado": vacante.estado_vac,
                    },
                }
            ),
            200,
        )

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@vacantes_bp.route("/vacantes/<string:vacante_id>", methods=["DELETE"])
@token_required
def eliminar_vacante(current_user, vacante_id):
    """Eliminar una vacante"""
    try:
        vacante = Vacante.query.get(vacante_id)

        if not vacante:
            return jsonify({"error": "Vacante no encontrada"}), 404

        # Verificar que el usuario sea la empresa dueña de la vacante
        from models.modelo_empresa import Empresa

        empresa = Empresa.query.filter_by(id_usu=current_user.id_usu).first()

        if not empresa or vacante.id_emp != empresa.id_emp:
            return jsonify({"error": "No autorizado para eliminar esta vacante"}), 403

        # Eliminar primero todas las postulaciones asociadas
        from models.modelo_postulacion import Postulacion

        Postulacion.query.filter_by(id_vac=vacante_id).delete()

        # Luego eliminar la vacante
        db.session.delete(vacante)
        db.session.commit()

        return jsonify({"mensaje": "Vacante eliminada exitosamente"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
