/**
 * Footer.jsx
 * Componente de pie de página con enlaces a Términos y Políticas
 */

import React, { useState } from "react";
import Modal from "./Modal.jsx";
import TermsAndConditions from "./TermsAndConditions.jsx";
import PrivacyPolicy from "./PrivacyPolicy.jsx";
import styles from "../styles/Footer.module.css";

export default function Footer() {
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  return (
    <>
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          {/* Información de FreeBridge */}
          <div className={styles.footerSection}>
            <h3>FreeBridge</h3>
            <p>Conectando talento con oportunidades</p>
          </div>

          {/* Enlaces rápidos */}
          <div className={styles.footerSection}>
            <h4>Enlaces</h4>
            <ul>
              <li>
                <a href="/">Inicio</a>
              </li>
              <li>
                <a href="/vacantes">Vacantes</a>
              </li>
              <li>
                <a href="/register">Registrarse</a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className={styles.footerSection}>
            <h4>Legal</h4>
            <ul>
              <li>
                <button
                  onClick={() => setShowTermsModal(true)}
                  className={styles.footerLink}
                >
                  Términos y Condiciones
                </button>
              </li>
              <li>
                <button
                  onClick={() => setShowPrivacyModal(true)}
                  className={styles.footerLink}
                >
                  Política de Privacidad
                </button>
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div className={styles.footerSection}>
            <h4>Contacto</h4>
            <p>contacto_freebridge@gmail.com</p>
            <p>+57 312-4658920</p>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p>&copy; 2025 FreeBridge. Todos los derechos reservados.</p>
        </div>
      </footer>

      {/* Modales */}
      <Modal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
        title="Términos y Condiciones"
      >
        <TermsAndConditions />
      </Modal>

      <Modal
        isOpen={showPrivacyModal}
        onClose={() => setShowPrivacyModal(false)}
        title="Política de Privacidad"
      >
        <PrivacyPolicy />
      </Modal>
    </>
  );
}
