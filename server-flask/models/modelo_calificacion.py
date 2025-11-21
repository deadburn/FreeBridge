from utils.db import db
from datetime import datetime


class Calificacion(db.Model):
    __tablename__ = "CALIFICACION"

    id_calif = db.Column(db.String(36), primary_key=True)
    id_post = db.Column(
        db.String(36), db.ForeignKey("POSTULACION.id_post"), nullable=False
    )
    id_emp = db.Column(db.String(36), db.ForeignKey("EMPRESA.id_emp"), nullable=False)
    id_free = db.Column(
        db.String(36), db.ForeignKey("FREELANCER.id_free"), nullable=False
    )
    puntuacion = db.Column(db.Integer, nullable=False)  # 1-5
    comentario = db.Column(db.Text)
    fecha_calif = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f"<Calificacion {self.id_calif} - {self.puntuacion} estrellas>"

    def to_dict(self):
        return {
            "id_calif": self.id_calif,
            "id_post": self.id_post,
            "id_emp": self.id_emp,
            "id_free": self.id_free,
            "puntuacion": self.puntuacion,
            "comentario": self.comentario,
            "fecha_calif": self.fecha_calif.isoformat() if self.fecha_calif else None,
        }
