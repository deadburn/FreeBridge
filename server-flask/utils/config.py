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

    # Clave secreta para JWT
    SECRET_KEY = os.environ.get("SECRET_KEY", "tu_clave_secreta_temporal")

    # Configuración de Flask-Mail (Mailtrap para desarrollo)
    MAIL_SERVER = os.environ.get("MAIL_SERVER", "sandbox.smtp.mailtrap.io")
    MAIL_PORT = int(os.environ.get("MAIL_PORT", 2525))
    MAIL_USERNAME = os.environ.get("MAIL_USERNAME", "")
    MAIL_PASSWORD = os.environ.get("MAIL_PASSWORD", "")
    MAIL_USE_TLS = os.environ.get("MAIL_USE_TLS", "True") == "True"
    MAIL_USE_SSL = os.environ.get("MAIL_USE_SSL", "False") == "True"
    MAIL_DEFAULT_SENDER = os.environ.get(
        "MAIL_DEFAULT_SENDER", "noreply@freebridge.com"
    )
    MAIL_MAX_EMAILS = None
    MAIL_ASCII_ATTACHMENTS = False

    # Configuración de Stripe
    STRIPE_SECRET_KEY = os.environ.get("STRIPE_SECRET_KEY", "")
    STRIPE_PUBLISHABLE_KEY = os.environ.get("STRIPE_PUBLISHABLE_KEY", "")
    STRIPE_WEBHOOK_SECRET = os.environ.get("STRIPE_WEBHOOK_SECRET", "")

    # Precios de tokens
    TOKEN_PRICE_USD = 3.00  # Precio por token en USD
    USD_TO_COP_RATE = 4000  # Tasa de cambio aproximada (actualizar según necesidad)
