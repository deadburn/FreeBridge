"""
Blueprint para servir archivos estáticos (hojas de vida, etc.)
"""

from flask import Blueprint, send_from_directory, jsonify
import os

archivos_bp = Blueprint("archivos", __name__, url_prefix="/api")

# Directorio base donde se almacenan los uploads
UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.dirname(__file__)), "uploads")


@archivos_bp.route("/uploads/hojas_vida/<filename>", methods=["GET"])
def descargar_hoja_vida(filename):
    """
    Sirve archivos de hojas de vida
    Endpoint público para que las empresas puedan ver las hojas de vida de postulantes
    """
    try:
        hojas_vida_path = os.path.join(UPLOAD_FOLDER, "hojas_vida")

        # Verificar que el archivo existe
        file_path = os.path.join(hojas_vida_path, filename)
        if not os.path.exists(file_path):
            return jsonify({"error": "Archivo no encontrado"}), 404

        # Servir el archivo
        return send_from_directory(
            hojas_vida_path,
            filename,
            as_attachment=False,  # False para visualizar en navegador
        )

    except Exception as e:
        print(f"Error al servir archivo: {str(e)}")
        return jsonify({"error": "Error al cargar el archivo"}), 500


@archivos_bp.route("/uploads/avatares/<filename>", methods=["GET"])
def servir_avatar(filename):
    """
    Sirve archivos de avatares de usuarios
    """
    try:
        avatares_path = os.path.join(UPLOAD_FOLDER, "avatares")

        # Verificar que el archivo existe
        file_path = os.path.join(avatares_path, filename)
        if not os.path.exists(file_path):
            return jsonify({"error": "Avatar no encontrado"}), 404

        # Servir el archivo
        return send_from_directory(
            avatares_path,
            filename,
            as_attachment=False,
        )

    except Exception as e:
        print(f"Error al servir avatar: {str(e)}")
        return jsonify({"error": "Error al cargar el avatar"}), 500


@archivos_bp.route("/uploads/logos/<filename>", methods=["GET"])
def servir_logo(filename):
    """
    Sirve archivos de logos de empresas
    """
    try:
        logos_path = os.path.join(UPLOAD_FOLDER, "logos")

        # Verificar que el archivo existe
        file_path = os.path.join(logos_path, filename)
        if not os.path.exists(file_path):
            return jsonify({"error": "Logo no encontrado"}), 404

        # Servir el archivo
        return send_from_directory(
            logos_path,
            filename,
            as_attachment=False,
        )

    except Exception as e:
        print(f"Error al servir logo: {str(e)}")
        return jsonify({"error": "Error al cargar el logo"}), 500
