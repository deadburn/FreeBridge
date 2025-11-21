from flask import Blueprint, request, jsonify
from utils.db import db
from utils.auth import token_required
from models.modelo_calificacion import Calificacion
from models.modelo_postulacion import Postulacion
from models.modelo_freelancer import Freelancer
import uuid

calificacion_bp = Blueprint("calificacion", __name__, url_prefix="/api")


@calificacion_bp.route("/calificar-freelancer", methods=["POST"])
@token_required
def calificar_freelancer(usuario_actual):
    """Permite a una empresa calificar a un freelancer después de un proceso cerrado"""
    try:
        # Verificar que sea empresa
        if usuario_actual.rol != "Empresa":
            return jsonify({"error": "Solo empresas pueden calificar freelancers"}), 403

        from models.modelo_empresa import Empresa

        # Obtener el registro de empresa asociado al usuario
        empresa = Empresa.query.filter_by(id_usu=usuario_actual.id_usu).first()
        if not empresa:
            return jsonify({"error": "No se encontró el perfil de empresa"}), 404

        data = request.get_json()
        id_post = data.get("id_post")
        puntuacion = data.get("puntuacion")
        comentario = data.get("comentario", "")

        # Validaciones
        if not id_post or not puntuacion:
            return (
                jsonify({"error": "id_post y puntuacion son obligatorios"}),
                400,
            )

        if not isinstance(puntuacion, int) or puntuacion < 1 or puntuacion > 5:
            return jsonify({"error": "La puntuación debe ser entre 1 y 5"}), 400

        # Verificar que la postulación existe y está aceptada
        postulacion = Postulacion.query.filter_by(id_post=id_post).first()
        if not postulacion:
            return jsonify({"error": "Postulación no encontrada"}), 404

        if postulacion.estado_post != "aceptada":
            return (
                jsonify(
                    {
                        "error": "Solo se pueden calificar postulaciones aceptadas (procesos cerrados)"
                    }
                ),
                400,
            )

        # Verificar que la vacante pertenece a esta empresa
        from models.modelo_vacante import Vacante

        vacante = Vacante.query.filter_by(id_vac=postulacion.id_vac).first()
        if not vacante or vacante.id_emp != empresa.id_emp:
            return (
                jsonify({"error": "No tienes permiso para calificar esta postulación"}),
                403,
            )

        # Verificar si ya existe una calificación para esta postulación
        calificacion_existente = Calificacion.query.filter_by(id_post=id_post).first()
        if calificacion_existente:
            return (
                jsonify({"error": "Ya has calificado esta postulación"}),
                400,
            )

        # Crear la calificación
        nueva_calificacion = Calificacion(
            id_calif=str(uuid.uuid4()),
            id_post=id_post,
            id_emp=empresa.id_emp,
            id_free=postulacion.id_free,
            puntuacion=puntuacion,
            comentario=comentario,
        )

        db.session.add(nueva_calificacion)
        db.session.commit()

        return (
            jsonify(
                {
                    "success": True,
                    "message": "Calificación guardada exitosamente",
                    "calificacion": nueva_calificacion.to_dict(),
                }
            ),
            201,
        )

    except Exception as e:
        db.session.rollback()
        print(f"Error al calificar freelancer: {str(e)}")
        return jsonify({"error": "Error al guardar la calificación"}), 500


@calificacion_bp.route("/calificacion-freelancer/<id_free>", methods=["GET"])
def obtener_calificacion_freelancer(id_free):
    """Obtiene el promedio de calificaciones y total de un freelancer"""
    try:
        # Calcular promedio y total de calificaciones
        calificaciones = Calificacion.query.filter_by(id_free=id_free).all()

        if not calificaciones:
            return jsonify({"promedio": 0, "total": 0, "calificaciones": []}), 200

        promedio = sum(c.puntuacion for c in calificaciones) / len(calificaciones)

        return (
            jsonify(
                {
                    "promedio": round(promedio, 1),
                    "total": len(calificaciones),
                    "calificaciones": [c.to_dict() for c in calificaciones],
                }
            ),
            200,
        )

    except Exception as e:
        print(f"Error al obtener calificaciones: {str(e)}")
        return jsonify({"error": "Error al obtener calificaciones"}), 500


@calificacion_bp.route("/verificar-puede-calificar/<id_post>", methods=["GET"])
@token_required
def verificar_puede_calificar(usuario_actual, id_post):
    """Verifica si la empresa puede calificar una postulación específica"""
    try:
        if usuario_actual.rol != "Empresa":
            return jsonify({"puede_calificar": False, "razon": "No es empresa"}), 200

        # Verificar si ya calificó
        calificacion_existente = Calificacion.query.filter_by(id_post=id_post).first()
        if calificacion_existente:
            return (
                jsonify(
                    {
                        "puede_calificar": False,
                        "razon": "Ya calificaste esta postulación",
                        "calificacion": calificacion_existente.to_dict(),
                    }
                ),
                200,
            )

        # Verificar que la postulación esté aceptada
        postulacion = Postulacion.query.filter_by(id_post=id_post).first()
        if not postulacion or postulacion.estado_post != "aceptada":
            return (
                jsonify(
                    {
                        "puede_calificar": False,
                        "razon": "La postulación no está aceptada",
                    }
                ),
                200,
            )

        return jsonify({"puede_calificar": True}), 200

    except Exception as e:
        print(f"Error al verificar si puede calificar: {str(e)}")
        return jsonify({"error": "Error al verificar permisos"}), 500


@calificacion_bp.route("/freelancers-trabajados", methods=["GET"])
@token_required
def obtener_freelancers_trabajados(usuario_actual):
    """Obtiene la lista de freelancers que han trabajado con la empresa (postulaciones aceptadas)"""
    try:
        print(f"=== Inicio: obtener_freelancers_trabajados ===")
        print(f"Usuario: {usuario_actual.id_usu}, Rol: {usuario_actual.rol}")

        if usuario_actual.rol != "Empresa":
            return jsonify({"error": "Solo empresas pueden acceder"}), 403

        from models.modelo_vacante import Vacante
        from models.modelo_freelancer import Freelancer
        from models.modelo_empresa import Empresa

        # Obtener empresa
        empresa = Empresa.query.filter_by(id_usu=usuario_actual.id_usu).first()
        if not empresa:
            return jsonify({"error": "Perfil de empresa no encontrado"}), 404

        print(f"Empresa ID: {empresa.id_emp}")

        # Consulta simple
        postulaciones = (
            db.session.query(Postulacion, Freelancer, Vacante, Calificacion)
            .join(Vacante, Postulacion.id_vac == Vacante.id_vac)
            .join(Freelancer, Postulacion.id_free == Freelancer.id_free)
            .outerjoin(Calificacion, Postulacion.id_post == Calificacion.id_post)
            .filter(Vacante.id_emp == empresa.id_emp)
            .all()
        )

        print(f"Total postulaciones: {len(postulaciones)}")

        freelancers_list = []
        for p, f, v, c in postulaciones:
            print(f"Postulación {p.id_post}: estado='{p.estado_post}'")

            # Solo incluir si está aceptada
            if not p.estado_post or p.estado_post.lower() != "aceptada":
                continue

            item = {
                "id_post": p.id_post,
                "id_free": f.id_free,
                "nombre_freelancer": f.usuario.nombre if f.usuario else "Sin nombre",
                "apellido_freelancer": "",  # El modelo Usuario solo tiene 'nombre' completo
                "email": f.usuario.correo if f.usuario else "",
                "avatar": f.avatar,
                "fecha_postulacion": p.fecha_post.isoformat() if p.fecha_post else None,
                "vacante": {
                    "id_vac": v.id_vac,
                    "nombre": v.nomb_vacante,
                },
                "calificacion": c.to_dict() if c else None,
                "puede_calificar": c is None,
            }
            freelancers_list.append(item)

        print(f"Freelancers aceptados: {len(freelancers_list)}")

        return (
            jsonify(
                {
                    "success": True,
                    "freelancers": freelancers_list,
                    "total": len(freelancers_list),
                }
            ),
            200,
        )

    except Exception as e:
        print(f"ERROR: {str(e)}")
        import traceback

        traceback.print_exc()
        return jsonify({"error": str(e)}), 500
