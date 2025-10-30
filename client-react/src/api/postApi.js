import api from "./axiosConfig.js";

export const getPostulaciones = async () => {
  const res = await api.get("/postulaciones/");
  return res.data;
};
