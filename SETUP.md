# FreeBridge - Guía de Instalación

## Backend (Flask)

### Requisitos previos

- Python 3.8 o superior
- MySQL 5.7+ o MariaDB
- pip (gestor de paquetes de Python)

### Instalación

1. **Crear entorno virtual (recomendado)**

   ```powershell
   cd server-flask
   python -m venv venv
   .\venv\Scripts\Activate
   ```

2. **Instalar dependencias**

   ```powershell
   pip install -r requirements.txt
   ```

3. **Configurar variables de entorno**

   - Copiar `.env.example` a `.env`
   - Actualizar credenciales de MySQL y Mailtrap:

     ```env
     DB_HOST=localhost
     DB_USER=root
     DB_PASSWORD=tu_password
     DB_NAME=freebridge
     DB_PORT=3306

     MAIL_SERVER=sandbox.smtp.mailtrap.io
     MAIL_PORT=2525
     MAIL_USERNAME=tu_username_mailtrap
     MAIL_PASSWORD=tu_password_mailtrap

     SECRET_KEY=genera_una_clave_secreta_fuerte_aqui
     ```

4. **Crear base de datos**

   ```sql
   CREATE DATABASE freebridge CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

5. **Ejecutar servidor**
   ```powershell
   python index.py
   ```
   El servidor estará disponible en `http://localhost:5000`

### Dependencias principales

- **Flask 3.1.2**: Framework web
- **Flask-SQLAlchemy 3.1.1**: ORM para base de datos
- **PyMySQL 1.1.0**: Driver MySQL/MariaDB
- **Flask-Mail 0.9.1**: Envío de correos (Mailtrap)
- **PyJWT 2.8.0**: Autenticación con tokens JWT
- **Flask-CORS 6.0.1**: Configuración de CORS
- **python-dotenv 1.0.0**: Variables de entorno

---

## Frontend (React + Vite)

### Requisitos previos

- Node.js 18+ y npm/pnpm/yarn

### Instalación

1. **Navegar al directorio**

   ```powershell
   cd client-react
   ```

2. **Instalar dependencias**

   ```powershell
   npm install
   # o
   pnpm install
   # o
   yarn install
   ```

3. **Configurar URL del backend**

   - El archivo `src/api/axiosConfig.js` apunta a `http://localhost:5000`
   - Si el backend corre en otro puerto, actualizar `baseURL`

4. **Ejecutar en desarrollo**

   ```powershell
   npm run dev
   ```

   La aplicación estará disponible en `http://localhost:5173`

5. **Build para producción**
   ```powershell
   npm run build
   npm run preview
   ```

### Dependencias principales

- **React 19.1.1**: Librería UI
- **React Router DOM 7.9.5**: Enrutamiento
- **Axios 1.13.1**: Cliente HTTP
- **Vite 7.1.7**: Build tool y dev server
- **React Icons 5.5.0**: Iconos
- **DiceBear 9.2.4**: Generación de avatares

---

## Servicios Externos

### MySQL

- Instalar localmente o usar contenedor Docker:
  ```powershell
  docker run --name freebridge-mysql -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=freebridge -p 3306:3306 -d mysql:8
  ```

### Mailtrap

1. Registrarse en [mailtrap.io](https://mailtrap.io)
2. Crear inbox en "Email Testing"
3. Copiar credenciales SMTP a `.env`

---

## Verificación

### Backend

```powershell
# Verificar salud del API
curl http://localhost:5000/api/health
```

### Frontend

- Abrir `http://localhost:5173` en navegador
- Probar registro y login

---

## Troubleshooting

### Backend

- **Error de conexión MySQL**: Verificar que MySQL esté corriendo y credenciales correctas
- **Error módulos Python**: `pip install -r requirements.txt --upgrade`
- **Error Flask-Mail**: Verificar credenciales Mailtrap en `.env`

### Frontend

- **Error CORS**: Verificar que backend permite origen `http://localhost:5173` (configurado en `app.py`)
- **Error módulos Node**: Eliminar `node_modules/` y `package-lock.json`, luego `npm install`
- **Error axios 401**: Token expirado o inválido, hacer logout/login

---

## Desarrollo

### Estructura de proyecto

```
freebridge-React-flask/
├── server-flask/          # Backend Flask
│   ├── app.py            # Configuración principal
│   ├── index.py          # Punto de entrada
│   ├── requirements.txt  # Dependencias Python
│   ├── .env              # Variables de entorno (NO versionar)
│   ├── models/           # Modelos SQLAlchemy
│   ├── routes/           # Blueprints/Endpoints
│   ├── utils/            # Utilidades (auth, config, db)
│   └── uploads/          # Archivos subidos
│
└── client-react/          # Frontend React
    ├── src/
    │   ├── api/          # Clientes HTTP
    │   ├── components/   # Componentes React
    │   ├── context/      # Context API
    │   ├── hooks/        # Custom hooks
    │   ├── pages/        # Páginas/Vistas
    │   ├── router/       # Configuración routing
    │   ├── styles/       # CSS modules
    │   └── utils/        # Utilidades
    ├── package.json      # Dependencias Node
    └── vite.config.js    # Configuración Vite
```

### Scripts útiles

**Backend**

```powershell
# Modo desarrollo con auto-reload
$env:FLASK_ENV="development"; python index.py

# Resetear base de datos
$env:RESET_DB="1"; python index.py
```

**Frontend**

```powershell
# Desarrollo
npm run dev

# Lint
npm run lint

# Build
npm run build
```
