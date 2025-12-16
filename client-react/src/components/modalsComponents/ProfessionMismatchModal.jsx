import React from "react";
import styles from "../../styles/modules_modals/ProfessionMismatchModal.module.css";
import { MdWarning, MdClose } from "react-icons/md";

/**
 * Modal que muestra una alerta cuando el freelancer intenta aplicar
 * a una vacante que no coincide con su perfil
 */
export default function ProfessionMismatchModal({
  isOpen,
  onClose,
  onContinue,
  freelancerCategory,
  vacancyCategory,
  vacancyTitle,
}) {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          <MdClose />
        </button>

        <div className={styles.modalBody}>
          <div className={styles.iconContainer}>
            <MdWarning className={styles.warningIcon} />
          </div>

          <h2 className={styles.title}>Alerta de Compatibilidad</h2>

          <div className={styles.message}>
            <p>
              Detectamos que tu perfil es de{" "}
              <strong>{freelancerCategory}</strong>, pero la vacante{" "}
              <strong>"{vacancyTitle}"</strong> es para{" "}
              <strong>{vacancyCategory}</strong>.
            </p>
            <p>
              Aunque puedes continuar, es posible que no cumplas con los
              requisitos específicos de esta posición.
            </p>
          </div>

          <div className={styles.actions}>
            <button className={styles.cancelButton} onClick={onClose}>
              Cancelar
            </button>
            <button className={styles.continueButton} onClick={onContinue}>
              Continuar de todas formas
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
