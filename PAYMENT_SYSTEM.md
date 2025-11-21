# Sistema de Pagos con Tokens - FreeBridge

## 📋 Descripción General

Sistema de pagos integrado con Stripe que permite a las empresas comprar tokens para publicar vacantes. Cada token representa el derecho a publicar una vacante en la plataforma.

## 💰 Modelo de Negocio

- **1 Token = 1 Vacante Publicada**
- **Precio por Token**: $12,000 COP (≈ $3 USD)
- **Tokens de Bienvenida**: 5 tokens gratis al registrar empresa
- **Método de Pago**: Stripe (tarjetas de crédito/débito)

## 🏗️ Arquitectura del Sistema

### Backend (Flask)

#### Modelos de Base de Datos

**TOKEN_BALANCE** - Gestión de tokens por empresa

```sql
- id_balance (PK)
- id_emp (FK → EMPRESA)
- tokens_disponibles
- tokens_usados
- tokens_totales
- fecha_actualizacion
```

**TRANSACCION** - Historial de transacciones

```sql
- id (PK)
- id_emp (FK → EMPRESA)
- tipo (compra/uso/reembolso/inicial)
- cantidad_tokens
- monto_cop
- monto_usd
- estado (pendiente/completado/fallido)
- stripe_payment_intent_id
- descripcion
- fecha
```

#### Rutas de API (`/api/payment`)

1. **GET /config** - Obtener clave pública de Stripe
2. **GET /token-balance** - Balance de tokens de la empresa
3. **POST /create-payment-intent** - Crear intención de pago
4. **POST /webhook** - Webhook de Stripe para confirmaciones
5. **GET /transaction-history** - Historial de transacciones

#### Configuración (`utils/config.py`)

```python
STRIPE_SECRET_KEY = "sk_test_..."
STRIPE_PUBLISHABLE_KEY = "pk_test_..."
TOKEN_PRICE_USD = 3.00
USD_TO_COP_RATE = 4000
```

### Frontend (React)

#### Componentes de Pago

**TokenBalance** (`components/paymentComponents/TokenBalance.jsx`)

- Muestra balance actual de tokens
- Estadísticas de uso
- Botón para comprar tokens
- Integrado en dashboard de empresa

**TokenPurchase** (`components/paymentComponents/TokenPurchase.jsx`)

- Modal de compra con Stripe Elements
- Flujo de 2 pasos: selección → pago
- Integración con PaymentElement de Stripe
- Manejo de éxito/error

**TransactionHistory** (`components/paymentComponents/TransactionHistory.jsx`)

- Lista completa de transacciones
- Filtrado por tipo
- Información detallada de cada transacción

#### API Client (`api/paymentApi.js`)

```javascript
getStripeConfig(); // Obtener config de Stripe
getTokenBalance(); // Balance de tokens
createPaymentIntent(qty); // Crear intención de pago
getTransactionHistory(); // Historial
```

## 🔧 Configuración e Instalación

### 1. Dependencias

**Backend:**

```bash
cd server-flask
pip install stripe==11.1.1
```

**Frontend:**

```bash
cd client-react
npm install @stripe/stripe-js @stripe/react-stripe-js
```

### 2. Variables de Entorno

Crear/editar `server-flask/.env`:

```env
STRIPE_SECRET_KEY=sk_test_tu_clave_secreta
STRIPE_PUBLISHABLE_KEY=pk_test_tu_clave_publica
STRIPE_WEBHOOK_SECRET=whsec_tu_webhook_secret
```

**Obtener claves de Stripe:**

1. Ir a https://dashboard.stripe.com/test/apikeys
2. Crear cuenta de prueba gratuita
3. Copiar las claves de prueba (test mode)

### 3. Base de Datos

Ejecutar el script SQL:

```bash
mysql -u root -p freebridge < server-flask/database/add_tokens_system.sql
```

Este script crea:

- Tabla `TOKEN_BALANCE`
- Tabla `TRANSACCION`
- Trigger para asignar 5 tokens gratis a nuevas empresas

### 4. Configurar Webhook (Opcional para testing local)

Para recibir eventos de Stripe en local:

```bash
stripe listen --forward-to localhost:5000/api/payment/webhook
```

## 🧪 Testing

### Tarjetas de Prueba de Stripe

**Pago Exitoso:**

- Número: `4242 4242 4242 4242`
- Fecha: Cualquier fecha futura
- CVC: Cualquier 3 dígitos
- ZIP: Cualquier código

**Pago Rechazado:**

- Número: `4000 0000 0000 0002`

**Requiere Autenticación 3D Secure:**

- Número: `4000 0025 0000 3155`

### Flujo de Prueba

1. Registrar nueva empresa → Recibe 5 tokens gratis
2. Ir a "Mis Tokens" en el dashboard
3. Click en "Comprar Tokens"
4. Seleccionar cantidad (ej: 10 tokens = $120,000 COP)
5. Ingresar datos de tarjeta de prueba
6. Confirmar pago
7. Verificar que se acrediten los tokens
8. Publicar vacante → Se descuenta 1 token
9. Revisar historial de transacciones

## 📊 Flujo de Negocio

### Registro de Empresa

```
1. Usuario crea cuenta de empresa
2. Sistema crea registro en TOKEN_BALANCE
3. Asigna 5 tokens iniciales automáticamente
4. Registra transacción tipo "inicial"
```

### Compra de Tokens

```
1. Empresa selecciona cantidad de tokens
2. Frontend calcula total en COP
3. Crea PaymentIntent en Stripe
4. Usuario ingresa datos de tarjeta
5. Stripe procesa pago
6. Webhook confirma pago exitoso
7. Backend acredita tokens
8. Actualiza transacción a "completado"
```

### Publicación de Vacante

```
1. Empresa intenta publicar vacante
2. Sistema verifica tokens disponibles
3. Si tiene tokens: crea vacante y descuenta 1 token
4. Si no tiene: retorna error 402 Payment Required
5. Registra transacción tipo "uso"
```

## 🔒 Seguridad

- ✅ Autenticación JWT requerida para todas las rutas
- ✅ Validación de empresa propietaria de tokens
- ✅ Webhook firmado por Stripe (verificación de signature)
- ✅ Transacciones atómicas en base de datos
- ✅ Claves secretas en variables de entorno
- ✅ Modo test de Stripe (sin cargos reales)

## 🎨 Interfaz de Usuario

### Vista de Tokens

- Balance destacado con colores
- Estadísticas de uso
- Barra de progreso
- Advertencia si tokens bajos
- Botón prominente de compra

### Modal de Compra

- Diseño limpio en 2 pasos
- Cálculo automático de precios
- PaymentElement de Stripe integrado
- Feedback de éxito/error
- Cierre automático después de compra

### Historial

- Tarjetas por transacción
- Iconos por tipo de transacción
- Colores verde/rojo según positivo/negativo
- Información completa (fecha, monto, tokens, estado)
- Responsive para móvil

## 📱 Responsive Design

Todos los componentes están optimizados para:

- Desktop (>768px)
- Tablet (768px)
- Mobile (<768px)

## 🚀 Mejoras Futuras

1. **Paquetes de Tokens con Descuento**

   - 10 tokens: 5% descuento
   - 50 tokens: 10% descuento
   - 100 tokens: 15% descuento

2. **Suscripciones Mensuales**

   - Plan básico: 20 tokens/mes
   - Plan profesional: 50 tokens/mes
   - Plan empresarial: tokens ilimitados

3. **Sistema de Reembolso**

   - Vacante cancelada antes de 24h = reembolso token
   - Reembolso parcial por vacantes sin postulaciones

4. **Dashboard de Métricas**

   - ROI por vacante publicada
   - Costo por postulación recibida
   - Análisis de tendencias de gasto

5. **Notificaciones**
   - Email cuando tokens < 3
   - Resumen mensual de uso
   - Recordatorio de tokens sin usar

## 📞 Soporte

Para dudas sobre el sistema de pagos:

- Documentación de Stripe: https://stripe.com/docs
- Webhooks: https://stripe.com/docs/webhooks
- Testing: https://stripe.com/docs/testing

## 📄 Licencia

Proyecto FreeBridge - Sistema de Pagos con Tokens
