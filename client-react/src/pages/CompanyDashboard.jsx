import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getCities } from "../api/cityApi";
import { saveCompanyProfile, getCompanyProfile } from "../api/companyApi";
import VacancyForm from "../components/vacancyForm";
import {
  MdDashboard,
  MdPostAdd,
  MdLabel,
  MdDelete,
  MdFolder,
  MdStar,
  MdStarBorder,
} from "react-icons/md";
import styles from "../styles/CompanyDashboard.module.css";

const CompanyDashboard = () => {
  const [profileComplete, setProfileComplete] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState("postulaciones"); // "postulaciones" o "publicar"
  const [postulaciones, setPostulaciones] = useState([]);
  const [formData, setFormData] = useState({
    nomb_emp: "",
    NIT: "",
    tamaño: "",
    desc_emp: "",
    id_ciud: "",
  });
  const [cities, setCities] = useState([]);
  const navigate = useNavigate();

  // Usar el contexto de autenticación en lugar de localStorage
  const { isAuthenticated, userRole, userId } = useAuth();

  useEffect(() => {
    // Verificar si el usuario está autenticado y es una empresa
    if (!isAuthenticated || userRole !== "Empresa") {
      navigate("/login");
      return;
    }

    const initializeDashboard = async () => {
      try {
        // Cargar ciudades para el selector
        const c = await getCities();
        setCities(c);

        // Verificar si el perfil de la empresa ya existe
        if (userId) {
          try {
            const profileData = await getCompanyProfile(userId);
            console.log("Respuesta del perfil:", profileData);

            if (
              profileData &&
              profileData.perfilCompleto &&
              profileData.empresa
            ) {
              // El perfil existe, marcar como completo
              setProfileComplete(true);
              // Guardar el ID de la empresa si existe
              if (profileData.empresa.id_emp) {
                localStorage.setItem("companyId", profileData.empresa.id_emp);
              }
            } else {
              // El perfil no existe o no está completo
              setProfileComplete(false);
            }
          } catch (error) {
            // Si hay un error, asumir que el perfil no existe
            console.log(
              "Perfil no encontrado, debe completarlo:",
              error.message
            );
            setProfileComplete(false);
          }
        } else {
          console.error("No se encontró userId en el contexto");
          setProfileComplete(false);
        }

        // Cargar postulaciones de ejemplo (TODO: conectar con backend)
        setPostulaciones([
          {
            id: 1,
            nombre: "Mateo.R",
            puesto: "Desarrollador web",
            rating: 4,
            avatar: "👨‍💻",
          },
          {
            id: 2,
            nombre: "Andres.M",
            puesto: "Especialista en marketing",
            rating: 5,
            avatar: "👨‍💼",
          },
          {
            id: 3,
            nombre: "Laura.D",
            puesto: "Especialista en multimedia",
            rating: 4,
            avatar: "👩‍💻",
          },
          {
            id: 4,
            nombre: "Marcela.S",
            puesto: "Junior python",
            rating: 4,
            avatar: "👩‍💻",
          },
        ]);
      } catch (err) {
        console.error("Error al cargar datos:", err);
      } finally {
        setLoading(false);
      }
    };

    initializeDashboard();
  }, [navigate, isAuthenticated, userRole, userId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Usar userId del contexto en lugar de localStorage
      if (!userId) {
        throw new Error("No se encontró el ID del usuario");
      }

      const companyData = {
        ...formData,
        id_usu: userId,
      };

      const response = await saveCompanyProfile(companyData);
      if (response.success) {
        setProfileComplete(true);
        // Guardar el ID de la empresa
        if (response.id_emp) {
          localStorage.setItem("companyId", response.id_emp);
        }
        alert("Perfil guardado exitosamente");
      }
    } catch (error) {
      console.error("Error al guardar el perfil:", error);
      alert(error.message || "Error al guardar el perfil de la empresa");
    }
  };

  // Mostrar loading mientras se verifica el perfil
  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Cargando...</p>
      </div>
    );
  }

  if (!profileComplete) {
    return (
      <div className={styles.profileSection}>
        <div className={styles.profileCard}>
          <h2 className={styles.profileTitle}>Complete su perfil de empresa</h2>
          <p className={styles.profileSubtitle}>
            Para poder crear vacantes, primero debe completar su perfil
          </p>
          <form onSubmit={handleSubmit} className={styles.profileForm}>
            <div className={styles.formGroup}>
              <label htmlFor="nomb_emp">Nombre de la empresa</label>
              <input
                type="text"
                id="nomb_emp"
                name="nomb_emp"
                value={formData.nomb_emp}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="NIT">NIT</label>
              <input
                type="text"
                id="NIT"
                name="NIT"
                value={formData.NIT}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="tamaño">Tamaño de la empresa</label>
              <select
                id="tamaño"
                name="tamaño"
                value={formData.tamaño}
                onChange={handleInputChange}
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
                onChange={handleInputChange}
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
            <button type="submit" className={styles.submitButton}>
              Guardar Perfil
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      {/* Sidebar de navegación */}
      <aside className={styles.sidebar}>
        <h2 className={styles.sidebarTitle}>Panel de Empresa</h2>

        <nav className={styles.nav}>
          <button
            className={`${styles.navItem} ${
              activeView === "postulaciones" ? styles.navItemActive : ""
            }`}
            onClick={() => setActiveView("postulaciones")}
          >
            <MdDashboard className={styles.navIcon} />
            <span className={styles.navText}>Gestión de postulaciones</span>
          </button>

          <button
            className={`${styles.navItem} ${
              activeView === "publicar" ? styles.navItemActive : ""
            }`}
            onClick={() => setActiveView("publicar")}
          >
            <MdPostAdd className={styles.navIcon} />
            <span className={styles.navText}>Publicar vacantes</span>
          </button>
        </nav>

        {/* Acciones adicionales */}
        <div className={styles.sidebarActions}>
          <button className={styles.actionButton} title="Etiquetas">
            <MdLabel />
          </button>
          <button className={styles.actionButton} title="Eliminar">
            <MdDelete />
          </button>
          <button className={styles.actionButton} title="Archivos">
            <MdFolder />
          </button>
        </div>
      </aside>

      {/* Contenido principal */}
      <main className={styles.mainContent}>
        {activeView === "postulaciones" ? (
          <div className={styles.postulacionesView}>
            <h1 className={styles.viewTitle}>Gestión de postulaciones</h1>

            <div className={styles.postulacionesGrid}>
              {postulaciones.map((postulacion) => (
                <div key={postulacion.id} className={styles.postulacionCard}>
                  <div className={styles.cardHeader}>
                    <div className={styles.avatar}>{postulacion.avatar}</div>
                    <div className={styles.cardInfo}>
                      <h3 className={styles.candidateName}>
                        {postulacion.nombre}
                      </h3>
                      <p className={styles.candidateRole}>
                        {postulacion.puesto}
                      </p>
                    </div>
                  </div>

                  <div className={styles.rating}>
                    {[...Array(5)].map((_, index) =>
                      index < postulacion.rating ? (
                        <MdStar key={index} className={styles.starFilled} />
                      ) : (
                        <MdStarBorder
                          key={index}
                          className={styles.starEmpty}
                        />
                      )
                    )}
                  </div>

                  <button className={styles.viewButton}>Ver</button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className={styles.publicarView}>
            <VacancyForm embedded={true} />
          </div>
        )}
      </main>
    </div>
  );
};

export default CompanyDashboard;
