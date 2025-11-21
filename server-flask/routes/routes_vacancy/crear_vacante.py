from flask import Blueprint, request, jsonify
from utils.auth import token_required
from utils.db import db
from models.modelo_vacante import Vacante
from models.modelo_empresa import Empresa
from models.modelo_token import TokenBalance, Transaccion
import uuid

crear_vacante_bp = Blueprint("crear_vacante", __name__, url_prefix="/api")


@crear_vacante_bp.route("/crear-vacantes", methods=["POST"])
@token_required
def crear_vacante(current_user):
    """Crear una nueva vacante (requiere 1 token)"""
    try:
        if current_user.rol != "Empresa":
            return jsonify({"error": "Solo empresas pueden crear vacantes"}), 403

        data = request.get_json()

        empresa = Empresa.query.filter_by(id_usu=current_user.id_usu).first()
        if not empresa:
            return jsonify({"error": "Perfil de empresa no encontrado"}), 404

        # Verificar balance de tokens
        balance = TokenBalance.query.filter_by(id_emp=empresa.id_emp).first()
        if not balance or balance.tokens_disponibles < 1:
            return (
                jsonify(
                    {
                        "error": "No tienes tokens suficientes",
                        "mensaje": "Necesitas al menos 1 token para publicar una vacante. Compra tokens para continuar.",
                        "tokens_disponibles": (
                            balance.tokens_disponibles if balance else 0
                        ),
                    }
                ),
                402,  # 402 Payment Required
            )

        # Crear vacante
        nueva_vacante = Vacante(
            id_vac=str(uuid.uuid4())[:11],
            id_emp=empresa.id_emp,
            nomb_vacante=data["nombre"],
            descripcion=data["descripcion"],
            requisitos=data["requisitos"],
            salario=data.get("salario"),
            duracion_proyecto=data.get("duracion_proyecto", "No especificado"),
            estado_vac="abierta",
        )

        # Descontar token
        balance.tokens_disponibles -= 1
        balance.tokens_usados += 1

        # Registrar transacción de uso
        transaccion = Transaccion(
            id_trans=str(uuid.uuid4()),
            id_emp=empresa.id_emp,
            tipo="uso",
            cantidad_tokens=1,
            estado="completada",
            descripcion=f"Publicación de vacante: {data['nombre']}",
        )

        db.session.add(nueva_vacante)
        db.session.add(transaccion)
        db.session.commit()

        return (
            jsonify(
                {
                    "mensaje": "Vacante creada exitosamente",
                    "vacante": {
                        "id": nueva_vacante.id_vac,
                        "nombre": nueva_vacante.nomb_vacante,
                    },
                    "tokens_restantes": balance.tokens_disponibles,
                }
            ),
            201,
        )

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
