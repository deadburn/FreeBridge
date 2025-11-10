/**
 * SuccessModal.jsx
 * Modal de confirmación para registro exitoso
 */

import React from "react";
import styles from "../styles/SuccessModal.module.css";

export default function SuccessModal({ isOpen, onClose, userName }) {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.iconContainer}>
          <svg
            className={styles.checkIcon}
            viewBox="0 0 52 52"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              className={styles.checkCircle}
              cx="26"
              cy="26"
              r="25"
              fill="none"
            />
            <path
              className={styles.checkPath}
              fill="none"
              d="M14.1 27.2l7.1 7.2 16.7-16.8"
            />
          </svg>
        </div>

        <h2 className={styles.title}>¡Registro Exitoso!</h2>

        <p className={styles.message}>
          Bienvenido/a, <strong>{userName}</strong>
        </p>

        <p className={styles.submessage}>
          Tu cuenta ha sido creada correctamente. Ahora puedes iniciar sesión y
          comenzar a usar FreeBridge.
        </p>

        <button className={styles.closeButton} onClick={onClose}>
          Continuar
        </button>
      </div>
    </div>
  );
}
