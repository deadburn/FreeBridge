import React from "react";
import { FaCheckCircle } from "react-icons/fa";
import styles from "../../styles/modules_dashboards/FreelanceDashboard.module.css";

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
                  <FaCheckCircle className={styles.checkIcon} />
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
