import api from "./axiosConfig.js";

export const loginUser = async (credentials) => {
  const res = await api.post("/routes_auth/login", credentials);
  return res.data;
};

export const registerUser = async (userData) => {
  const res = await api.post("/routes_auth/registro", userData);
  return res.data;
};
