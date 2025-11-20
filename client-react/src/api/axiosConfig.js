/**
 * Configuración global de Axios para la aplicación
 * - Establece la URL base del backend
 * - Configura headers por defecto
 * - Añade interceptor para incluir JWT token automáticamente en todas las peticiones
 */
import axios from "axios";
import { getToken } from "../utils/sessionManager";

const api = axios.create({
  baseURL: "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Interceptor para agregar el token JWT automáticamente a todas las peticiones
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
