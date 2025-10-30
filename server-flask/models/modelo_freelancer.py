from utils.db import db
from sqlalchemy import Column, String, ForeignKey, Text


class Freelancer(db.Model):
    __tablename__ = "freelancer"

    id_free = Column(String(11), primary_key=True)
    id_usu = Column(String(11), ForeignKey("usuario.id_usu"), nullable=False)
    id_ciud = Column(String(11), ForeignKey("ciudad.id_ciud"), nullable=False)
    profesion = Column(String(50), nullable=False)
    portafolio_URL = Column(String(255))
    experiencia = Column(Text)

    # Relaciones
    postulaciones = db.relationship("postulacion", backref="freelancer", lazy=True)

    def __repr__(self):
        return f"<freelancer {self.profesion}>"
