import React from "react";
import { MdCheckCircle } from "react-icons/md";
import styles from "../styles/CompanyDashboard.module.css";

export default function ProjectsList({ projects }) {
  return (
    <div className={styles.postulacionesView}>
      <h1 className={styles.viewTitle}>Historial de proyectos</h1>

      <div className={styles.projectsList}>
        {projects.length > 0 ? (
          projects.map((project) => (
            <div key={project.id} className={styles.projectCard}>
              <div className={styles.projectInfo}>
                <h3 className={styles.projectName}>{project.nombre}</h3>
                <span className={styles.projectStatus}>
                  <MdCheckCircle className={styles.checkIcon} />
                  {project.estado}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p className={styles.noVacancies}>No hay proyectos en el historial</p>
        )}
      </div>
    </div>
  );
}
