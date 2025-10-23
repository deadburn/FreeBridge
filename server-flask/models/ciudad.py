from utils.db import db


class Ciudad(db.Model):
    __tablename__ = "ciudad"

    id_ciud = db.Column(db.String(10), primary_key=True)
    nomb_ciud = db.Column(db.String(30), nullable=False)

    # Relaciones
    #empresas = db.relationship("Empresa", backref="ciudad", lazy=True)
    #freelancers = db.relationship("Freelancer", backref="ciudad", lazy=True)

    def __repr__(self):
        return f"<Ciudad {self.nomb_ciud}>"
