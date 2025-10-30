from utils.db import db
from sqlalchemy import Column, String, ForeignKey, Enum


class Empresa(db.Model):
    __tablename__ = "empresa"

    id_emp = Column(String(11), primary_key=True)
    id_usu = Column(String(11), ForeignKey("usuario.id_usu"), nullable=False)
    id_ciud = Column(String(11), ForeignKey("ciudad.id_ciud"), nullable=False)
    nomb_emp = Column(String(100), nullable=False)
    NIT = Column(String(20), unique=True, nullable=False)
    tamaño = Column(Enum("Pequeña", "Mediana", "Grande"), nullable=False)
    desc_emp = Column(String(250), nullable=False)

    # Relaciones
    vacantes = db.relationship("vacante", backref="empresa", lazy=True)

    def __repr__(self):
        return f"<empresa {self.nomb_emp}>"
