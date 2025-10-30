from app import app
from models.modelo_ciudad import Ciudad
from utils.db import db

with app.app_context():
    dato_codigo = "0001"
    dato_nombre = "Cucuta"
    try:
        # Probar la conexión
        db.engine.connect()
        print("✅ Conexión exitosa a la base de datos...................")

        # Crear las tablas
        db.create_all()
        print("✅ Tablas creadas correctamente....................")

        # Probar inserción
        Ciudad = Ciudad(id_ciud=dato_codigo, nomb_ciud=dato_nombre)
        db.session.add(Ciudad)
        db.session.commit()
        print("✅ Datos de prueba insertados")
        print(f"id_cuidad: {Ciudad.id_ciud} - { Ciudad.nomb_ciud}")

    except Exception as e:
        print(f"❌ Error: {e}")
