/**
 * Navbar.jsx
 * Componente de barra de navegación
 * Muestra versión compacta (solo iconos) en páginas que no son Home
 */

import React from "react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import styles from "../../styles/modules_pages/Navbar.module.css";
import {
  FaThLarge,
  FaSignInAlt,
  FaSignOutAlt,
  FaUserPlus,
  FaQuestionCircle,
} from "react-icons/fa";
import AboutFreeBridgeModal from "./AboutFreeBridgeModal";

export default function Navbar() {
  // Obtiene estado y métodos del contexto de autenticación
  const { isAuthenticated, logout, navigateToProfile } = useAuth();
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);

  // Obtiene la ruta actual para determinar si mostrar navbar compacto
  const location = useLocation();
  const isHomePage = location.pathname === "/" || location.pathname === "/home";

  return (
    <>
      <nav
        className={`${styles.navbar} ${
          !isHomePage ? styles.navbarCompact : ""
        }`}
      >
        {/* Logo FreeBridge con imagen */}
        <div className={styles.logo}>
          <Link to="/" title="FreeBridge">
            <img src="/src/assets/freebridge.svg" alt="FreeBridge Logo" />
          </Link>
        </div>

        {/* Centro de la navbar: contiene el botón About centrado */}
        <div className={styles.navCenter}>
          {isHomePage && (
            <button
              onClick={() => setIsAboutModalOpen(true)}
              className={styles.navLink}
              title="¿Por qué FreeBridge?"
            >
              <span className={styles.aboutButton}>
                <FaQuestionCircle /> ¿Por qué FreeBridge?
              </span>
            </button>
          )}
        </div>

        {/* Contenedor de enlaces de navegación */}
        <div className={styles.navLinks}>
          {/* Renderizado condicional según estado de autenticación */}
          {!isAuthenticated ? (
            <>
              <Link to="/login" title="Iniciar Sesión">
                {isHomePage ? (
                  "Iniciar Sesión"
                ) : (
                  <span className={styles.icon}>
                    <FaSignInAlt />
                  </span>
                )}
              </Link>
              <Link to="/register" title="Registrarse">
                {isHomePage ? (
                  "Registrarse"
                ) : (
                  <span className={styles.icon}>
                    <FaUserPlus />
                  </span>
                )}
              </Link>
            </>
          ) : (
            <>
              <button
                onClick={navigateToProfile}
                className={styles.navLink}
                title="Dashboard"
              >
                {isHomePage ? (
                  "Dashboard"
                ) : (
                  <span className={styles.icon}>
                    <FaThLarge />
                  </span>
                )}
              </button>
              <button
                onClick={() => logout(true)}
                className={styles.navLink}
                title="Cerrar Sesión"
              >
                {isHomePage ? (
                  "Cerrar Sesión"
                ) : (
                  <span className={styles.icon}>
                    <FaSignOutAlt />
                  </span>
                )}
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Modal de información sobre FreeBridge */}
      <AboutFreeBridgeModal
        isOpen={isAboutModalOpen}
        onClose={() => setIsAboutModalOpen(false)}
      />
    </>
  );
}
