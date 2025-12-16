import React from "react";
import styles from "../../styles/modules_pages/AboutFreeBridgeModal.module.css";
import { MdClose } from "react-icons/md";

export default function AboutFreeBridgeModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          <MdClose />
        </button>

        <div className={styles.modalBody}>
          <h1 className={styles.modalTitle}>¿Por qué FreeBridge?</h1>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>¿Qué es FreeBridge?</h2>
            <p className={styles.sectionText}>
              FreeBridge es una plataforma innovadora que conecta empresas con
              profesionales independientes y freelancers. Creamos un puente
              digital que facilita la colaboración remota y el intercambio de
              talento sin limitaciones geográficas.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Nuestro Propósito</h2>
            <p className={styles.sectionText}>
              Buscamos democratizar el acceso a oportunidades de trabajo remoto
              y permitir que las empresas encuentren los mejores talentos sin
              importar su ubicación. Creemos en empoderar a los profesionales
              independientes y dar a las empresas flexibilidad en sus procesos
              de contratación.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>¿Para quiénes fue creado?</h2>
            <div className={styles.targetAudience}>
              <div className={styles.audienceCard}>
                <h3>Para Freelancers</h3>
                <p>
                  Accede a múltiples oportunidades de trabajo, gestiona tus
                  proyectos y crece tu carrera profesional de forma
                  independiente.
                </p>
              </div>
              <div className={styles.audienceCard}>
                <h3>Para Empresas</h3>
                <p>
                  Encuentra profesionales especializados para tus proyectos,
                  reduce costos de operación y accede a un pool global de
                  talento calificado.
                </p>
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Nuestros Valores</h2>
            <ul className={styles.valuesList}>
              <li>
                <strong>Inclusión:</strong> Abierto para profesionales y
                empresas de todo nivel
              </li>
              <li>
                <strong>Confianza:</strong> Verificamos perfiles y mantenemos
                estándares de calidad
              </li>
              <li>
                <strong>Flexibilidad:</strong> Trabajos puntuales o proyectos de
                largo plazo
              </li>
              <li>
                <strong>Seguridad:</strong> Protegemos datos y transacciones de
                nuestros usuarios
              </li>
              <li>
                <strong>Oportunidad:</strong> Conectamos talento con demanda en
                tiempo real
              </li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>¿Por qué elegirnos?</h2>
            <div className={styles.benefitsList}>
              <div className={styles.benefit}>
                <div className={styles.benefitIcon}>✓</div>
                <div className={styles.benefitText}>
                  Plataforma fácil de usar y accesible
                </div>
              </div>
              <div className={styles.benefit}>
                <div className={styles.benefitIcon}>✓</div>
                <div className={styles.benefitText}>
                  Sistema de pagos seguro y transparente
                </div>
              </div>
              <div className={styles.benefit}>
                <div className={styles.benefitIcon}>✓</div>
                <div className={styles.benefitText}>
                  Calificaciones y reviews para tomar mejores decisiones
                </div>
              </div>
              <div className={styles.benefit}>
                <div className={styles.benefitIcon}>✓</div>
                <div className={styles.benefitText}>
                  Soporte dedicado para resolver tus dudas
                </div>
              </div>
            </div>
          </section>

          <div className={styles.ctaSection}>
            <p className={styles.ctaText}>
              ¿Listo para ser parte de la revolución del trabajo remoto?
            </p>
            <button className={styles.ctaButton} onClick={onClose}>
              Comencemos
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
