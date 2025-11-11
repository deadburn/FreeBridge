from flask import Blueprint, request, jsonify
from models import Freelancer
from utils.db import db
import uuid

perfil_freelancer_bp = Blueprint("perfil_freelancer_bp", __name__)


@perfil_freelancer_bp.route("/api/freelancer/perfil/<id_usu>", methods=["GET"])
def verificar_perfil(id_usu):
    """Verifica si el usuario ya tiene un perfil de freelancer creado"""
    try:
        freelancer = Freelancer.query.filter_by(id_usu=id_usu).first()
        if freelancer:
            return (
                jsonify(
                    {
                        "success": True,
                        "perfilCompleto": True,
                        "freelancer": {
                            "id_free": freelancer.id_free,
                            "profesion": freelancer.profesion,
                            "portafolio_URL": freelancer.portafolio_URL,
                            "experiencia": freelancer.experiencia,
                            "id_ciud": freelancer.id_ciud,
                        },
                    }
                ),
                200,
            )
        return jsonify({"success": True, "perfilCompleto": False}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400


@perfil_freelancer_bp.route("/api/freelancer/perfil", methods=["POST"])
def crear_perfil_freelancer():
    data = request.get_json()
    try:
        nuevo_freelancer = Freelancer(
            id_free=str(uuid.uuid4())[:10],
            profesion=data["profesion"],
            portafolio_URL=data.get("portafolio_URL", ""),
            experiencia=data.get("experiencia", ""),
            id_ciud=data["id_ciud"],
            id_usu=data["id_usu"],
        )
        db.session.add(nuevo_freelancer)
        db.session.commit()
        return jsonify({"success": True, "id_free": nuevo_freelancer.id_free}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"success": False, "error": str(e)}), 400
