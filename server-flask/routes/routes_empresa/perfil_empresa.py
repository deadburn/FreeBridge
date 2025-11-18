from flask import Blueprint, request, jsonify
from models import Empresa
from utils.db import db
from werkzeug.utils import secure_filename
import uuid
import os

perfil_empresa_bp = Blueprint("perfil_empresa_bp", __name__)

# Configuración de carpeta para subir logos
LOGO_FOLDER = "uploads/logos"
ALLOWED_IMAGE_EXTENSIONS = {"png", "jpg", "jpeg", "gif", "webp"}

# Crear carpeta si no existe
os.makedirs(LOGO_FOLDER, exist_ok=True)


def allowed_image(filename):
    return (
        "." in filename
        and filename.rsplit(".", 1)[1].lower() in ALLOWED_IMAGE_EXTENSIONS
    )


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
                            "nomb_emp": empresa.usuario.nombre,
                            "NIT": empresa.NIT,
                            "tamaño": empresa.tamaño,
                            "desc_emp": empresa.desc_emp,
                            "id_ciud": empresa.id_ciud,
                            "logo": empresa.logo,
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


@perfil_empresa_bp.route("/api/empresa/perfil/<id_emp>", methods=["PUT"])
def actualizar_perfil_empresa(id_emp):
    """Actualiza el perfil de una empresa existente"""
    try:
        empresa = Empresa.query.filter_by(id_emp=id_emp).first()
        if not empresa:
            return jsonify({"success": False, "error": "Empresa no encontrada"}), 404

        # Obtener datos del formulario
        if request.form.get("NIT"):
            empresa.NIT = request.form.get("NIT")

        if request.form.get("tamaño"):
            empresa.tamaño = request.form.get("tamaño")

        if request.form.get("desc_emp"):
            empresa.desc_emp = request.form.get("desc_emp")

        if request.form.get("id_ciud"):
            empresa.id_ciud = request.form.get("id_ciud")

        # Manejar logo
        if "logo" in request.files:
            file = request.files["logo"]
            if file and file.filename and allowed_image(file.filename):
                # Eliminar logo anterior si existe
                if empresa.logo:
                    old_logo_path = os.path.join(LOGO_FOLDER, empresa.logo)
                    if os.path.exists(old_logo_path):
                        try:
                            os.remove(old_logo_path)
                        except:
                            pass

                # Guardar nuevo logo
                filename = secure_filename(file.filename)
                unique_filename = (
                    f"logo_{empresa.id_usu}_{uuid.uuid4().hex[:8]}_{filename}"
                )
                filepath = os.path.join(LOGO_FOLDER, unique_filename)
                file.save(filepath)
                # Guardar solo el nombre del archivo, no la ruta completa
                empresa.logo = unique_filename

        db.session.commit()

        return (
            jsonify(
                {
                    "success": True,
                    "message": "Perfil actualizado exitosamente",
                    "empresa": {
                        "id_emp": empresa.id_emp,
                        "nomb_emp": empresa.usuario.nombre,
                        "NIT": empresa.NIT,
                        "tamaño": empresa.tamaño,
                        "desc_emp": empresa.desc_emp,
                        "id_ciud": empresa.id_ciud,
                        "logo": empresa.logo,
                    },
                }
            ),
            200,
        )

    except Exception as e:
        db.session.rollback()
        return jsonify({"success": False, "error": str(e)}), 400
