import React from "react";
import {
  MdDashboard,
  MdPostAdd,
  MdWorkOutline,
  MdLabel,
  MdDelete,
  MdFolder,
} from "react-icons/md";
import styles from "../styles/modules_dashboards/CompanyDashboard.module.css";

export default function CompanySidebar({ activeView, onViewChange }) {
  return (
    <aside className={styles.sidebar}>
      <h2 className={styles.sidebarTitle}>Panel de Empresa</h2>

      <nav className={styles.nav}>
        <button
          className={`${styles.navItem} ${
            activeView === "postulaciones" ? styles.navItemActive : ""
          }`}
          onClick={() => onViewChange("postulaciones")}
        >
          <MdDashboard className={styles.navIcon} />
          <span className={styles.navText}>Gestión de postulaciones</span>
        </button>

        <button
          className={`${styles.navItem} ${
            activeView === "mis-vacantes" ? styles.navItemActive : ""
          }`}
          onClick={() => onViewChange("mis-vacantes")}
        >
          <MdWorkOutline className={styles.navIcon} />
          <span className={styles.navText}>Mis Vacantes</span>
        </button>

        <button
          className={`${styles.navItem} ${
            activeView === "publicar" ? styles.navItemActive : ""
          }`}
          onClick={() => onViewChange("publicar")}
        >
          <MdPostAdd className={styles.navIcon} />
          <span className={styles.navText}>Publicar vacantes</span>
        </button>
      </nav>

      {/* Acciones adicionales */}
      <div className={styles.sidebarActions}>
        <button className={styles.actionButton} title="Etiquetas">
          <MdLabel />
        </button>
        <button className={styles.actionButton} title="Eliminar">
          <MdDelete />
        </button>
        <button className={styles.actionButton} title="Archivos">
          <MdFolder />
        </button>
      </div>
    </aside>
  );
}
