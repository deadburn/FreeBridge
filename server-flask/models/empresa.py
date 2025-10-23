from utils.db import db


class Empresa(db.Model):
    __tablename__ = "EMPRESA"

    id_emp = db.Column(db.String(11), primary_key=True)
    id_usu = db.Column(db.String(11), db.ForeignKey("USUARIO.id_usu"), nullable=False)
    id_ciud = db.Column(db.String(11), db.ForeignKey("CIUDAD.id_ciud"), nullable=False)
    nomb_emp = db.Column(db.String(100), nullable=False)
    NIT = db.Column(db.String(20), unique=True, nullable=False)
    tamaño = db.Column(db.Enum("Pequeña", "Mediana", "Grande"), nullable=False)

    # Relaciones
    vacantes = db.relationship("Vacante", backref="empresa", lazy=True)

    def __repr__(self):
        return f"<Empresa {self.nomb_emp}>"
