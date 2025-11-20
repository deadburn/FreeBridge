import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { verificarPostulacion } from "../../api/postApi";
import styles from "../../styles/modules_vacancies/VacancyCard.module.css";

/**
 * VacancyCard - Componente reutilizable para mostrar información de vacantes
 *
 * @param {Object} vacante - Objeto con la información de la vacante
 * @param {string} vacante.id - ID único de la vacante
 * @param {string} vacante.nombre - Nombre/título de la vacante
 * @param {string} vacante.descripcion - Descripción detallada
 * @param {string} [vacante.requisitos] - Requisitos del puesto (opcional)
 * @param {number} [vacante.salario] - Salario ofrecido (opcional)
 * @param {string} [vacante.estado] - Estado de la vacante (default: "abierta")
 * @param {Object} [vacante.empresa] - Información de la empresa
 * @param {string} [vacante.empresa.nombre] - Nombre de la empresa
 * @param {string} [vacante.fecha_publicacion] - Fecha ISO de publicación
 *
 * @param {Function} [onApply] - Callback al hacer clic en "Postularse" (opcional)
 * @param {Function} [onView] - Callback al hacer clic para ver detalles (opcional)
 * @param {boolean} [showApplyButton=true] - Mostrar botón de postulación
 * @param {boolean} [showCompany=true] - Mostrar nombre de empresa
 * @param {boolean} [showSalary=false] - Mostrar información de salario
 * @param {string} [variant="default"] - Variante de diseño: "default", "compact", "detailed"
 */
export default function VacancyCard({
  vacante,
  onApply,
  onView,
  showApplyButton = true,
  showCompany = true,
  showSalary = false,
  variant = "default",
}) {
  const { isAuthenticated, userRole } = useAuth();
  const [yaPostulado, setYaPostulado] = useState(false);
  const [verificando, setVerificando] = useState(true);

  // Verificar si el freelancer ya se postuló a esta vacante
  useEffect(() => {
    const verificarSiPostulo = async () => {
      // Solo verificar si es freelancer autenticado
      if (!isAuthenticated || userRole !== "FreeLancer" || !vacante.id) {
        setVerificando(false);
        return;
      }

      try {
        const resultado = await verificarPostulacion(vacante.id);
        setYaPostulado(resultado.postulado);
      } catch (error) {
        console.error("Error al verificar postulación:", error);
      } finally {
        setVerificando(false);
      }
    };

    verificarSiPostulo();
  }, [isAuthenticated, userRole, vacante.id]);

  // Maneja el clic en postularse
  const handleApply = (e) => {
    e.stopPropagation(); // Evita que se dispare onView si existe

    // Verificar que esté autenticado
    if (!isAuthenticated) {
      alert("Debes iniciar sesión como FreeLancer para postularte");
      return;
    }

    // Verificar que sea FreeLancer
    if (userRole !== "FreeLancer") {
      alert("Solo los FreeLancers pueden postularse a vacantes");
      return;
    }

    if (onApply) {
      onApply(vacante);
    }
  };

  // Maneja el clic en la card completa
  const handleCardClick = () => {
    if (onView) {
      onView(vacante);
    }
  };

  // Determina el estado de la vacante
  const estado = vacante.estado || vacante.estado_vac || "abierta";
  const isActive = estado.toLowerCase() === "abierta";

  // Determinar si puede postularse (no debe estar ya postulado)
  const canApply =
    isAuthenticated && userRole === "FreeLancer" && isActive && !yaPostulado;
  const shouldShowButton =
    showApplyButton &&
    (canApply || yaPostulado || !isAuthenticated || userRole === "FreeLancer");

  // Formatea el salario
  const formatSalary = (salary) => {
    if (!salary) return null;
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(salary);
  };

  // Calcula hace cuánto se publicó
  const getTimeAgo = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const now = new Date();

    // Normalizar ambas fechas al inicio del día para comparar solo días
    const dateOnly = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );
    const nowOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const diffMs = nowOnly - dateOnly;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Hoy";
    if (diffDays === 1) return "Hace 1 día";
    if (diffDays < 7) return `Hace ${diffDays} días`;
    if (diffDays < 30) return `Hace ${Math.floor(diffDays / 7)} semanas`;
    return `Hace ${Math.floor(diffDays / 30)} meses`;
  };

  return (
    <div
      className={`${styles.card} ${styles[variant]} ${
        onView ? styles.clickable : ""
      }`}
      onClick={handleCardClick}
    >
      <div className={styles.cardHeader}>
        <h3 className={styles.title}>
          {vacante.nombre || vacante.titulo || "Sin título"}
        </h3>
        <span
          className={`${styles.badge} ${
            isActive ? styles.badgeActive : styles.badgeInactive
          }`}
        >
          {isActive ? "Activa" : estado}
        </span>
      </div>

      <p className={styles.description}>
        {vacante.descripcion || "Sin descripción disponible"}
      </p>

      {/* Información adicional según la variante */}
      {variant === "detailed" && vacante.requisitos && (
        <div className={styles.requisitos}>
          <strong>Requisitos:</strong>
          <p>{vacante.requisitos}</p>
        </div>
      )}

      {/* Mostrar salario si está habilitado y existe */}
      {showSalary && vacante.salario && (
        <div className={styles.salary}>💰 {formatSalary(vacante.salario)}</div>
      )}

      <div className={styles.cardFooter}>
        <div className={styles.footerInfo}>
          {/* Mostrar empresa si está habilitado */}
          {showCompany && (
            <small className={styles.company}>
              🏢 {vacante.empresa?.nombre || "Empresa Confidencial"}
            </small>
          )}

          {/* Mostrar fecha de publicación */}
          {vacante.fecha_publicacion && (
            <small className={styles.date}>
              📅 {getTimeAgo(vacante.fecha_publicacion)}
            </small>
          )}
        </div>

        {/* Botón de postulación si está habilitado */}
        {shouldShowButton && (
          <button
            className={styles.applyButton}
            onClick={handleApply}
            disabled={!canApply || verificando}
            style={{
              opacity: canApply && !verificando ? 1 : 0.6,
              cursor: canApply && !verificando ? "pointer" : "not-allowed",
            }}
            title={
              yaPostulado
                ? "Ya te has postulado a esta vacante"
                : "Postularse a la vacante"
            }
          >
            {verificando
              ? "Verificando..."
              : yaPostulado
              ? "Ya postulado"
              : "Postularse"}
          </button>
        )}
      </div>
    </div>
  );
}
