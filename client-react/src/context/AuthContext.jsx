/**
 * AuthContext.jsx
 * Context API para manejar el estado de autenticación global
 * Proporciona estado y métodos de autenticación a toda la aplicación
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom";
import {
  getToken,
  getUserRole,
  getUserId,
  getUserName,
  setSessionData,
  clearSession,
  hasActiveSession,
} from "../utils/sessionManager";

// Crear el contexto de autenticación
const AuthContext = createContext(null);

/**
 * Hook personalizado para usar el contexto de autenticación
 * @returns {Object} Estado y métodos de autenticación
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
};

/**
 * Provider del contexto de autenticación
 * Envuelve la aplicación y proporciona estado global de autenticación
 */
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  /**
   * Verifica y carga el estado de autenticación desde localStorage
   */
  const checkAuth = useCallback(() => {
    const token = getToken();
    const role = getUserRole();
    const id = getUserId();
    const name = getUserName();

    setIsAuthenticated(hasActiveSession());
    setUserRole(role);
    setUserId(id);
    setUserName(name);
    setIsLoading(false);
  }, []);

  /**
   * Inicia sesión y guarda los datos del usuario
   * @param {Object} userData - Datos del usuario
   */
  const login = useCallback((userData) => {
    setSessionData(userData);
    setIsAuthenticated(true);
    setUserRole(userData.userRole);
    setUserId(userData.userId);
    setUserName(userData.userName);
  }, []);

  /**
   * Cierra la sesión del usuario y limpia todos los datos
   * @param {boolean} redirect - Si debe redirigir a home después del logout
   */
  const logout = useCallback(
    (redirect = true) => {
      clearSession();
      setIsAuthenticated(false);
      setUserRole(null);
      setUserId(null);
      setUserName(null);

      if (redirect) {
        navigate("/");
      }
    },
    [navigate]
  );

  /**
   * Navega al dashboard correspondiente según el rol del usuario
   */
  const navigateToProfile = useCallback(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    switch (userRole) {
      case "Empresa":
        navigate("/company-dashboard");
        break;
      case "FreeLancer":
        navigate("/freelance-dashboard");
        break;
      default:
        navigate("/login");
    }
  }, [isAuthenticated, userRole, navigate]);

  // Verifica autenticación al montar el componente
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Valor del contexto que se proporciona a los componentes hijos
  const value = {
    // Estado
    isAuthenticated,
    userRole,
    userId,
    userName,
    isLoading,

    // Métodos
    login,
    logout,
    checkAuth,
    navigateToProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
