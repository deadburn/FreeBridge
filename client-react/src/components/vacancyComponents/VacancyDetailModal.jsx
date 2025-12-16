import React from "react";
import {
  MdClose,
  MdLocationOn,
  MdAttachMoney,
  MdWork,
  MdBusiness,
  MdSchedule,
} from "react-icons/md";
import styles from "../../styles/modules_modals/VacancyDetailModal.module.css";
import { useProfessionValidation } from "../../hooks/useProfessionValidation";
import ProfessionMismatchModal from "../modalsComponents/ProfessionMismatchModal";
import { useAuth } from "../../context/AuthContext";
import { useFreelancerProfession } from "../../hooks/useFreelancerProfession";

export default function VacancyDetailModal({
  vacante,
  isOpen,
  onClose,
  onApply,
  canApply,
  yaPostulado = false,
}) {
  const { userRole } = useAuth();
  const { profession } = useFreelancerProfession();
  const {
    showMismatchModal,
    currentVacancy,
    validateAndProceed,
    handleContinueAnyway,
    handleCancel,
    getMessageForCurrentVacancy,
  } = useProfessionValidation(profession);

  if (!isOpen || !vacante) return null;

  const formatSalary = (salary) => {
    if (!salary) return "No especificado";
    return new Intl.NumberFormat("es-CO", {
      minimumFractionDigits: 0,
    }).format(salary);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "No especificada";
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleApplyClick = () => {
    // Si es freelancer con profesión, validar compatibilidad
    if (userRole === "FreeLancer" && profession) {
      validateAndProceed(vacante, () => onApply(vacante));
    } else {
      // Si no es freelancer o no tiene profesión, aplicar directamente
      onApply(vacante);
    }
  };

  return (
    <>
      <div className={styles.backdrop} onClick={handleBackdropClick}>
        <div className={styles.modal}>
          <button className={styles.closeButton} onClick={onClose}>
            <MdClose />
          </button>

          <div className={styles.header}>
            <h2 className={styles.title}>{vacante.nombre}</h2>
            <span
              className={`${styles.badge} ${
                (vacante.estado || vacante.estado_vac)?.toLowerCase() ===
                "abierta"
                  ? styles.badgeOpen
                  : styles.badgeClosed
              }`}
            >
              {(vacante.estado || vacante.estado_vac)?.toLowerCase() ===
              "abierta"
                ? "Abierta"
                : "Cerrada"}
            </span>
          </div>

          <div className={styles.info}>
            {vacante.empresa && (
              <div className={styles.infoItem}>
                <MdBusiness className={styles.icon} />
                <span>
                  {vacante.empresa.nombre || "Empresa no especificada"}
                </span>
              </div>
            )}

            {vacante.ciudad && (
              <div className={styles.infoItem}>
                <MdLocationOn className={styles.icon} />
                <span>
                  {vacante.ciudad.nombre || "Ubicación no especificada"}
                </span>
              </div>
            )}

            {vacante.salario && (
              <div className={styles.infoItem}>
                <MdAttachMoney className={styles.icon} />
                <span>{formatSalary(vacante.salario)}</span>
              </div>
            )}

            {vacante.duracion_proyecto &&
              vacante.duracion_proyecto !== "No especificado" && (
                <div className={styles.infoItem}>
                  <MdSchedule className={styles.icon} />
                  <span>Duración: {vacante.duracion_proyecto}</span>
                </div>
              )}

            <div className={styles.infoItem}>
              <MdWork className={styles.icon} />
              <span>Publicada: {formatDate(vacante.fecha_publicacion)}</span>
            </div>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Descripción</h3>
            <p className={styles.description}>
              {vacante.descripcion || "Sin descripción"}
            </p>
          </div>

          {vacante.requisitos && (
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Requisitos</h3>
              <p className={styles.requisitos}>{vacante.requisitos}</p>
            </div>
          )}

          {canApply && (
            <div className={styles.actions}>
              <button className={styles.applyButton} onClick={handleApplyClick}>
                Postularse a esta vacante
              </button>
            </div>
          )}

          {yaPostulado && (
            <div className={styles.actions}>
              <div className={styles.alreadyApplied}>
                Ya te has postulado a esta vacante
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal de validación de compatibilidad */}
      {userRole === "FreeLancer" && profession && (
        <ProfessionMismatchModal
          isOpen={showMismatchModal}
          onClose={handleCancel}
          onContinue={handleContinueAnyway}
          freelancerCategory={getMessageForCurrentVacancy()?.freelancerCategory}
          vacancyCategory={getMessageForCurrentVacancy()?.vacancyCategory}
          vacancyTitle={currentVacancy?.nomb_vacante || currentVacancy?.nombre}
        />
      )}
    </>
  );
}
