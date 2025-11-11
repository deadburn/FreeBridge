import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getCities } from "../api/cityApi";
import { useFreelancerProfile } from "../hooks/useFreelancerProfile";
import FreelancerProfileForm from "../components/FreelancerProfileForm";
import FreelancerSidebar from "../components/FreelancerSidebar";
import ProjectsList from "../components/ProjectsList";
import VacanciesView from "../components/VacanciesView";
import SuccessModal from "../components/SuccessModal";
import styles from "../styles/CompanyDashboard.module.css";

const FreelanceDashboard = () => {
  const [activeView, setActiveView] = useState("vacantes");
  const [projects, setProjects] = useState([]);
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
  } = useFreelancerProfile(userId);

  useEffect(() => {
    if (!isAuthenticated || userRole !== "FreeLancer") {
      navigate("/login");
      return;
    }

    const initializeDashboard = async () => {
      try {
        const c = await getCities();
        setCities(c);

        // Proyectos de ejemplo (TODO: obtener del backend)
        setProjects([
          { id: 1, nombre: "Proyecto 1", estado: "Completado" },
          { id: 2, nombre: "Proyecto 2", estado: "Completado" },
        ]);
      } catch (err) {
        console.error("Error al cargar datos:", err);
      }
    };

    initializeDashboard();
  }, [navigate, isAuthenticated, userRole]);

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
        <FreelancerProfileForm
          formData={formData}
          cities={cities}
          onInputChange={handleInputChange}
          onSubmit={handleSubmit}
        />
        <SuccessModal
          isOpen={showSuccessModal}
          onClose={handleSuccessModalClose}
          userName={userName}
          title="¡Perfil Completado!"
          message="tu perfil ha sido configurado exitosamente."
          submessage="Ahora puedes explorar vacantes y postularte a las oportunidades que te interesen."
        />
      </>
    );
  }

  return (
    <div className={styles.dashboard}>
      <FreelancerSidebar
        userName={userName}
        activeView={activeView}
        onViewChange={setActiveView}
      />

      <main className={styles.mainContent}>
        {activeView === "freelancer" ? (
          <ProjectsList projects={projects} />
        ) : (
          <VacanciesView />
        )}
      </main>
    </div>
  );
};

export default FreelanceDashboard;
