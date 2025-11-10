import React from "react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { useSessionTimeout } from "./hooks/useSessionTimeout";
import AppRouter from "./router/appRouter.jsx";
import "./index.css";

/**
 * Componente interno que usa el hook de session timeout
 * Debe estar dentro del AuthProvider para tener acceso al contexto
 */
function AppContent() {
  // Hook que maneja la expiración de sesión por inactividad
  // Se ejecuta automáticamente cuando hay una sesión activa
  useSessionTimeout(30 * 60 * 1000); // 30 minutos de inactividad

  return (
    <div className="app">
      <AppRouter />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      {/* AuthProvider envuelve toda la app para proporcionar contexto de autenticación */}
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
