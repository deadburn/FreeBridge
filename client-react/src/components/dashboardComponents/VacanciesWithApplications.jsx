import React, { useState, useEffect } from "react";
import { getVacantesByEmpresa } from "../../api/vacancyApi";
import {
  getPostulacionesByEmpresa,
  updatePostulacionEstado,
} from "../../api/postApi";
import { useAuth } from "../../context/AuthContext";
import VacancyCard from "../vacancyComponents/VacancyCard";
import {
  MdDescription,
  MdPeople,
  MdExpandMore,
  MdExpandLess,
  MdStar,
  MdStarBorder,
  MdCheckCircle,
  MdCancel,
} from "react-icons/md";
import styles from "../../styles/modules_vacancies/VacanciesWithApplications.module.css";

export default function VacanciesWithApplications() {
  const [vacantes, setVacantes] = useState([]);
  const [postulaciones, setPostulaciones] = useState([]);
  const [expandedVacancy, setExpandedVacancy] = useState(null);
  const [loading, setLoading] = useState(true);
  const { userId } = useAuth();

  useEffect(() => {
    loadData();
  }, [userId]);

  const loadData = async () => {
    try {
      setLoading(true);

      const [vacantesData, postulacionesData] = await Promise.all([
        getVacantesByEmpresa(userId),
        getPostulacionesByEmpresa(),
      ]);

      setVacantes(vacantesData || []);
      setPostulaciones(postulacionesData || []);
    } catch (error) {
      console.error("Error al cargar datos:", error);
      setVacantes([]);
      setPostulaciones([]);
    } finally {
      setLoading(false);
    }
  };

  // Agrupar postulaciones por vacante
  const getPostulacionesByVacante = (vacanteId) => {
    return postulaciones.filter((p) => p.vacante && p.vacante.id === vacanteId);
  };

  const toggleExpand = (vacanteId) => {
    setExpandedVacancy(expandedVacancy === vacanteId ? null : vacanteId);
  };

  const handleUpdateEstado = async (postulacionId, nuevoEstado) => {
    const accion = nuevoEstado === "aceptada" ? "aceptar" : "rechazar";

    if (
      !confirm(
        `¿Estás seguro de ${accion} esta postulación? Se enviará un email al freelancer.`
      )
    ) {
      return;
    }

    try {
      await updatePostulacionEstado(postulacionId, nuevoEstado);
      alert(
        `Postulación ${nuevoEstado} exitosamente. Se ha enviado un email de notificación al freelancer.`
      );
      // Recargar datos
      loadData();
    } catch (error) {
      console.error("Error al actualizar estado:", error);
      alert("Error al actualizar el estado: " + error.message);
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Cargando información...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Mis Vacantes y Postulaciones</h2>
        <div className={styles.stats}>
          <span className={styles.statItem}>
            <MdDescription /> {vacantes.length} Vacantes
          </span>
          <span className={styles.statItem}>
            <MdPeople /> {postulaciones.length} Postulaciones
          </span>
        </div>
      </div>

      {vacantes.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <MdDescription />
          </div>
          <h3>No tienes vacantes publicadas</h3>
          <p>Crea tu primera vacante para empezar a recibir postulaciones</p>
        </div>
      ) : (
        <div className={styles.vacanciesList}>
          {vacantes.map((vacante) => {
            const vacancyApplications = getPostulacionesByVacante(vacante.id);
            const isExpanded = expandedVacancy === vacante.id;

            return (
              <div key={vacante.id} className={styles.vacancyItem}>
                <div className={styles.vacancyHeader}>
                  <div className={styles.vacancyInfo}>
                    <h3 className={styles.vacancyTitle}>{vacante.nombre}</h3>
                    <div className={styles.vacancyMeta}>
                      <span
                        className={`${styles.statusBadge} ${
                          vacante.estado === "abierta"
                            ? styles.statusActive
                            : styles.statusInactive
                        }`}
                      >
                        {vacante.estado === "abierta" ? "Activa" : "Cerrada"}
                      </span>
                      <span className={styles.applicationsCount}>
                        <MdPeople /> {vacancyApplications.length} postulaciones
                      </span>
                    </div>
                  </div>

                  <div className={styles.vacancyActions}>
                    <button
                      className={styles.expandButton}
                      onClick={() => toggleExpand(vacante.id)}
                      title={
                        isExpanded
                          ? "Ocultar postulaciones"
                          : "Ver postulaciones"
                      }
                    >
                      {isExpanded ? <MdExpandLess /> : <MdExpandMore />}
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className={styles.applicationsSection}>
                    <div className={styles.vacancyDetails}>
                      <p className={styles.description}>
                        {vacante.descripcion}
                      </p>
                      {vacante.salario && (
                        <p className={styles.salary}>
                          <strong>Salario:</strong> $
                          {Number(vacante.salario).toLocaleString("es-ES")}
                        </p>
                      )}
                    </div>

                    <div className={styles.applicationsList}>
                      <h4 className={styles.applicationsTitle}>
                        Postulaciones ({vacancyApplications.length})
                      </h4>

                      {vacancyApplications.length === 0 ? (
                        <div className={styles.noApplications}>
                          <p>Aún no hay postulaciones para esta vacante</p>
                        </div>
                      ) : (
                        <div className={styles.applicationsGrid}>
                          {vacancyApplications.map((postulacion) => (
                            <div
                              key={postulacion.id}
                              className={styles.applicationCard}
                            >
                              <div className={styles.candidateHeader}>
                                <div className={styles.avatar}>
                                  {postulacion.avatar}
                                </div>
                                <div className={styles.candidateInfo}>
                                  <h5 className={styles.candidateName}>
                                    {postulacion.nombre}
                                  </h5>
                                  <p className={styles.candidateRole}>
                                    {postulacion.puesto}
                                  </p>
                                </div>
                              </div>

                              {postulacion.experiencia && (
                                <p className={styles.experience}>
                                  {postulacion.experiencia.substring(0, 100)}
                                  {postulacion.experiencia.length > 100 &&
                                    "..."}
                                </p>
                              )}

                              <div className={styles.applicationFooter}>
                                <div className={styles.rating}>
                                  {[...Array(5)].map((_, index) =>
                                    index < postulacion.rating ? (
                                      <MdStar
                                        key={index}
                                        className={styles.starFilled}
                                      />
                                    ) : (
                                      <MdStarBorder
                                        key={index}
                                        className={styles.starEmpty}
                                      />
                                    )
                                  )}
                                </div>
                                <span
                                  className={`${styles.statusBadge} ${
                                    styles[
                                      "status" +
                                        postulacion.estado
                                          ?.charAt(0)
                                          .toUpperCase() +
                                        postulacion.estado?.slice(1)
                                    ]
                                  }`}
                                >
                                  {postulacion.estado || "Pendiente"}
                                </span>
                              </div>

                              {postulacion.hoja_vida && (
                                <a
                                  href={`http://localhost:5000${postulacion.hoja_vida}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={styles.cvLink}
                                >
                                  📄 Ver Hoja de Vida
                                </a>
                              )}

                              {postulacion.estado === "pendiente" && (
                                <div className={styles.actionButtons}>
                                  <button
                                    className={`${styles.actionBtn} ${styles.acceptBtn}`}
                                    onClick={() =>
                                      handleUpdateEstado(
                                        postulacion.id,
                                        "aceptada"
                                      )
                                    }
                                    title="Aceptar postulación"
                                  >
                                    <MdCheckCircle /> Aceptar
                                  </button>
                                  <button
                                    className={`${styles.actionBtn} ${styles.rejectBtn}`}
                                    onClick={() =>
                                      handleUpdateEstado(
                                        postulacion.id,
                                        "rechazada"
                                      )
                                    }
                                    title="Rechazar postulación"
                                  >
                                    <MdCancel /> Rechazar
                                  </button>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
