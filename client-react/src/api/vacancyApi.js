import api from "./axiosConfig.js";

export const getVacantes = async () => {
  const res = await api.get("/vacantes/");
  return res.data;
};

export const getVacanteById = async (id) => {
  const res = await api.get(`/vacantes/${id}`);
  return res.data;
};

export const crearVacante = async (vacanteData) => {
  const res = await api.post("/vacantes/crear", vacanteData);
  return res.data;
};
