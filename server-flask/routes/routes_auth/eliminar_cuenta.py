from flask import Blueprint, jsonify
from models.modelo_usuarios import Usuario
from models.modelo_freelancer import Freelancer
from models.modelo_empresa import Empresa
from models.modelo_postulacion import Postulacion
from models.modelo_vacante import Vacante
from utils.db import db
from utils.auth import token_required
import os

eliminar_cuenta_bp = Blueprint("eliminar_cuenta", __name__)

UPLOAD_FOLDER = "uploads/hojas_vida"
AVATAR_FOLDER = "uploads/avatares"


@eliminar_cuenta_bp.route("/api/usuario/eliminar", methods=["DELETE"])
@token_required
def eliminar_cuenta(current_user):
    """Elimina la cuenta del usuario y todos sus datos relacionados"""
    try:
        user_id = current_user.id_usu
        user_role = current_user.rol

        # Si es FreeLancer
        if user_role == "FreeLancer":
            freelancer = Freelancer.query.filter_by(id_usu=user_id).first()
            if freelancer:
                # Eliminar postulaciones del freelancer
                Postulacion.query.filter_by(id_free=freelancer.id_free).delete()

                # Eliminar archivos físicos (hoja de vida y avatar)
                if freelancer.hoja_vida and os.path.exists(freelancer.hoja_vida):
                    try:
                        os.remove(freelancer.hoja_vida)
                    except:
                        pass

                if (
                    freelancer.avatar
                    and freelancer.avatar.startswith("uploads/")
                    and os.path.exists(freelancer.avatar)
                ):
                    try:
                        os.remove(freelancer.avatar)
                    except:
                        pass

                # Eliminar registro de freelancer
                db.session.delete(freelancer)

        # Si es Empresa
        elif user_role == "Empresa":
            empresa = Empresa.query.filter_by(id_usu=user_id).first()
            if empresa:
                # Obtener todas las vacantes de la empresa
                vacantes = Vacante.query.filter_by(id_emp=empresa.id_emp).all()

                for vacante in vacantes:
                    # Eliminar postulaciones de cada vacante
                    Postulacion.query.filter_by(id_vac=vacante.id_vac).delete()
                    # Eliminar la vacante
                    db.session.delete(vacante)

                # Eliminar logo si existe
                if (
                    empresa.logo
                    and empresa.logo.startswith("uploads/")
                    and os.path.exists(empresa.logo)
                ):
                    try:
                        os.remove(empresa.logo)
                    except:
                        pass

                # Eliminar registro de empresa
                db.session.delete(empresa)

        # Finalmente eliminar el usuario
        db.session.delete(current_user)
        db.session.commit()

        return (
            jsonify(
                {
                    "success": True,
                    "message": "Cuenta eliminada exitosamente",
                }
            ),
            200,
        )

    except Exception as e:
        db.session.rollback()
        print(f"Error al eliminar cuenta: {str(e)}")
        return jsonify({"success": False, "error": str(e)}), 500
