# 📝 Nueva Funcionalidad: Duración del Proyecto en Vacantes

## 🎯 Descripción

Se ha agregado un campo de **duración del proyecto** en las vacantes para que las empresas puedan especificar el tiempo estimado del trabajo ofrecido.

## 📋 Cambios Implementados

### 1. Base de Datos

**Archivo:** `server-flask/database/add_duracion_column.sql`

- ✅ Agregada columna `duracion_proyecto` a la tabla `VACANTE`
- Tipo: `VARCHAR(50)`
- Valor por defecto: `'No especificado'`

**Para aplicar el cambio:**

```sql
-- Ejecutar en MySQL:
USE freebridge;
SOURCE server-flask/database/add_duracion_column.sql;

-- O manualmente:
ALTER TABLE VACANTE
ADD COLUMN duracion_proyecto VARCHAR(50) DEFAULT 'No especificado' AFTER salario;
```

### 2. Backend (Flask)

#### Modelo Actualizado

**Archivo:** `server-flask/models/modelo_vacante.py`

```python
duracion_proyecto = db.Column(db.String(50), default="No especificado")
```

#### Rutas Modificadas

1. **Crear Vacante** (`server-flask/routes/routes_vacancy/crear_vacante.py`)
   - ✅ Acepta campo `duracion_proyecto` en POST
2. **Actualizar Vacante** (`server-flask/routes/routes_vacancy/vacantes.py`)

   - ✅ Acepta campo `duracion_proyecto` en PUT
   - ✅ Incluido en respuestas JSON

3. **Listar Vacantes** (`server-flask/routes/routes_vacancy/vacantes.py`)
   - ✅ Incluye `duracion_proyecto` en todas las respuestas

### 3. Frontend (React)

#### Componentes Actualizados

1. **VacancyForm.jsx** ✅

   - Campo select con opciones predefinidas
   - **Opciones disponibles:**
     - 1-3 meses
     - 3-6 meses
     - 6-12 meses
     - Más de 1 año
     - Indefinido
     - Por proyecto
   - Campo **requerido** al crear/editar vacantes

2. **VacancyCard.jsx** ✅

   - Muestra duración con icono ⏱️
   - Solo se muestra si el valor no es "No especificado"
   - Estilo: Badge azul

3. **VacancyDetailModal.jsx** ✅
   - Incluye duración en la información de la vacante
   - Icono `MdSchedule` (reloj)
   - Se muestra junto a salario y otros datos

#### Estilos

**Archivo:** `client-react/src/styles/modules_vacancies/VacancyCard.module.css`

```css
.duration {
  background-color: #e3f2fd;
  color: #1565c0;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.95rem;
  margin-bottom: 1rem;
  display: inline-block;
  margin-left: 0.5rem;
}
```

## 🚀 Cómo Usar

### Para Empresas (Crear/Editar Vacante)

1. Al crear o editar una vacante, verás un nuevo campo: **"Duración del proyecto"**
2. Selecciona la opción que mejor describa la duración estimada
3. El campo es **obligatorio**

### Para Freelancers (Ver Vacantes)

- La duración aparece en las tarjetas de vacantes con el icono ⏱️
- En el detalle de la vacante, se muestra junto al salario y ubicación
- Puedes usar esta información para filtrar proyectos según tu disponibilidad

## 📊 Ejemplo Visual

```
┌─────────────────────────────────────┐
│ Desarrollador Full Stack            │
│ ─────────────────────────────────── │
│ Buscamos desarrollador para...      │
│                                     │
│ 💰 $2,500  ⏱️ Duración: 3-6 meses  │
│                                     │
│ 🏢 Tech Solutions  📅 Hace 2 días  │
│                   [Postularse]      │
└─────────────────────────────────────┘
```

## 🔧 Pruebas

### 1. Aplicar Migración de Base de Datos

```bash
# En MySQL Workbench o línea de comandos
mysql -u root -p freebridge < server-flask/database/add_duracion_column.sql
```

### 2. Reiniciar el Backend

```bash
cd server-flask
python index.py
```

### 3. Reiniciar el Frontend

```bash
cd client-react
npm run dev
```

### 4. Verificar Funcionalidad

- ✅ Crear nueva vacante con duración
- ✅ Editar vacante existente agregando duración
- ✅ Ver listado de vacantes con duración
- ✅ Abrir detalle de vacante y verificar duración

## 🐛 Resolución de Problemas

### Error: "duracion_proyecto" no existe en respuesta

**Solución:** Ejecutar el script SQL para agregar la columna

### Campo no aparece en el formulario

**Solución:** Limpiar caché del navegador (Ctrl + Shift + R)

### Vacantes antiguas sin duración

**Solución:** Las vacantes existentes mostrarán "No especificado" automáticamente

## 📝 Notas Adicionales

- Las vacantes creadas antes de esta actualización tendrán el valor "No especificado" por defecto
- La duración es opcional en el backend pero requerida en el frontend para nuevas vacantes
- Se puede agregar más opciones de duración editando el select en `VacancyForm.jsx`

## 🎨 Personalización

Para cambiar las opciones de duración, edita:

```jsx
// client-react/src/components/vacancyComponents/VacancyForm.jsx
<select value={duracionProyecto} ...>
  <option value="">Selecciona la duración del proyecto</option>
  <option value="Tu nueva opción">Tu nueva opción</option>
  ...
</select>
```

---

**Fecha de implementación:** 21 de Noviembre, 2025
**Versión:** 1.0.0
