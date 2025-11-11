import React from "react";
import styles from "../styles/CompanyDashboard.module.css";

export default function CompanyProfileForm({
  formData,
  cities,
  onInputChange,
  onSubmit,
}) {
  return (
    <div className={styles.profileSection}>
      <div className={styles.profileCard}>
        <h2 className={styles.profileTitle}>Complete su perfil de empresa</h2>
        <p className={styles.profileSubtitle}>
          Para poder crear vacantes, primero debe completar su perfil
        </p>
        <form onSubmit={onSubmit} className={styles.profileForm}>
          <div className={styles.formGroup}>
            <label htmlFor="NIT">NIT</label>
            <input
              type="text"
              id="NIT"
              name="NIT"
              value={formData.NIT}
              onChange={onInputChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="tamaño">Tamaño de la empresa</label>
            <select
              id="tamaño"
              name="tamaño"
              value={formData.tamaño}
              onChange={onInputChange}
              required
            >
              <option value="">Seleccione un tamaño</option>
              <option value="Pequeña">Pequeña</option>
              <option value="Mediana">Mediana</option>
              <option value="Grande">Grande</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="desc_emp">Descripción de la empresa</label>
            <textarea
              id="desc_emp"
              name="desc_emp"
              value={formData.desc_emp}
              onChange={onInputChange}
              required
              maxLength={250}
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
