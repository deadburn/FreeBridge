import React from "react";
import { MdClose, MdCheck, MdWarning, MdError, MdInfo } from "react-icons/md";
import styles from "../../styles/modules_modals/AlertModal.module.css";

/**
 * Modal genérico para mostrar alertas, errores, confirmaciones, etc.
 * Reemplaza el uso de alert() del navegador
 */
export default function AlertModal({
  isOpen,
  onClose,
  title,
  message,
  type = "info", // 'success', 'error', 'warning', 'info'
  icon,
  buttons = [],
  onConfirm,
}) {
  if (!isOpen) return null;

  const getIcon = () => {
    if (icon) return icon;

    switch (type) {
      case "success":
        return <MdCheck className={styles.iconSuccess} />;
      case "error":
        return <MdError className={styles.iconError} />;
      case "warning":
        return <MdWarning className={styles.iconWarning} />;
      case "info":
      default:
        return <MdInfo className={styles.iconInfo} />;
    }
  };

  const handleConfirm = () => {
    if (onConfirm) onConfirm();
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          <MdClose />
        </button>

        <div className={styles.content}>
          <div className={`${styles.iconContainer} ${styles[`type-${type}`]}`}>
            {getIcon()}
          </div>

          {title && <h2 className={styles.title}>{title}</h2>}

          {message && <p className={styles.message}>{message}</p>}

          <div className={styles.actions}>
            {buttons && buttons.length > 0 ? (
              buttons.map((button, index) => (
                <button
                  key={index}
                  className={`${styles.button} ${
                    styles[`button-${button.type || "primary"}`]
                  }`}
                  onClick={() => {
                    if (button.onClick) button.onClick();
                    onClose();
                  }}
                >
                  {button.label}
                </button>
              ))
            ) : (
              <button
                className={`${styles.button} ${styles["button-primary"]}`}
                onClick={handleConfirm}
              >
                Aceptar
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
