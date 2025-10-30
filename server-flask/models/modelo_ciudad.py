from utils.db import db
from sqlalchemy import Column, String


class Ciudad(db.Model):
    __tablename__ = "ciudad"

    id_ciud = Column(String(10), primary_key=True)
    nomb_ciud = Column(String(30), nullable=False)

    # Relaciones
    empresas = db.relationship("empresa", backref="ciudad", lazy=True)
    freelancers = db.relationship("freelancer", backref="ciudad", lazy=True)

    def __repr__(self):
        return f"<Ciudad {self.nomb_ciud}>"
