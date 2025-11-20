import axiosInstance from "./axiosConfig";

/**
 * Obtiene la lista de todas las ciudades disponibles
 * @returns {Promise<Array>} Array de ciudades con estructura { id_ciud, nomb_ciud }
 * @throws {Error} Si hay un error en la petición
 */
export const getCities = async () => {
  try {
    const res = await axiosInstance.get("/api/ciudades");
    // API devuelve { success: true, ciudades: [...] }
    if (res.data && res.data.ciudades) return res.data.ciudades;
    return [];
  } catch (error) {
    console.error("Error al obtener ciudades:", error);
    throw error;
  }
};

export default {
  getCities,
};
