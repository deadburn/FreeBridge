import React from "react";
import { useEffect, useState } from "react";
import { getVacantes } from "../api/vacancyApi.js";
import VacancyCard from "./vacancyCard.jsx";
import styles from "../styles/vacancyList.module.css";

export default function VacancyList() {
  const [vacantes, setVacantes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getVacantes()
      .then(setVacantes)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Vacantes Disponibles</h2>
        <span className={styles.count}>{vacantes.length} oportunidades</span>
      </div>

      {loading ? (
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Cargando vacantes...</p>
        </div>
      ) : vacantes.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📋</div>
          <h3>No hay vacantes disponibles</h3>
          <p>Vuelve pronto para ver nuevas oportunidades</p>
        </div>
      ) : (
        <div className={styles.list}>
          {vacantes.map((v) => (
            <VacancyCard key={v.id} vacante={v} />
          ))}
        </div>
      )}
    </div>
  );
}
