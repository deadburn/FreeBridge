from utils.db import db
from datetime import datetime, timedelta


class PasswordResetToken(db.Model):
    __tablename__ = "password_reset_tokens"

    id_reset = db.Column(db.String(36), primary_key=True)
    email = db.Column(db.String(100), nullable=False)
    token = db.Column(db.String(255), unique=True, nullable=False)
    expires_at = db.Column(db.DateTime, nullable=False)
    used = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __init__(self, id_reset, email, token, expires_in_hours=1):
        self.id_reset = id_reset
        self.email = email
        self.token = token
        self.expires_at = datetime.utcnow() + timedelta(hours=expires_in_hours)
        self.used = False

    def is_valid(self):
        """Verifica si el token es válido (no usado y no expirado)"""
        return not self.used and datetime.utcnow() < self.expires_at

    def mark_as_used(self):
        """Marca el token como usado"""
        self.used = True
        db.session.commit()
