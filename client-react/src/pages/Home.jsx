import React, { useEffect, useState } from "react";
import styles from "../styles/modules_pages/Home.module.css";
import { Link, useLocation } from "react-router-dom";
import Footer from "../components/layoutComponents/Footer.jsx";
import { FaPallet, FaDesktop, FaMobileAlt } from "react-icons/fa";

export default function Home() {
  const location = useLocation();
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      // Limpiar el mensaje después de 5 segundos
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [location]);
  return (
    <div className={styles.home}>
      {/* Mensaje de confirmación */}
      {successMessage && (
        <div className={styles.successBanner}>
          <p>{successMessage}</p>
        </div>
      )}

      {/* Sección hero con fondo degradado */}
      <section className={styles.heroSection}>
        {/* Título principal de la página */}
        <h1 className={styles.heroTitle}>Conecta talentos con empresas</h1>

        {/* Subtítulo descriptivo */}
        <p className={styles.heroSubtitle}>
          Encuentra oportunidades de trabajo remoto o el profesional ideal para
          tu proyecto.
        </p>

        {/* Botón de llamada a la acción */}
        <Link to="/register">
          <button className={styles.ctaButton}>Comenzar ahora</button>
        </Link>
      </section>
      {/* Sección de categorías */}
      <section className={styles.categoriesSection}>
        {/* Título de la sección */}
        <h2 className={styles.categoriesTitle}>Explora categorías</h2>

        {/* Contenedor de las tarjetas de categorías */}
        <div className={styles.categoriesGrid}>
          {/* Tarjeta de categoría - Diseño */}
          <div className={styles.categoryCard}>
            <div className={styles.categoryIcon}>
              {" "}
              <FaPallet />{" "}
            </div>
            <h3>Diseño</h3>
            <p>Encuentra diseñadores gráficos, UI/UX y creativos</p>
          </div>

          {/* Tarjeta de categoría - Desarrollo */}
          <div className={styles.categoryCard}>
            <div className={styles.categoryIcon}>
              <FaDesktop />
            </div>
            <h3>Desarrollo</h3>
            <p>Conecta con desarrolladores web y mobile</p>
          </div>

          {/* Tarjeta de categoría - Marketing */}
          <div className={styles.categoryCard}>
            <div className={styles.categoryIcon}>
              <FaMobileAlt />
            </div>
            <h3>Marketing</h3>
            <p>Expertos en marketing digital y contenido</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
