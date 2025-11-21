import React, { useState } from "react";
import {
  MdDashboard,
  MdPostAdd,
  MdWorkOutline,
  MdBusiness,
  MdDelete,
  MdFolder,
  MdEdit,
  MdAccountBalanceWallet,
  MdHistory,
  MdMenu,
  MdClose,
  MdStar,
} from "react-icons/md";
import NotificationButton from "../commonComponents/NotificationButton";
import styles from "../../styles/modules_dashboards/Sidebar.module.css";

export default function CompanySidebar({
  activeView,
  onViewChange,
  onDeleteAccount,
  companyData,
  notificationCount = 0,
  onNotificationClick,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const getLogoDisplay = () => {
    if (!companyData?.logo) {
      return (
        <div className={styles.defaultLogo}>
          <MdBusiness size={60} />
        </div>
      );
    }

    // El logo puede venir como "filename.png" o "uploads/logos/filename.png"
    const logoFilename = companyData.logo.includes("/")
      ? companyData.logo.split("/").pop()
      : companyData.logo;
    const logoUrl = `http://localhost:5000/api/uploads/logos/${logoFilename}?t=${Date.now()}`;

    return (
      <img
        src={logoUrl}
        alt="Logo de la empresa"
        className={styles.companyLogo}
        key={logoUrl}
        onError={(e) => {
          console.error("Error al cargar logo de empresa");
        }}
      />
    );
  };

  const handleViewChange = (view) => {
    onViewChange(view);
    setIsOpen(false); // Cerrar sidebar al seleccionar una opción
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
        className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ""}`}
      >
        <h2 className={styles.sidebarTitle}>Panel de Empresa</h2>

        {/* Logo de la empresa */}
        <div className={styles.logoContainer}>
          {getLogoDisplay()}
          {companyData?.nomb_emp && (
            <p className={styles.companyName}>{companyData.nomb_emp}</p>
          )}
        </div>

        <nav className={styles.nav}>
          <button
            className={`${styles.navItem} ${
              activeView === "perfil" ? styles.navItemActive : ""
            }`}
            onClick={() => handleViewChange("perfil")}
          >
            <MdBusiness className={styles.navIcon} />
            <span className={styles.navText}>Mi Perfil</span>
          </button>

          <button
            className={`${styles.navItem} ${
              activeView === "postulaciones" ? styles.navItemActive : ""
            }`}
            onClick={() => handleViewChange("postulaciones")}
          >
            <MdDashboard className={styles.navIcon} />
            <span className={styles.navText}>Gestión de postulaciones</span>
          </button>

          <button
            className={`${styles.navItem} ${
              activeView === "mis-vacantes" ? styles.navItemActive : ""
            }`}
            onClick={() => handleViewChange("mis-vacantes")}
          >
            <MdWorkOutline className={styles.navIcon} />
            <span className={styles.navText}>Mis Vacantes</span>
          </button>

          <button
            className={`${styles.navItem} ${
              activeView === "publicar" ? styles.navItemActive : ""
            }`}
            onClick={() => handleViewChange("publicar")}
          >
            <MdPostAdd className={styles.navIcon} />
            <span className={styles.navText}>Publicar vacantes</span>
          </button>

          <button
            className={`${styles.navItem} ${
              activeView === "tokens" ? styles.navItemActive : ""
            }`}
            onClick={() => handleViewChange("tokens")}
          >
            <MdAccountBalanceWallet className={styles.navIcon} />
            <span className={styles.navText}>Mis Tokens</span>
          </button>

          <button
            className={`${styles.navItem} ${
              activeView === "historial" ? styles.navItemActive : ""
            }`}
            onClick={() => handleViewChange("historial")}
          >
            <MdHistory className={styles.navIcon} />
            <span className={styles.navText}>Historial de Transacciones</span>
          </button>

          <button
            className={`${styles.navItem} ${
              activeView === "calificar" ? styles.navItemActive : ""
            }`}
            onClick={() => handleViewChange("calificar")}
          >
            <MdStar className={styles.navIcon} />
            <span className={styles.navText}>Calificar Freelancers</span>
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
