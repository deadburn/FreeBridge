import React from "react";
import { useState } from "react";
import { crearVacante } from "../api/vacancyApi.js";
import SuccessModal from "./SuccessModal.jsx";
import styles from "../styles/vacancyForm.module.css";

export default function VacancyForm({ embedded = false }) {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [requisitos, setRequisitos] = useState("");
  const [salario, setSalario] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [error, setError] = useState("");
  const [createdVacancyName, setCreatedVacancyName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const vacanteData = {
        nombre,
        descripcion,
        requisitos,
      };

      // Solo incluir salario si se proporcionó
      if (salario) {
        vacanteData.salario = parseFloat(salario);
      }

      await crearVacante(vacanteData);
      setCreatedVacancyName(nombre);
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error al crear vacante:", error);
      setError(error.response?.data?.error || "Error al crear la vacante");
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    // Limpiar formulario
    setNombre("");
    setDescripcion("");
    setRequisitos("");
    setSalario("");
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

              {/* Campo de nombre */}
              <input
                type="text"
                placeholder="Nombre de la vacante"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
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
                rows="4"
              />

              {/* Campo de requisitos */}
              <textarea
                placeholder="Requisitos (habilidades, experiencia, etc.)"
                value={requisitos}
                onChange={(e) => setRequisitos(e.target.value)}
                required
                className={styles.textarea}
                rows="4"
              />

              {/* Campo de salario (opcional) */}
              <input
                type="number"
                placeholder="Salario (opcional)"
                value={salario}
                onChange={(e) => setSalario(e.target.value)}
                className={styles.input}
                min="0"
                step="0.01"
              />

              {/* Botón de submit */}
              <button type="submit" className={styles.submitButton}>
                Crear Vacante
              </button>
            </div>
          </form>
        </div>

        <SuccessModal
          isOpen={showSuccessModal}
          onClose={handleSuccessModalClose}
          userName={createdVacancyName}
          title="¡Vacante Creada!"
          message="ha sido publicada exitosamente."
          submessage="Los freelancers ya pueden ver y postularse a esta oportunidad."
        />
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

            {/* Campo de nombre */}
            <input
              type="text"
              placeholder="Nombre de la vacante"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
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
              rows="4"
            />

            {/* Campo de requisitos */}
            <textarea
              placeholder="Requisitos (habilidades, experiencia, etc.)"
              value={requisitos}
              onChange={(e) => setRequisitos(e.target.value)}
              required
              className={styles.textarea}
              rows="4"
            />

            {/* Campo de salario (opcional) */}
            <input
              type="number"
              placeholder="Salario (opcional)"
              value={salario}
              onChange={(e) => setSalario(e.target.value)}
              className={styles.input}
              min="0"
              step="0.01"
            />

            {/* Botón de submit */}
            <button type="submit" className={styles.submitButton}>
              Crear Vacante
            </button>
          </div>
        </form>
      </div>

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleSuccessModalClose}
        userName={createdVacancyName}
        title="¡Vacante Creada!"
        message="ha sido publicada exitosamente."
        submessage="Los freelancers ya pueden ver y postularse a esta oportunidad."
      />
    </div>
  );
}
