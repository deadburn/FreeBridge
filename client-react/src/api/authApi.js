import api from "./axiosConfig.js";

export const registerUser = async (userData) => {
  try {
    const data = {
      nombre: userData.nombre,
      correo: userData.email,
      contraseña: userData.password,
      rol: userData.rol,
    };
    console.log("Attempting to send data:", data); // Debug log

    const res = await api.post("/api/registro", data);
    console.log("Response received:", res.data); // Debug log
    return res.data;
  } catch (error) {
    console.error("Complete error object:", error);
    console.error("Response data:", error.response?.data);
    console.error("Response status:", error.response?.status);
    throw error;
  }
};

export const loginUser = async (credentials) => {
  try {
    const data = {
      correo: credentials.email,
      contraseña: credentials.password,
    };
    console.log("Login attempt with:", data);

    const res = await api.post("/api/login", data);
    console.log("Login response:", res.data);

    if (res.data.token) {
      localStorage.setItem("token", res.data.token);
    }
    return res.data;
  } catch (error) {
    console.error("Login error:", error.response?.data || error.message);
    throw error;
  }
};
