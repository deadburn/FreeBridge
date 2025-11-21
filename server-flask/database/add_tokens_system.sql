-- ============================================
-- Script para agregar sistema de tokens y pagos
-- ============================================

USE freebridge;

-- Tabla para gestionar el balance de tokens de cada empresa
CREATE TABLE TOKEN_BALANCE (
    id_balance VARCHAR(36) PRIMARY KEY,
    id_emp VARCHAR(36) NOT NULL,
    tokens_disponibles INT DEFAULT 0,
    tokens_usados INT DEFAULT 0,
    fecha_actualizacion DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_emp) REFERENCES EMPRESA(id_emp) ON DELETE CASCADE ON UPDATE CASCADE,
    UNIQUE KEY unique_empresa (id_emp),
    INDEX idx_empresa (id_emp)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla para registrar todas las transacciones de tokens
CREATE TABLE TRANSACCION (
    id_trans VARCHAR(36) PRIMARY KEY,
    id_emp VARCHAR(36) NOT NULL,
    tipo ENUM('compra', 'uso', 'reembolso') NOT NULL,
    cantidad_tokens INT NOT NULL,
    monto DECIMAL(10, 2),
    moneda VARCHAR(3) DEFAULT 'COP',
    stripe_payment_intent_id VARCHAR(255),
    estado ENUM('pendiente', 'completada', 'fallida', 'reembolsada') DEFAULT 'pendiente',
    descripcion TEXT,
    fecha_transaccion DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_emp) REFERENCES EMPRESA(id_emp) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_empresa (id_emp),
    INDEX idx_estado (estado),
    INDEX idx_fecha (fecha_transaccion),
    INDEX idx_stripe (stripe_payment_intent_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Inicializar balance de tokens para empresas existentes (5 tokens gratis de bienvenida)
INSERT INTO TOKEN_BALANCE (id_balance, id_emp, tokens_disponibles, tokens_usados)
SELECT 
    UUID() as id_balance,
    id_emp,
    5 as tokens_disponibles,
    0 as tokens_usados
FROM EMPRESA
WHERE id_emp NOT IN (SELECT id_emp FROM TOKEN_BALANCE);
