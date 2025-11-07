from utils.db import db


class Freelancer(db.Model):
    __tablename__ = "FREELANCER"

    id_free = db.Column(db.String(11), primary_key=True)
    id_usu = db.Column(db.String(11), db.ForeignKey("USUARIO.id_usu"), nullable=False)
    id_ciud = db.Column(db.String(11), db.ForeignKey("CIUDAD.id_ciud"), nullable=False)
    profesion = db.Column(db.String(50), nullable=False)
    portafolio_URL = db.Column(db.String(255))
    experiencia = db.Column(db.Text)

    # Relaciones
    postulaciones = db.relationship(
        "Postulacion",
        backref=db.backref("freelancer", lazy=True),
        lazy=True,
        primaryjoin="Freelancer.id_free == Postulacion.id_free",
    )

    def __repr__(self):
        return f"<freelancer {self.profesion}>"
