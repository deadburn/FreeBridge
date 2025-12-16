import React, { useState } from "react";
import { MdStar, MdStarBorder } from "react-icons/md";
import AlertModal from "./AlertModal";
import styles from "../../styles/modules_common/RatingModal.module.css";

export default function RatingModal({
  isOpen,
  onClose,
  onSubmit,
  freelancerName,
  vacancyName,
}) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comentario, setComentario] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [alertModal, setAlertModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "info",
  });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      setAlertModal({
        isOpen: true,
        title: "Validación requerida",
        message: "Por favor selecciona una calificación",
        type: "warning",
      });
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit(rating, comentario);
      setRating(0);
      setComentario("");
    } finally {
      setSubmitting(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div className={styles.modal}>
        <h2 className={styles.title}>Calificar Freelancer</h2>

        <div className={styles.info}>
          <p>
            <strong>Freelancer:</strong> {freelancerName}
          </p>
          <p>
            <strong>Vacante:</strong> {vacancyName}
          </p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.ratingSection}>
            <label className={styles.label}>Calificación:</label>
            <div className={styles.stars}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={styles.starButton}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                >
                  {star <= (hover || rating) ? (
                    <MdStar className={styles.starFilled} />
                  ) : (
                    <MdStarBorder className={styles.starEmpty} />
                  )}
                </button>
              ))}
            </div>
            <p className={styles.ratingText}>
              {rating === 0
                ? "Selecciona tu calificación"
                : `${rating} ${rating === 1 ? "estrella" : "estrellas"}`}
            </p>
          </div>

          <div className={styles.commentSection}>
            <label className={styles.label}>Comentario (opcional):</label>
            <textarea
              className={styles.textarea}
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              placeholder="Comparte tu experiencia trabajando con este freelancer..."
              rows={4}
              maxLength={500}
            />
            <small className={styles.charCount}>
              {comentario.length}/500 caracteres
            </small>
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={onClose}
              disabled={submitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={submitting || rating === 0}
            >
              {submitting ? "Guardando..." : "Guardar Calificación"}
            </button>
          </div>
        </form>
      </div>

      {/* Modal de alertas */}
      <AlertModal
        isOpen={alertModal.isOpen}
        onClose={() => setAlertModal({ ...alertModal, isOpen: false })}
        title={alertModal.title}
        message={alertModal.message}
        type={alertModal.type}
      />
    </div>
  );
}
