# 🚀 Guía Rápida - Sistema de Pagos FreeBridge

## Pasos de Configuración

### 1️⃣ Crear Cuenta en Stripe (5 minutos)

1. Ve a https://dashboard.stripe.com/register
2. Crea una cuenta gratuita
3. Activa el **Modo de Prueba** (Test Mode)
4. Ve a: **Developers → API keys**
5. Copia las claves:
   - `Publishable key` (empieza con `pk_test_`)
   - `Secret key` (empieza con `sk_test_`)

### 2️⃣ Configurar Backend

**Crear archivo `.env` en `server-flask/`:**

```env
# Claves de Stripe (REEMPLAZA CON TUS CLAVES)
STRIPE_SECRET_KEY=sk_test_TU_CLAVE_SECRETA_AQUI
STRIPE_PUBLISHABLE_KEY=pk_test_TU_CLAVE_PUBLICA_AQUI

# Opcional: webhook secret (solo si usas webhooks en local)
STRIPE_WEBHOOK_SECRET=whsec_tu_webhook_secret
```

**Verificar que stripe esté instalado:**

```bash
cd server-flask
pip install stripe==11.1.1
```

### 3️⃣ Configurar Base de Datos

**Ejecutar script SQL:**

```bash
mysql -u root -p freebridge < server-flask/database/add_tokens_system.sql
```

O manualmente en MySQL Workbench:

1. Abrir `server-flask/database/add_tokens_system.sql`
2. Ejecutar todo el script
3. Verificar que se crearon las tablas `TOKEN_BALANCE` y `TRANSACCION`

### 4️⃣ Instalar Dependencias Frontend

```bash
cd client-react
npm install @stripe/stripe-js @stripe/react-stripe-js
```

### 5️⃣ Iniciar Servidores

**Terminal 1 - Backend:**

```bash
cd server-flask
python app.py
```

**Terminal 2 - Frontend:**

```bash
cd client-react
npm run dev
```

### 6️⃣ Probar el Sistema

1. **Registrar nueva empresa:**

   - Ir a http://localhost:5173/register
   - Crear cuenta tipo "Empresa"
   - Completar perfil de empresa
   - ✅ Recibirás **5 tokens gratis** automáticamente

2. **Ver tokens:**

   - En el dashboard, click en "Mis Tokens"
   - Verás tu balance de 5 tokens

3. **Comprar tokens:**

   - Click en "Comprar Tokens"
   - Selecciona cantidad (ej: 10 tokens)
   - Usa tarjeta de prueba: `4242 4242 4242 4242`
   - Fecha: cualquier fecha futura
   - CVC: 123
   - ✅ Tokens se acreditan inmediatamente

4. **Publicar vacante:**

   - Click en "Publicar vacantes"
   - Llena el formulario
   - Al guardar, se descuenta 1 token
   - ✅ Verifica en "Mis Tokens" que se descontó

5. **Ver historial:**
   - Click en "Historial de Transacciones"
   - Verás todas las operaciones (compras, uso, tokens iniciales)

## 🧪 Tarjetas de Prueba de Stripe

| Escenario               | Número de Tarjeta     | Resultado              |
| ----------------------- | --------------------- | ---------------------- |
| ✅ Pago exitoso         | `4242 4242 4242 4242` | Aprobado               |
| ❌ Pago rechazado       | `4000 0000 0000 0002` | Rechazado              |
| 🔐 3D Secure            | `4000 0025 0000 3155` | Requiere autenticación |
| 💳 Fondos insuficientes | `4000 0000 0000 9995` | Fondos insuficientes   |

Para todas:

- **Fecha:** Cualquier mes/año futuro (ej: 12/28)
- **CVC:** Cualquier 3 dígitos (ej: 123)
- **ZIP:** Cualquier código (ej: 12345)

## ⚠️ Problemas Comunes

### "No se puede conectar a Stripe"

- ✅ Verifica que las claves estén en `.env`
- ✅ Reinicia el servidor Flask
- ✅ Las claves deben empezar con `pk_test_` y `sk_test_`

### "Tokens no se acreditan"

- ✅ Verifica que el script SQL se ejecutó correctamente
- ✅ Revisa la consola de Flask por errores
- ✅ Verifica que la transacción aparezca en la base de datos

### "Error al publicar vacante"

- ✅ Verifica que tengas tokens disponibles
- ✅ Si tienes tokens pero da error, revisa el modelo `TokenBalance`

### "Webhook no funciona"

En desarrollo local, los webhooks son opcionales. El sistema acredita tokens sin webhook usando polling. Para webhooks en local:

```bash
# Instalar Stripe CLI
stripe listen --forward-to localhost:5000/api/payment/webhook

# Copiar el webhook secret que muestra
# Agregarlo al .env como STRIPE_WEBHOOK_SECRET
```

## 📊 Verificar que Todo Funciona

Checklist de verificación:

- [ ] Backend corriendo en puerto 5000
- [ ] Frontend corriendo en puerto 5173
- [ ] Puedes registrar empresa
- [ ] Empresa recibe 5 tokens iniciales
- [ ] Puedes comprar tokens con tarjeta de prueba
- [ ] Tokens se acreditan correctamente
- [ ] Puedes publicar vacante
- [ ] Se descuenta 1 token al publicar
- [ ] Historial muestra todas las transacciones
- [ ] Si tokens = 0, no permite publicar

## 🎉 ¡Listo!

El sistema de pagos está completamente funcional.

**Siguiente paso:** Configurar claves de producción cuando estés listo para ir a producción.

## 📚 Documentación Completa

Ver `PAYMENT_SYSTEM.md` para:

- Arquitectura detallada
- Modelos de base de datos
- API endpoints
- Mejoras futuras
- Troubleshooting avanzado
