from utils.db import db
from datetime import datetime
from sqlalchemy import Column, String, Text, Numeric, ForeignKey, DateTime


class Vacante(db.Model):
    __tablename__ = "vacante"

    id_vac = Column(String(11), primary_key=True)
    id_emp = Column(String(11), ForeignKey("empresa.id_emp"), nullable=False)
    nomb_vacante = Column(String(50), nullable=False)
    descripcion = Column(Text, nullable=False)
    requisitos = Column(Text, nullable=False)
    salario = Column(Numeric(10, 2))
    fecha_publicacion = Column(DateTime, default=datetime.utcnow)
    estado_vac = Column(String(20), default="abierta")

    # Relaciones
    postulaciones = db.relationship("postulacion", backref="vacante", lazy=True)

    def __repr__(self):
        return f"<Vacante {self.nomb_vacante}>"
