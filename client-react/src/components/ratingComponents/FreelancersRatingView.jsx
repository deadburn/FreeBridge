import React, { useState, useEffect } from "react";
import { MdStar, MdPerson } from "react-icons/md";
import {
  obtenerFreelancersTrabajados,
  calificarFreelancer,
} from "../../api/ratingApi";
import RatingModal from "../commonComponents/RatingModal";
import styles from "../../styles/modules_rating/FreelancersRating.module.css";

export default function FreelancersRatingView() {
  const [freelancers, setFreelancers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedFreelancer, setSelectedFreelancer] = useState(null);

  useEffect(() => {
    loadFreelancers();
  }, []);

  const loadFreelancers = async () => {
    try {
      setLoading(true);
      const response = await obtenerFreelancersTrabajados();
      setFreelancers(response.freelancers || []);
    } catch (error) {
      console.error("Error al cargar freelancers:", error);
      // No mostrar error si no hay freelancers trabajados aún
      setFreelancers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenRatingModal = (freelancer) => {
    setSelectedFreelancer(freelancer);
    setShowRatingModal(true);
  };

  const handleSubmitRating = async (rating, comentario) => {
    try {
      await calificarFreelancer(selectedFreelancer.id_post, rating, comentario);
      alert("¡Calificación guardada exitosamente!");
      setShowRatingModal(false);
      setSelectedFreelancer(null);
      // Recargar la lista
      loadFreelancers();
    } catch (error) {
      console.error("Error al guardar calificación:", error);
      alert(error.response?.data?.error || "Error al guardar la calificación");
    }
  };

  const renderStars = (puntuacion) => {
    return (
      <div className={styles.stars}>
        {[1, 2, 3, 4, 5].map((star) => (
          <MdStar
            key={star}
            className={
              star <= puntuacion ? styles.starFilled : styles.starEmpty
            }
          />
        ))}
      </div>
    );
  };

  const getAvatarDisplay = (freelancer) => {
    if (freelancer.avatar) {
      if (freelancer.avatar.startsWith("default_")) {
        // Avatar por defecto - mostrar icono
        return <MdPerson className={styles.defaultAvatar} />;
      }
      if (freelancer.avatar.startsWith("uploads/")) {
        return (
          <img
            src={`/api/${freelancer.avatar}`}
            alt={freelancer.nombre_freelancer}
            className={styles.avatar}
          />
        );
      }
    }
    return <MdPerson className={styles.defaultAvatar} />;
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Cargando freelancers...</p>
        </div>
      </div>
    );
  }

  if (freelancers.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Calificar Freelancers</h1>
        </div>
        <div className={styles.emptyState}>
          <MdStar className={styles.emptyIcon} />
          <h2>No hay freelancers para calificar</h2>
          <p>
            Aquí aparecerán los freelancers que han completado trabajos con tu
            empresa.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Calificar Freelancers</h1>
        <p className={styles.subtitle}>
          {freelancers.length}{" "}
          {freelancers.length === 1 ? "freelancer" : "freelancers"} que han
          trabajado contigo
        </p>
      </div>

      <div className={styles.grid}>
        {freelancers.map((freelancer) => (
          <div key={freelancer.id_post} className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.avatarContainer}>
                {getAvatarDisplay(freelancer)}
              </div>
              <div className={styles.info}>
                <h3 className={styles.name}>
                  {freelancer.nombre_freelancer}{" "}
                  {freelancer.apellido_freelancer}
                </h3>
                <p className={styles.email}>{freelancer.email}</p>
              </div>
            </div>

            <div className={styles.vacancyInfo}>
              <strong>Vacante:</strong> {freelancer.vacante.nombre}
            </div>

            {freelancer.calificacion ? (
              <div className={styles.ratedSection}>
                <div className={styles.ratingHeader}>
                  <span className={styles.ratedLabel}>Ya calificado</span>
                  <div className={styles.ratingDisplay}>
                    {renderStars(freelancer.calificacion.puntuacion)}
                    <span className={styles.ratingValue}>
                      {freelancer.calificacion.puntuacion}.0
                    </span>
                  </div>
                </div>
                {freelancer.calificacion.comentario && (
                  <p className={styles.comment}>
                    "{freelancer.calificacion.comentario}"
                  </p>
                )}
                <small className={styles.date}>
                  Calificado el{" "}
                  {new Date(
                    freelancer.calificacion.fecha_calif
                  ).toLocaleDateString("es-ES")}
                </small>
              </div>
            ) : (
              <button
                className={styles.rateButton}
                onClick={() => handleOpenRatingModal(freelancer)}
              >
                <MdStar /> Calificar Freelancer
              </button>
            )}
          </div>
        ))}
      </div>

      {showRatingModal && selectedFreelancer && (
        <RatingModal
          isOpen={showRatingModal}
          onClose={() => {
            setShowRatingModal(false);
            setSelectedFreelancer(null);
          }}
          onSubmit={handleSubmitRating}
          freelancerName={`${selectedFreelancer.nombre_freelancer} ${selectedFreelancer.apellido_freelancer}`}
          vacancyName={selectedFreelancer.vacante.nombre}
        />
      )}
    </div>
  );
}
