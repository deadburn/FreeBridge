import React, { useState, useEffect } from "react";
import { getVacantes } from "../api/vacancyApi";
import VacancyCard from "./VacancyCard";
import styles from "../styles/CompanyDashboard.module.css";

export default function VacanciesView() {
  const [vacancies, setVacancies] = useState([]);
  const [filteredVacancies, setFilteredVacancies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

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
          🔍
        </button>
      </div>

      {/* Grid de vacantes */}
      <div className={styles.vacanciesGrid}>
        {filteredVacancies.length > 0 ? (
          filteredVacancies.map((vacancy) => (
            <VacancyCard
              key={vacancy.id}
              vacante={vacancy}
              onApply={(vacante) => {
                console.log("Postularse a:", vacante.nombre);
                // TODO: Implementar lógica de postulación
              }}
              onView={(vacante) => {
                console.log("Ver detalles:", vacante.nombre);
                // TODO: Implementar modal o página de detalles
              }}
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
    </div>
  );
}
