import React, { useState, useEffect } from "react";
import { getVacantes } from "../../api/vacancyApi";
import { postularVacante } from "../../api/postApi";
import { useAuth } from "../../context/AuthContext";
import VacancyCard from "./VacancyCard";
import VacancyDetailModal from "./VacancyDetailModal";
import { MdSearch } from "react-icons/md";
import styles from "../../styles/modules_dashboards/FreelanceDashboard.module.css";

export default function VacanciesView() {
  const [vacancies, setVacancies] = useState([]);
  const [filteredVacancies, setFilteredVacancies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedVacancy, setSelectedVacancy] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isAuthenticated, userRole } = useAuth();

  useEffect(() => {
    loadVacancies();
  }, []);

  useEffect(() => {
    filterVacancies();
  }, [searchTerm, vacancies]);

  const loadVacancies = async () => {
    try {
      const vacantesData = await getVacantes();
      setVacancies(vacantesData || []);
      setFilteredVacancies(vacantesData || []);
    } catch (error) {
      console.error("Error al cargar vacantes:", error);
      setVacancies([]);
      setFilteredVacancies([]);
    } finally {
      setLoading(false);
    }
  };

  const filterVacancies = () => {
    if (!searchTerm.trim()) {
      setFilteredVacancies(vacancies);
      return;
    }

    const filtered = vacancies.filter((vacancy) =>
      vacancy.nombre?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredVacancies(filtered);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleViewDetails = (vacancy) => {
    setSelectedVacancy(vacancy);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedVacancy(null);
  };

  const handleApply = async (vacante) => {
    if (!isAuthenticated) {
      alert("Debes iniciar sesión como FreeLancer para postularte");
      return;
    }

    if (userRole !== "FreeLancer") {
      alert("Solo los FreeLancers pueden postularse a vacantes");
      return;
    }

    try {
      const response = await postularVacante(vacante.id_vac || vacante.id);
      alert(response.mensaje || "¡Postulación enviada exitosamente!");
      handleCloseModal();
    } catch (error) {
      console.error("Error al postularse:", error);
      if (error.response?.status === 409) {
        alert("Ya te has postulado a esta vacante");
      } else if (error.response?.status === 403) {
        alert("Solo freelancers pueden postularse a vacantes");
      } else {
        alert("Error al enviar la postulación. Intenta nuevamente.");
      }
    }
  };

  if (loading) {
    return (
      <div className={styles.publicarView}>
        <h1 className={styles.viewTitle}>Vacantes disponibles</h1>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>Cargando vacantes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.publicarView}>
      <h1 className={styles.viewTitle}>Vacantes disponibles</h1>

      {/* Buscador */}
      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Ingresa el nombre de las vacantes de tu interés"
          className={styles.searchInput}
          value={searchTerm}
          onChange={handleSearch}
        />
        <button className={styles.searchButton} onClick={filterVacancies}>
          <MdSearch />
        </button>
      </div>

      {/* Grid de vacantes */}
      <div className={styles.vacanciesGrid}>
        {filteredVacancies.length > 0 ? (
          filteredVacancies.map((vacancy) => (
            <VacancyCard
              key={vacancy.id}
              vacante={vacancy}
              onApply={handleApply}
              onView={handleViewDetails}
              showApplyButton={true}
              showCompany={true}
              showSalary={false}
              variant="default"
            />
          ))
        ) : (
          <p className={styles.noVacancies}>
            {searchTerm
              ? `No se encontraron vacantes con "${searchTerm}"`
              : "No hay vacantes disponibles en este momento"}
          </p>
        )}
      </div>

      {/* Modal de detalles */}
      <VacancyDetailModal
        vacante={selectedVacancy}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onApply={handleApply}
        canApply={isAuthenticated && userRole === "FreeLancer"}
      />
    </div>
  );
}
