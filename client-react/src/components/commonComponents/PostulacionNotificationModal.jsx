import React from "react";
import { MdCheckCircle, MdCancel, MdEmail, MdClose } from "react-icons/md";
import styles from "../../styles/modules_common/PostulacionNotificationModal.module.css";

export default function PostulacionNotificationModal({
  cambios,
  onClose,
  isOpen,
}) {
  if (!isOpen) {
    return null;
  }

  const aceptadas = cambios.filter((c) => c.estado === "aceptada");
  const rechazadas = cambios.filter((c) => c.estado === "rechazada");

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          <MdClose />
        </button>

        <div className={styles.header}>
          <div className={styles.iconContainer}>
            <MdEmail className={styles.emailIcon} />
          </div>
          <h2 className={styles.title}>
            {cambios && cambios.length > 0
              ? "¡Tienes actualizaciones en tus postulaciones!"
              : "Historial de Notificaciones"}
          </h2>
          <p className={styles.subtitle}>
            {cambios && cambios.length > 0
              ? `Se han actualizado ${cambios.length} ${
                  cambios.length === 1 ? "postulación" : "postulaciones"
                }`
              : "No tienes notificaciones nuevas en este momento"}
          </p>
        </div>

        <div className={styles.content}>
          {(!cambios || cambios.length === 0) && (
            <div className={styles.section}>
              <p className={styles.emptyMessage}>
                📭 No hay actualizaciones de postulaciones por el momento.
                <br />
                <small>
                  Las notificaciones sobre cambios en tus postulaciones
                  aparecerán aquí.
                </small>
              </p>
            </div>
          )}
          {aceptadas.length > 0 && (
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <MdCheckCircle className={styles.successIcon} />
                <h3 className={styles.sectionTitle}>
                  ✨ Postulaciones Aceptadas ({aceptadas.length})
                </h3>
              </div>
              <div className={styles.list}>
                {aceptadas.map((cambio) => (
                  <div key={cambio.id} className={styles.itemSuccess}>
                    <strong>{cambio.vacante.nombre}</strong>
                    <p>{cambio.vacante.descripcion.substring(0, 80)}...</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {rechazadas.length > 0 && (
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <MdCancel className={styles.rejectIcon} />
                <h3 className={styles.sectionTitle}>
                  Postulaciones No Seleccionadas ({rechazadas.length})
                </h3>
              </div>
              <div className={styles.list}>
                {rechazadas.map((cambio) => (
                  <div key={cambio.id} className={styles.itemReject}>
                    <strong>{cambio.vacante.nombre}</strong>
                    <p>{cambio.vacante.descripcion.substring(0, 80)}...</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className={styles.emailReminder}>
            <MdEmail />
            <p>
              <strong>Revisa tu correo electrónico</strong> para ver los
              detalles completos de cada actualización.
            </p>
          </div>
        </div>

        <div className={styles.footer}>
          <button className={styles.primaryButton} onClick={onClose}>
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
}
