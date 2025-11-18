import React, { useState, useEffect } from "react";
import {
  getVacantesByEmpresa,
  eliminarVacante,
  cambiarEstadoVacante,
} from "../../api/vacancyApi";
import { useAuth } from "../../context/AuthContext";
import VacancyCard from "./VacancyCard";
import {
  MdEdit,
  MdDelete,
  MdDescription,
  MdToggleOn,
  MdToggleOff,
  MdMoreVert,
} from "react-icons/md";
import styles from "../../styles/modules_vacancies/MyVacanciesList.module.css";

export default function MyVacanciesList({ onEdit, onDelete }) {
  const [vacantes, setVacantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuAbierto, setMenuAbierto] = useState(null);
  const { userId } = useAuth();

  useEffect(() => {
    loadVacantes();
  }, [userId]);

  useEffect(() => {
    // Cerrar menú al hacer clic fuera
    const handleClickOutside = (event) => {
      if (menuAbierto && !event.target.closest(`.${styles.menuContainer}`)) {
        setMenuAbierto(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuAbierto]);

  const loadVacantes = async () => {
    try {
      setLoading(true);
      const data = await getVacantesByEmpresa(userId);

      setVacantes(data || []);
    } catch (error) {
      console.error("Error al cargar vacantes:", error);
      setVacantes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (vacante) => {
    if (onDelete) {
      // Si se provee onDelete desde el padre, usarlo
      await onDelete(vacante);
      // Recargar lista después de eliminar
      loadVacantes();
    } else {
      // Fallback a la implementación local
      if (
        !confirm(`¿Estás seguro de eliminar la vacante "${vacante.nombre}"?`)
      ) {
        return;
      }

      try {
        await eliminarVacante(vacante.id);
        setVacantes(vacantes.filter((v) => v.id !== vacante.id));
        alert("Vacante eliminada exitosamente");
      } catch (error) {
        console.error("Error al eliminar vacante:", error);
        alert("Error al eliminar la vacante. Intenta nuevamente.");
      }
    }
  };

  const handleToggleEstado = async (vacante) => {
    const nuevoEstado = vacante.estado === "abierta" ? "cerrada" : "abierta";
    const accion = nuevoEstado === "abierta" ? "activar" : "desactivar";

    if (!confirm(`¿Deseas ${accion} la vacante "${vacante.nombre}"?`)) {
      return;
    }

    try {
      await cambiarEstadoVacante(vacante.id, nuevoEstado);
      setVacantes(
        vacantes.map((v) =>
          v.id === vacante.id ? { ...v, estado: nuevoEstado } : v
        )
      );
      alert(
        `Vacante ${
          nuevoEstado === "abierta" ? "activada" : "desactivada"
        } exitosamente`
      );
    } catch (error) {
      console.error("Error al cambiar estado de vacante:", error);
      alert("Error al cambiar el estado. Intenta nuevamente.");
    }
  };

  const handleEdit = (vacante) => {
    setMenuAbierto(null); // Cerrar menú
    if (onEdit) {
      onEdit(vacante);
    }
  };

  const toggleMenu = (vacanteId) => {
    setMenuAbierto(menuAbierto === vacanteId ? null : vacanteId);
  };

  const handleDeleteClick = (vacante) => {
    setMenuAbierto(null); // Cerrar menú
    handleDelete(vacante);
  };

  const handleToggleClick = (vacante) => {
    setMenuAbierto(null); // Cerrar menú
    handleToggleEstado(vacante);
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <h2 className={styles.title}>Mis Vacantes</h2>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Cargando vacantes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Mis Vacantes</h2>
        <span className={styles.count}>
          {vacantes.length} vacantes publicadas
        </span>
      </div>

      {vacantes.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <MdDescription />
          </div>
          <h3>No tienes vacantes publicadas</h3>
          <p>Crea tu primera vacante para empezar a recibir postulaciones</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {vacantes.map((vacante) => (
            <div key={vacante.id} className={styles.vacancyWrapper}>
              <VacancyCard
                vacante={vacante}
                showApplyButton={false}
                showCompany={false}
                showSalary={true}
                variant="detailed"
              />
              <div className={styles.menuContainer}>
                <button
                  className={styles.menuButton}
                  onClick={() => toggleMenu(vacante.id)}
                  title="Más opciones"
                >
                  <MdMoreVert />
                </button>

                {menuAbierto === vacante.id && (
                  <div className={styles.menuDropdown}>
                    <button
                      className={styles.menuItem}
                      onClick={() => handleEdit(vacante)}
                    >
                      <MdEdit /> Editar
                    </button>
                    <button
                      className={`${styles.menuItem} ${
                        vacante.estado === "abierta"
                          ? styles.menuItemActive
                          : styles.menuItemInactive
                      }`}
                      onClick={() => handleToggleClick(vacante)}
                    >
                      {vacante.estado === "abierta" ? (
                        <>
                          <MdToggleOff /> Desactivar
                        </>
                      ) : (
                        <>
                          <MdToggleOn /> Activar
                        </>
                      )}
                    </button>
                    <button
                      className={`${styles.menuItem} ${styles.menuItemDelete}`}
                      onClick={() => handleDeleteClick(vacante)}
                    >
                      <MdDelete /> Eliminar
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
