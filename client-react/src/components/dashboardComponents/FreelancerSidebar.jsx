import React from "react";
import {
  MdPerson,
  MdWork,
  MdEdit,
  MdDelete,
  MdAssignment,
} from "react-icons/md";
import NotificationButton from "../commonComponents/NotificationButton";
import { createAvatar } from "@dicebear/core";
import {
  avataaars,
  bottts,
  funEmoji,
  lorelei,
  micah,
  personas,
} from "@dicebear/collection";
import sidebarStyles from "../../styles/modules_dashboards/Sidebar.module.css";
import freelanceStyles from "../../styles/modules_dashboards/FreelanceDashboard.module.css";

const styles = { ...sidebarStyles, ...freelanceStyles };

const AVATAR_STYLES_MAP = {
  avataaars: avataaars,
  bottts: bottts,
  funEmoji: funEmoji,
  lorelei: lorelei,
  micah: micah,
  personas: personas,
};

export default function FreelancerSidebar({
  userName,
  activeView,
  onViewChange,
  avatarUrl,
  onDeleteAccount,
  notificationCount = 0,
  onNotificationClick,
}) {
  // Generar avatar por defecto si no hay uno
  const getAvatarDisplay = () => {
    if (avatarUrl) {
      // Si es un avatar por defecto (default_stylename)
      if (avatarUrl.startsWith("default_")) {
        const styleName = avatarUrl.replace("default_", "");
        const avatarStyle = AVATAR_STYLES_MAP[styleName] || avataaars;
        const avatar = createAvatar(avatarStyle, {
          seed: userName || "default",
          size: 96,
        });
        return (
          <img
            key={avatarUrl}
            src={avatar.toDataUri()}
            alt="Avatar"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        );
      }
      // Si es una imagen subida
      if (avatarUrl.startsWith("uploads/")) {
        return (
          <img
            key={avatarUrl}
            src={`/api/${avatarUrl}?t=${Date.now()}`}
            alt="Avatar"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        );
      }
    }
    // Fallback a icono
    return <MdPerson size={48} />;
  };

  return (
    <aside className={`${styles.sidebar} ${styles.sidebarFreelance}`}>
      <div className={styles.profileHeader}>
        <div className={styles.avatarLarge}>{getAvatarDisplay()}</div>
        <h2 className={styles.userName}>{userName || "Freelancer"}</h2>
        <div className={styles.ratingDisplay}>
          <span className={styles.ratingValue}>5.0</span>
          <span className={styles.stars}>★★★★★</span>
        </div>
      </div>

      <nav className={styles.nav}>
        <button
          className={`${styles.navItem} ${
            activeView === "perfil" ? styles.navItemActive : ""
          }`}
          onClick={() => onViewChange("perfil")}
        >
          <MdPerson className={styles.navIcon} />
          <span className={styles.navText}>Mi Perfil</span>
        </button>

        <button
          className={`${styles.navItem} ${
            activeView === "vacantes" ? styles.navItemActive : ""
          }`}
          onClick={() => onViewChange("vacantes")}
        >
          <MdWork className={styles.navIcon} />
          <span className={styles.navText}>Consultar Vacantes</span>
        </button>

        <button
          className={`${styles.navItem} ${
            activeView === "mis-postulaciones" ? styles.navItemActive : ""
          }`}
          onClick={() => onViewChange("mis-postulaciones")}
        >
          <MdAssignment className={styles.navIcon} />
          <span className={styles.navText}>Mis Postulaciones</span>
        </button>
      </nav>

      {/* Acciones adicionales */}
      <div className={styles.sidebarActions}>
        {onNotificationClick && (
          <NotificationButton
            notificationCount={notificationCount}
            onClick={onNotificationClick}
          />
        )}
        <button
          className={styles.actionButton}
          title="Editar perfil"
          onClick={() => onViewChange("perfil")}
        >
          <MdEdit />
        </button>
        <button
          className={styles.actionButton}
          title="Eliminar cuenta"
          onClick={onDeleteAccount}
        >
          <MdDelete />
        </button>
      </div>
    </aside>
  );
}
