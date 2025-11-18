"""
Blueprint para actualizar el estado de las postulaciones
"""

from flask import Blueprint, request, jsonify
from utils.db import db
from utils.auth import token_required
from models.modelo_postulacion import Postulacion
from models.modelo_freelancer import Freelancer
from models.modelo_vacante import Vacante
from flask_mail import Message

actualizar_estado_bp = Blueprint("actualizar_estado", __name__)

# mail se asignará desde app.py
mail = None


@actualizar_estado_bp.route("/api/postulacion/estado/<id_post>", methods=["PUT"])
@token_required
def actualizar_estado_postulacion(current_user, id_post):
    """
    Actualiza el estado de una postulación (aceptada/rechazada)
    y envía notificación por email al freelancer
    """
    try:
        data = request.get_json()
        nuevo_estado = data.get("estado")

        # Validar estado
        if nuevo_estado not in ["aceptada", "rechazada"]:
            return (
                jsonify(
                    {
                        "success": False,
                        "error": "Estado inválido. Debe ser 'aceptada' o 'rechazada'",
                    }
                ),
                400,
            )

        # Buscar la postulación
        postulacion = Postulacion.query.filter_by(id_post=id_post).first()
        if not postulacion:
            return (
                jsonify({"success": False, "error": "Postulación no encontrada"}),
                404,
            )

        # Obtener información del freelancer y la vacante
        freelancer = Freelancer.query.filter_by(id_free=postulacion.id_free).first()
        vacante = Vacante.query.filter_by(id_vac=postulacion.id_vac).first()

        if not freelancer or not vacante:
            return (
                jsonify(
                    {
                        "success": False,
                        "error": "No se pudo obtener información completa",
                    }
                ),
                404,
            )

        # Actualizar estado
        postulacion.estado_post = nuevo_estado
        db.session.commit()

        # Enviar email al freelancer
        try:
            print(f"Intentando enviar email a: {freelancer.usuario.correo}")
            print(f"Estado de la postulación: {nuevo_estado}")
            enviar_email_notificacion(
                freelancer=freelancer, vacante=vacante, estado=nuevo_estado
            )
            print("✓ Email enviado exitosamente")
        except Exception as email_error:
            print(f"✗ Error al enviar email: {str(email_error)}")
            import traceback

            traceback.print_exc()
            # No fallar si el email no se puede enviar

        return (
            jsonify(
                {
                    "success": True,
                    "message": f"Postulación {nuevo_estado} exitosamente",
                    "postulacion": {
                        "id": postulacion.id_post,
                        "estado": postulacion.estado_post,
                    },
                }
            ),
            200,
        )

    except Exception as e:
        db.session.rollback()
        return jsonify({"success": False, "error": str(e)}), 500


def enviar_email_notificacion(freelancer, vacante, estado):
    """
    Envía email de notificación al freelancer sobre el estado de su postulación
    """
    from flask import current_app

    usuario = freelancer.usuario
    print(f"Preparando email para: {usuario.correo}")
    print(f"Estado: {estado}")
    print(f"Mail object: {actualizar_estado_bp.mail}")

    if estado == "aceptada":
        asunto = f"¡Felicidades! Tu postulación fue aceptada - {vacante.nomb_vacante}"
        html_body = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: linear-gradient(135deg, #16a085 0%, #16685a 100%); 
                           color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
                .content {{ background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }}
                .success-badge {{ background: #27ae60; color: white; padding: 10px 20px; 
                                 border-radius: 20px; display: inline-block; margin: 20px 0; }}
                .vacancy-info {{ background: white; padding: 20px; border-radius: 10px; 
                                margin: 20px 0; border-left: 4px solid #16a085; }}
                .footer {{ text-align: center; margin-top: 30px; color: #777; font-size: 14px; }}
                .button {{ background: #16a085; color: white; padding: 12px 30px; 
                          text-decoration: none; border-radius: 5px; display: inline-block; 
                          margin: 20px 0; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🎉 ¡Felicidades {usuario.nombre}!</h1>
                </div>
                <div class="content">
                    <div class="success-badge">✓ Postulación Aceptada</div>
                    
                    <p>Nos complace informarte que tu postulación ha sido <strong>aceptada</strong>.</p>
                    
                    <div class="vacancy-info">
                        <h3>📋 Detalles de la Vacante</h3>
                        <p><strong>Puesto:</strong> {vacante.nomb_vacante}</p>
                        <p><strong>Descripción:</strong> {vacante.descripcion}</p>
                        {f'<p><strong>Salario:</strong> ${vacante.salario:,.0f}</p>' if vacante.salario else ''}
                    </div>
                    
                    <p>La empresa se pondrá en contacto contigo pronto con los siguientes pasos.</p>
                    
                    <p><strong>Próximos pasos:</strong></p>
                    <ul>
                        <li>Mantente atento a tu correo electrónico</li>
                        <li>Prepara tu documentación</li>
                        <li>Revisa los detalles de la vacante</li>
                    </ul>
                    
                    <a href="http://localhost:5173/freelance-dashboard" class="button">
                        Ver Mis Postulaciones
                    </a>
                </div>
                <div class="footer">
                    <p>FreeBridge - Conectando talento con oportunidades</p>
                    <p>Este es un correo automático, por favor no respondas a este mensaje.</p>
                </div>
            </div>
        </body>
        </html>
        """
    else:  # rechazada
        asunto = f"Actualización sobre tu postulación - {vacante.nomb_vacante}"
        html_body = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: linear-gradient(135deg, #7f8c8d 0%, #5a6a7a 100%); 
                           color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
                .content {{ background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }}
                .info-badge {{ background: #7f8c8d; color: white; padding: 10px 20px; 
                              border-radius: 20px; display: inline-block; margin: 20px 0; }}
                .vacancy-info {{ background: white; padding: 20px; border-radius: 10px; 
                                margin: 20px 0; border-left: 4px solid #7f8c8d; }}
                .footer {{ text-align: center; margin-top: 30px; color: #777; font-size: 14px; }}
                .button {{ background: #16a085; color: white; padding: 12px 30px; 
                          text-decoration: none; border-radius: 5px; display: inline-block; 
                          margin: 20px 0; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Actualización de Postulación</h1>
                </div>
                <div class="content">
                    <p>Hola {usuario.nombre},</p>
                    
                    <p>Gracias por tu interés en la siguiente oportunidad:</p>
                    
                    <div class="vacancy-info">
                        <h3>📋 Detalles de la Vacante</h3>
                        <p><strong>Puesto:</strong> {vacante.nomb_vacante}</p>
                        <p><strong>Descripción:</strong> {vacante.descripcion}</p>
                    </div>
                    
                    <p>Lamentablemente, en esta ocasión hemos decidido continuar con otros candidatos 
                    cuyo perfil se ajusta más a nuestras necesidades actuales.</p>
                    
                    <p>Te animamos a seguir explorando otras oportunidades en FreeBridge que se ajusten 
                    a tu perfil profesional.</p>
                    
                    <p><strong>Recuerda:</strong></p>
                    <ul>
                        <li>Mantén tu perfil actualizado</li>
                        <li>Explora nuevas vacantes regularmente</li>
                        <li>Cada experiencia suma a tu crecimiento profesional</li>
                    </ul>
                    
                    <a href="http://localhost:5173/vacantes" class="button">
                        Ver Nuevas Vacantes
                    </a>
                </div>
                <div class="footer">
                    <p>FreeBridge - Conectando talento con oportunidades</p>
                    <p>Este es un correo automático, por favor no respondas a este mensaje.</p>
                </div>
            </div>
        </body>
        </html>
        """

    print(f"Creando mensaje de email...")
    print(f"Asunto: {asunto}")
    print(f"Destinatario: {usuario.correo}")

    msg = Message(subject=asunto, recipients=[usuario.correo], html=html_body)

    print("Enviando email...")
    actualizar_estado_bp.mail.send(msg)
    print("Email enviado correctamente")
