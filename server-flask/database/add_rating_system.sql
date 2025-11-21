-- Sistema de Calificaciones para Freelancers
-- Ejecutar después de tener las tablas base creadas

-- Tabla de calificaciones
CREATE TABLE IF NOT EXISTS CALIFICACION (
    id_calif VARCHAR(36) PRIMARY KEY,
    id_post VARCHAR(36) NOT NULL,
    id_emp VARCHAR(36) NOT NULL,
    id_free VARCHAR(36) NOT NULL,
    puntuacion INT NOT NULL CHECK (puntuacion >= 1 AND puntuacion <= 5),
    comentario TEXT,
    fecha_calif DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_post) REFERENCES POSTULACION(id_post) ON DELETE CASCADE,
    FOREIGN KEY (id_emp) REFERENCES EMPRESA(id_emp) ON DELETE CASCADE,
    FOREIGN KEY (id_free) REFERENCES FREELANCER(id_free) ON DELETE CASCADE,
    UNIQUE KEY unique_calificacion (id_post) -- Una sola calificación por postulación
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Índices para mejorar rendimiento
CREATE INDEX idx_calif_freelancer ON CALIFICACION(id_free);
CREATE INDEX idx_calif_empresa ON CALIFICACION(id_emp);
CREATE INDEX idx_calif_postulacion ON CALIFICACION(id_post);

-- Vista para obtener el promedio de calificaciones por freelancer
CREATE OR REPLACE VIEW vista_calificaciones_freelancer AS
SELECT 
    f.id_free,
    COALESCE(AVG(c.puntuacion), 0) as promedio_calificacion,
    COUNT(c.id_calif) as total_calificaciones
FROM FREELANCER f
LEFT JOIN CALIFICACION c ON f.id_free = c.id_free
GROUP BY f.id_free;
