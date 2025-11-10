import React from "react";
import styles from "../styles/Home.module.css";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className={styles.home}>
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
            <div className={styles.categoryIcon}>🎨</div>
            <h3>Diseño</h3>
            <p>Encuentra diseñadores gráficos, UI/UX y creativos</p>
          </div>

          {/* Tarjeta de categoría - Desarrollo */}
          <div className={styles.categoryCard}>
            <div className={styles.categoryIcon}>💻</div>
            <h3>Desarrollo</h3>
            <p>Conecta con desarrolladores web y mobile</p>
          </div>

          {/* Tarjeta de categoría - Marketing */}
          <div className={styles.categoryCard}>
            <div className={styles.categoryIcon}>📱</div>
            <h3>Marketing</h3>
            <p>Expertos en marketing digital y contenido</p>
          </div>
        </div>
      </section>
    </div>
  );
}
