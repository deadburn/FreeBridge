import api from "./axiosConfig.js";

/**
 * Registra un nuevo usuario en el sistema
 * @param {Object} userData - Datos del usuario a registrar
 * @param {string} userData.nombre - Nombre completo del usuario
 * @param {string} userData.email - Correo electrónico
 * @param {string} userData.password - Contraseña
 * @param {string} userData.rol - Rol del usuario ('FreeLancer' o 'Empresa')
 * @returns {Promise<Object>} Respuesta del servidor con los datos del usuario registrado
 */
export const registerUser = async (userData) => {
  try {
    const data = {
      nombre: userData.nombre,
      correo: userData.email,
      contraseña: userData.password,
      rol: userData.rol,
    };

    const res = await api.post("/api/registro", data);
    return res.data;
  } catch (error) {
    console.error(
      "Error en registro de usuario:",
      error.response?.data?.message || error.message
    );
    throw error;
  }
};

/**
 * Autentica un usuario en el sistema
 * @param {Object} credentials - Credenciales de acceso
 * @param {string} credentials.email - Correo electrónico del usuario
 * @param {string} credentials.password - Contraseña del usuario
 * @returns {Promise<Object>} Respuesta del servidor con token y datos del usuario
 */
export const loginUser = async (credentials) => {
  try {
    const data = {
      correo: credentials.email,
      contraseña: credentials.password,
    };

    const res = await api.post("/api/login", data);
    // El token se guarda desde loginForm.jsx usando el método login() del AuthContext
    return res.data;
  } catch (error) {
    console.error(
      "Error en autenticación:",
      error.response?.data?.message || error.message
    );
    throw error;
  }
};

/**
 * Solicita recuperación de contraseña
 * @param {string} email - Correo electrónico del usuario
 * @returns {Promise<Object>} Confirmación del envío del correo
 */
export const forgotPassword = async (email) => {
  try {
    const res = await api.post("/api/auth/forgot-password", { email });
    return res.data;
  } catch (error) {
    console.error(
      "Error al solicitar recuperación de contraseña:",
      error.response?.data?.message || error.message
    );
    throw error;
  }
};

/**
 * Restablece la contraseña de un usuario
 * @param {string} token - Token de recuperación enviado por correo
 * @param {string} password - Nueva contraseña
 * @returns {Promise<Object>} Confirmación del cambio de contraseña
 */
export const resetPassword = async (token, password) => {
  try {
    const res = await api.post("/api/auth/reset-password", { token, password });
    return res.data;
  } catch (error) {
    console.error(
      "Error al restablecer contraseña:",
      error.response?.data?.message || error.message
    );
    throw error;
  }
};

/**
 * Elimina la cuenta del usuario autenticado
 * @returns {Promise<Object>} Confirmación de eliminación
 */
export const deleteAccount = async () => {
  try {
    const res = await api.delete("/api/usuario/eliminar");
    return res.data;
  } catch (error) {
    console.error(
      "Error al eliminar cuenta:",
      error.response?.data?.message || error.message
    );
    throw error;
  }
};
