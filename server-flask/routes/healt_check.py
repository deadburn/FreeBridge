from flask import Blueprint, jsonify
from datetime import datetime

health_check_bp = Blueprint("healt", __name__, url_prefix="/api")


@health_check_bp.route("/health", methods=["GET"])
def health_check():
    """Verificar que la API está funcionando"""
    return (
        jsonify(
            {
                "status": "OK",
                "mensaje": "API FreeBridge funcionando correctamente",
                "timestamp": datetime.utcnow().isoformat(),
            }
        ),
        200,
    )
