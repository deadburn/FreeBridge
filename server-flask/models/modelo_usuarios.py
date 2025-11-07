from utils.db import db


class Usuario(db.Model):
    __tablename__ = "USUARIO"

    id_usu = db.Column(db.String(10), primary_key=True)
    nombre = db.Column(db.String(100), nullable=False)
    correo = db.Column(db.String(100), unique=True, nullable=False)
    contraseña = db.Column(db.String(255), nullable=False)
    rol = db.Column(db.Enum("Empresa", "FreeLancer"), nullable=False)
    estado = db.Column(
        db.Enum("Activo", "Inactivo", "Bloqueado", "Eliminado"), default="Activo"
    )

    # Relaciones
    empresa = db.relationship(
        "Empresa",
        backref=db.backref("usuario", uselist=False),
        uselist=False,
        lazy=True,
        primaryjoin="Usuario.id_usu == Empresa.id_usu",
    )
    freelancer = db.relationship(
        "Freelancer",
        backref=db.backref("usuario", uselist=False),
        uselist=False,
        lazy=True,
        primaryjoin="Usuario.id_usu == Freelancer.id_usu",
    )

    def __repr__(self):
        return f"<usuario {self.nombre}>"
