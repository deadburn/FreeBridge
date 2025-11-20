import React from "react";
import { MdNotifications } from "react-icons/md";
import styles from "../../styles/modules_common/NotificationButton.module.css";

export default function NotificationButton({ notificationCount, onClick }) {
  return (
    <button
      className={styles.notificationButton}
      onClick={onClick}
      title="Ver notificaciones"
      aria-label={`Notificaciones${
        notificationCount > 0 ? ` (${notificationCount})` : ""
      }`}
    >
      <MdNotifications className={styles.bellIcon} />
      {notificationCount > 0 && (
        <span className={styles.badge}>{notificationCount}</span>
      )}
    </button>
  );
}
