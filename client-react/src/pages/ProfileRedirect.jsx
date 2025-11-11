import React from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * ProfileRedirect
 * Componente que redirige automáticamente al dashboard correspondiente
 * según el rol del usuario autenticado
 */
export default function ProfileRedirect() {
  const { isAuthenticated, userRole, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Esperar a que termine de cargar
    if (isLoading) return;

    // Si no está autenticado, redirigir a login
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    // Redirigir según el rol
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
  }, [isAuthenticated, userRole, isLoading, navigate]);

  // Mostrar loading mientras redirige
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        flexDirection: "column",
        gap: "1rem",
      }}
    >
      <div
        style={{
          width: "40px",
          height: "40px",
          border: "4px solid #f3f3f3",
          borderTop: "4px solid #16a085",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
        }}
      ></div>
      <p>Redirigiendo...</p>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
