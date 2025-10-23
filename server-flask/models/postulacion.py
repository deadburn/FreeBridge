from utils.db import db
from datetime import datetime


class Postulacion(db.Model):
    __tablename__ = "POSTULACION"

    id_post = db.Column(db.String(10), primary_key=True)
    id_free = db.Column(
        db.String(10), db.ForeignKey("FREELANCER.id_free"), nullable=False
    )
    id_vac = db.Column(db.String(10), db.ForeignKey("VACANTE.id_vac"), nullable=False)
    fecha_post = db.Column(db.Date, default=datetime.utcnow)
    estado_post = db.Column(db.String(20), default="pendiente")

    def __repr__(self):
        return f"<Postulacion {self.id_post}>"
