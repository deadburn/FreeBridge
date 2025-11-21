import React, { useState } from "react";
import {
  MdPerson,
  MdWork,
  MdEdit,
  MdDelete,
  MdAssignment,
  MdMenu,
  MdClose,
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
  rating = 0,
  totalRatings = 0,
}) {
  const [isOpen, setIsOpen] = useState(false);
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

  const handleViewChange = (view) => {
    onViewChange(view);
    setIsOpen(false);
  };

  return (
    <>
      {/* Botón hamburguesa */}
      <button
        className={styles.toggleButton}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        {isOpen ? <MdClose size={28} /> : <MdMenu size={28} />}
      </button>

      {/* Overlay para cerrar al hacer clic fuera */}
      {isOpen && (
        <div className={styles.overlay} onClick={() => setIsOpen(false)} />
      )}

      <aside
        className={`${styles.sidebar} ${styles.sidebarFreelance} ${
          isOpen ? styles.sidebarOpen : ""
        }`}
      >
        <div className={styles.profileHeader}>
          <div className={styles.avatarLarge}>{getAvatarDisplay()}</div>
          <h2 className={styles.userName}>{userName || "Freelancer"}</h2>
          <div className={styles.ratingDisplay}>
            <span className={styles.ratingValue}>
              {rating > 0 ? rating.toFixed(1) : "0.0"}
            </span>
            <div className={styles.starsContainer}>
              <span className={styles.stars}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={
                      star <= Math.round(rating)
                        ? styles.starFilled
                        : styles.starEmpty
                    }
                  >
                    ★
                  </span>
                ))}
              </span>
              <small className={styles.ratingCount}>
                ({totalRatings}{" "}
                {totalRatings === 1 ? "calificación" : "calificaciones"})
              </small>
            </div>
          </div>
        </div>

        <nav className={styles.nav}>
          <button
            className={`${styles.navItem} ${
              activeView === "perfil" ? styles.navItemActive : ""
            }`}
            onClick={() => handleViewChange("perfil")}
          >
            <MdPerson className={styles.navIcon} />
            <span className={styles.navText}>Mi Perfil</span>
          </button>

          <button
            className={`${styles.navItem} ${
              activeView === "vacantes" ? styles.navItemActive : ""
            }`}
            onClick={() => handleViewChange("vacantes")}
          >
            <MdWork className={styles.navIcon} />
            <span className={styles.navText}>Consultar Vacantes</span>
          </button>

          <button
            className={`${styles.navItem} ${
              activeView === "mis-postulaciones" ? styles.navItemActive : ""
            }`}
            onClick={() => handleViewChange("mis-postulaciones")}
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
            onClick={() => handleViewChange("perfil")}
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
    </>
  );
}
