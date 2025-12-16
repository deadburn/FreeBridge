# 🧪 Guía de Pruebas Postman - FreeBridge

## 🎯 FLUJO AUTOMATIZADO COMPLETO

Esta colección ahora crea automáticamente:

- ✅ 2 usuarios (Empresa + Freelancer) con correos únicos usando `{{$timestamp}}`
- ✅ **Los correos se guardan automáticamente** en variables de entorno
- ✅ Los logins reutilizan los correos guardados (no más errores 401)
- ✅ Ambos perfiles completos (Empresa y Freelancer)
- ✅ Flujo completo: Crear vacante → Postular → Verificar
- ⚠️ **Solo 1 paso manual:** Asignar tokens via SQL (te muestra el comando exacto)

## 📦 Archivos Incluidos:

- `FreeBridge_Postman_Collection.json` - Colección con 11 tests funcionales
- `FreeBridge_Postman_Environment.json` - Variables de entorno

---

## 🔑 Cómo Funciona el Sistema de Correos Únicos

**Problema resuelto:** Cada vez que ejecutas las pruebas, los correos deben ser únicos para evitar error "usuario ya existe".

**Solución implementada:**

1. **Test 1.1** genera correo: `empresa{{$timestamp}}@techsolutions.com`

   - `{{$timestamp}}` es una variable de Postman que genera el timestamp actual
   - Ejemplo: `empresa1701952341@techsolutions.com`
   - ✅ El correo se **guarda automáticamente** en la variable `empresa_correo`

2. **Test 1.3** usa el correo guardado: `{{empresa_correo}}`

   - No genera un nuevo timestamp, usa el mismo correo del registro
   - ✅ El login funciona correctamente

3. Lo mismo para Freelancer:
   - Test 1.2: genera `freelancer{{$timestamp}}@test.com` → guarda en `freelancer_correo`
   - Test 1.4: usa `{{freelancer_correo}}` para login

**Ventaja:** Cada ejecución crea nuevos usuarios sin conflictos, y los logins usan los correos correctos.

---

## 🔍 Diagnóstico de Errores en Tiempo Real

### **Paso 1: Verificar qué falló exactamente**

En Postman, cuando un test falle:

1. Click en el test fallido
2. Ve a la pestaña **"Body"** para ver la respuesta del servidor
3. Ve a la **"Console"** (abajo) para ver detalles

### **Paso 2: Errores Comunes y Respuestas**

| Error en Respuesta                              | Causa              | Solución                                            |
| ----------------------------------------------- | ------------------ | --------------------------------------------------- |
| `401 "Usuario no encontrado"`                   | Test 1.3/1.4 Login | ✅ **SOLUCIONADO:** Correo guardado automáticamente |
| `"error": "Perfil de empresa no encontrado"`    | Test 1.6           | Crear perfil de empresa (ver arriba)                |
| `"error": "No tienes tokens suficientes"`       | Test 1.6           | Asignar tokens (ver SQL arriba)                     |
| `"error": "Solo freelancers pueden postularse"` | Test 1.8           | Verificar que uses `{{freelancer_token}}`           |
| `"error": "Perfil de freelancer no encontrado"` | Test 1.8           | Asegurar que test 1.5 pasó                          |
| `"error": "Vacante no encontrada"`              | Test 1.8           | Verificar que `{{vacante_id}}` tiene valor          |

### **Paso 3: Verificar Variables de Entorno**

Click en el ícono del ojo 👁️ (arriba derecha) y verificar:

```
✅ base_url = http://localhost:5000/api
✅ empresa_correo = empresa1234567890@techsolutions.com
✅ freelancer_correo = freelancer1234567890@test.com
✅ token = (debe tener un JWT largo)
✅ freelancer_token = (debe tener un JWT largo)
✅ empresa_user_id = (debe tener un ID)
✅ freelancer_user_id = (debe tener un ID)
✅ vacante_id = (debe tener un ID después del test 1.6)
```

Si alguna variable está **vacía**, el test que la debería guardar falló.

---

## 🚀 Setup Inicial: Base de Datos Limpia

### **Paso 1: Reiniciar la Base de Datos**

```powershell
# Detener el servidor Flask (Ctrl+C)
cd c:\freebridge-React-flask\server-flask
$env:RESET_DB="1"; python index.py
```

Verás el mensaje: `Database dropped and recreated (RESET_DB=1)`

### **Paso 2: Insertar Datos Iniciales (Ciudades)**

Conecta a MySQL y ejecuta:

```sql
USE freebridge_db;

INSERT INTO Ciudad (id_ciu, nomb_ciu) VALUES
(1, 'Bogotá'),
(2, 'Medellín'),
(3, 'Cali'),
(4, 'Barranquilla'),
(5, 'Cartagena');
```

O desde PowerShell:

```powershell
mysql -u root -p -e "USE freebridge_db; INSERT INTO Ciudad (id_ciu, nomb_ciu) VALUES (1, 'Bogotá'), (2, 'Medellín'), (3, 'Cali'), (4, 'Barranquilla'), (5, 'Cartagena');"
```

### **Paso 3: Importar Colección en Postman**

1. Abrir Postman
2. Click en **Import**
3. Arrastrar ambos archivos:
   - `FreeBridge_Postman_Collection.json`
   - `FreeBridge_Postman_Environment.json`
4. Seleccionar environment **"FreeBridge Local"** en el dropdown superior derecho

### **Paso 4: Ejecutar Pruebas Funcionales - FLUJO REORGANIZADO ✅**

**El flujo ahora sigue el orden lógico: Empresa completa → Freelancer completo → Interacciones**

1. Expandir colección "FreeBridge API Tests"
2. Click derecho en carpeta **"1. Pruebas Funcionales"**
3. Click en **"Run folder"**

**⏸️ PAUSA MANUAL después del test 1.3:**

Después de que se ejecute **"1.3 Crear Perfil Empresa"**:

- Ver en **Console** el mensaje: `✅ Empresa ID guardado: XXXXX`
- O verificar variable: Click en 👁️ → buscar `empresa_id`

**Ejecutar SQL para asignar tokens:**

```sql
INSERT INTO TokenBalance VALUES (UUID(), 'TU_EMPRESA_ID_AQUI', 10, 0, 10);
```

Luego **continuar** con los tests 1.5 en adelante.

**📊 Progreso esperado:**

```
Tests 1.1-1.3: EMPRESA (Usuario + Login + Perfil) → 3/3 ✅
Test 1.4: PAUSA para SQL ⏸️
Tests 1.5-1.7: FREELANCER (Usuario + Login + Perfil) → 3/3 ✅
Tests 1.8-1.11: INTERACCIONES (Vacante + Postular + Ver) → 4/4 ✅
```

**Resultado final esperado: 11/11 tests PASS** ✅

---

## 📋 Estructura de Pruebas - FLUJO REORGANIZADO (✅ ORDEN LÓGICO)

### **1. Pruebas Funcionales (11 tests)**

**✅ FLUJO EMPRESA (Tests 1.1 - 1.4):**

```
1.1 ✅ Registro de Empresa
    └─ Guarda: empresa_user_id, empresa_correo

1.2 ✅ Login Empresa
    └─ Usa: empresa_correo
    └─ Guarda: token

1.3 ✅ Crear Perfil Empresa
    └─ Usa: empresa_user_id
    └─ Guarda: empresa_id

1.4 ⚠️ Asignar Tokens a Empresa (MANUAL SQL)
    └─ Usa: empresa_id
    └─ SQL: INSERT INTO TokenBalance VALUES (UUID(), 'empresa_id', 10, 0, 10);
```

**✅ FLUJO FREELANCER (Tests 1.5 - 1.7):**

```
1.5 ✅ Registro de Freelancer
    └─ Guarda: freelancer_user_id, freelancer_correo

1.6 ✅ Login Freelancer
    └─ Usa: freelancer_correo
    └─ Guarda: freelancer_token

1.7 ✅ Crear Perfil Freelancer
    └─ Usa: freelancer_user_id
```

**✅ FLUJO VACANTES Y POSTULACIONES (Tests 1.8 - 1.11):**

```
1.8 ✅ Crear Vacante (Empresa)
    └─ Usa: token (empresa), requiere tokens
    └─ Guarda: vacante_id

1.9 ✅ Listar Vacantes
    └─ Público (sin autenticación)

1.10 ✅ Postular a Vacante (Freelancer)
     └─ Usa: freelancer_token, vacante_id
     └─ Guarda: postulacion_id

1.11 ✅ Ver Perfil
     └─ Usa: token (empresa)
```

**Variables que se guardan automáticamente:**

- `empresa_user_id` - ID del usuario empresa
- `empresa_correo` - Email generado para empresa
- `token` - JWT token de empresa
- `empresa_id` - ID del perfil de empresa
- `freelancer_user_id` - ID del usuario freelancer
- `freelancer_correo` - Email generado para freelancer
- `freelancer_token` - JWT token de freelancer
- `vacante_id` - ID de la vacante creada
- `postulacion_id` - ID de la postulación

### **2. Pruebas de Caja Negra (4 tests)**

- Validaciones de formulario
- Mensajes de error
- Acceso sin autenticación
- Prevención de duplicados

### **3. Pruebas Unitarias (4 tests)**

- Health check API
- Validación de campos
- Controladores backend
- Autenticación JWT

### **4. Pruebas de Integración (4 tests)**

- CRUD completo de vacantes
- Comunicación Frontend-Backend-DB

### **5. Pruebas de Aceptación (2 tests)**

- Flujo completo de búsqueda y postulación
- Experiencia de usuario final

---

## ⚠️ PASO CRÍTICO: Asignar Tokens (Test 1.5C)

Después de ejecutar el test **1.5B**, verás en la consola de Postman el ID de la empresa.

**Ejecuta este SQL en MySQL:**

```sql
-- Reemplaza 'ID_EMPRESA_AQUI' con el valor de empresa_id que viste en la consola
INSERT INTO TokenBalance (id_balance, id_emp, tokens_disponibles, tokens_usados, tokens_comprados)
VALUES (UUID(), 'ID_EMPRESA_AQUI', 10, 0, 10);
```

**O desde PowerShell (más rápido):**

```powershell
# Ver el ID de empresa desde las variables de Postman
# Luego ejecutar:
$empresaId = "PEGAR_ID_AQUI"
mysql -u root -p -e "USE freebridge_db; INSERT INTO TokenBalance (id_balance, id_emp, tokens_disponibles, tokens_usados, tokens_comprados) VALUES (UUID(), '$empresaId', 10, 0, 10);"
```

---

## ⚠️ CRÍTICO: Problemas Comunes y Soluciones

### **❌ Test 1.6 "Crear Vacante" falla - Sin Perfil de Empresa**

**YA SOLUCIONADO** con el test 1.5B (Crear Perfil Empresa).

### **❌ Test 1.6 "Crear Vacante" falla - Sin Tokens**

**Solución:** Ejecutar este request **ANTES** del test 1.6:

**Crear request manual en Postman:**

```
POST {{base_url}}/empresa/perfil
Authorization: Bearer {{token}}
Content-Type: application/json

Body:
{
  "NIT": "900123456",
  "tamaño": "Mediana",
  "desc_emp": "Empresa de desarrollo de software",
  "id_ciud": 1,
  "id_usu": "{{empresa_user_id}}"
}
```

### **❌ Test 1.6 "Crear Vacante" falla - Sin Tokens**

**Causa:** El sistema cobra 1 token por vacante publicada.

### **❌ Test 1.6 "Crear Vacante" falla - Sin Tokens**

**Causa:** El sistema cobra 1 token por vacante publicada.

**Solución:** Ejecutar SQL después del test 1.5B (ver sección arriba).

**Alternativa temporal (solo para testing):**

Comenta la validación en `server-flask/routes/routes_vacancy/crear_vacante.py` (líneas 28-41):

```python
# COMENTAR TEMPORALMENTE:
# if not balance or balance.tokens_disponibles < 1:
#     return jsonify({...}), 402
```

**¡Recuerda descomentar después!**

### **❌ Test 1.8 "Postular a Vacante" falla**

**Causa:** Puede fallar si:

1. El `vacante_id` no se guardó (porque el test 1.6 falló)
2. El freelancer no tiene perfil creado

**Solución:** Asegurar que los tests 1.5 y 1.6 pasen primero.

### **❌ Test 1.9 "Profile data exists" falla**

**Causa:** El test espera estructura `jsonData.usuario` pero el backend devuelve datos directos.

**Ya corregido** en la colección actualizada.---

## 🔍 Verificar que Todo Funciona

### **Test Rápido desde PowerShell:**

```powershell
# Health check
curl http://localhost:5000/api/health

# Debe devolver:
# {"status":"OK","mensaje":"API FreeBridge funcionando correctamente"}
```

### **Verificar Ciudades en la DB:**

```powershell
mysql -u root -p -e "USE freebridge_db; SELECT * FROM Ciudad;"
```

---

## 🎯 Resultado Esperado

Después del setup, ejecutar "Pruebas Funcionales" debe mostrar:

```
✅ 1.1 Registro de Empresa - PASS
✅ 1.2 Registro de Freelancer - PASS
✅ 1.3 Login Empresa - PASS
✅ 1.4 Login Freelancer - PASS
✅ 1.5 Crear Perfil Freelancer - PASS
✅ 1.6 Crear Vacante - PASS (con tokens asignados)
✅ 1.7 Listar Vacantes - PASS
✅ 1.8 Postular a Vacante - PASS
✅ 1.9 Ver Perfil - PASS
```

---

## 🛠️ Troubleshooting

### **Error: "Could not get response"**

```powershell
# Verificar que el servidor está corriendo
cd c:\freebridge-React-flask\server-flask
python index.py
```

### **Error: "No tienes tokens suficientes" (Test 1.6)**

Ver sección "Sistema de Tokens" arriba.

### **Error: "Usuario ya existe"**

Los tests usan `{{$timestamp}}` para generar correos únicos. Si falla, espera 1 segundo y reintenta.

### **Error: "Ciudad not found"**

Ejecuta el SQL de inserción de ciudades (Paso 2).

---

## 📊 Ejecutar Todas las Pruebas

Para ejecutar las 23 pruebas completas:

1. Click derecho en colección **"FreeBridge API Tests"**
2. Click en **"Run collection"**
3. Configurar:
   - Iterations: 1
   - Delay: 500ms
4. Click **"Run FreeBridge API Tests"**

---

## 🎯 RESUMEN: Flujo Completamente Automatizado

### **Lo que hace la colección actualizada:**

1. **Crea 2 usuarios:**

   - ✅ Usuario Empresa (correo único con timestamp)
   - ✅ Usuario Freelancer (correo único con timestamp)

2. **Autentica ambos:**

   - ✅ Login Empresa → guarda token
   - ✅ Login Freelancer → guarda freelancer_token

3. **Completa perfiles automáticamente:**

   - ✅ Perfil Freelancer (profesión, experiencia, ciudad)
   - ✅ Perfil Empresa (NIT, tamaño, descripción, ciudad)

4. **Solo requiere 1 paso manual:**

   - ⚠️ Asignar tokens via SQL (el test te muestra el comando exacto)

5. **Luego todo es automático:**
   - ✅ Crear vacante
   - ✅ Postular a vacante
   - ✅ Verificar perfiles

### **Comando SQL que necesitas ejecutar (solo una vez):**

```sql
-- El ID de empresa se muestra en la consola de Postman después del test 1.5B
INSERT INTO TokenBalance (id_balance, id_emp, tokens_disponibles, tokens_usados, tokens_comprados)
VALUES (UUID(), 'COPIAR_EMPRESA_ID_AQUI', 10, 0, 10);
```

---

## ✅ Checklist Pre-Ejecución

- [ ] Servidor Flask corriendo en `http://localhost:5000`
- [ ] Base de datos reiniciada con `$env:RESET_DB="1"; python index.py`
- [ ] Ciudades insertadas en la tabla `Ciudad` (SQL del Paso 2)
- [ ] Environment "FreeBridge Local" seleccionado en Postman
- [ ] Colección `FreeBridge_Postman_Collection.json` importada

**Durante la ejecución:**

- [ ] Después del test 1.5B, copiar el `empresa_id` de la consola
- [ ] Ejecutar SQL para asignar 10 tokens a la empresa
- [ ] Continuar con el resto de tests

---

## 🎉 Resultado Final Esperado

```
Pruebas Funcionales: 11/11 PASS ✅

1.1 Registro Empresa ✅
1.2 Registro Freelancer ✅
1.3 Login Empresa ✅
1.4 Login Freelancer ✅
1.5 Crear Perfil Freelancer ✅
1.5B Crear Perfil Empresa ✅
1.5C Asignar Tokens (info) ✅
1.6 Crear Vacante ✅
1.7 Listar Vacantes ✅
1.8 Postular a Vacante ✅
1.9 Ver Perfil ✅
```

**¡Sistema completamente funcional con flujo automatizado! 🚀**
