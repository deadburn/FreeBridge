from utils.db import db


class Empresa(db.Model):
    __tablename__ = "EMPRESA"

    id_emp = db.Column(db.String(36), primary_key=True)
    id_usu = db.Column(db.String(36), db.ForeignKey("USUARIO.id_usu"), nullable=False)
    id_ciud = db.Column(db.String(36), db.ForeignKey("CIUDAD.id_ciud"), nullable=False)
    NIT = db.Column(db.String(20), unique=True, nullable=False)
    tamaño = db.Column(db.Enum("Pequeña", "Mediana", "Grande"), nullable=False)
    desc_emp = db.Column(db.String(250), nullable=False)
    logo = db.Column(db.String(255))  # Ruta del logo de la empresa

    # Relaciones
    vacantes = db.relationship(
        "Vacante",
        backref=db.backref("empresa", lazy=True),
        lazy=True,
        primaryjoin="Empresa.id_emp == Vacante.id_emp",
    )

    def __repr__(self):
        return f"<empresa {self.usuario.nombre if self.usuario else 'Sin nombre'}>"
