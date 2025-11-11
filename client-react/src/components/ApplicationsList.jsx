import React from "react";
import { MdStar, MdStarBorder } from "react-icons/md";
import styles from "../styles/CompanyDashboard.module.css";

export default function ApplicationsList({ postulaciones }) {
  return (
    <div className={styles.postulacionesView}>
      <h1 className={styles.viewTitle}>Gestión de postulaciones</h1>

      <div className={styles.postulacionesGrid}>
        {postulaciones.length > 0 ? (
          postulaciones.map((postulacion) => (
            <div key={postulacion.id} className={styles.postulacionCard}>
              <div className={styles.cardHeader}>
                <div className={styles.avatar}>{postulacion.avatar}</div>
                <div className={styles.cardInfo}>
                  <h3 className={styles.candidateName}>{postulacion.nombre}</h3>
                  <p className={styles.candidateRole}>{postulacion.puesto}</p>
                </div>
              </div>

              <div className={styles.rating}>
                {[...Array(5)].map((_, index) =>
                  index < postulacion.rating ? (
                    <MdStar key={index} className={styles.starFilled} />
                  ) : (
                    <MdStarBorder key={index} className={styles.starEmpty} />
                  )
                )}
              </div>

              <button className={styles.viewButton}>Ver</button>
            </div>
          ))
        ) : (
          <p className={styles.noVacancies}>
            No hay postulaciones en este momento
          </p>
        )}
      </div>
    </div>
  );
}
