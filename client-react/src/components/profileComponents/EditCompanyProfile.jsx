import React, { useState, useEffect } from "react";
import {
  MdEdit,
  MdSave,
  MdCancel,
  MdUpload,
  MdBusiness,
  MdDescription,
} from "react-icons/md";
import styles from "../../styles/modules_profile/EditCompanyProfile.module.css";

const COMPANY_SIZES = [
  { value: "Pequeña", label: "Pequeña (1-50 empleados)" },
  { value: "Mediana", label: "Mediana (51-200 empleados)" },
  { value: "Grande", label: "Grande (200+ empleados)" },
];

export default function EditCompanyProfile({
  companyData,
  cities,
  onSave,
  onCancel,
}) {
  const [formData, setFormData] = useState({
    NIT: "",
    tamaño: "",
    desc_emp: "",
    id_ciud: "",
    logo: null,
  });

  const [previewLogo, setPreviewLogo] = useState(null);
  const [currentLogoFile, setCurrentLogoFile] = useState(null);

  useEffect(() => {
    if (companyData) {
      setFormData({
        NIT: companyData.NIT || "",
        tamaño: companyData.tamaño || "",
        desc_emp: companyData.desc_emp || "",
        id_ciud: companyData.id_ciud || "",
        logo: null,
      });

      // Cargar logo actual
      if (companyData.logo) {
        const logoFilename = companyData.logo.includes("/")
          ? companyData.logo.split("/").pop()
          : companyData.logo;
        setPreviewLogo(
          `http://localhost:5000/api/uploads/logos/${logoFilename}`
        );
      }
    }
  }, [companyData]);

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith("image/")) {
      alert("Por favor seleccione un archivo de imagen");
      return;
    }

    // Validar tamaño (2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert("La imagen no debe superar los 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewLogo(reader.result);
      setCurrentLogoFile(file);
      setFormData((prev) => ({ ...prev, logo: file }));
    };
    reader.readAsDataURL(file);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("NIT", formData.NIT);
    formDataToSend.append("tamaño", formData.tamaño);
    formDataToSend.append("desc_emp", formData.desc_emp);
    formDataToSend.append("id_ciud", formData.id_ciud);

    if (currentLogoFile) {
      formDataToSend.append("logo", currentLogoFile);
    }

    await onSave(formDataToSend);
  };

  return (
    <div className={styles.editProfileContainer}>
      <div className={styles.profileHeader}>
        <h2>
          <MdEdit /> Editar Perfil de Empresa
        </h2>
        <p>Actualiza la información de tu empresa</p>
      </div>

      <form onSubmit={handleSubmit} className={styles.profileForm}>
        {/* Sección de Logo */}
        <div className={styles.logoSection}>
          <h3>Logo de la Empresa</h3>
          <div className={styles.logoContainer}>
            <div className={styles.logoPreview}>
              {previewLogo ? (
                <img src={previewLogo} alt="Logo" />
              ) : (
                <MdBusiness className={styles.placeholderIcon} />
              )}
            </div>
            <div className={styles.logoActions}>
              <label className={styles.btnPrimary}>
                <MdUpload /> Subir Logo
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  style={{ display: "none" }}
                />
              </label>
              <small>PNG, JPG, GIF o WEBP. Máx 2MB</small>
            </div>
          </div>
        </div>

        {/* Información de la Empresa */}
        <div className={styles.formSection}>
          <h3>
            <MdBusiness /> Información de la Empresa
          </h3>

          <div className={styles.formGroup}>
            <label htmlFor="NIT">NIT *</label>
            <input
              type="text"
              id="NIT"
              name="NIT"
              value={formData.NIT}
              onChange={handleInputChange}
              placeholder="Ej: 900123456-7"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="tamaño">Tamaño de la Empresa *</label>
            <select
              id="tamaño"
              name="tamaño"
              value={formData.tamaño}
              onChange={handleInputChange}
              required
            >
              <option value="">Seleccione el tamaño</option>
              {COMPANY_SIZES.map((size) => (
                <option key={size.value} value={size.value}>
                  {size.label}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="id_ciud">Ciudad *</label>
            <select
              id="id_ciud"
              name="id_ciud"
              value={formData.id_ciud}
              onChange={handleInputChange}
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

          <div className={styles.formGroup}>
            <label htmlFor="desc_emp">Descripción de la Empresa *</label>
            <textarea
              id="desc_emp"
              name="desc_emp"
              value={formData.desc_emp}
              onChange={handleInputChange}
              placeholder="Describe tu empresa, sector, misión, valores..."
              rows="6"
              maxLength="250"
              required
            />
            <small>{formData.desc_emp.length}/250 caracteres</small>
          </div>
        </div>

        {/* Botones de Acción */}
        <div className={styles.formActions}>
          <button type="submit" className={styles.btnSave}>
            <MdSave /> Guardar Cambios
          </button>
          <button type="button" onClick={onCancel} className={styles.btnCancel}>
            <MdCancel /> Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
