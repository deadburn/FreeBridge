"""
Script de verificación del sistema de pagos
Ejecutar: python test_payment_system.py
"""

import os
import sys
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()


def check_stripe_config():
    """Verificar configuración de Stripe"""
    print("🔍 Verificando configuración de Stripe...")

    secret_key = os.getenv("STRIPE_SECRET_KEY")
    public_key = os.getenv("STRIPE_PUBLISHABLE_KEY")

    if not secret_key:
        print("❌ STRIPE_SECRET_KEY no encontrada en .env")
        return False

    if not public_key:
        print("❌ STRIPE_PUBLISHABLE_KEY no encontrada en .env")
        return False

    if not secret_key.startswith("sk_test_"):
        print("⚠️  ADVERTENCIA: Usando clave de producción. Cambia a modo test.")
    else:
        print("✅ Claves de Stripe configuradas (modo test)")

    return True


def check_stripe_connection():
    """Verificar conexión con Stripe API"""
    print("\n🌐 Verificando conexión con Stripe API...")

    try:
        import stripe

        stripe.api_key = os.getenv("STRIPE_SECRET_KEY")

        # Intentar obtener la cuenta
        account = stripe.Account.retrieve()
        print(f"✅ Conectado a Stripe API")
        print(f"   Cuenta: {account.get('email', 'N/A')}")
        return True
    except ImportError:
        print("❌ Módulo 'stripe' no instalado. Ejecuta: pip install stripe")
        return False
    except Exception as e:
        print(f"❌ Error al conectar con Stripe: {str(e)}")
        return False


def check_database_tables():
    """Verificar que existan las tablas necesarias"""
    print("\n🗄️  Verificando tablas de base de datos...")

    try:
        from utils.db import db
        from models.modelo_token import TokenBalance, Transaccion

        # Intentar hacer una consulta simple
        balance_count = db.session.query(TokenBalance).count()
        trans_count = db.session.query(Transaccion).count()

        print(f"✅ Tabla TOKEN_BALANCE existe ({balance_count} registros)")
        print(f"✅ Tabla TRANSACCION existe ({trans_count} registros)")
        return True
    except Exception as e:
        print(f"❌ Error en base de datos: {str(e)}")
        print("   ¿Ejecutaste el script add_tokens_system.sql?")
        return False


def check_payment_routes():
    """Verificar que las rutas de pago estén registradas"""
    print("\n🛣️  Verificando rutas de pago...")

    try:
        from app import app

        routes = []
        for rule in app.url_map.iter_rules():
            if "payment" in rule.rule:
                routes.append(rule.rule)

        expected_routes = [
            "/api/payment/config",
            "/api/payment/token-balance",
            "/api/payment/create-payment-intent",
            "/api/payment/webhook",
            "/api/payment/transaction-history",
        ]

        missing = []
        for route in expected_routes:
            if route in routes:
                print(f"✅ {route}")
            else:
                print(f"❌ {route} - NO ENCONTRADA")
                missing.append(route)

        return len(missing) == 0
    except Exception as e:
        print(f"❌ Error al verificar rutas: {str(e)}")
        return False


def check_frontend_packages():
    """Verificar paquetes del frontend"""
    print("\n📦 Verificando paquetes del frontend...")

    try:
        import json

        package_json_path = os.path.join(
            os.path.dirname(__file__), "..", "client-react", "package.json"
        )

        if not os.path.exists(package_json_path):
            print("⚠️  No se encontró package.json del frontend")
            return False

        with open(package_json_path, "r", encoding="utf-8") as f:
            package_data = json.load(f)

        dependencies = package_data.get("dependencies", {})

        required = {
            "@stripe/stripe-js": "Stripe.js",
            "@stripe/react-stripe-js": "React Stripe Elements",
        }

        all_found = True
        for pkg, name in required.items():
            if pkg in dependencies:
                print(f"✅ {name} instalado ({dependencies[pkg]})")
            else:
                print(f"❌ {name} NO instalado")
                all_found = False

        if not all_found:
            print("\n   Ejecuta: npm install @stripe/stripe-js @stripe/react-stripe-js")

        return all_found
    except Exception as e:
        print(f"❌ Error al verificar paquetes: {str(e)}")
        return False


def test_token_price_calculation():
    """Probar cálculo de precios"""
    print("\n💰 Probando cálculo de precios...")

    try:
        from utils.config import TOKEN_PRICE_USD, USD_TO_COP_RATE

        tokens = 10
        price_cop = tokens * TOKEN_PRICE_USD * USD_TO_COP_RATE
        price_usd = tokens * TOKEN_PRICE_USD

        print(f"✅ {tokens} tokens = ${price_cop:,.0f} COP (≈ ${price_usd:.2f} USD)")
        print(f"   1 token = ${TOKEN_PRICE_USD * USD_TO_COP_RATE:,.0f} COP")

        return True
    except Exception as e:
        print(f"❌ Error al calcular precios: {str(e)}")
        return False


def main():
    """Ejecutar todas las verificaciones"""
    print("=" * 60)
    print("🔧 VERIFICACIÓN DEL SISTEMA DE PAGOS - FreeBridge")
    print("=" * 60)

    results = []

    results.append(("Configuración de Stripe", check_stripe_config()))
    results.append(("Conexión con Stripe API", check_stripe_connection()))
    results.append(("Tablas de base de datos", check_database_tables()))
    results.append(("Rutas de pago", check_payment_routes()))
    results.append(("Paquetes del frontend", check_frontend_packages()))
    results.append(("Cálculo de precios", test_token_price_calculation()))

    print("\n" + "=" * 60)
    print("📊 RESUMEN")
    print("=" * 60)

    passed = 0
    failed = 0

    for name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status} - {name}")
        if result:
            passed += 1
        else:
            failed += 1

    print("\n" + "=" * 60)
    print(f"Resultado: {passed}/{len(results)} verificaciones exitosas")
    print("=" * 60)

    if failed > 0:
        print("\n⚠️  Hay problemas que deben solucionarse.")
        print("Ver PAYMENT_SETUP_GUIDE.md para instrucciones.")
        sys.exit(1)
    else:
        print("\n🎉 ¡Todo está configurado correctamente!")
        print("El sistema de pagos está listo para usar.")
        sys.exit(0)


if __name__ == "__main__":
    main()
