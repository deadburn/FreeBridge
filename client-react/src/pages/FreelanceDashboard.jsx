import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getCities } from "../api/cityApi";
import {
  getFreelancerProfile,
  updateFreelancerProfile,
} from "../api/freelancerApi";
import { deleteAccount } from "../api/authApi";
import { getCambiosRecientes } from "../api/postApi";
import { obtenerCalificacionFreelancer } from "../api/ratingApi";
import { useFreelancerProfile } from "../hooks/useFreelancerProfile";
import FreelancerProfileForm from "../components/profileComponents/FreelancerProfileForm";
import EditFreelancerProfile from "../components/profileComponents/EditFreelancerProfile";
import FreelancerSidebar from "../components/dashboardComponents/FreelancerSidebar";
import ProjectsList from "../components/dashboardComponents/ProjectsList";
import VacanciesView from "../components/vacancyComponents/VacanciesView";
import MisPostulaciones from "../components/dashboardComponents/MisPostulaciones";
import SuccessModal from "../components/commonComponents/SuccessModal";
import DeleteAccountModal from "../components/commonComponents/DeleteAccountModal";
import PostulacionNotificationModal from "../components/commonComponents/PostulacionNotificationModal";
import dashboardStyles from "../styles/modules_dashboards/Dashboard.module.css";
import freelanceStyles from "../styles/modules_dashboards/FreelanceDashboard.module.css";

const styles = { ...dashboardStyles, ...freelanceStyles };

const FreelanceDashboard = () => {
  const [activeView, setActiveView] = useState("vacantes");
  const [projects, setProjects] = useState([]);
  const [cities, setCities] = useState([]);
  const [freelancerData, setFreelancerData] = useState(null);
  const [showEditSuccessModal, setShowEditSuccessModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [cambiosPostulaciones, setCambiosPostulaciones] = useState([]);
  const [cambiosNoVistos, setCambiosNoVistos] = useState([]);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const navigate = useNavigate();

  const { isAuthenticated, userRole, userId, userName, logout } = useAuth();
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

        // Cargar datos del freelancer si el perfil está completo
        if (profileComplete) {
          const profileData = await getFreelancerProfile(userId);
          if (profileData.freelancer) {
            setFreelancerData(profileData.freelancer);

            // Obtener calificación del freelancer usando id_free
            try {
              const ratingData = await obtenerCalificacionFreelancer(
                profileData.freelancer.id_free
              );
              setRating(ratingData.promedio || 0);
              setTotalRatings(ratingData.total || 0);
            } catch (error) {
              console.error("Error al obtener calificación:", error);
            }
          }

          // Verificar cambios recientes en postulaciones
          try {
            const cambios = await getCambiosRecientes();

            if (
              cambios.success &&
              cambios.cambios &&
              cambios.cambios.length > 0
            ) {
              // Guardar TODAS las notificaciones
              setCambiosPostulaciones(cambios.cambios);

              // Obtener las notificaciones ya vistas de localStorage
              const notificacionesVistas = JSON.parse(
                localStorage.getItem("notificacionesVistas") || "[]"
              );

              // Filtrar solo los cambios que no han sido vistos para el contador
              const noVistos = cambios.cambios.filter(
                (cambio) => !notificacionesVistas.includes(cambio.id)
              );

              setCambiosNoVistos(noVistos);
            }
          } catch (error) {
            console.error("Error al verificar cambios:", error);
          }
        }

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
  }, [navigate, isAuthenticated, userRole, userId, profileComplete]);

  const handleSaveProfile = async (formDataToSend) => {
    try {
      const freelancerId = localStorage.getItem("freelancerId");
      if (!freelancerId) {
        throw new Error("No se encontró el ID del freelancer");
      }

      const response = await updateFreelancerProfile(
        freelancerId,
        formDataToSend
      );
      if (response.success) {
        // Recargar datos completos del perfil desde el servidor
        const updatedProfileData = await getFreelancerProfile(userId);
        if (updatedProfileData.freelancer) {
          setFreelancerData(updatedProfileData.freelancer);
        }
        setShowEditSuccessModal(true);
        setActiveView("vacantes");
      }
    } catch (error) {
      console.error("Error al actualizar perfil:", error);
      alert("Error al actualizar el perfil: " + error.message);
    }
  };

  const handleCancelEdit = () => {
    setActiveView("vacantes");
  };

  const handleCloseNotificationModal = () => {
    // Marcar las notificaciones actuales como vistas
    const notificacionesVistas = JSON.parse(
      localStorage.getItem("notificacionesVistas") || "[]"
    );

    const nuevasNotificacionesVistas = [
      ...notificacionesVistas,
      ...cambiosPostulaciones.map((cambio) => cambio.id),
    ];

    localStorage.setItem(
      "notificacionesVistas",
      JSON.stringify(nuevasNotificacionesVistas)
    );

    setShowNotificationModal(false);
    // Limpiar solo las no vistas, pero mantener todas las notificaciones
    setCambiosNoVistos([]);
  };

  const handleDeleteAccount = async () => {
    try {
      const response = await deleteAccount();
      if (response.success) {
        // Cerrar modal primero
        setShowDeleteModal(false);

        // Redirigir INMEDIATAMENTE antes de limpiar la sesión
        // Esto evita que el useEffect redirija a /login
        navigate("/", {
          replace: true,
          state: {
            message: "Tu cuenta ha sido eliminada exitosamente",
          },
        });

        // Limpiar sesión DESPUÉS de redirigir
        setTimeout(() => {
          logout(false);
        }, 50);
      }
    } catch (error) {
      console.error("Error al eliminar cuenta:", error);
      alert("Error al eliminar la cuenta: " + error.message);
      setShowDeleteModal(false);
    }
  };

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
        avatarUrl={freelancerData?.avatar}
        onDeleteAccount={() => setShowDeleteModal(true)}
        notificationCount={cambiosNoVistos?.length || 0}
        onNotificationClick={() => setShowNotificationModal(true)}
        rating={rating}
        totalRatings={totalRatings}
      />

      <main className={styles.mainContent}>
        {activeView === "perfil" && freelancerData ? (
          <EditFreelancerProfile
            freelancerData={freelancerData}
            cities={cities}
            onSave={handleSaveProfile}
            onCancel={handleCancelEdit}
            userName={userName}
          />
        ) : activeView === "mis-postulaciones" ? (
          <MisPostulaciones />
        ) : activeView === "freelancer" ? (
          <ProjectsList projects={projects} />
        ) : (
          <VacanciesView />
        )}
      </main>

      <SuccessModal
        isOpen={showEditSuccessModal}
        onClose={() => setShowEditSuccessModal(false)}
        userName={userName}
        title="¡Perfil Actualizado!"
        message="tu perfil ha sido actualizado exitosamente."
        submessage="Los cambios se reflejarán en tu perfil público."
      />

      <DeleteAccountModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteAccount}
        userName={userName}
      />

      <PostulacionNotificationModal
        cambios={cambiosPostulaciones}
        onClose={handleCloseNotificationModal}
        isOpen={showNotificationModal}
      />
    </div>
  );
};

export default FreelanceDashboard;
