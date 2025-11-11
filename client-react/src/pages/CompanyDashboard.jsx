import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getCities } from "../api/cityApi";
import { useCompanyProfile } from "../hooks/useCompanyProfile";
import CompanyProfileForm from "../components/CompanyProfileForm";
import CompanySidebar from "../components/CompanySidebar";
import ApplicationsList from "../components/ApplicationsList";
import VacancyForm from "../components/VacancyForm";
import SuccessModal from "../components/SuccessModal";
import styles from "../styles/CompanyDashboard.module.css";

const CompanyDashboard = () => {
  const [activeView, setActiveView] = useState("postulaciones");
  const [postulaciones, setPostulaciones] = useState([]);
  const [cities, setCities] = useState([]);
  const navigate = useNavigate();

  const { isAuthenticated, userRole, userId, userName } = useAuth();
  const {
    profileComplete,
    loading,
    showSuccessModal,
    formData,
    handleInputChange,
    handleSubmit,
    handleSuccessModalClose,
  } = useCompanyProfile(userId);

  useEffect(() => {
    if (!isAuthenticated || userRole !== "Empresa") {
      navigate("/login");
      return;
    }

    const initializeDashboard = async () => {
      try {
        const c = await getCities();
        setCities(c);

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
      }
    };

    initializeDashboard();
  }, [navigate, isAuthenticated, userRole]);

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
      <>
        <CompanyProfileForm
          formData={formData}
          cities={cities}
          onInputChange={handleInputChange}
          onSubmit={handleSubmit}
        />
        <SuccessModal
          isOpen={showSuccessModal}
          onClose={handleSuccessModalClose}
          userName={userName}
          title="¡Perfil Empresarial Completado!"
          message="tu empresa ha sido registrada exitosamente."
          submessage="Ahora puedes publicar vacantes y gestionar tus postulaciones."
        />
      </>
    );
  }

  return (
    <div className={styles.dashboard}>
      <CompanySidebar activeView={activeView} onViewChange={setActiveView} />

      <main className={styles.mainContent}>
        {activeView === "postulaciones" ? (
          <ApplicationsList postulaciones={postulaciones} />
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
