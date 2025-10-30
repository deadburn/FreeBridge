from utils.db import db
from sqlalchemy import Column, String, Enum


class Usuario(db.Model):
    __tablename__ = "usuario"

    id_usu = Column(String(10), primary_key=True)
    nombre = Column(String(100), nullable=False)
    correo = Column(String(100), unique=True, nullable=False)
    contraseña = Column(String(255), nullable=False)
    rol = Column(Enum("empresa", "freeLancer"), nullable=False)
    estado = Column(
        Enum("Activo", "Inactivo", "Bloqueado", "Eliminado"), default="Activo"
    )

    # Relaciones
    empresa = db.relationship("empresa", backref="usuario", uselist=False, lazy=True)
    freelancer = db.relationship(
        "freelancer", backref="usuario", uselist=False, lazy=True
    )
    productos = db.relationship("producto", backref="usuario", lazy=True)

    def __repr__(self):
        return f"<usuario {self.nombre}>"
