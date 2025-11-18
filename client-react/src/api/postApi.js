import api from "./axiosConfig.js";

export const getPostulaciones = async () => {
  const res = await api.get("/postulaciones/");
  return res.data;
};

export const postularVacante = async (idVacante) => {
  const res = await api.post(`/api/postular/${idVacante}`);
  return res.data;
};

export const getPostulacionesByFreelancer = async () => {
  const res = await api.get("/api/mis-postulaciones");
  return res.data;
};

export const getPostulacionesByEmpresa = async () => {
  const res = await api.get("/api/empresa/postulaciones");
  return res.data;
};

export const updatePostulacionEstado = async (idPostulacion, estado) => {
  try {
    const res = await api.put(`/api/postulacion/estado/${idPostulacion}`, {
      estado: estado,
    });
    return res.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(
        error.response.data.error || "Error al actualizar el estado"
      );
    }
    throw error;
  }
};

export const getCambiosRecientes = async () => {
  try {
    const res = await api.get("/api/postulaciones/cambios-recientes");
    return res.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(
        error.response.data.error || "Error al obtener cambios recientes"
      );
    }
    throw error;
  }
};

export const cancelarPostulacion = async (idPostulacion) => {
  try {
    const res = await api.delete(`/api/postulacion/cancelar/${idPostulacion}`);
    return res.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(
        error.response.data.error || "Error al cancelar la postulación"
      );
    }
    throw error;
  }
};

export const getNuevasPostulacionesEmpresa = async () => {
  try {
    const res = await api.get(
      "/api/empresa/notificaciones/nuevas-postulaciones"
    );
    return res.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(
        error.response.data.error || "Error al obtener notificaciones"
      );
    }
    throw error;
  }
};
