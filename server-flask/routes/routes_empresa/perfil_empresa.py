from flask import Blueprint, request, jsonify
from models import Empresa
from utils.db import db
import uuid

perfil_empresa_bp = Blueprint("perfil_empresa_bp", __name__)


@perfil_empresa_bp.route("/api/empresa/perfil/<id_usu>", methods=["GET"])
def verificar_perfil(id_usu):
    """Verifica si el usuario ya tiene un perfil de empresa creado"""
    try:
        empresa = Empresa.query.filter_by(id_usu=id_usu).first()
        if empresa:
            return (
                jsonify(
                    {
                        "success": True,
                        "perfilCompleto": True,
                        "empresa": {
                            "id_emp": empresa.id_emp,
                            "nomb_emp": empresa.nomb_emp,
                            "NIT": empresa.NIT,
                            "tamaño": empresa.tamaño,
                            "desc_emp": empresa.desc_emp,
                            "id_ciud": empresa.id_ciud,
                        },
                    }
                ),
                200,
            )
        return jsonify({"success": True, "perfilCompleto": False}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400


@perfil_empresa_bp.route("/api/empresa/perfil", methods=["POST"])
def crear_perfil_empresa():
    data = request.get_json()
    try:
        nueva_empresa = Empresa(
            id_emp=str(uuid.uuid4())[:10],
            nomb_emp=data["nomb_emp"],
            NIT=data["NIT"],
            tamaño=data["tamaño"],
            desc_emp=data["desc_emp"],
            id_ciud=data["id_ciud"],
            id_usu=data["id_usu"],
        )
        db.session.add(nueva_empresa)
        db.session.commit()
        return jsonify({"success": True, "id_emp": nueva_empresa.id_emp}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"success": False, "error": str(e)}), 400
