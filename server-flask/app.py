from flask import Flask, jsonify
import os
from flask_cors import CORS
from flask_mail import Mail
from utils.db import db
from utils.config import Config

app = Flask(__name__)
app.config.from_object(Config)

# Debug: Verificar configuración de correo
print("=" * 60)
print("📧 CONFIGURACIÓN DE CORREO:")
print(f"MAIL_SERVER: {app.config.get('MAIL_SERVER')}")
print(f"MAIL_PORT: {app.config.get('MAIL_PORT')}")
print(f"MAIL_USERNAME: {app.config.get('MAIL_USERNAME')}")
print(f"MAIL_PASSWORD: {'*' * len(str(app.config.get('MAIL_PASSWORD', '')))}")
print(f"MAIL_USE_TLS: {app.config.get('MAIL_USE_TLS')}")
print(f"MAIL_USE_SSL: {app.config.get('MAIL_USE_SSL')}")
print("=" * 60)

# Inicializar Flask-Mail
mail = Mail(app)

# Importracion de Blueprints
from routes.routes_auth.login import login_bp
from routes.routes_auth.registro import registro_bp
from routes.routes_auth.password_reset import password_reset_bp
from routes.routes_auth.eliminar_cuenta import eliminar_cuenta_bp
from routes.routes_perfil.ver_perfil import perfil_bp
from routes.routes_perfil.perfil_freelancer import perfil_freelancer_bp
from routes.routes_post.postulacion import postulacion_bp
from routes.routes_post.ver_postulacion import ver_postulacion_bp
from routes.routes_post.postulacion_empresa import postulacion_empresa_bp
from routes.routes_post.actualizar_estado import actualizar_estado_bp
from routes.routes_post.notificaciones import notificaciones_bp
from routes.routes_post.cancelar_postulacion import cancelar_postulacion_bp
from routes.routes_post.notificaciones_empresa import notificaciones_empresa_bp
from routes.routes_post.verificar_postulacion import verificar_postulacion_bp
from routes.routes_vacancy.crear_vacante import crear_vacante_bp
from routes.routes_vacancy.vacantes import vacantes_bp
from routes.routes_vacancy.ver_vacante import ver_vacante_bp
from routes.ciudades import ciudades_bp
from routes.routes_empresa.perfil_empresa import perfil_empresa_bp
from routes.archivos import archivos_bp

# Hacer mail disponible para los blueprints
password_reset_bp.mail = mail
actualizar_estado_bp.mail = mail

CORS(
    app,
    resources={
        r"/api/*": {
            "origins": ["http://localhost:5173", "http://localhost:5200"],
            "methods": ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"],
            "expose_headers": ["Content-Type", "Authorization"],
            "supports_credentials": True,
            "allow_credentials": True,
        }
    },
)

# Importar todos los modelos
from models import (
    Usuario,
    Empresa,
    Ciudad,
    Freelancer,
    Vacante,
    Postulacion,
    PasswordResetToken,
)

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
    app.register_blueprint(password_reset_bp)
    app.register_blueprint(eliminar_cuenta_bp)

    # Perfil
    app.register_blueprint(perfil_bp)
    app.register_blueprint(perfil_freelancer_bp)

    # Ciudades
    app.register_blueprint(ciudades_bp)

    # Postulaciones
    app.register_blueprint(postulacion_bp)
    app.register_blueprint(ver_postulacion_bp)
    app.register_blueprint(postulacion_empresa_bp)
    app.register_blueprint(actualizar_estado_bp)
    app.register_blueprint(notificaciones_bp)
    app.register_blueprint(cancelar_postulacion_bp)
    app.register_blueprint(notificaciones_empresa_bp)
    app.register_blueprint(verificar_postulacion_bp)

    # Vacantes
    app.register_blueprint(crear_vacante_bp)
    app.register_blueprint(vacantes_bp)
    app.register_blueprint(ver_vacante_bp)

    # Empresa
    app.register_blueprint(perfil_empresa_bp)

    # Archivos estáticos
    app.register_blueprint(archivos_bp)


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
