import React from "react";
import styles from "../../styles/modules_dashboards/FreelanceDashboard.module.css";

export default function FreelancerProfileForm({
  formData,
  cities,
  onInputChange,
  onSubmit,
}) {
  return (
    <div className={styles.profileSection}>
      <div className={styles.profileCard}>
        <h2 className={styles.profileTitle}>
          Complete su perfil de freelancer
        </h2>
        <p className={styles.profileSubtitle}>
          Para poder postularse a vacantes, primero debe completar su perfil
        </p>
        <form onSubmit={onSubmit} className={styles.profileForm}>
          <div className={styles.formGroup}>
            <label htmlFor="profesion">Profesión</label>
            <input
              type="text"
              id="profesion"
              name="profesion"
              value={formData.profesion}
              onChange={onInputChange}
              placeholder="Ej: Desarrollador Web, Diseñador Gráfico"
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="hoja_vida">Hoja de Vida (PDF) - Opcional</label>
            <input
              type="file"
              id="hoja_vida"
              name="hoja_vida"
              accept=".pdf"
              onChange={onInputChange}
              className={styles.fileInput}
            />
            <small style={{ color: "#7f8c8d", fontSize: "0.9rem" }}>
              Formato permitido: PDF. Tamaño máximo: 5MB
            </small>
            {formData.hoja_vida && (
              <p
                style={{
                  color: "#16a085",
                  fontSize: "0.9rem",
                  marginTop: "0.5rem",
                }}
              >
                ✓ Archivo seleccionado: {formData.hoja_vida.name}
              </p>
            )}
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="experiencia">Experiencia (Opcional)</label>
            <textarea
              id="experiencia"
              name="experiencia"
              value={formData.experiencia}
              onChange={onInputChange}
              placeholder="Describe tu experiencia profesional..."
              rows="4"
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="id_ciud">Ciudad</label>
            <select
              id="id_ciud"
              name="id_ciud"
              value={formData.id_ciud}
              onChange={onInputChange}
              required
            >
              <option value="">Seleccione una ciudad</option>
              {cities.map((c) => (
                <option key={c.id_ciud} value={c.id_ciud}>
                  {c.nomb_ciud}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className={styles.submitButton}>
            Guardar Perfil
          </button>
        </form>
      </div>
    </div>
  );
}
