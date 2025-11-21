from flask import Blueprint, request, jsonify
from utils.auth import token_required
from utils.db import db
from utils.config import Config
from models.modelo_token import TokenBalance, Transaccion
from models.modelo_empresa import Empresa
import stripe
import uuid
from decimal import Decimal

# Configurar Stripe
stripe.api_key = Config.STRIPE_SECRET_KEY

payment_bp = Blueprint("payment", __name__, url_prefix="/api/payment")


@payment_bp.route("/config", methods=["GET"])
def get_config():
    """Obtener clave pública de Stripe"""
    return jsonify({"publishableKey": Config.STRIPE_PUBLISHABLE_KEY}), 200


@payment_bp.route("/token-balance", methods=["GET"])
@token_required
def get_token_balance(current_user):
    """Obtener balance de tokens de la empresa"""
    try:
        if current_user.rol != "Empresa":
            return jsonify({"error": "Solo empresas pueden consultar tokens"}), 403

        empresa = Empresa.query.filter_by(id_usu=current_user.id_usu).first()
        if not empresa:
            return jsonify({"error": "Perfil de empresa no encontrado"}), 404

        # Buscar o crear balance de tokens
        balance = TokenBalance.query.filter_by(id_emp=empresa.id_emp).first()
        if not balance:
            # Crear balance inicial con 5 tokens gratis
            balance = TokenBalance(
                id_balance=str(uuid.uuid4()),
                id_emp=empresa.id_emp,
                tokens_disponibles=5,
                tokens_usados=0,
            )
            db.session.add(balance)
            db.session.commit()

        return (
            jsonify(
                {
                    "tokens_disponibles": balance.tokens_disponibles,
                    "tokens_usados": balance.tokens_usados,
                    "total_adquiridos": balance.tokens_disponibles
                    + balance.tokens_usados,
                }
            ),
            200,
        )

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@payment_bp.route("/create-payment-intent", methods=["POST"])
@token_required
def create_payment_intent(current_user):
    """Crear un Payment Intent de Stripe para comprar tokens"""
    try:
        if current_user.rol != "Empresa":
            return jsonify({"error": "Solo empresas pueden comprar tokens"}), 403

        data = request.get_json()
        cantidad_tokens = data.get("cantidad_tokens", 1)

        if cantidad_tokens < 1 or cantidad_tokens > 100:
            return jsonify({"error": "Cantidad de tokens inválida (1-100)"}), 400

        empresa = Empresa.query.filter_by(id_usu=current_user.id_usu).first()
        if not empresa:
            return jsonify({"error": "Perfil de empresa no encontrado"}), 404

        # Calcular monto en COP (pesos colombianos)
        monto_usd = Decimal(str(Config.TOKEN_PRICE_USD)) * cantidad_tokens
        monto_cop = int(monto_usd * Config.USD_TO_COP_RATE)

        # Crear Payment Intent en Stripe
        # Stripe maneja montos en centavos, así que multiplicamos por 100
        payment_intent = stripe.PaymentIntent.create(
            amount=monto_cop * 100,  # Convertir a centavos
            currency="cop",
            metadata={
                "empresa_id": empresa.id_emp,
                "cantidad_tokens": cantidad_tokens,
                "user_id": current_user.id_usu,
            },
            description=f"Compra de {cantidad_tokens} token(es) para publicar vacantes",
        )

        # Registrar transacción pendiente
        transaccion = Transaccion(
            id_trans=str(uuid.uuid4()),
            id_emp=empresa.id_emp,
            tipo="compra",
            cantidad_tokens=cantidad_tokens,
            monto=monto_cop,
            moneda="COP",
            stripe_payment_intent_id=payment_intent.id,
            estado="pendiente",
            descripcion=f"Compra de {cantidad_tokens} token(es)",
        )
        db.session.add(transaccion)
        db.session.commit()

        return (
            jsonify(
                {
                    "clientSecret": payment_intent.client_secret,
                    "monto": monto_cop,
                    "cantidad_tokens": cantidad_tokens,
                }
            ),
            200,
        )

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@payment_bp.route("/webhook", methods=["POST"])
def stripe_webhook():
    """Webhook para recibir eventos de Stripe"""
    payload = request.data
    sig_header = request.headers.get("Stripe-Signature")

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, Config.STRIPE_WEBHOOK_SECRET
        )

        # Manejar el evento
        if event["type"] == "payment_intent.succeeded":
            payment_intent = event["data"]["object"]
            handle_successful_payment(payment_intent)

        elif event["type"] == "payment_intent.payment_failed":
            payment_intent = event["data"]["object"]
            handle_failed_payment(payment_intent)

        return jsonify({"status": "success"}), 200

    except:
        pass


@payment_bp.route("/confirm-payment/<payment_intent_id>", methods=["POST"])
@token_required
def confirm_payment(current_user, payment_intent_id):
    """Confirmar pago manualmente (para desarrollo sin webhook)"""
    try:
        if current_user.rol != "Empresa":
            return jsonify({"error": "Solo empresas pueden confirmar pagos"}), 403

        # Verificar el estado del payment intent en Stripe
        payment_intent = stripe.PaymentIntent.retrieve(payment_intent_id)

        if payment_intent.status == "succeeded":
            # Buscar la transacción pendiente
            transaccion = Transaccion.query.filter_by(
                stripe_payment_intent_id=payment_intent_id, estado="pendiente"
            ).first()

            if transaccion:
                # Actualizar estado
                transaccion.estado = "completado"

                # Acreditar tokens
                balance = TokenBalance.query.filter_by(
                    id_emp=transaccion.id_emp
                ).first()
                if balance:
                    balance.tokens_disponibles += transaccion.cantidad_tokens

                db.session.commit()

                return (
                    jsonify({"status": "success", "message": "Tokens acreditados"}),
                    200,
                )
            else:
                return jsonify({"error": "Transacción no encontrada"}), 404
        else:
            return (
                jsonify(
                    {"error": "Pago no completado", "status": payment_intent.status}
                ),
                400,
            )

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


def handle_successful_payment(payment_intent):
    """Procesar pago exitoso"""
    try:
        metadata = payment_intent.get("metadata", {})
        empresa_id = metadata.get("empresa_id")
        cantidad_tokens = int(metadata.get("cantidad_tokens", 0))

        if not empresa_id or cantidad_tokens <= 0:
            return

        # Actualizar transacción
        transaccion = Transaccion.query.filter_by(
            stripe_payment_intent_id=payment_intent.id
        ).first()

        if transaccion:
            transaccion.estado = "completada"

            # Actualizar balance de tokens
            balance = TokenBalance.query.filter_by(id_emp=empresa_id).first()
            if balance:
                balance.tokens_disponibles += cantidad_tokens
            else:
                # Crear balance si no existe
                balance = TokenBalance(
                    id_balance=str(uuid.uuid4()),
                    id_emp=empresa_id,
                    tokens_disponibles=cantidad_tokens,
                    tokens_usados=0,
                )
                db.session.add(balance)

            db.session.commit()

    except Exception as e:
        db.session.rollback()
        print(f"Error procesando pago exitoso: {str(e)}")


def handle_failed_payment(payment_intent):
    """Procesar pago fallido"""
    try:
        transaccion = Transaccion.query.filter_by(
            stripe_payment_intent_id=payment_intent.id
        ).first()

        if transaccion:
            transaccion.estado = "fallida"
            db.session.commit()

    except Exception as e:
        db.session.rollback()
        print(f"Error procesando pago fallido: {str(e)}")


@payment_bp.route("/transaction-history", methods=["GET"])
@token_required
def get_transaction_history(current_user):
    """Obtener historial de transacciones de la empresa"""
    try:
        if current_user.rol != "Empresa":
            return jsonify({"error": "Solo empresas pueden consultar historial"}), 403

        empresa = Empresa.query.filter_by(id_usu=current_user.id_usu).first()
        if not empresa:
            return jsonify({"error": "Perfil de empresa no encontrado"}), 404

        transacciones = (
            Transaccion.query.filter_by(id_emp=empresa.id_emp)
            .order_by(Transaccion.fecha_transaccion.desc())
            .limit(50)
            .all()
        )

        resultado = [
            {
                "id": t.id_trans,
                "tipo": t.tipo,
                "cantidad_tokens": t.cantidad_tokens,
                "monto_cop": float(t.monto) if t.monto else 0,
                "estado": t.estado,
                "stripe_payment_intent_id": t.stripe_payment_intent_id,
                "descripcion": t.descripcion,
                "fecha": (
                    t.fecha_transaccion.isoformat() if t.fecha_transaccion else None
                ),
            }
            for t in transacciones
        ]

        return jsonify({"transacciones": resultado}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
