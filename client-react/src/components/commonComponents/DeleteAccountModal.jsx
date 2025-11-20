import React, { useState } from "react";
import { MdWarning, MdClose } from "react-icons/md";
import styles from "../../styles/modules_common/DeleteAccountModal.module.css";

export default function DeleteAccountModal({
  isOpen,
  onClose,
  onConfirm,
  userName,
}) {
  const [showSecondConfirm, setShowSecondConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen) return null;

  const handleFirstConfirm = () => {
    setShowSecondConfirm(true);
  };

  const handleFinalConfirm = async () => {
    setIsDeleting(true);
    await onConfirm();
    // El estado de carga se mantendrá hasta que se complete la redirección
  };

  const handleClose = () => {
    if (!isDeleting) {
      setShowSecondConfirm(false);
      onClose();
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={handleClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        {!isDeleting && (
          <button className={styles.closeButton} onClick={handleClose}>
            <MdClose />
          </button>
        )}

        <div className={styles.warningIcon}>
          <MdWarning />
        </div>

        {isDeleting ? (
          <>
            <h2 className={styles.title}>Eliminando cuenta...</h2>
            <div className={styles.loadingContainer}>
              <div className={styles.spinner}></div>
              <p className={styles.loadingText}>
                Por favor espera mientras eliminamos tu cuenta y todos tus
                datos.
              </p>
            </div>
          </>
        ) : !showSecondConfirm ? (
          <>
            <h2 className={styles.title}>¿Eliminar Cuenta?</h2>

            <div className={styles.messageContainer}>
              <p className={styles.message}>
                <strong>{userName}</strong>, estás a punto de eliminar tu cuenta
                de forma permanente.
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
              <button className={styles.btnCancel} onClick={handleClose}>
                Cancelar
              </button>
              <button className={styles.btnDelete} onClick={handleFirstConfirm}>
                Continuar
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className={styles.title}>⚠️ Confirmación Final</h2>

            <div className={styles.messageContainer}>
              <p className={styles.finalWarning}>
                Esta es tu última oportunidad para cancelar.
              </p>
              <p className={styles.message}>
                ¿Estás completamente seguro de que deseas eliminar tu cuenta?
              </p>
              <p className={styles.permanentWarning}>
                <strong>Esta acción es permanente e irreversible.</strong>
              </p>
            </div>

            <div className={styles.actions}>
              <button className={styles.btnCancel} onClick={handleClose}>
                No, mantener mi cuenta
              </button>
              <button
                className={styles.btnDeleteFinal}
                onClick={handleFinalConfirm}
              >
                Sí, eliminar definitivamente
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
