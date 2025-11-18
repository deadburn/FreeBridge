import api from "./axiosConfig.js";

export const getVacantes = async () => {
  const res = await api.get("/api/vacantes");
  return res.data;
};

export const getVacanteById = async (id) => {
  const res = await api.get(`/api/vacantes/${id}`);
  return res.data;
};

export const crearVacante = async (vacanteData) => {
  const res = await api.post("/api/crear-vacantes", vacanteData);
  return res.data;
};

export const actualizarVacante = async (id, vacanteData) => {
  const res = await api.put(`/api/vacantes/${id}`, vacanteData);
  return res.data;
};

export const cambiarEstadoVacante = async (id, estado) => {
  const res = await api.patch(`/api/vacantes/${id}/estado`, { estado });
  return res.data;
};

export const eliminarVacante = async (id) => {
  const res = await api.delete(`/api/vacantes/${id}`);
  return res.data;
};

export const getVacantesByEmpresa = async (empresaId) => {
  if (!empresaId) {
    throw new Error("empresaId es requerido");
  }

  const res = await api.get(`/api/vacantes/empresa/${empresaId}`);
  return res.data;
};
