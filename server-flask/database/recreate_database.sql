-- ============================================================================
-- SCRIPT DE RECREACIÓN COMPLETA DE LA BASE DE DATOS FREEBRIDGE
-- ============================================================================
-- Fecha: 21 de Noviembre 2025
-- Descripción: Script para recrear todas las tablas del sistema FreeBridge
-- Orden: Respeta la jerarquía de dependencias para evitar errores
-- ============================================================================

-- Eliminar la base de datos si existe y crearla nuevamente
DROP DATABASE IF EXISTS freebridge;
CREATE DATABASE freebridge CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE freebridge;

-- ============================================================================
-- TABLA 1: CIUDAD (Sin dependencias)
-- ============================================================================
CREATE TABLE CIUDAD (
    id_ciud VARCHAR(36) PRIMARY KEY,
    nomb_ciud VARCHAR(30) NOT NULL,
    INDEX idx_nomb_ciud (nomb_ciud)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLA 2: USUARIO (Sin dependencias)
-- ============================================================================
CREATE TABLE USUARIO (
    id_usu VARCHAR(36) PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(100) NOT NULL UNIQUE,
    contraseña VARCHAR(255) NOT NULL,
    rol ENUM('Empresa', 'FreeLancer') NOT NULL,
    estado ENUM('Activo', 'Inactivo', 'Bloqueado', 'Eliminado') DEFAULT 'Activo',
    INDEX idx_correo (correo),
    INDEX idx_rol (rol),
    INDEX idx_estado (estado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLA 3: EMPRESA (Depende de: USUARIO, CIUDAD)
-- ============================================================================
CREATE TABLE EMPRESA (
    id_emp VARCHAR(36) PRIMARY KEY,
    id_usu VARCHAR(36) NOT NULL,
    id_ciud VARCHAR(36) NOT NULL,
    NIT VARCHAR(20) NOT NULL UNIQUE,
    tamaño ENUM('Pequeña', 'Mediana', 'Grande') NOT NULL,
    desc_emp VARCHAR(250) NOT NULL,
    logo VARCHAR(255) DEFAULT NULL,
    nomb_emp VARCHAR(100) DEFAULT NULL,
    FOREIGN KEY (id_usu) REFERENCES USUARIO(id_usu) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (id_ciud) REFERENCES CIUDAD(id_ciud) ON DELETE RESTRICT ON UPDATE CASCADE,
    INDEX idx_id_usu (id_usu),
    INDEX idx_id_ciud (id_ciud),
    INDEX idx_nit (NIT)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLA 4: FREELANCER (Depende de: USUARIO, CIUDAD)
-- ============================================================================
CREATE TABLE FREELANCER (
    id_free VARCHAR(36) PRIMARY KEY,
    id_usu VARCHAR(36) NOT NULL,
    id_ciud VARCHAR(36) NOT NULL,
    profesion VARCHAR(50) NOT NULL,
    experiencia TEXT,
    hoja_vida VARCHAR(255) DEFAULT NULL,
    avatar VARCHAR(255) DEFAULT NULL,
    FOREIGN KEY (id_usu) REFERENCES USUARIO(id_usu) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (id_ciud) REFERENCES CIUDAD(id_ciud) ON DELETE RESTRICT ON UPDATE CASCADE,
    INDEX idx_id_usu (id_usu),
    INDEX idx_id_ciud (id_ciud),
    INDEX idx_profesion (profesion)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLA 5: VACANTE (Depende de: EMPRESA)
-- ============================================================================
CREATE TABLE VACANTE (
    id_vac VARCHAR(36) PRIMARY KEY,
    id_emp VARCHAR(36) NOT NULL,
    nomb_vacante VARCHAR(50) NOT NULL,
    descripcion TEXT NOT NULL,
    requisitos TEXT NOT NULL,
    salario DECIMAL(10, 2) DEFAULT NULL,
    duracion_proyecto VARCHAR(50) DEFAULT 'No especificado',
    fecha_publicacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    estado_vac VARCHAR(20) DEFAULT 'abierta',
    FOREIGN KEY (id_emp) REFERENCES EMPRESA(id_emp) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_id_emp (id_emp),
    INDEX idx_estado_vac (estado_vac),
    INDEX idx_fecha_publicacion (fecha_publicacion)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLA 6: POSTULACION (Depende de: FREELANCER, VACANTE)
-- ============================================================================
CREATE TABLE POSTULACION (
    id_post VARCHAR(36) PRIMARY KEY,
    id_free VARCHAR(36) NOT NULL,
    id_vac VARCHAR(36) NOT NULL,
    fecha_post DATETIME DEFAULT CURRENT_TIMESTAMP,
    estado_post VARCHAR(20) DEFAULT 'pendiente',
    FOREIGN KEY (id_free) REFERENCES FREELANCER(id_free) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (id_vac) REFERENCES VACANTE(id_vac) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_id_free (id_free),
    INDEX idx_id_vac (id_vac),
    INDEX idx_estado_post (estado_post),
    INDEX idx_fecha_post (fecha_post),
    UNIQUE KEY unique_postulacion (id_free, id_vac)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLA 7: CALIFICACION (Depende de: POSTULACION, EMPRESA, FREELANCER)
-- ============================================================================
CREATE TABLE CALIFICACION (
    id_calif VARCHAR(36) PRIMARY KEY,
    id_post VARCHAR(36) NOT NULL,
    id_emp VARCHAR(36) NOT NULL,
    id_free VARCHAR(36) NOT NULL,
    puntuacion INT NOT NULL CHECK (puntuacion >= 1 AND puntuacion <= 5),
    comentario TEXT,
    fecha_calif DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_post) REFERENCES POSTULACION(id_post) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (id_emp) REFERENCES EMPRESA(id_emp) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (id_free) REFERENCES FREELANCER(id_free) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_id_post (id_post),
    INDEX idx_id_emp (id_emp),
    INDEX idx_id_free (id_free),
    INDEX idx_puntuacion (puntuacion),
    UNIQUE KEY unique_calificacion (id_post)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLA 8: TOKEN_BALANCE (Depende de: EMPRESA)
-- ============================================================================
CREATE TABLE TOKEN_BALANCE (
    id_balance VARCHAR(36) PRIMARY KEY,
    id_emp VARCHAR(36) NOT NULL,
    tokens_disponibles INT DEFAULT 0,
    tokens_usados INT DEFAULT 0,
    fecha_actualizacion DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_emp) REFERENCES EMPRESA(id_emp) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_id_emp (id_emp),
    UNIQUE KEY unique_balance_per_empresa (id_emp)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLA 9: TRANSACCION (Depende de: EMPRESA)
-- ============================================================================
CREATE TABLE TRANSACCION (
    id_trans VARCHAR(36) PRIMARY KEY,
    id_emp VARCHAR(36) NOT NULL,
    tipo VARCHAR(20) NOT NULL,
    cantidad_tokens INT NOT NULL,
    monto DECIMAL(10, 2) DEFAULT NULL,
    moneda VARCHAR(3) DEFAULT 'COP',
    stripe_payment_intent_id VARCHAR(255) DEFAULT NULL,
    estado VARCHAR(20) DEFAULT 'pendiente',
    descripcion TEXT,
    fecha_transaccion DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_emp) REFERENCES EMPRESA(id_emp) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_id_emp (id_emp),
    INDEX idx_tipo (tipo),
    INDEX idx_estado (estado),
    INDEX idx_fecha_transaccion (fecha_transaccion),
    INDEX idx_stripe_payment (stripe_payment_intent_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLA 10: password_reset_tokens
-- ============================================================================
-- NOTA: Esta tabla NO tiene Foreign Key a USUARIO por diseño intencional:
-- 1. Permite solicitar reset ANTES de que el usuario exista (edge case)
-- 2. Los tokens son temporales y se expiran automáticamente
-- 3. Si el usuario elimina su cuenta, los tokens pendientes no causan problemas
-- 4. Mayor flexibilidad operacional para recuperación de contraseñas
-- 
-- Si prefieres agregar FK para mayor integridad, descomenta la línea:
-- FOREIGN KEY (email) REFERENCES USUARIO(correo) ON DELETE CASCADE ON UPDATE CASCADE
-- 
CREATE TABLE password_reset_tokens (
    id_reset VARCHAR(36) PRIMARY KEY,
    email VARCHAR(100) NOT NULL,
    token VARCHAR(255) NOT NULL UNIQUE,
    expires_at DATETIME NOT NULL,
    used TINYINT(1) DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    -- FOREIGN KEY (email) REFERENCES USUARIO(correo) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_email (email),
    INDEX idx_token (token),
    INDEX idx_expires_at (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- DATOS INICIALES: CIUDADES
-- ============================================================================
INSERT INTO CIUDAD (id_ciud, nomb_ciud) VALUES
(UUID(), 'Bogotá'),
(UUID(), 'Medellín'),
(UUID(), 'Cali'),
(UUID(), 'Barranquilla'),
(UUID(), 'Cartagena'),
(UUID(), 'Bucaramanga'),
(UUID(), 'Pereira'),
(UUID(), 'Santa Marta'),
(UUID(), 'Manizales'),
(UUID(), 'Ibagué');

-- ============================================================================
-- VISTAS: VISTA DE CALIFICACIONES DE FREELANCERS
-- ============================================================================

-- Vista para obtener el resumen de calificaciones por freelancer
CREATE OR REPLACE VIEW vista_calificaciones_freelancer AS
SELECT 
    f.id_free,
    u.nombre AS nombre_freelancer,
    u.correo AS correo_freelancer,
    f.profesion,
    f.avatar,
    COUNT(c.id_calif) AS total_calificaciones,
    COALESCE(AVG(c.puntuacion), 0) AS promedio_calificacion,
    SUM(CASE WHEN c.puntuacion = 5 THEN 1 ELSE 0 END) AS calificaciones_5_estrellas,
    SUM(CASE WHEN c.puntuacion = 4 THEN 1 ELSE 0 END) AS calificaciones_4_estrellas,
    SUM(CASE WHEN c.puntuacion = 3 THEN 1 ELSE 0 END) AS calificaciones_3_estrellas,
    SUM(CASE WHEN c.puntuacion = 2 THEN 1 ELSE 0 END) AS calificaciones_2_estrellas,
    SUM(CASE WHEN c.puntuacion = 1 THEN 1 ELSE 0 END) AS calificaciones_1_estrella,
    MAX(c.fecha_calif) AS ultima_calificacion,
    COUNT(DISTINCT c.id_emp) AS empresas_diferentes_trabajadas
FROM 
    FREELANCER f
    INNER JOIN USUARIO u ON f.id_usu = u.id_usu
    LEFT JOIN CALIFICACION c ON f.id_free = c.id_free
GROUP BY 
    f.id_free, u.nombre, u.correo, f.profesion, f.avatar;

-- Vista detallada de calificaciones con información de empresa y vacante
CREATE OR REPLACE VIEW vista_calificaciones_detalladas AS
SELECT 
    c.id_calif,
    c.puntuacion,
    c.comentario,
    c.fecha_calif,
    -- Información del Freelancer
    f.id_free,
    uf.nombre AS nombre_freelancer,
    uf.correo AS correo_freelancer,
    f.profesion,
    -- Información de la Empresa
    e.id_emp,
    ue.nombre AS nombre_empresa,
    e.logo AS logo_empresa,
    -- Información de la Vacante
    v.id_vac,
    v.nomb_vacante,
    -- Información de la Postulación
    p.id_post,
    p.fecha_post,
    p.estado_post
FROM 
    CALIFICACION c
    INNER JOIN FREELANCER f ON c.id_free = f.id_free
    INNER JOIN USUARIO uf ON f.id_usu = uf.id_usu
    INNER JOIN EMPRESA e ON c.id_emp = e.id_emp
    INNER JOIN USUARIO ue ON e.id_usu = ue.id_usu
    INNER JOIN POSTULACION p ON c.id_post = p.id_post
    INNER JOIN VACANTE v ON p.id_vac = v.id_vac;

-- ============================================================================
-- VERIFICACIÓN DE TABLAS CREADAS
-- ============================================================================
-- Para verificar que todas las tablas se crearon correctamente:
-- SHOW TABLES;
-- Para verificar la estructura de cada tabla:
-- DESCRIBE nombre_tabla;

-- ============================================================================
-- FIN DEL SCRIPT
-- ============================================================================
-- Para ejecutar este script:
-- 1. Abre phpMyAdmin o MySQL Workbench
-- 2. Selecciona "SQL" o "Query"
-- 3. Copia y pega todo este contenido
-- 4. Ejecuta el script
-- 
-- O desde línea de comandos:
-- mysql -u root -p < recreate_database.sql
-- ============================================================================
