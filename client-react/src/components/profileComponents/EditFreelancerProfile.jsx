import React, { useState, useEffect } from "react";
import { createAvatar } from "@dicebear/core";
import {
  avataaars,
  bottts,
  funEmoji,
  lorelei,
  micah,
  personas,
} from "@dicebear/collection";
import {
  MdEdit,
  MdSave,
  MdCancel,
  MdUpload,
  MdPerson,
  MdDescription,
} from "react-icons/md";
import styles from "../../styles/modules_profile/EditFreelancerProfile.module.css";

const AVATAR_STYLES = [
  { name: "avataaars", style: avataaars, label: "Avataaars" },
  { name: "bottts", style: bottts, label: "Robots" },
  { name: "funEmoji", style: funEmoji, label: "Emoji" },
  { name: "lorelei", style: lorelei, label: "Lorelei" },
  { name: "micah", style: micah, label: "Micah" },
  { name: "personas", style: personas, label: "Personas" },
];

export default function EditFreelancerProfile({
  freelancerData,
  cities,
  onSave,
  onCancel,
  userName,
}) {
  const [formData, setFormData] = useState({
    profesion: "",
    experiencia: "",
    id_ciud: "",
    hoja_vida: null,
    avatar: null,
    avatar_default: "",
  });

  const [previewAvatar, setPreviewAvatar] = useState(null);
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);
  const [selectedAvatarStyle, setSelectedAvatarStyle] = useState("avataaars");
  const [currentFile, setCurrentFile] = useState(null);
  const [currentCVFile, setCurrentCVFile] = useState(null);

  // Función para generar avatar por defecto
  const generateDefaultAvatar = (styleName) => {
    const avatarStyle = AVATAR_STYLES.find((s) => s.name === styleName);
    if (!avatarStyle) return;

    const avatar = createAvatar(avatarStyle.style, {
      seed: userName || "default",
      size: 200,
    });

    const svg = avatar.toString();
    const blob = new Blob([svg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);

    setPreviewAvatar(url);
    setFormData((prev) => ({
      ...prev,
      avatar_default: `default_${styleName}`,
    }));
    setCurrentFile(null);
  };

  useEffect(() => {
    if (freelancerData) {
      setFormData({
        profesion: freelancerData.profesion || "",
        experiencia: freelancerData.experiencia || "",
        id_ciud: freelancerData.id_ciud || "",
        hoja_vida: null,
        avatar: null,
        avatar_default: freelancerData.avatar || "",
      });

      // Cargar avatar actual
      if (freelancerData.avatar) {
        if (freelancerData.avatar.startsWith("uploads/")) {
          // Es un archivo subido
          setPreviewAvatar(`/api/${freelancerData.avatar}`);
        } else if (freelancerData.avatar.startsWith("default_")) {
          // Es un avatar por defecto - extraer el estilo y generar
          const styleName = freelancerData.avatar.replace("default_", "");
          setSelectedAvatarStyle(styleName);
          generateDefaultAvatar(styleName);
        } else {
          // Avatar antiguo sin formato - usar avataaars por defecto
          generateDefaultAvatar("avataaars");
        }
      } else {
        // Generar avatar por defecto inicial
        generateDefaultAvatar("avataaars");
      }
    }
  }, [freelancerData, userName]);

  const handleAvatarStyleChange = (styleName) => {
    setSelectedAvatarStyle(styleName);
    generateDefaultAvatar(styleName);
  };

  const handleAvatarUpload = (e) => {
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
      setPreviewAvatar(reader.result);
      setCurrentFile(file);
      setFormData((prev) => ({ ...prev, avatar: file, avatar_default: "" }));
    };
    reader.readAsDataURL(file);
  };

  const handleCVUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validar que sea PDF
    if (file.type !== "application/pdf") {
      alert("Por favor seleccione un archivo PDF");
      e.target.value = "";
      return;
    }

    // Validar tamaño (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("El archivo no debe superar los 5MB");
      e.target.value = "";
      return;
    }

    setCurrentCVFile(file);
    setFormData((prev) => ({ ...prev, hoja_vida: file }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("profesion", formData.profesion);
    formDataToSend.append("experiencia", formData.experiencia);
    formDataToSend.append("id_ciud", formData.id_ciud);

    if (currentFile) {
      formDataToSend.append("avatar", currentFile);
    } else if (formData.avatar_default) {
      formDataToSend.append("avatar_default", formData.avatar_default);
    }

    if (currentCVFile) {
      formDataToSend.append("hoja_vida", currentCVFile);
    }

    await onSave(formDataToSend);
  };

  return (
    <div className={styles.editProfileContainer}>
      <div className={styles.profileHeader}>
        <h2>
          <MdEdit /> Editar Perfil
        </h2>
        <p>Actualiza tu información profesional</p>
      </div>

      <form onSubmit={handleSubmit} className={styles.profileForm}>
        {/* Sección de Avatar */}
        <div className={styles.avatarSection}>
          <h3>Foto de Perfil</h3>
          <div className={styles.avatarContainer}>
            <div className={styles.avatarPreview}>
              {previewAvatar ? (
                <img src={previewAvatar} alt="Avatar" />
              ) : (
                <MdPerson className={styles.placeholderIcon} />
              )}
            </div>
            <div className={styles.avatarActions}>
              <button
                type="button"
                className={styles.btnSecondary}
                onClick={() => setShowAvatarSelector(!showAvatarSelector)}
              >
                {showAvatarSelector
                  ? "Ocultar Avatares"
                  : "Usar Avatar por Defecto"}
              </button>
              <label className={styles.btnPrimary}>
                <MdUpload /> Subir Imagen
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  style={{ display: "none" }}
                />
              </label>
            </div>
          </div>

          {showAvatarSelector && (
            <div className={styles.avatarSelector}>
              <p>Selecciona un estilo de avatar:</p>
              <div className={styles.avatarGrid}>
                {AVATAR_STYLES.map((avatarStyle) => (
                  <button
                    key={avatarStyle.name}
                    type="button"
                    className={`${styles.avatarOption} ${
                      selectedAvatarStyle === avatarStyle.name
                        ? styles.selected
                        : ""
                    }`}
                    onClick={() => handleAvatarStyleChange(avatarStyle.name)}
                  >
                    <div className={styles.avatarOptionPreview}>
                      <img
                        src={createAvatar(avatarStyle.style, {
                          seed: userName || "preview",
                          size: 80,
                        }).toDataUri()}
                        alt={avatarStyle.label}
                      />
                    </div>
                    <span>{avatarStyle.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Información Básica */}
        <div className={styles.formSection}>
          <h3>
            <MdPerson /> Información Profesional
          </h3>

          <div className={styles.formGroup}>
            <label htmlFor="profesion">Profesión *</label>
            <input
              type="text"
              id="profesion"
              name="profesion"
              value={formData.profesion}
              onChange={handleInputChange}
              placeholder="Ej: Desarrollador Full Stack, Diseñador UX/UI"
              required
            />
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
            <label htmlFor="experiencia">Experiencia</label>
            <textarea
              id="experiencia"
              name="experiencia"
              value={formData.experiencia}
              onChange={handleInputChange}
              placeholder="Describe tu experiencia profesional, proyectos destacados, habilidades..."
              rows="6"
            />
            <small>
              Puedes incluir logros, certificaciones, y tecnologías que manejas
            </small>
          </div>
        </div>

        {/* Hoja de Vida */}
        <div className={styles.formSection}>
          <h3>
            <MdDescription /> Hoja de Vida
          </h3>

          <div className={styles.formGroup}>
            <label htmlFor="hoja_vida">Actualizar Hoja de Vida (PDF)</label>
            {freelancerData?.hoja_vida && !currentCVFile && (
              <div className={styles.currentFile}>
                <p>✓ Actualmente tienes una hoja de vida cargada</p>
                <a
                  href={`/api/${freelancerData.hoja_vida}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.linkView}
                >
                  Ver hoja de vida actual
                </a>
              </div>
            )}
            <input
              type="file"
              id="hoja_vida"
              name="hoja_vida"
              accept=".pdf"
              onChange={handleCVUpload}
              className={styles.fileInput}
            />
            <small>Formato: PDF. Tamaño máximo: 5MB</small>
            {currentCVFile && (
              <p className={styles.fileSelected}>
                ✓ Nuevo archivo seleccionado: {currentCVFile.name}
              </p>
            )}
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
