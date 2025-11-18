# Estructura de Componentes

Esta carpeta contiene todos los componentes React organizados por funcionalidad.

## 📁 Estructura de Carpetas

```
components/
├── authComponents/          # Componentes de autenticación
│   ├── LoginForm.jsx       # Formulario de inicio de sesión
│   └── RegisterForm.jsx    # Formulario de registro
│
├── vacancyComponents/       # Componentes relacionados con vacantes
│   ├── VacancyCard.jsx     # Tarjeta de vacante (reutilizable)
│   ├── VacancyForm.jsx     # Formulario crear/editar vacante
│   ├── VacancyList.jsx     # Lista pública de vacantes
│   ├── VacanciesView.jsx   # Vista de vacantes (dashboard freelancer)
│   └── MyVacanciesList.jsx # Lista de vacantes propias (dashboard empresa)
│
├── profileComponents/       # Componentes de perfil
│   ├── CompanyProfileForm.jsx      # Formulario perfil empresa
│   └── FreelancerProfileForm.jsx   # Formulario perfil freelancer
│
├── dashboardComponents/     # Componentes específicos de dashboards
│   ├── CompanySidebar.jsx          # Sidebar del dashboard empresa
│   ├── FreelancerSidebar.jsx       # Sidebar del dashboard freelancer
│   ├── ApplicationsList.jsx        # Lista de postulaciones (empresa)
│   └── ProjectsList.jsx            # Lista de proyectos (freelancer)
│
├── layoutComponents/        # Componentes de layout/estructura
│   ├── Navbar.jsx          # Barra de navegación principal
│   └── Footer.jsx          # Pie de página
│
└── commonComponents/        # Componentes comunes/reutilizables
    ├── Modal.jsx           # Modal genérico
    ├── SuccessModal.jsx    # Modal de éxito
    ├── TermsAndConditions.jsx  # Términos y condiciones
    └── PrivacyPolicy.jsx       # Política de privacidad
```

## 🎯 Guía de Uso

### Importar componentes

Debido a la nueva estructura, las importaciones deben especificar la subcarpeta:

```javascript
// ✅ Correcto
import VacancyCard from "../components/vacancyComponents/VacancyCard";
import LoginForm from "../components/authComponents/LoginForm";
import Navbar from "../components/layoutComponents/Navbar";

// ❌ Incorrecto (ruta antigua)
import VacancyCard from "../components/VacancyCard";
```

### Rutas relativas dentro de componentes

Los componentes dentro de subcarpetas deben ajustar sus rutas relativas:

```javascript
// Antes (cuando estaban en /components)
import styles from "../styles/MyStyles.module.css";
import { myApi } from "../api/myApi";

// Ahora (desde /components/subcarpeta)
import styles from "../../styles/MyStyles.module.css";
import { myApi } from "../../api/myApi";
```

## 📝 Convenciones

1. **Nombres de carpetas**: camelCase con sufijo "Components"
2. **Nombres de archivos**: PascalCase (ej: `VacancyCard.jsx`)
3. **Un componente por archivo**: Facilita mantenimiento
4. **Componentes relacionados juntos**: Agrupados por funcionalidad

## 🔄 Beneficios de esta Estructura

- ✅ **Organización clara**: Fácil encontrar componentes
- ✅ **Escalabilidad**: Agregar nuevos componentes sin saturar carpeta raíz
- ✅ **Mantenibilidad**: Cambios en una funcionalidad afectan solo su carpeta
- ✅ **Reutilización**: Componentes comunes claramente identificados
- ✅ **Colaboración**: Equipos pueden trabajar en diferentes subcarpetas sin conflictos
