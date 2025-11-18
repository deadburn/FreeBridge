-- ============================================
-- Script de datos iniciales para FreeBridge
-- ============================================

USE freebridge;

-- ============================================
-- Insertar ciudades de Colombia
-- ============================================
INSERT INTO CIUDAD (id_ciud, nomb_ciud) VALUES
('C001', 'Bogotá'),
('C002', 'Medellín'),
('C003', 'Cali'),
('C004', 'Barranquilla'),
('C005', 'Cartagena'),
('C006', 'Bucaramanga'),
('C007', 'Pereira'),
('C008', 'Santa Marta'),
('C009', 'Cúcuta'),
('C010', 'Manizales'),
('C011', 'Ibagué'),
('C012', 'Pasto'),
('C013', 'Neiva'),
('C014', 'Villavicencio'),
('C015', 'Armenia');

-- ============================================
-- Datos de ejemplo (comentados)
-- Descomenta si necesitas datos de prueba
-- ============================================

-- Ejemplo de usuario empresa
-- INSERT INTO USUARIO (id_usu, nombre, correo, contraseña, rol, estado) VALUES
-- ('U001', 'TechCorp SAS', 'contacto@techcorp.com', '$2b$12$hashedpassword', 'Empresa', 'Activo');

-- Ejemplo de empresa
-- INSERT INTO EMPRESA (id_emp, id_usu, id_ciud, NIT, tamaño, desc_emp) VALUES
-- ('E001', 'U001', 'C001', '900123456-1', 'Mediana', 'Empresa de desarrollo de software');

-- Ejemplo de usuario freelancer
-- INSERT INTO USUARIO (id_usu, nombre, correo, contraseña, rol, estado) VALUES
-- ('U002', 'Juan Pérez', 'juan.perez@email.com', '$2b$12$hashedpassword', 'FreeLancer', 'Activo');

-- Ejemplo de freelancer
-- INSERT INTO FREELANCER (id_free, id_usu, id_ciud, profesion, experiencia, hoja_vida) VALUES
-- ('F001', 'U002', 'C001', 'Desarrollador Full Stack', '5 años de experiencia en desarrollo web', NULL);

-- Ejemplo de vacante
-- INSERT INTO VACANTE (id_vac, id_emp, nomb_vacante, descripcion, requisitos, salario, estado_vac) VALUES
-- ('V001', 'E001', 'Desarrollador React', 'Buscamos desarrollador con experiencia en React', 'React, JavaScript, CSS', 3500000.00, 'abierta');

-- Ejemplo de postulación
-- INSERT INTO POSTULACION (id_post, id_free, id_vac, estado_post) VALUES
-- ('P001', 'F001', 'V001', 'pendiente');

SELECT 'Base de datos inicializada correctamente' AS mensaje;
