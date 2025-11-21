import api from "./axiosConfig";

/**
 * Calificar a un freelancer después de un proceso cerrado
 */
export const calificarFreelancer = async (
  idPost,
  puntuacion,
  comentario = ""
) => {
  try {
    const response = await api.post("/api/calificar-freelancer", {
      id_post: idPost,
      puntuacion,
      comentario,
    });
    return response.data;
  } catch (error) {
    console.error("Error al calificar freelancer:", error);
    throw error;
  }
};

/**
 * Obtener calificación promedio de un freelancer
 */
export const obtenerCalificacionFreelancer = async (idFree) => {
  try {
    const response = await api.get(`/api/calificacion-freelancer/${idFree}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener calificación:", error);
    throw error;
  }
};

/**
 * Verificar si una empresa puede calificar una postulación
 */
export const verificarPuedeCalificar = async (idPost) => {
  try {
    const response = await api.get(`/api/verificar-puede-calificar/${idPost}`);
    return response.data;
  } catch (error) {
    console.error("Error al verificar si puede calificar:", error);
    throw error;
  }
};

/**
 * Obtener lista de freelancers que han trabajado con la empresa
 */
export const obtenerFreelancersTrabajados = async () => {
  try {
    const response = await api.get("/api/freelancers-trabajados");
    return response.data;
  } catch (error) {
    console.error("Error al obtener freelancers trabajados:", error);
    throw error;
  }
};
