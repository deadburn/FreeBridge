import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("userRole");
    setIsAuthenticated(!!token);
    setUserRole(role);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    setIsAuthenticated(false);
    setUserRole(null);
    navigate("/");
  };

  const handleProfileClick = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    switch (userRole) {
      case "Empresa":
        navigate("/company-dashboard");
        break;
      case "Freelancer":
        navigate("/freelancer-dashboard");
        break;
      default:
        navigate("/perfil");
    }
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.BotonInicio}>
        <Link to="/">Inicio</Link>
      </div>

      <Link to="/vacantes">Vacantes</Link>

      {!isAuthenticated ? (
        <>
          <Link to="/login">Iniciar Sesión</Link>
          <Link to="/register">Registrarse</Link>
        </>
      ) : (
        <>
          <button onClick={handleProfileClick} className={styles.navLink}>
            Perfil
          </button>
          <button onClick={handleLogout} className={styles.navLink}>
            Cerrar Sesión
          </button>
        </>
      )}
    </nav>
  );
}
