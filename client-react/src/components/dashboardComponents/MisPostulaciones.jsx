import React, { useState, useEffect } from "react";
import {
  getPostulacionesByFreelancer,
  cancelarPostulacion,
} from "../../api/postApi";
import {
  MdWork,
  MdCancel,
  MdCheckCircle,
  MdPending,
  MdDelete,
} from "react-icons/md";
import styles from "../../styles/modules_dashboards/MisPostulaciones.module.css";

export default function MisPostulaciones() {
  const [postulaciones, setPostulaciones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPostulaciones();
  }, []);

  const loadPostulaciones = async () => {
    try {
      setLoading(true);
      const data = await getPostulacionesByFreelancer();
      setPostulaciones(data.postulaciones || []);
    } catch (error) {
      console.error("Error al cargar postulaciones:", error);
      setPostulaciones([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelar = async (postulacion) => {
    if (postulacion.estado !== "pendiente") {
      alert("Solo puedes cancelar postulaciones pendientes");
      return;
    }

    if (
      !confirm(
        `¿Estás seguro de cancelar tu postulación a "${
          postulacion.vacante?.nombre || "esta vacante"
        }"?`
      )
    ) {
      return;
    }

    try {
      await cancelarPostulacion(postulacion.id);
      alert("Postulación cancelada exitosamente");
      loadPostulaciones();
    } catch (error) {
      console.error("Error al cancelar postulación:", error);
      alert("Error al cancelar la postulación: " + error.message);
    }
  };

  const getEstadoIcon = (estado) => {
    switch (estado) {
      case "aceptada":
        return <MdCheckCircle className={styles.iconAceptada} />;
      case "rechazada":
        return <MdCancel className={styles.iconRechazada} />;
      default:
        return <MdPending className={styles.iconPendiente} />;
    }
  };

  const getEstadoBadgeClass = (estado) => {
    switch (estado) {
      case "aceptada":
        return styles.badgeAceptada;
      case "rechazada":
        return styles.badgeRechazada;
      default:
        return styles.badgePendiente;
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Cargando postulaciones...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          <MdWork /> Mis Postulaciones
        </h2>
        <p className={styles.subtitle}>
          Gestiona tus postulaciones a las vacantes
        </p>
      </div>

      {postulaciones.length === 0 ? (
        <div className={styles.emptyState}>
          <MdWork className={styles.emptyIcon} />
          <h3>No tienes postulaciones</h3>
          <p>
            Explora las vacantes disponibles y postúlate a las que te interesen
          </p>
        </div>
      ) : (
        <div className={styles.postulacionesList}>
          {postulaciones.map((postulacion) => (
            <div key={postulacion.id} className={styles.postulacionCard}>
              <div className={styles.cardHeader}>
                <div className={styles.vacanteInfo}>
                  <h3 className={styles.vacanteName}>
                    {postulacion.vacante?.nombre || "Vacante sin nombre"}
                  </h3>
                  <p className={styles.empresaName}>
                    {postulacion.vacante?.empresa || "Empresa"}
                  </p>
                </div>
                <div className={styles.estadoContainer}>
                  {getEstadoIcon(postulacion.estado)}
                  <span
                    className={`${styles.estadoBadge} ${getEstadoBadgeClass(
                      postulacion.estado
                    )}`}
                  >
                    {postulacion.estado === "pendiente"
                      ? "Pendiente"
                      : postulacion.estado === "aceptada"
                      ? "Aceptada"
                      : "Rechazada"}
                  </span>
                </div>
              </div>

              {postulacion.vacante?.descripcion && (
                <p className={styles.descripcion}>
                  {postulacion.vacante.descripcion.substring(0, 150)}
                  {postulacion.vacante.descripcion.length > 150 && "..."}
                </p>
              )}

              <div className={styles.cardFooter}>
                <div className={styles.fecha}>
                  Postulado el:{" "}
                  {new Date(postulacion.fecha).toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>

                {postulacion.estado === "pendiente" && (
                  <button
                    className={styles.cancelButton}
                    onClick={() => handleCancelar(postulacion)}
                    title="Cancelar postulación"
                  >
                    <MdDelete /> Cancelar
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
