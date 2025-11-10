/**
 * useSessionTimeout.js
 * Hook personalizado para gestionar la expiración de sesión por inactividad
 * Detecta actividad del usuario y cierra sesión automáticamente después de un período de inactividad
 */

import { useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import {
  getLastActivity,
  setLastActivity,
  getTimeSinceLastActivity,
  hasActiveSession,
} from "../utils/sessionManager";

/**
 * Hook que implementa el sistema de timeout de sesión
 * @param {number} inactivityTime - Tiempo de inactividad en milisegundos (por defecto 30 minutos)
 */
export const useSessionTimeout = (inactivityTime = 30 * 60 * 1000) => {
  const { isAuthenticated, logout } = useAuth();

  /**
   * Actualiza el timestamp de última actividad
   * Solo se ejecuta si hay una sesión activa
   */
  const updateActivity = useCallback(() => {
    if (isAuthenticated && hasActiveSession()) {
      setLastActivity();
    }
  }, [isAuthenticated]);

  /**
   * Verifica si la sesión ha expirado por inactividad
   * Cierra sesión automáticamente si ha pasado el tiempo límite
   */
  const checkExpiration = useCallback(() => {
    // Solo verifica si hay una sesión activa
    if (!hasActiveSession()) {
      return;
    }

    const lastActivity = getLastActivity();

    // Si hay token pero no hay timestamp, es la primera vez - establece el timestamp
    if (!lastActivity) {
      setLastActivity();
      return;
    }

    // Calcula el tiempo transcurrido desde la última actividad
    const timeSinceActivity = getTimeSinceLastActivity();

    // Si ha excedido el tiempo de inactividad, cierra sesión
    if (timeSinceActivity !== null && timeSinceActivity > inactivityTime) {
      alert(
        "Tu sesión ha expirado por inactividad. Por favor, inicia sesión nuevamente."
      );
      logout(true); // Cierra sesión y redirige
    }
  }, [inactivityTime, logout]);

  /**
   * useEffect: Detecta actividad del usuario y verifica expiración
   * Solo se activa cuando el usuario está autenticado
   */
  useEffect(() => {
    // No hacer nada si no hay sesión activa
    if (!isAuthenticated) {
      return;
    }

    // Establece timestamp inicial si es la primera vez
    if (!getLastActivity()) {
      setLastActivity();
    }

    // Eventos que indican actividad del usuario
    const activityEvents = [
      "mousedown", // Clic del mouse
      "keydown", // Tecla presionada
      "scroll", // Desplazamiento de página
      "touchstart", // Toque en pantalla táctil
      "click", // Clic general
      "mousemove", // Movimiento del mouse (cada ciertos movimientos)
    ];

    // Agregar listeners para cada evento
    activityEvents.forEach((event) => {
      window.addEventListener(event, updateActivity);
    });

    // Verificar expiración cada 1 minuto
    const checkInterval = setInterval(checkExpiration, 60000);

    // Verificar inmediatamente al montar
    checkExpiration();

    // Limpieza: Remover listeners e intervalos al desmontar
    return () => {
      activityEvents.forEach((event) => {
        window.removeEventListener(event, updateActivity);
      });
      clearInterval(checkInterval);
    };
  }, [isAuthenticated, updateActivity, checkExpiration]);

  // Hook no retorna nada, solo efectos secundarios
  return null;
};
