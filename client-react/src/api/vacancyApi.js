import api from "./axiosConfig.js";

/**
 * Obtiene todas las vacantes disponibles
 * @returns {Promise<Object>} Lista de vacantes
 */
export const getVacantes = async () => {
  const res = await api.get("/api/vacantes");
  return res.data;
};

/**
 * Obtiene una vacante específica por ID
 * @param {string} id - ID de la vacante
 * @returns {Promise<Object>} Datos de la vacante
 */
export const getVacanteById = async (id) => {
  const res = await api.get(`/api/vacantes/${id}`);
  return res.data;
};

/**
 * Crea una nueva vacante
 * @param {Object} vacanteData - Datos de la vacante
 * @param {string} vacanteData.nombre - Nombre/Título de la vacante
 * @param {string} vacanteData.desc_vac - Descripción de la vacante
 * @param {number} vacanteData.salario - Salario ofrecido
 * @param {string} vacanteData.id_ciud - ID de la ciudad
 * @param {string} vacanteData.id_emp - ID de la empresa
 * @returns {Promise<Object>} Vacante creada
 */
export const crearVacante = async (vacanteData) => {
  const res = await api.post("/api/crear-vacantes", vacanteData);
  return res.data;
};

/**
 * Actualiza una vacante existente
 * @param {string} id - ID de la vacante
 * @param {Object} vacanteData - Datos actualizados de la vacante
 * @returns {Promise<Object>} Vacante actualizada
 */
export const actualizarVacante = async (id, vacanteData) => {
  const res = await api.put(`/api/vacantes/${id}`, vacanteData);
  return res.data;
};

/**
 * Cambia el estado de una vacante (abierta/cerrada)
 * @param {string} id - ID de la vacante
 * @param {string} estado - Nuevo estado ('abierta' o 'cerrada')
 * @returns {Promise<Object>} Confirmación del cambio
 */
export const cambiarEstadoVacante = async (id, estado) => {
  const res = await api.patch(`/api/vacantes/${id}/estado`, { estado });
  return res.data;
};

/**
 * Elimina una vacante
 * @param {string} id - ID de la vacante
 * @returns {Promise<Object>} Confirmación de eliminación
 */
export const eliminarVacante = async (id) => {
  const res = await api.delete(`/api/vacantes/${id}`);
  return res.data;
};

/**
 * Obtiene todas las vacantes de una empresa específica
 * @param {string} empresaId - ID de la empresa
 * @returns {Promise<Object>} Lista de vacantes de la empresa
 * @throws {Error} Si empresaId no es proporcionado
 */
export const getVacantesByEmpresa = async (empresaId) => {
  if (!empresaId) {
    throw new Error("empresaId es requerido");
  }

  const res = await api.get(`/api/vacantes/empresa/${empresaId}`);
  return res.data;
};
