import api from "./axiosConfig.js";

export const getProfile = async () => {
  const res = await api.get(`/api/perfil`);
  return res.data;
};
