from flask import Blueprint, jsonify
from models import Ciudad

ciudades_bp = Blueprint("ciudades_bp", __name__)


@ciudades_bp.route("/api/ciudades", methods=["GET"])
def get_ciudades():
    """Devuelve la lista de ciudades disponibles."""
    try:
        ciudades = Ciudad.query.all()
        data = [{"id_ciud": c.id_ciud, "nomb_ciud": c.nomb_ciud} for c in ciudades]
        return jsonify({"success": True, "ciudades": data}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
