import axios from "axios";
import { getToken } from "../utils/sessionManager";

const api = axios.create({
  baseURL: "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

//Interceptor para agregar el token automáticamente
api.interceptors.request.use(
  (config) => {
    // Usar getToken del sessionManager en lugar de localStorage directo
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
