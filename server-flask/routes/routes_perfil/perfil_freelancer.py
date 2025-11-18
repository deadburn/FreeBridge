from flask import Blueprint, request, jsonify
from models import Freelancer
from utils.db import db
from werkzeug.utils import secure_filename
import uuid
import os

perfil_freelancer_bp = Blueprint("perfil_freelancer_bp", __name__)

# Configuración de carpeta para subir archivos
UPLOAD_FOLDER = "uploads/hojas_vida"
AVATAR_FOLDER = "uploads/avatares"
ALLOWED_EXTENSIONS = {"pdf"}
ALLOWED_IMAGE_EXTENSIONS = {"png", "jpg", "jpeg", "gif", "webp"}

# Crear carpetas si no existen
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(AVATAR_FOLDER, exist_ok=True)


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


def allowed_image(filename):
    return (
        "." in filename
        and filename.rsplit(".", 1)[1].lower() in ALLOWED_IMAGE_EXTENSIONS
    )


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
                            "experiencia": freelancer.experiencia,
                            "id_ciud": freelancer.id_ciud,
                            "hoja_vida": freelancer.hoja_vida,
                            "avatar": freelancer.avatar,
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
    try:
        # Obtener datos del formulario (FormData)
        profesion = request.form.get("profesion")
        experiencia = request.form.get("experiencia", "")
        id_ciud = request.form.get("id_ciud")
        id_usu = request.form.get("id_usu")

        # Validar campos requeridos
        if not profesion or not id_ciud or not id_usu:
            return jsonify({"success": False, "error": "Faltan campos requeridos"}), 400

        # Manejar archivo de hoja de vida
        hoja_vida_path = None
        if "hoja_vida" in request.files:
            file = request.files["hoja_vida"]
            if file and file.filename and allowed_file(file.filename):
                # Crear nombre único para el archivo
                filename = secure_filename(file.filename)
                unique_filename = f"{id_usu}_{uuid.uuid4().hex[:8]}_{filename}"
                filepath = os.path.join(UPLOAD_FOLDER, unique_filename)

                # Guardar archivo
                file.save(filepath)
                hoja_vida_path = filepath

        # Crear freelancer
        nuevo_freelancer = Freelancer(
            id_free=str(uuid.uuid4())[:10],
            profesion=profesion,
            experiencia=experiencia,
            id_ciud=id_ciud,
            id_usu=id_usu,
            hoja_vida=hoja_vida_path,
        )

        db.session.add(nuevo_freelancer)
        db.session.commit()

        return (
            jsonify(
                {
                    "success": True,
                    "id_free": nuevo_freelancer.id_free,
                    "hoja_vida": hoja_vida_path,
                }
            ),
            201,
        )

    except Exception as e:
        db.session.rollback()
        return jsonify({"success": False, "error": str(e)}), 400


@perfil_freelancer_bp.route("/api/freelancer/perfil/<id_free>", methods=["PUT"])
def actualizar_perfil_freelancer(id_free):
    """Actualiza el perfil de un freelancer existente"""
    try:
        freelancer = Freelancer.query.filter_by(id_free=id_free).first()
        if not freelancer:
            return jsonify({"success": False, "error": "Freelancer no encontrado"}), 404

        # Obtener datos del formulario
        if request.form.get("profesion"):
            freelancer.profesion = request.form.get("profesion")

        if request.form.get("experiencia") is not None:
            freelancer.experiencia = request.form.get("experiencia")

        if request.form.get("id_ciud"):
            freelancer.id_ciud = request.form.get("id_ciud")

        # Manejar actualización de hoja de vida
        if "hoja_vida" in request.files:
            file = request.files["hoja_vida"]
            if file and file.filename and allowed_file(file.filename):
                # Eliminar archivo anterior si existe
                if freelancer.hoja_vida and os.path.exists(freelancer.hoja_vida):
                    try:
                        os.remove(freelancer.hoja_vida)
                    except:
                        pass

                # Guardar nuevo archivo
                filename = secure_filename(file.filename)
                unique_filename = (
                    f"{freelancer.id_usu}_{uuid.uuid4().hex[:8]}_{filename}"
                )
                filepath = os.path.join(UPLOAD_FOLDER, unique_filename)
                file.save(filepath)
                freelancer.hoja_vida = filepath

        # Manejar avatar
        if "avatar" in request.files:
            file = request.files["avatar"]
            if file and file.filename and allowed_image(file.filename):
                # Eliminar avatar anterior si existe y no es un avatar por defecto
                if freelancer.avatar and os.path.exists(freelancer.avatar):
                    try:
                        os.remove(freelancer.avatar)
                    except:
                        pass

                # Guardar nuevo avatar
                filename = secure_filename(file.filename)
                unique_filename = (
                    f"avatar_{freelancer.id_usu}_{uuid.uuid4().hex[:8]}_{filename}"
                )
                filepath = os.path.join(AVATAR_FOLDER, unique_filename)
                file.save(filepath)
                freelancer.avatar = filepath
        elif request.form.get("avatar_default"):
            # Si se seleccionó un avatar por defecto
            freelancer.avatar = request.form.get("avatar_default")

        db.session.commit()

        return (
            jsonify(
                {
                    "success": True,
                    "message": "Perfil actualizado exitosamente",
                    "freelancer": {
                        "id_free": freelancer.id_free,
                        "profesion": freelancer.profesion,
                        "experiencia": freelancer.experiencia,
                        "id_ciud": freelancer.id_ciud,
                        "hoja_vida": freelancer.hoja_vida,
                        "avatar": freelancer.avatar,
                    },
                }
            ),
            200,
        )

    except Exception as e:
        db.session.rollback()
        return jsonify({"success": False, "error": str(e)}), 400
