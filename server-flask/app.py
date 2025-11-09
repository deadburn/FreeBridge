from flask import Flask, jsonify
import os
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
from routes.ciudades import ciudades_bp
from routes.routes_empresa.perfil_empresa import perfil_empresa_bp


app = Flask(__name__)
app.config.from_object(Config)


CORS(
    app,
    resources={
        r"/api/*": {
            "origins": ["http://localhost:5173"],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"],
            "expose_headers": ["Content-Type", "Authorization"],
            "supports_credentials": True,
            "allow_credentials": True,
        }
    },
)

# Importar todos los modelos
from models import Usuario, Empresa, Ciudad, Freelancer, Vacante, Postulacion

db.init_app(app)

with app.app_context():
    # Controlar recreación de la DB con la variable de entorno RESET_DB
    # Si RESET_DB=1, la base de datos se eliminará y se volverá a crear (útil en dev).
    # Si no está activa, solo se ejecuta create_all() sin borrar datos existentes.
    reset_db = os.environ.get("RESET_DB", "0") == "1"
    if reset_db:
        # Eliminar todas las tablas existentes y crear nuevas
        db.drop_all()
        db.create_all()
        print("Database dropped and recreated (RESET_DB=1)")
    else:
        # Crear tablas que falten sin borrar datos existentes
        db.create_all()
        print("Database tables ensured (no drop). Set RESET_DB=1 to force recreate")

    ################# REGISTRO DE BLUEPRINTS #####################
    # Autenticación
    app.register_blueprint(login_bp)
    app.register_blueprint(registro_bp)

    # Perfil
    app.register_blueprint(perfil_bp)

    # Ciudades
    app.register_blueprint(ciudades_bp)

    # Postulaciones
    app.register_blueprint(postulacion_bp)
    app.register_blueprint(ver_postulacion_bp)

    # Vacantes
    app.register_blueprint(crear_vacante_bp)
    app.register_blueprint(vacantes_bp)
    app.register_blueprint(ver_vacante_bp)

    # Empresa
    app.register_blueprint(perfil_empresa_bp)


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
