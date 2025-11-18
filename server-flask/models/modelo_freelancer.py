from utils.db import db


class Freelancer(db.Model):
    __tablename__ = "FREELANCER"

    id_free = db.Column(db.String(36), primary_key=True)
    id_usu = db.Column(db.String(36), db.ForeignKey("USUARIO.id_usu"), nullable=False)
    id_ciud = db.Column(db.String(36), db.ForeignKey("CIUDAD.id_ciud"), nullable=False)
    profesion = db.Column(db.String(50), nullable=False)
    experiencia = db.Column(db.Text)
    hoja_vida = db.Column(db.String(255))  # Ruta del archivo PDF
    avatar = db.Column(
        db.String(255)
    )  # Ruta del avatar o nombre del avatar por defecto

    # Relaciones
    postulaciones = db.relationship(
        "Postulacion",
        backref=db.backref("freelancer", lazy=True),
        lazy=True,
        primaryjoin="Freelancer.id_free == Postulacion.id_free",
    )

    def __repr__(self):
        nombre = self.usuario.nombre if self.usuario else "Sin nombre"
        return f"<freelancer {nombre} - {self.profesion}>"
