from flask import Flask, jsonify
from flask_cors import CORS
from utils.db import db
from utils.config import Config

# Importracion de Blueprints
from routes.routes_auth.login import login_bp
from routes.routes_auth.registro import registro_bp
from routes.routes_perfil.ver_perfil import perfil_bp
from routes.routes_post.postulacion import postulacion_bp
from routes.routes_post.ver_postulacion import ver_postulacion_bp
from routes.routes_vacancy.crear_vacante import crear_vacante_bp
from routes.routes_vacancy.vacantes import vacantes_bp
from routes.routes_vacancy.ver_vacante import ver_vacante_bp


app = Flask(__name__)
app.config.from_object(Config)


CORS(
    app,
    resources={
        r"/api/*": {
            "origins": ["http://localhost:5173"],  # URL de React
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"],
        }
    },
)

db.init_app(app)

with app.app_context():

    ################# REGISTRO DE BLUEPRINTS #####################
    # Autenticación
    app.register_blueprint(login_bp)
    app.register_blueprint(registro_bp)

    # Perfil
    app.register_blueprint(perfil_bp)

    # Postulaciones
    app.register_blueprint(postulacion_bp)
    app.register_blueprint(ver_postulacion_bp)

    # Vacantes
    app.register_blueprint(crear_vacante_bp)
    app.register_blueprint(vacantes_bp)
    app.register_blueprint(ver_vacante_bp)


########## MANEJO DE ERRORES #############


@app.errorhandler(400)
def bad_request(e):
    """Error de petición incorrecta"""
    return jsonify({"error": "Petición incorrecta", "mensaje": str(e)}), 400


@app.errorhandler(401)
def unauthorized(e):
    """Error de no autorizado"""
    return (
        jsonify(
            {
                "error": "No autorizado",
                "mensaje": "Credenciales inválidas o token faltante",
            }
        ),
        401,
    )


@app.errorhandler(403)
def forbidden(e):
    """Error de acceso prohibido"""
    return (
        jsonify(
            {
                "error": "Acceso prohibido",
                "mensaje": str(e),
            }
        ),
        403,
    )


@app.errorhandler(404)
def not_found(e):
    """Error de recurso no encontrado"""
    return (
        jsonify(
            {
                "error": "Recurso no encontrado",
                "mensaje": str(e),
            }
        ),
        404,
    )


@app.errorhandler(409)
def conflict(e):
    """Error de conflicto (duplicados)"""
    return jsonify({"error": "Conflicto", "mensaje": str(e)}), 409


@app.errorhandler(500)
def internal_error(e):
    """Error interno del servidor"""
    return (
        jsonify(
            {
                "error": "Error interno del servidor",
                "mensaje": "Ocurrió un error inesperado. Contacta al administrador.",
            }
        ),
        500,
    )

    # ==================== RUTA DE HEALTH CHECK ====================


@app.route("/api/health", methods=["GET"])
def health_check():
    """Verificar que la API está funcionando"""
    return (
        jsonify(
            {"status": "OK", "mensaje": "API FreeBridge funcionando correctamente"}
        ),
        200,
    )
