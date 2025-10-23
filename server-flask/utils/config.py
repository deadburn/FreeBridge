import os
from dotenv import load_dotenv

load_dotenv()


class Config:
    """Configuración base de la aplicación"""

    # Configuración de la base de datos
    DB_HOST = os.environ.get("DB_HOST", "localhost")
    DB_USER = os.environ.get("DB_USER", "root")
    DB_PASSWORD = os.environ.get("DB_PASSWORD", " ")
    DB_NAME = os.environ.get("DB_NAME", "freebridge")
    DB_PORT = os.environ.get("DB_PORT", "3306")

    # URI de conexión a MySQL
    SQLALCHEMY_DATABASE_URI = (
        f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
    )

    # Desactivar el tracking de modificaciones
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Configuración adicional
    SQLALCHEMY_ECHO = True
