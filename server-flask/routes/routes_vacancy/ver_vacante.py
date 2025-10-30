from flask import Blueprint, jsonify
from models.modelo_vacante import Vacante

ver_vacante_bp = Blueprint("ver_vacante", __name__, url_prefix="/api")


@ver_vacante_bp.route("/mis-vacantes/<id_vac>", methods=["GET"])
def detalle_vacante(id_vac):
    """Ver detalle de una vacante específica"""
    try:
        vacante = Vacante.query.get(id_vac)

        if not vacante:
            return jsonify({"error": "Vacante no encontrada"}), 404

        resultado = {
            "id": vacante.id_vac,
            "nombre": vacante.nombre_vacante,
            "descripcion": vacante.descripcion,
            "requisitos": vacante.requisitos,
            "salario": float(vacante.salario) if vacante.salario else None,
            "fecha_publicacion": (
                vacante.fecha_publicacion.isoformat()
                if vacante.fecha_publicacion
                else None
            ),
            "estado": vacante.estado_vac,
            "empresa": (
                {
                    "id": vacante.empresa.id_emp,
                    "nombre": vacante.empresa.nomb_emp,
                    "tamaño": vacante.empresa.tamaño,
                }
                if vacante.empresa
                else None
            ),
        }

        return jsonify(resultado), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
