import React from "react";
import styles from "../styles/vacancyCard.module.css";

export default function VacancyCard({ vacante }) {
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h3 className={styles.title}>{vacante.titulo}</h3>
        <span className={styles.badge}>Activa</span>
      </div>

      <p className={styles.description}>{vacante.descripcion}</p>

      <div className={styles.cardFooter}>
        <small className={styles.company}>
          🏢 {vacante.empresa || "Empresa Confidencial"}
        </small>
        <button className={styles.applyButton}>Postularse</button>
      </div>
    </div>
  );
}
