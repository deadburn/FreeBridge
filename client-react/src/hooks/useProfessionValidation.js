import { useState, useCallback } from "react";
import {
  getCompatibilityMessage,
  isVacancyCompatible,
} from "../utils/professionMatcher";

/**
 * Hook para manejar la validación de compatibilidad entre profesión y vacante
 * Retorna el estado y funciones para mostrar/manejar el modal de alerta
 */
export function useProfessionValidation(freelancerProfession) {
  const [showMismatchModal, setShowMismatchModal] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [currentVacancy, setCurrentVacancy] = useState(null);

  /**
   * Valida si la vacante es compatible con la profesión
   * Si no lo es, muestra el modal en lugar de continuar directamente
   * @param {Object} vacancy - La vacante a validar
   * @param {Function} onContinue - Callback si el usuario continúa
   */
  const validateAndProceed = useCallback(
    (vacancy, onContinue) => {
      try {
        const compatible = isVacancyCompatible(freelancerProfession, vacancy);

        if (compatible) {
          // Si es compatible, continuar directamente
          onContinue();
        } else {
          // Si no es compatible, mostrar modal
          setCurrentVacancy(vacancy);
          setPendingAction(() => onContinue);
          setShowMismatchModal(true);
        }
      } catch (error) {
        console.error("❌ Error en validateAndProceed:", error);
        // En caso de error, permitir continuar
        if (typeof onContinue === "function") {
          onContinue();
        }
      }
    },
    [freelancerProfession]
  );

  /**
   * El usuario continuó a pesar de la incompatibilidad
   */
  const handleContinueAnyway = useCallback(() => {
    console.log("✓ Usuario continuó a pesar de incompatibilidad");
    setShowMismatchModal(false);
    if (pendingAction && typeof pendingAction === "function") {
      console.log("   Ejecutando callback pendiente...");
      pendingAction();
    } else {
      console.warn("   No hay callback pendiente válido:", pendingAction);
    }
    setPendingAction(null);
    setCurrentVacancy(null);
  }, [pendingAction]);

  /**
   * El usuario canceló la acción
   */
  const handleCancel = useCallback(() => {
    setShowMismatchModal(false);
    setPendingAction(null);
    setCurrentVacancy(null);
  }, []);

  /**
   * Obtiene el mensaje de compatibilidad para la vacante actual
   */
  const getMessageForCurrentVacancy = useCallback(() => {
    if (!currentVacancy) return null;
    return getCompatibilityMessage(freelancerProfession, currentVacancy);
  }, [currentVacancy, freelancerProfession]);

  return {
    showMismatchModal,
    currentVacancy,
    validateAndProceed,
    handleContinueAnyway,
    handleCancel,
    getMessageForCurrentVacancy,
  };
}
