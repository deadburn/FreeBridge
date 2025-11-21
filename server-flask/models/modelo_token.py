from utils.db import db
from datetime import datetime


class TokenBalance(db.Model):
    """Modelo para gestionar el balance de tokens de cada empresa"""

    __tablename__ = "TOKEN_BALANCE"

    id_balance = db.Column(db.String(36), primary_key=True)
    id_emp = db.Column(db.String(36), db.ForeignKey("EMPRESA.id_emp"), nullable=False)
    tokens_disponibles = db.Column(db.Integer, default=0)
    tokens_usados = db.Column(db.Integer, default=0)
    fecha_actualizacion = db.Column(
        db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    def __repr__(self):
        return f"<TokenBalance empresa={self.id_emp} disponibles={self.tokens_disponibles}>"


class Transaccion(db.Model):
    """Modelo para registrar transacciones de tokens"""

    __tablename__ = "TRANSACCION"

    id_trans = db.Column(db.String(36), primary_key=True)
    id_emp = db.Column(db.String(36), db.ForeignKey("EMPRESA.id_emp"), nullable=False)
    tipo = db.Column(db.String(20), nullable=False)  # compra, uso, reembolso
    cantidad_tokens = db.Column(db.Integer, nullable=False)
    monto = db.Column(db.Numeric(10, 2))
    moneda = db.Column(db.String(3), default="COP")
    stripe_payment_intent_id = db.Column(db.String(255))
    estado = db.Column(
        db.String(20), default="pendiente"
    )  # pendiente, completada, fallida, reembolsada
    descripcion = db.Column(db.Text)
    fecha_transaccion = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f"<Transaccion {self.id_trans} tipo={self.tipo} tokens={self.cantidad_tokens}>"
