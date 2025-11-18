# Scripts de Base de Datos - FreeBridge

Este directorio contiene los scripts SQL necesarios para crear y configurar la base de datos del proyecto FreeBridge.

## Archivos

### 1. `create_database.sql`

Script principal que crea la base de datos y todas las tablas con sus relaciones.

**Tablas creadas:**

- `CIUDAD` - Ciudades disponibles
- `USUARIO` - Usuarios del sistema (Empresa y FreeLancer)
- `EMPRESA` - Perfil de empresas
- `FREELANCER` - Perfil de freelancers
- `VACANTE` - Vacantes publicadas por empresas
- `POSTULACION` - Postulaciones de freelancers a vacantes

### 2. `seed_data.sql`

Script con datos iniciales (ciudades de Colombia) y ejemplos comentados para pruebas.

## Instrucciones de Uso

### Opción 1: Desde MySQL Workbench o phpMyAdmin

1. Abre MySQL Workbench o phpMyAdmin
2. Ejecuta primero `create_database.sql`
3. Luego ejecuta `seed_data.sql`

### Opción 2: Desde línea de comandos

```bash
# Navega al directorio database
cd server-flask/database

# Ejecuta el script de creación
mysql -u root -p < create_database.sql

# Ejecuta el script de datos iniciales
mysql -u root -p < seed_data.sql
```

### Opción 3: Desde PowerShell (XAMPP)

```powershell
# Asegúrate de que XAMPP MySQL está corriendo
cd C:\xampp\mysql\bin

# Ejecuta el script de creación
.\mysql.exe -u root -p < C:\freebridge-React-flask\server-flask\database\create_database.sql

# Ejecuta el script de datos iniciales
.\mysql.exe -u root -p < C:\freebridge-React-flask\server-flask\database\seed_data.sql
```

## Configuración del Backend

Después de crear la base de datos, asegúrate de que tu archivo `.env` tenga la configuración correcta:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=freebridge
DB_PORT=3306
SECRET_KEY=tu_clave_secreta_aqui
```

## Verificación

Para verificar que las tablas se crearon correctamente:

```sql
USE freebridge;
SHOW TABLES;
DESCRIBE USUARIO;
DESCRIBE EMPRESA;
DESCRIBE FREELANCER;
DESCRIBE VACANTE;
DESCRIBE POSTULACION;
DESCRIBE CIUDAD;
```

## Estructura de las Tablas

### USUARIO

- `id_usu` (VARCHAR(10), PK)
- `nombre` (VARCHAR(100))
- `correo` (VARCHAR(100), UNIQUE)
- `contraseña` (VARCHAR(255))
- `rol` (ENUM: 'Empresa', 'FreeLancer')
- `estado` (ENUM: 'Activo', 'Inactivo', 'Bloqueado', 'Eliminado')

### EMPRESA

- `id_emp` (VARCHAR(11), PK)
- `id_usu` (VARCHAR(11), FK)
- `id_ciud` (VARCHAR(11), FK)
- `NIT` (VARCHAR(20), UNIQUE)
- `tamaño` (ENUM: 'Pequeña', 'Mediana', 'Grande')
- `desc_emp` (VARCHAR(250))

### FREELANCER

- `id_free` (VARCHAR(11), PK)
- `id_usu` (VARCHAR(11), FK)
- `id_ciud` (VARCHAR(11), FK)
- `profesion` (VARCHAR(50))
- `experiencia` (TEXT)
- `hoja_vida` (VARCHAR(255))

### VACANTE

- `id_vac` (VARCHAR(11), PK)
- `id_emp` (VARCHAR(11), FK)
- `nomb_vacante` (VARCHAR(50))
- `descripcion` (TEXT)
- `requisitos` (TEXT)
- `salario` (DECIMAL(10,2))
- `fecha_publicacion` (DATETIME)
- `estado_vac` (VARCHAR(20))

### POSTULACION

- `id_post` (VARCHAR(11), PK)
- `id_free` (VARCHAR(11), FK)
- `id_vac` (VARCHAR(11), FK)
- `fecha_post` (DATETIME)
- `estado_post` (VARCHAR(20))

### CIUDAD

- `id_ciud` (VARCHAR(10), PK)
- `nomb_ciud` (VARCHAR(30))

## Notas Importantes

- Las contraseñas deben estar hasheadas con bcrypt antes de insertarse
- Los IDs se generan automáticamente en el backend
- La tabla CIUDAD ya incluye las principales ciudades de Colombia
- Se han agregado índices para optimizar las consultas más comunes
- Las llaves foráneas tienen configurado CASCADE para eliminación
