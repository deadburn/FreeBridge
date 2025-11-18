-- ============================================
-- Script de creación de base de datos FreeBridge
-- ============================================

-- Crear la base de datos si no existe
DROP DATABASE IF EXISTS freebridge;
CREATE DATABASE freebridge CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE freebridge;

-- ============================================
-- Tabla: CIUDAD
-- ============================================
CREATE TABLE CIUDAD (
    id_ciud VARCHAR(10) PRIMARY KEY,
    nomb_ciud VARCHAR(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Tabla: USUARIO
-- ============================================
CREATE TABLE USUARIO (
    id_usu VARCHAR(10) PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(100) NOT NULL UNIQUE,
    contraseña VARCHAR(255) NOT NULL,
    rol ENUM('Empresa', 'FreeLancer') NOT NULL,
    estado ENUM('Activo', 'Inactivo', 'Bloqueado', 'Eliminado') DEFAULT 'Activo',
    INDEX idx_correo (correo),
    INDEX idx_rol (rol)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Tabla: EMPRESA
-- ============================================
CREATE TABLE EMPRESA (
    id_emp VARCHAR(11) PRIMARY KEY,
    id_usu VARCHAR(11) NOT NULL,
    id_ciud VARCHAR(11) NOT NULL,
    NIT VARCHAR(20) NOT NULL UNIQUE,
    tamaño ENUM('Pequeña', 'Mediana', 'Grande') NOT NULL,
    desc_emp VARCHAR(250) NOT NULL,
    FOREIGN KEY (id_usu) REFERENCES USUARIO(id_usu) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (id_ciud) REFERENCES CIUDAD(id_ciud) ON DELETE RESTRICT ON UPDATE CASCADE,
    INDEX idx_nit (NIT),
    INDEX idx_id_usu (id_usu)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Tabla: FREELANCER
-- ============================================
CREATE TABLE FREELANCER (
    id_free VARCHAR(11) PRIMARY KEY,
    id_usu VARCHAR(11) NOT NULL,
    id_ciud VARCHAR(11) NOT NULL,
    profesion VARCHAR(50) NOT NULL,
    experiencia TEXT,
    hoja_vida VARCHAR(255),
    FOREIGN KEY (id_usu) REFERENCES USUARIO(id_usu) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (id_ciud) REFERENCES CIUDAD(id_ciud) ON DELETE RESTRICT ON UPDATE CASCADE,
    INDEX idx_id_usu (id_usu),
    INDEX idx_profesion (profesion)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Tabla: VACANTE
-- ============================================
CREATE TABLE VACANTE (
    id_vac VARCHAR(11) PRIMARY KEY,
    id_emp VARCHAR(11) NOT NULL,
    nomb_vacante VARCHAR(50) NOT NULL,
    descripcion TEXT NOT NULL,
    requisitos TEXT NOT NULL,
    salario DECIMAL(10, 2),
    fecha_publicacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    estado_vac VARCHAR(20) DEFAULT 'abierta',
    FOREIGN KEY (id_emp) REFERENCES EMPRESA(id_emp) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_id_emp (id_emp),
    INDEX idx_estado (estado_vac),
    INDEX idx_fecha (fecha_publicacion)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Tabla: POSTULACION
-- ============================================
CREATE TABLE POSTULACION (
    id_post VARCHAR(11) PRIMARY KEY,
    id_free VARCHAR(11) NOT NULL,
    id_vac VARCHAR(11) NOT NULL,
    fecha_post DATETIME DEFAULT CURRENT_TIMESTAMP,
    estado_post VARCHAR(20) DEFAULT 'pendiente',
    FOREIGN KEY (id_free) REFERENCES FREELANCER(id_free) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (id_vac) REFERENCES VACANTE(id_vac) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_id_free (id_free),
    INDEX idx_id_vac (id_vac),
    INDEX idx_estado (estado_post),
    UNIQUE KEY unique_postulacion (id_free, id_vac)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Tabla: PASSWORD_RESET_TOKENS
-- Almacena tokens para recuperación de contraseña
-- ============================================
CREATE TABLE password_reset_tokens (
    id_reset VARCHAR(36) PRIMARY KEY,
    email VARCHAR(100) NOT NULL,
    token VARCHAR(255) NOT NULL UNIQUE,
    expires_at DATETIME NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_token (token),
    INDEX idx_email (email),
    INDEX idx_expires (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Verificación de tablas creadas
-- ============================================
SHOW TABLES;
