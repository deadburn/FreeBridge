import React from "react";
import { MdWarning, MdClose } from "react-icons/md";
import styles from "../../styles/modules_common/DeleteAccountModal.module.css";

export default function DeleteAccountModal({
  isOpen,
  onClose,
  onConfirm,
  userName,
}) {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          <MdClose />
        </button>

        <div className={styles.warningIcon}>
          <MdWarning />
        </div>

        <h2 className={styles.title}>¿Eliminar Cuenta?</h2>

        <div className={styles.messageContainer}>
          <p className={styles.message}>
            <strong>{userName}</strong>, estás a punto de eliminar tu cuenta de
            forma permanente.
          </p>
          <p className={styles.warning}>
            Esta acción no se puede deshacer y se eliminarán:
          </p>
          <ul className={styles.itemsList}>
            <li>Todos tus datos personales</li>
            <li>Tu perfil profesional</li>
            <li>Todas tus postulaciones</li>
            <li>Archivos subidos (CV, imágenes)</li>
            <li>Todo tu historial en la plataforma</li>
          </ul>
        </div>

        <div className={styles.actions}>
          <button className={styles.btnCancel} onClick={onClose}>
            Cancelar
          </button>
          <button className={styles.btnDelete} onClick={onConfirm}>
            Sí, eliminar mi cuenta
          </button>
        </div>
      </div>
    </div>
  );
}
