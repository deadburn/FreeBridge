from flask import Blueprint, request, jsonify
from models.modelo_vacante import Vacante

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
