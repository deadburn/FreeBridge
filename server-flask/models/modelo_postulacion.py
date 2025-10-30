from utils.db import db
from datetime import datetime
from sqlalchemy import Column, String, ForeignKey, DateTime


class Postulacion(db.Model):
    __tablename__ = "postulacion"
    id_post = Column(String(11), primary_key=True)
    id_free = Column(String(11), ForeignKey("freelancerid_free"), nullable=False)
    id_vac = Column(String(11), ForeignKey("vacanteid_vac"), nullable=False)
    fecha_post = Column(DateTime, default=datetime.utcnow)
    estado_post = Column(String(20), default="pendiente")


def __repr__(self):
    return f"<postulacion {self.id_post}>"
