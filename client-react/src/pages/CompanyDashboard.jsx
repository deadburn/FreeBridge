import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getCities } from "../api/cityApi";
import { eliminarVacante } from "../api/vacancyApi";
import { getCompanyProfile, updateCompanyProfile } from "../api/companyApi";
import { deleteAccount } from "../api/authApi";
import { getNuevasPostulacionesEmpresa } from "../api/postApi";
import { useCompanyProfile } from "../hooks/useCompanyProfile";
import CompanyProfileForm from "../components/profileComponents/CompanyProfileForm";
import EditCompanyProfile from "../components/profileComponents/EditCompanyProfile";
import CompanySidebar from "../components/dashboardComponents/CompanySidebar";
import VacanciesWithApplications from "../components/dashboardComponents/VacanciesWithApplications";
import VacancyForm from "../components/vacancyComponents/VacancyForm";
import MyVacanciesList from "../components/vacancyComponents/MyVacanciesList";
import SuccessModal from "../components/commonComponents/SuccessModal";
import DeleteAccountModal from "../components/commonComponents/DeleteAccountModal";
import EmpresaNotificationModal from "../components/commonComponents/EmpresaNotificationModal";
import dashboardStyles from "../styles/modules_dashboards/Dashboard.module.css";
import companyStyles from "../styles/modules_dashboards/CompanyDashboard.module.css";

const styles = { ...dashboardStyles, ...companyStyles };

const CompanyDashboard = () => {
  const [activeView, setActiveView] = useState("postulaciones");
  const [cities, setCities] = useState([]);
  const [vacanteToEdit, setVacanteToEdit] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [companyData, setCompanyData] = useState(null);
  const [showEditSuccessModal, setShowEditSuccessModal] = useState(false);
  const [notificacionesPostulaciones, setNotificacionesPostulaciones] =
    useState([]);
  const [notificacionesNoVistas, setNotificacionesNoVistas] = useState([]);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
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

        // Cargar datos de la empresa si el perfil está completo
        if (profileComplete) {
          const profileData = await getCompanyProfile(userId);
          if (profileData.empresa) {
            setCompanyData(profileData.empresa);
          }

          // Verificar nuevas postulaciones
          try {
            const notificaciones = await getNuevasPostulacionesEmpresa();
            if (
              notificaciones.success &&
              notificaciones.notificaciones &&
              notificaciones.notificaciones.length > 0
            ) {
              // Guardar TODAS las notificaciones
              setNotificacionesPostulaciones(notificaciones.notificaciones);

              // Obtener las notificaciones ya vistas de localStorage
              const notificacionesVistas = JSON.parse(
                localStorage.getItem("notificacionesEmpresaVistas") || "[]"
              );

              // Filtrar solo las notificaciones no vistas para el contador
              const noVistas = notificaciones.notificaciones.filter(
                (notif) => !notificacionesVistas.includes(notif.id)
              );

              setNotificacionesNoVistas(noVistas);
            }
          } catch (error) {
            console.error("Error al verificar notificaciones:", error);
          }
        }
      } catch (err) {
        console.error("Error al cargar datos:", err);
      }
    };

    initializeDashboard();
  }, [navigate, isAuthenticated, userRole, userId, profileComplete]);

  const handleEditVacante = (vacante) => {
    setVacanteToEdit(vacante);
    setActiveView("publicar");
  };

  const handleDeleteVacante = async (vacante) => {
    if (!confirm(`¿Estás seguro de eliminar la vacante "${vacante.nombre}"?`)) {
      return;
    }

    try {
      await eliminarVacante(vacante.id);
      alert("Vacante eliminada exitosamente");
      setRefreshKey((prev) => prev + 1); // Forzar actualización
    } catch (error) {
      console.error("Error al eliminar vacante:", error);
      alert("Error al eliminar la vacante. Intenta nuevamente.");
    }
  };

  const handleVacancySuccess = () => {
    // Volver a la vista de postulaciones después de crear/editar
    setVacanteToEdit(null);
    setActiveView("postulaciones");
    setRefreshKey((prev) => prev + 1); // Forzar actualización
  };

  const handleViewChange = (view) => {
    // Limpiar vacante a editar cuando cambiamos de vista
    if (view !== "publicar") {
      setVacanteToEdit(null);
    }
    setActiveView(view);
  };

  const handleCloseNotificationModal = () => {
    // Marcar las notificaciones actuales como vistas
    const notificacionesVistas = JSON.parse(
      localStorage.getItem("notificacionesEmpresaVistas") || "[]"
    );

    const nuevasNotificacionesVistas = [
      ...notificacionesVistas,
      ...notificacionesPostulaciones.map((notif) => notif.id),
    ];

    localStorage.setItem(
      "notificacionesEmpresaVistas",
      JSON.stringify(nuevasNotificacionesVistas)
    );

    setShowNotificationModal(false);
    // Limpiar solo las no vistas, pero mantener todas las notificaciones
    setNotificacionesNoVistas([]);
  };

  const handleViewPostulaciones = () => {
    handleCloseNotificationModal();
    setActiveView("postulaciones");
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

  const handleSaveCompanyProfile = async (formData) => {
    try {
      const companyId = localStorage.getItem("companyId");
      const userId = localStorage.getItem("userId");

      if (!companyId || !userId) {
        throw new Error("No se pudo obtener el ID de la empresa");
      }

      await updateCompanyProfile(companyId, formData);

      // Recargar datos del perfil desde el servidor
      const updatedProfile = await getCompanyProfile(userId);
      console.log("Updated profile:", updatedProfile);
      if (updatedProfile.empresa) {
        setCompanyData(updatedProfile.empresa);
      }

      setShowEditSuccessModal(true);
      setActiveView("postulaciones");
    } catch (error) {
      console.error("Error al actualizar perfil de empresa:", error);
      alert("Error al actualizar el perfil: " + error.message);
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
      <CompanySidebar
        activeView={activeView}
        onViewChange={handleViewChange}
        onDeleteAccount={() => setShowDeleteModal(true)}
        companyData={companyData}
        notificationCount={notificacionesNoVistas?.length || 0}
        onNotificationClick={() => setShowNotificationModal(true)}
      />

      <main className={styles.mainContent}>
        {activeView === "postulaciones" && (
          <VacanciesWithApplications key={refreshKey} />
        )}

        {activeView === "publicar" && (
          <div className={styles.publicarView}>
            <VacancyForm
              embedded={true}
              vacanteToEdit={vacanteToEdit}
              onSuccess={handleVacancySuccess}
            />
          </div>
        )}

        {activeView === "mis-vacantes" && (
          <MyVacanciesList
            key={refreshKey}
            onEdit={handleEditVacante}
            onDelete={handleDeleteVacante}
          />
        )}

        {activeView === "perfil" && (
          <>
            {!companyData && <p>Cargando datos de la empresa...</p>}
            {companyData && (
              <EditCompanyProfile
                companyData={companyData}
                cities={cities}
                onSave={handleSaveCompanyProfile}
                onCancel={() => setActiveView("postulaciones")}
              />
            )}
          </>
        )}
      </main>

      <DeleteAccountModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteAccount}
        userName={userName}
      />

      <SuccessModal
        isOpen={showEditSuccessModal}
        onClose={() => setShowEditSuccessModal(false)}
        userName={userName}
        title="¡Perfil Empresarial Actualizado!"
        message="los datos de tu empresa han sido actualizados exitosamente."
        submessage="Los cambios ya están visibles en tu perfil."
      />

      <EmpresaNotificationModal
        notificaciones={notificacionesPostulaciones}
        onClose={handleCloseNotificationModal}
        onViewPostulaciones={handleViewPostulaciones}
        isOpen={showNotificationModal}
      />
    </div>
  );
};

export default CompanyDashboard;
