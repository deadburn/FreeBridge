from utils.db import db
from datetime import datetime


class Vacante(db.Model):
    __tablename__ = "VACANTE"

    id_vac = db.Column(db.String(36), primary_key=True)
    id_emp = db.Column(db.String(36), db.ForeignKey("EMPRESA.id_emp"), nullable=False)
    nomb_vacante = db.Column(db.String(50), nullable=False)
    descripcion = db.Column(db.Text, nullable=False)
    requisitos = db.Column(db.Text, nullable=False)
    salario = db.Column(db.Numeric(10, 2))
    fecha_publicacion = db.Column(db.DateTime, default=datetime.utcnow)
    estado_vac = db.Column(db.String(20), default="abierta")

    # Relaciones
    postulaciones = db.relationship(
        "Postulacion",
        backref=db.backref("vacante", lazy=True),
        lazy=True,
        primaryjoin="Vacante.id_vac == Postulacion.id_vac",
    )

    def __repr__(self):
        return f"<Vacante {self.nomb_vacante}>"
