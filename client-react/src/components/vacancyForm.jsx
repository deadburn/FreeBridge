import React from "react";
import { useState, useEffect } from "react";
import { crearVacante, actualizarVacante } from "../api/vacancyApi.js";
import SuccessModal from "./SuccessModal.jsx";
import styles from "../styles/modules_forms/VacancyForm.module.css";

export default function VacancyForm({
  embedded = false,
  vacanteToEdit = null,
  onSuccess = null,
}) {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [requisitos, setRequisitos] = useState("");
  const [salario, setSalario] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [error, setError] = useState("");
  const [createdVacancyName, setCreatedVacancyName] = useState("");
  const isEditing = !!vacanteToEdit;

  // Cargar datos si estamos editando
  useEffect(() => {
    if (vacanteToEdit) {
      setNombre(vacanteToEdit.nombre || "");
      setDescripcion(vacanteToEdit.descripcion || "");
      setRequisitos(vacanteToEdit.requisitos || "");
      setSalario(vacanteToEdit.salario || "");
    }
  }, [vacanteToEdit]);

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

      if (isEditing) {
        await actualizarVacante(vacanteToEdit.id, vacanteData);
        setCreatedVacancyName(nombre);
        setShowSuccessModal(true);
      } else {
        await crearVacante(vacanteData);
        setCreatedVacancyName(nombre);
        setShowSuccessModal(true);
      }
    } catch (error) {
      console.error(
        `Error al ${isEditing ? "actualizar" : "crear"} vacante:`,
        error
      );
      setError(
        error.response?.data?.error ||
          `Error al ${isEditing ? "actualizar" : "crear"} la vacante`
      );
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);

    if (onSuccess) {
      onSuccess();
    }

    // Solo limpiar formulario si no estamos editando
    if (!isEditing) {
      setNombre("");
      setDescripcion("");
      setRequisitos("");
      setSalario("");
    }
  };

  // Si está embebido, solo retornar el card sin el hero section
  if (embedded) {
    return (
      <>
        <div className={styles.formCard}>
          <h2 className={styles.headerForm}>
            {isEditing ? "Editar Vacante" : "Crear Nueva Vacante"}
          </h2>

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
                {isEditing ? "Actualizar Vacante" : "Crear Vacante"}
              </button>
            </div>
          </form>
        </div>

        <SuccessModal
          isOpen={showSuccessModal}
          onClose={handleSuccessModalClose}
          userName={createdVacancyName}
          title={isEditing ? "¡Vacante Actualizada!" : "¡Vacante Creada!"}
          message={
            isEditing
              ? "ha sido actualizada exitosamente."
              : "ha sido publicada exitosamente."
          }
          submessage={
            isEditing
              ? "Los cambios ya están disponibles para los freelancers."
              : "Los freelancers ya pueden ver y postularse a esta oportunidad."
          }
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
