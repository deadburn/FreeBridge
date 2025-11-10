/**
 * sessionManager.js
 * Utilidades para gestionar la sesión de usuario en localStorage
 * Funciones puras sin dependencias de React
 */

// Claves de localStorage
const KEYS = {
  TOKEN: "token",
  USER_ROLE: "userRole",
  USER_ID: "userId",
  USER_NAME: "userName",
  LAST_ACTIVITY: "lastActivity",
};

/**
 * Obtiene el token de autenticación
 * @returns {string|null} Token o null si no existe
 */
export const getToken = () => {
  return localStorage.getItem(KEYS.TOKEN);
};

/**
 * Obtiene el rol del usuario
 * @returns {string|null} Rol del usuario o null
 */
export const getUserRole = () => {
  return localStorage.getItem(KEYS.USER_ROLE);
};

/**
 * Obtiene el ID del usuario
 * @returns {string|null} ID del usuario o null
 */
export const getUserId = () => {
  return localStorage.getItem(KEYS.USER_ID);
};

/**
 * Obtiene el nombre del usuario
 * @returns {string|null} Nombre del usuario o null
 */
export const getUserName = () => {
  return localStorage.getItem(KEYS.USER_NAME);
};

/**
 * Obtiene el timestamp de la última actividad
 * @returns {number|null} Timestamp en milisegundos o null
 */
export const getLastActivity = () => {
  const lastActivity = localStorage.getItem(KEYS.LAST_ACTIVITY);
  return lastActivity ? parseInt(lastActivity) : null;
};

/**
 * Establece el timestamp de la última actividad al momento actual
 */
export const setLastActivity = () => {
  localStorage.setItem(KEYS.LAST_ACTIVITY, Date.now().toString());
};

/**
 * Guarda los datos de sesión del usuario
 * @param {Object} sessionData - Datos de sesión
 * @param {string} sessionData.token - Token JWT
 * @param {string} sessionData.userRole - Rol del usuario
 * @param {string} sessionData.userId - ID del usuario
 * @param {string} sessionData.userName - Nombre del usuario
 */
export const setSessionData = ({ token, userRole, userId, userName }) => {
  localStorage.setItem(KEYS.TOKEN, token);
  localStorage.setItem(KEYS.USER_ROLE, userRole);
  localStorage.setItem(KEYS.USER_ID, userId);
  localStorage.setItem(KEYS.USER_NAME, userName);
  setLastActivity(); // Establece timestamp inicial
};

/**
 * Elimina todos los datos de sesión
 */
export const clearSession = () => {
  localStorage.removeItem(KEYS.TOKEN);
  localStorage.removeItem(KEYS.USER_ROLE);
  localStorage.removeItem(KEYS.USER_ID);
  localStorage.removeItem(KEYS.USER_NAME);
  localStorage.removeItem(KEYS.LAST_ACTIVITY);
};

/**
 * Verifica si existe una sesión activa
 * @returns {boolean} true si hay token, false si no
 */
export const hasActiveSession = () => {
  return !!getToken();
};

/**
 * Obtiene todos los datos de sesión
 * @returns {Object} Objeto con todos los datos de sesión
 */
export const getSessionData = () => {
  return {
    token: getToken(),
    userRole: getUserRole(),
    userId: getUserId(),
    userName: getUserName(),
    lastActivity: getLastActivity(),
  };
};

/**
 * Calcula el tiempo transcurrido desde la última actividad
 * @returns {number|null} Tiempo en milisegundos o null si no hay registro
 */
export const getTimeSinceLastActivity = () => {
  const lastActivity = getLastActivity();
  if (!lastActivity) return null;
  return Date.now() - lastActivity;
};
