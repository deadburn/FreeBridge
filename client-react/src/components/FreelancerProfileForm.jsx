import React from "react";
import styles from "../styles/CompanyDashboard.module.css";

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
            <label htmlFor="portafolio_URL">
              URL del Portafolio (Opcional)
            </label>
            <input
              type="url"
              id="portafolio_URL"
              name="portafolio_URL"
              value={formData.portafolio_URL}
              onChange={onInputChange}
              placeholder="https://mi-portafolio.com"
            />
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
