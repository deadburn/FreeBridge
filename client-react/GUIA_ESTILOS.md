# Guía de Estilos - FreeBridge

## 🎨 Paleta de Colores

### Colores Principales

- **Teal Principal**: `#16a085` - Color primario de marca
- **Teal Oscuro**: `#16685a` - Para títulos y énfasis
- **Cyan Claro**: `#b8f2e6` - Fondos degradados (inicio)
- **Cyan Medio**: `#7dd3c0` - Fondos degradados (fin)

### Colores de Texto

- **Título Principal**: `#16685a` (Teal oscuro)
- **Texto Secundario**: `#2c3e50` (Gris oscuro)
- **Texto Normal**: `#34495e` (Gris medio)
- **Texto Deshabilitado**: `#7f8c8d` (Gris claro)

### Colores de Estado

- **Error**: `#c33` - Mensajes de error
- **Fondo Error**: `#fee` - Fondo de mensajes de error
- **Éxito**: `#16a085` - Color principal usado para éxito
- **Hover**: `#16685a` - Versión oscura para hover

### Colores de UI

- **Borde**: `#e0e0e0` - Bordes de inputs y cards
- **Borde Hover**: `#d0d0d0` - Bordes en hover
- **Fondo Blanco**: `white` - Cards y formularios
- **Sombra Base**: `rgba(0, 0, 0, 0.1)` - Sombras suaves
- **Sombra Hover**: `rgba(0, 0, 0, 0.15)` - Sombras al hacer hover

---

## 📐 Espaciado

### Padding

- **Formularios (Desktop)**: `2.5rem`
- **Formularios (Mobile)**: `2rem 1.5rem`
- **Cards**: `1.5rem`
- **Inputs**: `0.875rem 1rem`
- **Botones**: `0.875rem` vertical, variable horizontal

### Margin

- **Entre inputs**: `1.25rem` (gap)
- **Título a contenido**: `1.5rem`
- **Entre cards**: `1.25rem`

### Secciones

- **Hero Section**: `3rem 2rem` (Desktop), `2rem 1rem` (Mobile)
- **Altura mínima Hero**: `calc(100vh - 80px)` (Desktop), `calc(100vh - 60px)` (Mobile)

---

## 🔤 Tipografía

### Tamaños de Fuente

- **Título Formulario (h2)**: `2rem` (Desktop), `1.75rem` (Mobile)
- **Título Card (h3)**: `1.4rem` (Desktop), `1.2rem` (Mobile)
- **Texto Normal**: `1rem`
- **Texto Pequeño**: `0.95rem`
- **Badges**: `0.75rem`
- **Footer Text**: `0.9rem`

### Pesos de Fuente

- **Títulos**: `700` (Bold)
- **Subtítulos**: `600` (Semi-bold)
- **Badges y Botones**: `600` (Semi-bold)
- **Texto Normal**: `400` (Regular)

### Familia de Fuentes

- **Principal**: `Arial, Helvetica, sans-serif`

---

## 🎯 Componentes Estándar

### Inputs

```css
padding: 0.875rem 1rem;
border: 2px solid #e0e0e0;
border-radius: 8px;
font-size: 1rem;
transition: all 0.3s ease;

/* Focus */
border-color: #16a085;
box-shadow: 0 0 0 3px rgba(22, 160, 133, 0.1);
```

### Botones Principales

```css
background: linear-gradient(135deg, #16a085 0%, #16685a 100%);
color: white;
border: none;
padding: 0.875rem 2.5rem;
border-radius: 8px; /* Formularios */
border-radius: 20px; /* Cards/Badges */
border-radius: 50px; /* Modales */
font-size: 1.05rem;
font-weight: 600;
box-shadow: 0 4px 6px rgba(22, 160, 133, 0.2);

/* Hover */
transform: translateY(-2px);
box-shadow: 0 6px 12px rgba(22, 160, 133, 0.3);
```

### Cards

```css
background-color: white;
padding: 2.5rem; /* Formularios */
padding: 1.5rem; /* Cards de vacantes */
border-radius: 15px; /* Formularios */
border-radius: 12px; /* Cards de vacantes */
box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
transition: transform 0.3s ease, box-shadow 0.3s ease;

/* Hover */
transform: translateY(-5px); /* Formularios */
transform: translateY(-4px); /* Cards de vacantes */
box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
```

---

## 🌊 Fondos con Marca de Agua

### Hero Section

```css
background: linear-gradient(180deg, #b8f2e6 0%, #7dd3c0 100%);
position: relative;
overflow: hidden;

/* Marca de agua */
&::before {
  content: "";
  background-image: url("/src/assets/freebridge.svg");
  background-size: 150px 150px;
  background-repeat: repeat;
  opacity: 0.08;
  transform: rotate(-15deg) scale(1.2);
}
```

---

## ✨ Transiciones y Animaciones

### Transiciones Estándar

- **General**: `all 0.3s ease`
- **Transform**: `transform 0.3s ease`
- **Color**: `color 0.3s ease`

### Animaciones de Modal

- **Fade In**: `0.3s ease`
- **Slide Up**: `0.4s ease`
- **Check Icon**: Animación stroke con cubic-bezier
- **Escalado**: `0.5s ease` con delay progresivo

---

## 📱 Breakpoints Responsive

### Mobile

```css
@media (max-width: 768px) {
  /* Ajustes de padding, font-size y layout */
}
```

### Ajustes Comunes en Mobile

- Reducir padding de `2.5rem` a `2rem 1.5rem`
- Reducir fuentes en ~0.25rem
- Cambiar flex-direction a column
- Cards al 100% de ancho
- Botones al 100% de ancho

---

## 🔧 Clases Reutilizables

### Mensajes de Error

```css
.errorMessage {
  background-color: #fee;
  color: #c33;
  padding: 0.875rem;
  border-radius: 8px;
  border-left: 4px solid #c33;
  font-size: 0.95rem;
  text-align: center;
}
```

### Estados Vacíos

```css
.emptyState {
  padding: 4rem 2rem;
  background-color: #f8f9fa;
  border-radius: 15px;
  border: 2px dashed #d0d0d0;
  text-align: center;
}
```

### Spinners de Carga

```css
.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #e0e0e0;
  border-top-color: #16a085;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
```

---

## 📋 Checklist de Consistencia

Al crear nuevos componentes, asegurar:

- ✅ Usar paleta de colores definida
- ✅ Aplicar padding/margin estándar
- ✅ Incluir estados hover/focus/active
- ✅ Agregar transiciones suaves (0.3s)
- ✅ Diseño responsive con breakpoint @768px
- ✅ Box-shadow consistente
- ✅ Border-radius según tipo de componente
- ✅ Font-weight apropiado para jerarquía
- ✅ Marca de agua en secciones hero
- ✅ Animaciones fluidas en modales

---

**Última actualización**: Noviembre 10, 2025
