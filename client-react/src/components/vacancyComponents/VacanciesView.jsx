import React, { useState, useEffect } from "react";
import { getVacantes } from "../../api/vacancyApi";
import { postularVacante, verificarPostulacion } from "../../api/postApi";
import { useAuth } from "../../context/AuthContext";
import VacancyCard from "./VacancyCard";
import VacancyDetailModal from "./VacancyDetailModal";
import { MdSearch } from "react-icons/md";
import styles from "../../styles/modules_dashboards/FreelanceDashboard.module.css";

export default function VacanciesView() {
  const [vacancies, setVacancies] = useState([]);
  const [filteredVacancies, setFilteredVacancies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [durationFilter, setDurationFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedVacancy, setSelectedVacancy] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [yaPostulado, setYaPostulado] = useState(false);
  const [verificandoPostulacion, setVerificandoPostulacion] = useState(false);
  const { isAuthenticated, userRole } = useAuth();

  useEffect(() => {
    loadVacancies();
  }, []);

  useEffect(() => {
    filterVacancies();
  }, [searchTerm, durationFilter, vacancies]);

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
    let filtered = vacancies;

    // Filtrar por término de búsqueda
    if (searchTerm.trim()) {
      filtered = filtered.filter((vacancy) =>
        vacancy.nombre?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrar por duración
    if (durationFilter) {
      filtered = filtered.filter(
        (vacancy) => vacancy.duracion_proyecto === durationFilter
      );
    }

    setFilteredVacancies(filtered);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDurationFilter = (e) => {
    setDurationFilter(e.target.value);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setDurationFilter("");
  };

  const handleViewDetails = async (vacancy) => {
    setSelectedVacancy(vacancy);
    setIsModalOpen(true);
    setYaPostulado(false);

    // Verificar si ya se postuló a esta vacante
    if (isAuthenticated && userRole === "FreeLancer" && vacancy.id) {
      setVerificandoPostulacion(true);
      try {
        const resultado = await verificarPostulacion(vacancy.id);
        setYaPostulado(resultado.postulado);
      } catch (error) {
        console.error("Error al verificar postulación:", error);
        setYaPostulado(false);
      } finally {
        setVerificandoPostulacion(false);
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedVacancy(null);
    setYaPostulado(false);
    setVerificandoPostulacion(false);
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

      {/* Contenedor de filtros */}
      <div className={styles.filtersContainer}>
        {/* Buscador por nombre */}
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Buscar por nombre de vacante"
            className={styles.searchInput}
            value={searchTerm}
            onChange={handleSearch}
          />
          <button className={styles.searchButton} onClick={filterVacancies}>
            <MdSearch />
          </button>
        </div>

        {/* Filtro por duración */}
        <div className={styles.filterGroup}>
          <select
            className={styles.filterSelect}
            value={durationFilter}
            onChange={handleDurationFilter}
          >
            <option value="">Todas las duraciones</option>
            <option value="1-3 meses">1-3 meses</option>
            <option value="3-6 meses">3-6 meses</option>
            <option value="6-12 meses">6-12 meses</option>
            <option value="Más de 1 año">Más de 1 año</option>
            <option value="Indefinido">Indefinido</option>
            <option value="Por proyecto">Por proyecto</option>
          </select>
        </div>

        {/* Botón para limpiar filtros */}
        {(searchTerm || durationFilter) && (
          <button className={styles.clearButton} onClick={clearFilters}>
            Limpiar filtros
          </button>
        )}
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
            {searchTerm || durationFilter
              ? "No se encontraron vacantes con los filtros seleccionados"
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
        canApply={
          isAuthenticated &&
          userRole === "FreeLancer" &&
          !yaPostulado &&
          !verificandoPostulacion
        }
        yaPostulado={yaPostulado}
      />
    </div>
  );
}
