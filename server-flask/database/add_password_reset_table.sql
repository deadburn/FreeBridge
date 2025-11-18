-- ============================================
-- Script para agregar tabla PASSWORD_RESET_TOKENS
-- a base de datos existente
-- ============================================

USE freebridge;

-- Crear tabla de tokens de recuperación de contraseña
CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id_reset VARCHAR(36) PRIMARY KEY COMMENT 'ID único del registro de token',
    email VARCHAR(100) NOT NULL COMMENT 'Email del usuario que solicita recuperación',
    token VARCHAR(255) NOT NULL UNIQUE COMMENT 'Token único de recuperación (UUID)',
    expires_at DATETIME NOT NULL COMMENT 'Fecha y hora de expiración del token',
    used BOOLEAN DEFAULT FALSE COMMENT 'Indica si el token ya fue utilizado',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha y hora de creación del token',
    
    -- Índices para mejorar rendimiento
    INDEX idx_token (token),
    INDEX idx_email (email),
    INDEX idx_expires (expires_at)
) ENGINE=InnoDB 
DEFAULT CHARSET=utf8mb4 
COLLATE=utf8mb4_unicode_ci
COMMENT='Tabla para almacenar tokens de recuperación de contraseña';

-- Verificar que la tabla se creó correctamente
DESCRIBE password_reset_tokens;

-- Mostrar todas las tablas
SHOW TABLES;
