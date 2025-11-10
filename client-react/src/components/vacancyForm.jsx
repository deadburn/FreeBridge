import React from "react";
import { useState } from "react";
import { crearVacante } from "../api/vacancyApi.js";
import SuccessModal from "./SuccessModal.jsx";
import styles from "../styles/vacancyForm.module.css";

export default function VacancyForm({ embedded = false }) {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await crearVacante({ titulo, descripcion });
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error al crear vacante:", error);
      setError(error.response?.data?.error || "Error al crear la vacante");
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    // Limpiar formulario
    setTitulo("");
    setDescripcion("");
  };

  // Si está embebido, solo retornar el card sin el hero section
  if (embedded) {
    return (
      <>
        <div className={styles.formCard}>
          <h2 className={styles.headerForm}>Crear Nueva Vacante</h2>

          <form onSubmit={handleSubmit}>
            <div className={styles.inputsContainer}>
              {/* Mensaje de error */}
              {error && <div className={styles.errorMessage}>{error}</div>}

              {/* Campo de título */}
              <input
                type="text"
                placeholder="Título de la vacante"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                required
                className={styles.input}
              />

              {/* Campo de descripción */}
              <textarea
                placeholder="Descripción detallada de la vacante"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                required
                className={styles.textarea}
                rows="6"
              />

              {/* Botón de submit */}
              <button type="submit" className={styles.submitButton}>
                Crear Vacante
              </button>
            </div>
          </form>
        </div>

        {/* Modal de éxito */}
        {showSuccessModal && (
          <div
            className={styles.modalOverlay}
            onClick={handleSuccessModalClose}
          >
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
              <div className={styles.iconContainer}>
                <svg
                  className={styles.checkIcon}
                  viewBox="0 0 52 52"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    className={styles.checkCircle}
                    cx="26"
                    cy="26"
                    r="25"
                    fill="none"
                  />
                  <path
                    className={styles.checkPath}
                    fill="none"
                    d="M14.1 27.2l7.1 7.2 16.7-16.8"
                  />
                </svg>
              </div>

              <h2 className={styles.modalTitle}>¡Vacante Creada!</h2>

              <p className={styles.modalMessage}>
                La vacante <strong>{titulo}</strong> ha sido publicada
                exitosamente.
              </p>

              <p className={styles.modalSubmessage}>
                Los freelancers ya pueden ver y postularse a esta oportunidad.
              </p>

              <button
                className={styles.closeButton}
                onClick={handleSuccessModalClose}
              >
                Continuar
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <div className={styles.heroSection}>
      {/* Card contenedor del formulario */}
      <div className={styles.formCard}>
        <h2 className={styles.headerForm}>Crear Nueva Vacante</h2>

        <form onSubmit={handleSubmit}>
          <div className={styles.inputsContainer}>
            {/* Mensaje de error */}
            {error && <div className={styles.errorMessage}>{error}</div>}

            {/* Campo de título */}
            <input
              type="text"
              placeholder="Título de la vacante"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              required
              className={styles.input}
            />

            {/* Campo de descripción */}
            <textarea
              placeholder="Descripción detallada de la vacante"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              required
              className={styles.textarea}
              rows="6"
            />

            {/* Botón de submit */}
            <button type="submit" className={styles.submitButton}>
              Crear Vacante
            </button>
          </div>
        </form>
      </div>

      {/* Modal de éxito personalizado para vacantes */}
      {showSuccessModal && (
        <div className={styles.modalOverlay} onClick={handleSuccessModalClose}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.iconContainer}>
              <svg
                className={styles.checkIcon}
                viewBox="0 0 52 52"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  className={styles.checkCircle}
                  cx="26"
                  cy="26"
                  r="25"
                  fill="none"
                />
                <path
                  className={styles.checkPath}
                  fill="none"
                  d="M14.1 27.2l7.1 7.2 16.7-16.8"
                />
              </svg>
            </div>

            <h2 className={styles.modalTitle}>¡Vacante Creada!</h2>

            <p className={styles.modalMessage}>
              La vacante <strong>{titulo}</strong> ha sido publicada
              exitosamente.
            </p>

            <p className={styles.modalSubmessage}>
              Los freelancers ya pueden ver y postularse a esta oportunidad.
            </p>

            <button
              className={styles.closeButton}
              onClick={handleSuccessModalClose}
            >
              Continuar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
