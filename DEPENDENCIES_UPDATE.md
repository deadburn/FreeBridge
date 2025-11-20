# Dependencias actualizadas - Backend

## Archivos actualizados

### ✅ `server-flask/requirements.txt`

Se agregaron todas las dependencias necesarias:

**Core Framework:**

- `Flask==3.1.2` - Framework web principal
- `flask-cors==6.0.1` - Manejo de CORS

**Database:**

- `Flask-SQLAlchemy==3.1.1` - ORM para base de datos
- `PyMySQL==1.1.0` - Driver MySQL/MariaDB

**Authentication & Security:**

- `PyJWT==2.8.0` - Tokens JWT para autenticación
- `werkzeug==3.0.1` - Utilidades de seguridad (hashing)

**Email:**

- `Flask-Mail==0.9.1` - Envío de correos (Mailtrap)

**Environment:**

- `python-dotenv==1.0.0` - Carga de variables .env

**Opcionales (comentadas):**

- `Flask-Migrate==4.0.5` - Migraciones de base de datos
- `Flask-Limiter==3.5.0` - Rate limiting
- `gunicorn==21.2.0` - Servidor WSGI para producción

---

### ✅ `client-react/package.json`

Ya contiene todas las dependencias necesarias (sin cambios):

**Dependencies:**

- `@dicebear/collection@^9.2.4` - Colección de avatares
- `@dicebear/core@^9.2.4` - Core de avatares
- `axios@^1.13.1` - Cliente HTTP
- `react@^19.1.1` - Librería React
- `react-dom@^19.1.1` - React DOM
- `react-icons@^5.5.0` - Iconos
- `react-router-dom@^7.9.5` - Routing

**DevDependencies:**

- Vite, ESLint y tipos de TypeScript

---

## Comandos de instalación

### Backend

```powershell
cd server-flask
pip install -r requirements.txt
```

### Frontend

```powershell
cd client-react
npm install
```

---

## Próximos pasos recomendados

1. **Instalar dependencias en ambos proyectos**
2. **Configurar `.env` con credenciales reales**
3. **Verificar conexión a MySQL**
4. **Probar endpoints con el health check**
5. **Ejecutar aplicaciones en paralelo**

Ver `SETUP.md` para guía completa de instalación.
