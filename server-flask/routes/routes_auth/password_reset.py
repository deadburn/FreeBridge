"""
Blueprint para recuperación de contraseña
Endpoints:
- POST /api/auth/forgot-password: Solicita recuperación de contraseña
- POST /api/auth/reset-password: Restablece la contraseña con token
"""

from flask import Blueprint, request, jsonify
from models.modelo_usuarios import Usuario
from models.modelo_password_reset import PasswordResetToken
from utils.db import db
from werkzeug.security import generate_password_hash
from flask_mail import Message
import uuid
from datetime import datetime

password_reset_bp = Blueprint("password_reset", __name__)

# La instancia de mail se inyectará desde app.py
mail = None


@password_reset_bp.route("/api/auth/forgot-password", methods=["POST"])
def forgot_password():
    """
    Solicita recuperación de contraseña
    Genera un token y envía correo con enlace de recuperación
    """
    try:
        data = request.get_json()
        email = data.get("email")

        if not email:
            return jsonify({"error": "El email es requerido"}), 400

        # Buscar usuario por email
        usuario = Usuario.query.filter_by(correo=email).first()

        if not usuario:
            # Por seguridad, no revelamos si el email existe o no
            return (
                jsonify(
                    {
                        "message": "Si el correo existe, recibirás un enlace de recuperación"
                    }
                ),
                200,
            )

        # Generar token único
        reset_token = str(uuid.uuid4())
        reset_id = str(uuid.uuid4())[:10]

        # Crear registro de token en BD
        password_reset = PasswordResetToken(
            id_reset=reset_id,
            email=email,
            token=reset_token,
            expires_in_hours=1,  # Token válido por 1 hora
        )

        db.session.add(password_reset)
        db.session.commit()

        # Construir enlace de recuperación
        reset_link = f"http://localhost:5173/reset-password?token={reset_token}"

        # Enviar correo electrónico
        try:
            msg = Message(
                subject="Recuperación de Contraseña - FreeBridge",
                recipients=[email],
                sender="noreply@freebridge.com",
            )

            msg.html = f"""
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body {{
                        font-family: Arial, sans-serif;
                        line-height: 1.6;
                        color: #333;
                    }}
                    .container {{
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                        background-color: #f4f4f4;
                    }}
                    .content {{
                        background-color: white;
                        padding: 30px;
                        border-radius: 10px;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    }}
                    .header {{
                        color: #16685a;
                        text-align: center;
                        margin-bottom: 20px;
                    }}
                    .button {{
                        display: inline-block;
                        padding: 12px 30px;
                        background: linear-gradient(135deg, #16a085 0%, #16685a 100%);
                        color: white;
                        text-decoration: none;
                        border-radius: 5px;
                        margin: 20px 0;
                    }}
                    .footer {{
                        text-align: center;
                        margin-top: 20px;
                        color: #666;
                        font-size: 12px;
                    }}
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="content">
                        <h2 class="header">Recuperación de Contraseña</h2>
                        <p>Hola,</p>
                        <p>Recibimos una solicitud para restablecer la contraseña de tu cuenta en FreeBridge.</p>
                        <p>Haz clic en el siguiente botón para crear una nueva contraseña:</p>
                        <div style="text-align: center;">
                            <a href="{reset_link}" class="button">Restablecer Contraseña</a>
                        </div>
                        <p><strong>Este enlace expirará en 1 hora.</strong></p>
                        <p>Si no solicitaste este cambio, puedes ignorar este correo de forma segura.</p>
                        <p>Saludos,<br>El equipo de FreeBridge</p>
                    </div>
                    <div class="footer">
                        <p>Si tienes problemas con el botón, copia y pega este enlace en tu navegador:</p>
                        <p>{reset_link}</p>
                    </div>
                </div>
            </body>
            </html>
            """

            password_reset_bp.mail.send(msg)
            print(f"✅ Correo enviado a {email}")
            print(f"🔗 Token: {reset_token}")
            print(f"🔗 Link: {reset_link}")

        except Exception as e:
            print(f"❌ Error al enviar correo: {str(e)}")
            # Aún así retornamos éxito para no revelar info

        return (
            jsonify(
                {"message": "Si el correo existe, recibirás un enlace de recuperación"}
            ),
            200,
        )

    except Exception as e:
        print(f"Error en forgot_password: {str(e)}")
        return jsonify({"error": "Error al procesar la solicitud"}), 500


@password_reset_bp.route("/api/auth/reset-password", methods=["POST"])
def reset_password():
    """
    Restablece la contraseña usando el token válido
    """
    try:
        data = request.get_json()
        token = data.get("token")
        new_password = data.get("password")

        if not token or not new_password:
            return jsonify({"error": "Token y contraseña son requeridos"}), 400

        if len(new_password) < 6:
            return (
                jsonify({"error": "La contraseña debe tener al menos 6 caracteres"}),
                400,
            )

        # Buscar token en BD
        password_reset = PasswordResetToken.query.filter_by(token=token).first()

        if not password_reset:
            return jsonify({"error": "Token inválido o expirado"}), 400

        # Verificar que el token sea válido (no usado y no expirado)
        if not password_reset.is_valid():
            return jsonify({"error": "Token inválido o expirado"}), 400

        # Buscar usuario
        usuario = Usuario.query.filter_by(correo=password_reset.email).first()

        if not usuario:
            return jsonify({"error": "Usuario no encontrado"}), 404

        # Actualizar contraseña
        usuario.contraseña = generate_password_hash(new_password)

        # Marcar token como usado
        password_reset.mark_as_used()

        db.session.commit()

        print(f"✅ Contraseña actualizada para {usuario.correo}")

        return jsonify({"message": "Contraseña restablecida exitosamente"}), 200

    except Exception as e:
        print(f"Error en reset_password: {str(e)}")
        db.session.rollback()
        return jsonify({"error": "Error al restablecer la contraseña"}), 500
