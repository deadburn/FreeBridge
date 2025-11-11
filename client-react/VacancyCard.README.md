# VacancyCard - Componente Reutilizable

## 📋 Descripción

Componente React altamente reutilizable para mostrar tarjetas de vacantes con múltiples variantes y opciones de personalización.

## 🎯 Props Explicadas

### Props Requeridas

#### `vacante` (Object) - OBLIGATORIA

El objeto con toda la información de la vacante. Debe contener:

```javascript
{
  id: "vac_123",              // ID único
  nombre: "Desarrollador React", // Título de la vacante
  descripcion: "Buscamos...",  // Descripción
  requisitos: "React, Node...", // Requisitos (opcional)
  salario: 50000,              // Salario numérico (opcional)
  estado: "abierta",           // Estado (opcional, default: "abierta")
  fecha_publicacion: "2025-11-10T12:00:00", // ISO string (opcional)
  empresa: {                   // Objeto empresa (opcional)
    nombre: "TechCorp"
  }
}
```

**¿Por qué es obligatoria?**
Sin los datos de la vacante, la card no tiene nada que mostrar. Es el corazón del componente.

---

### Props de Callbacks (Opcionales)

#### `onApply` (Function)

Función que se ejecuta cuando el usuario hace clic en "Postularse".

```javascript
const handleApply = (vacante) => {
  console.log("Postularse a:", vacante.id);
  // Aquí puedes abrir un modal, navegar, hacer llamada API, etc.
};

<VacancyCard vacante={vacante} onApply={handleApply} />;
```

**¿Por qué existe?**
Permite que el componente padre controle qué sucede al postularse. Cada contexto puede necesitar algo diferente: abrir un modal, navegar a otra página, verificar autenticación, etc.

**¿Qué pasa si no la paso?**
Se ejecutará un console.log por defecto (útil para desarrollo).

---

#### `onView` (Function)

Función que se ejecuta cuando el usuario hace clic en toda la card (para ver detalles).

```javascript
const handleView = (vacante) => {
  navigate(`/vacantes/${vacante.id}`);
};

<VacancyCard vacante={vacante} onView={handleView} />;
```

**¿Por qué existe?**
Permite hacer que toda la card sea clickeable para ver más detalles. Útil en listas donde quieres navegar al detalle completo.

**¿Qué pasa si no la paso?**
La card no será clickeable (solo el botón "Postularse" funcionará).

---

### Props de Visualización (Booleanas)

#### `showApplyButton` (Boolean, default: true)

Controla si se muestra el botón "Postularse".

```javascript
// Mostrar botón (default)
<VacancyCard vacante={vacante} />

// Ocultar botón (útil para vista de empresa que no puede postularse a sus propias vacantes)
<VacancyCard vacante={vacante} showApplyButton={false} />
```

**¿Por qué existe?**
Una empresa viendo sus propias vacantes no necesita el botón "Postularse". O en una vista administrativa, solo quieres mostrar información sin acciones.

---

#### `showCompany` (Boolean, default: true)

Controla si se muestra el nombre de la empresa.

```javascript
// Mostrar empresa (default)
<VacancyCard vacante={vacante} />

// Ocultar empresa (útil en dashboard de empresa donde todas las vacantes son propias)
<VacancyCard vacante={vacante} showCompany={false} />
```

**¿Por qué existe?**
En el dashboard de una empresa, todas las vacantes son suyas, mostrar "🏢 Mi Empresa" en cada card es redundante.

---

#### `showSalary` (Boolean, default: false)

Controla si se muestra el salario (cuando está disponible).

```javascript
// Ocultar salario (default, para privacidad)
<VacancyCard vacante={vacante} />

// Mostrar salario (útil en vista detallada)
<VacancyCard vacante={vacante} showSalary={true} />
```

**¿Por qué existe?**
El salario es información sensible. Por defecto está oculto. Solo lo muestras cuando es relevante (vista detallada, ciertos roles, etc.).

**¿Por qué default false?**
Mejora la privacidad y evita mostrar información sensible innecesariamente.

---

### Props de Estilo

#### `variant` (String: "default" | "compact" | "detailed", default: "default")

Define la variante de diseño de la card.

```javascript
// Default - Uso general
<VacancyCard vacante={vacante} variant="default" />

// Compact - Para listas densas o sidebars
<VacancyCard vacante={vacante} variant="compact" />

// Detailed - Para vistas amplias con toda la información
<VacancyCard vacante={vacante} variant="detailed" showSalary={true} />
```

**Diferencias entre variantes:**

| Variante   | Padding | Título | Descripción | Requisitos |
| ---------- | ------- | ------ | ----------- | ---------- |
| `default`  | 1.5rem  | 1.4rem | 3 líneas    | No         |
| `compact`  | 1rem    | 1.2rem | 2 líneas    | No         |
| `detailed` | 2rem    | 1.4rem | 5 líneas    | Sí         |

**¿Por qué existe?**
Un mismo componente puede usarse en diferentes contextos con diferentes necesidades de espacio y detalle.

---

## 📚 Ejemplos de Uso Completos

### Ejemplo 1: Lista Pública de Vacantes (Freelancers)

```javascript
import VacancyCard from './components/VacancyCard';

function PublicVacancies() {
  const vacancies = [...]; // Array de vacantes del API

  const handleApply = (vacante) => {
    // Verificar si está autenticado
    if (!user) {
      navigate('/login');
      return;
    }
    // Abrir modal de postulación
    setSelectedVacancy(vacante);
    setShowApplicationModal(true);
  };

  const handleView = (vacante) => {
    navigate(`/vacantes/${vacante.id}`);
  };

  return (
    <div>
      {vacancies.map(v => (
        <VacancyCard
          key={v.id}
          vacante={v}
          onApply={handleApply}
          onView={handleView}
          showApplyButton={true}
          showCompany={true}
          showSalary={false}
        />
      ))}
    </div>
  );
}
```

**¿Por qué estas props?**

- `onApply`: Necesitamos verificar autenticación antes de postular
- `onView`: Queremos que la card sea clickeable para ver detalles
- `showApplyButton={true}`: Los freelancers deben poder postularse
- `showCompany={true}`: Los freelancers quieren saber qué empresa publica
- `showSalary={false}`: Por privacidad, no mostramos salario en lista pública

---

### Ejemplo 2: Dashboard de Empresa (Sus Propias Vacantes)

```javascript
function CompanyDashboard() {
  const myVacancies = [...]; // Vacantes de la empresa

  const handleView = (vacante) => {
    setSelectedVacancy(vacante);
    setShowDetailsModal(true);
  };

  return (
    <div>
      <h2>Mis Vacantes Publicadas</h2>
      {myVacancies.map(v => (
        <VacancyCard
          key={v.id}
          vacante={v}
          onView={handleView}
          showApplyButton={false}  // La empresa no se postula a sí misma
          showCompany={false}       // Todas son de la misma empresa
          variant="compact"         // Espacio limitado en dashboard
        />
      ))}
    </div>
  );
}
```

**¿Por qué estas props?**

- `showApplyButton={false}`: Una empresa no puede postularse a sus propias vacantes
- `showCompany={false}`: Es redundante mostrar "Mi Empresa" en cada card
- `variant="compact"`: En un dashboard queremos mostrar más cards en menos espacio

---

### Ejemplo 3: Vista Detallada de Vacante

```javascript
function VacancyDetail({ id }) {
  const [vacancy, setVacancy] = useState(null);

  const handleApply = (vacante) => {
    submitApplication(vacante.id);
  };

  return (
    <div className="detail-page">
      <VacancyCard
        vacante={vacancy}
        onApply={handleApply}
        showApplyButton={true}
        showCompany={true}
        showSalary={true} // Mostrar toda la información
        variant="detailed" // Máximo detalle
      />

      {/* Información adicional de la empresa, reviews, etc. */}
    </div>
  );
}
```

**¿Por qué estas props?**

- `showSalary={true}`: En vista detallada, mostramos toda la información
- `variant="detailed"`: Queremos ver descripción completa y requisitos
- `onApply`: Permite postularse directamente desde la vista detallada

---

### Ejemplo 4: Sidebar con Vacantes Relacionadas

```javascript
function RelatedVacancies({ currentVacancyId }) {
  const related = [...]; // Vacantes similares

  const handleView = (vacante) => {
    navigate(`/vacantes/${vacante.id}`);
  };

  return (
    <aside className="sidebar">
      <h3>Vacantes Relacionadas</h3>
      {related.map(v => (
        <VacancyCard
          key={v.id}
          vacante={v}
          onView={handleView}
          showApplyButton={false}  // Solo queremos navegación
          showCompany={true}
          variant="compact"        // Espacio limitado en sidebar
        />
      ))}
    </aside>
  );
}
```

**¿Por qué estas props?**

- `showApplyButton={false}`: El sidebar es solo para navegación, no para acciones
- `variant="compact"`: Los sidebars tienen espacio limitado
- `onView`: Permite navegar a la vacante completa

---

## 🔧 Funciones Internas Explicadas

### `handleApply(e)`

```javascript
const handleApply = (e) => {
  e.stopPropagation(); // ← CRÍTICO: Evita que se dispare onView
  if (onApply) {
    onApply(vacante);
  }
};
```

**¿Por qué `stopPropagation`?**
Sin esto, al hacer clic en "Postularse":

1. Se ejecuta `handleApply`
2. El evento burbujea al div padre (la card)
3. Se ejecuta `handleCardClick` (onView)
4. Resultado: haces doble acción (postular Y navegar)

Con `stopPropagation`, el evento se detiene y solo se postula.

---

### `formatSalary(salary)`

```javascript
const formatSalary = (salary) => {
  if (!salary) return null;
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(salary);
};
```

**¿Por qué usar `Intl.NumberFormat`?**
Convierte `50000` → `"$50,000"` automáticamente según el locale.

**¿Por qué locale 'es-ES'?**
FreeBridge está en español, queremos formato español.

**¿Por qué `minimumFractionDigits: 0`?**
Los salarios usualmente no tienen centavos: `$50,000` en vez de `$50,000.00`

---

### `getTimeAgo(dateString)`

```javascript
const getTimeAgo = (dateString) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Hoy";
  if (diffDays === 1) return "Hace 1 día";
  if (diffDays < 7) return `Hace ${diffDays} días`;
  if (diffDays < 30) return `Hace ${Math.floor(diffDays / 7)} semanas`;
  return `Hace ${Math.floor(diffDays / 30)} meses`;
};
```

**¿Por qué esta función?**
Convierte `"2025-11-05T12:00:00"` → `"Hace 5 días"` (más humano y legible).

**¿Por qué no usar una librería?**
Para esta funcionalidad simple, no necesitamos `moment.js` o `date-fns`. Reduce el bundle size.

---

## 🎨 Clases CSS Dinámicas

```javascript
<div
  className={`${styles.card} ${styles[variant]} ${onView ? styles.clickable : ''}`}
  onClick={handleCardClick}
>
```

**¿Qué hace esto?**

1. `${styles.card}` → Siempre aplica estilos base
2. `${styles[variant]}` → Aplica estilos de variante (`compact`, `detailed`, etc.)
3. `${onView ? styles.clickable : ''}` → Solo aplica cursor pointer si la card es clickeable

**Resultado:**

- Sin `onView`: `class="card default"`
- Con `onView`: `class="card default clickable"`

---

## 🚀 Ventajas de Esta Implementación

### 1. **Verdaderamente Reutilizable**

Un componente sirve para:

- Lista pública de vacantes
- Dashboard de empresa
- Vista detallada
- Sidebar de relacionados
- Vista de administrador

### 2. **Props Opcionales con Defaults Sensatos**

No necesitas pasar 10 props cada vez. Defaults inteligentes:

```javascript
// Esto funciona perfectamente:
<VacancyCard vacante={vacante} />

// Y esto también:
<VacancyCard
  vacante={vacante}
  onApply={handleApply}
  onView={handleView}
  showSalary={true}
  variant="detailed"
/>
```

### 3. **Documentación JSDoc Completa**

El editor muestra ayuda automática al escribir:

```javascript
<VacancyCard
  vacante={/*  ← Aquí el editor muestra toda la estructura esperada */}
/>
```

### 4. **Robustez con Fallbacks**

```javascript
{
  vacante.nombre || vacante.titulo || "Sin título";
}
{
  vacante.empresa?.nombre || "Empresa Confidencial";
}
```

No rompe si faltan datos, muestra valores por defecto.

### 5. **Separación de Responsabilidades**

- **Componente**: Solo renderiza y maneja UI
- **Padre**: Controla la lógica de negocio (postular, navegar, etc.)

---

## 📖 Resumen de Cuándo Usar Cada Prop

| Contexto                 | onApply | onView | showApplyButton | showCompany | showSalary | variant  |
| ------------------------ | ------- | ------ | --------------- | ----------- | ---------- | -------- |
| Lista pública freelancer | ✅      | ✅     | ✅              | ✅          | ❌         | default  |
| Dashboard empresa        | ❌      | ✅     | ❌              | ❌          | ❌         | compact  |
| Vista detallada          | ✅      | ❌     | ✅              | ✅          | ✅         | detailed |
| Sidebar relacionados     | ❌      | ✅     | ❌              | ✅          | ❌         | compact  |
| Admin (solo lectura)     | ❌      | ✅     | ❌              | ✅          | ✅         | default  |

---

## 🎓 Principios Aplicados

1. **Single Responsibility**: El componente solo renderiza una card
2. **Open/Closed**: Abierto a extensión (nuevas variantes), cerrado a modificación
3. **Composition over Configuration**: Usas props para componer comportamiento
4. **Sensible Defaults**: Funciona bien sin configuración excesiva
5. **Progressive Enhancement**: Básico por defecto, avanzado cuando lo necesitas
