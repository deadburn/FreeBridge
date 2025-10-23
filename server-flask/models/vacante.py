from utils.db import db
from datetime import datetime


class Vacante(db.Model):
    __tablename__ = "VACANTE"

    id_vac = db.Column(db.String(11), primary_key=True)
    id_emp = db.Column(db.String(11), db.ForeignKey("EMPRESA.id_emp"), nullable=False)
    nombre_vacante = db.Column(db.String(50), nullable=False)
    descripcion = db.Column(db.Text, nullable=False)
    requisitos = db.Column(db.Text, nullable=False)
    salario = db.Column(db.Numeric(10, 2))
    fecha_publicacion = db.Column(db.Date, default=datetime.utcnow)
    estado_vac = db.Column(db.String(20), default="abierta")

    # Relaciones
    postulaciones = db.relationship("Postulacion", backref="vacante", lazy=True)

    def __repr__(self):
        return f"<Vacante {self.nombre_vacante}>"
