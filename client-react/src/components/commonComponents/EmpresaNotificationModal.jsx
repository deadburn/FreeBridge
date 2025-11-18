import React from "react";
import { MdNotifications, MdWork, MdClose, MdPersonAdd } from "react-icons/md";
import styles from "../../styles/modules_common/EmpresaNotificationModal.module.css";

export default function EmpresaNotificationModal({
  notificaciones,
  onClose,
  onViewPostulaciones,
  isOpen,
}) {
  console.log(
    "EmpresaNotificationModal - isOpen:",
    isOpen,
    "notificaciones:",
    notificaciones
  );

  if (!isOpen || !notificaciones || notificaciones.length === 0) {
    console.log(
      "Modal no se muestra - isOpen:",
      isOpen,
      "tiene notificaciones:",
      notificaciones?.length || 0
    );
    return null;
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          <MdClose />
        </button>

        <div className={styles.header}>
          <div className={styles.iconContainer}>
            <MdNotifications className={styles.notificationIcon} />
          </div>
          <h2 className={styles.title}>¡Tienes nuevas postulaciones!</h2>
          <p className={styles.subtitle}>
            {notificaciones.length}{" "}
            {notificaciones.length === 1
              ? "persona se ha postulado"
              : "personas se han postulado"}{" "}
            a tus vacantes
          </p>
        </div>

        <div className={styles.content}>
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <MdPersonAdd className={styles.personIcon} />
              <h3 className={styles.sectionTitle}>Postulaciones Pendientes</h3>
            </div>
            <div className={styles.list}>
              {notificaciones.slice(0, 5).map((notif) => (
                <div key={notif.id} className={styles.item}>
                  <div className={styles.itemContent}>
                    <div className={styles.itemHeader}>
                      <MdWork className={styles.workIcon} />
                      <strong>{notif.vacante.nombre}</strong>
                    </div>
                    <p className={styles.itemDetail}>
                      <span className={styles.freelancerName}>
                        {notif.freelancer.nombre}
                      </span>
                      {" - "}
                      <span className={styles.itemDate}>
                        {new Date(notif.fecha).toLocaleDateString("es-ES", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
            {notificaciones.length > 5 && (
              <p className={styles.moreItems}>
                Y {notificaciones.length - 5} postulaciones más...
              </p>
            )}
          </div>

          <div className={styles.infoBox}>
            <MdNotifications />
            <p>
              Revisa y gestiona todas las postulaciones en el panel de gestión
            </p>
          </div>
        </div>

        <div className={styles.footer}>
          <button className={styles.secondaryButton} onClick={onClose}>
            Más tarde
          </button>
          <button
            className={styles.primaryButton}
            onClick={onViewPostulaciones}
          >
            Ver Postulaciones
          </button>
        </div>
      </div>
    </div>
  );
}
