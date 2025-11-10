/**
 * Modal.jsx
 * Componente modal reutilizable para mostrar contenido en ventana emergente
 * Se usa para Términos y Condiciones, Políticas de Privacidad, etc.
 */

import React, { useEffect } from "react";
import styles from "../styles/Modal.module.css";

export default function Modal({ isOpen, onClose, title, children }) {
  // Cerrar modal con tecla Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Prevenir scroll del body cuando el modal está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // No renderizar si no está abierto
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      {/* Contenedor del modal */}
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        {/* Header con título y botón cerrar */}
        <div className={styles.modalHeader}>
          <h2>{title}</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Cuerpo del modal con scroll */}
        <div className={styles.modalBody}>{children}</div>

        {/* Footer con botón de cerrar */}
        <div className={styles.modalFooter}>
          <button className={styles.acceptButton} onClick={onClose}>
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
}
