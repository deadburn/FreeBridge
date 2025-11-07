import React from "react";
import { Link } from "react-router-dom";
import styles from "./Navbar.module.css";

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.BotonInicio}>
        <Link to="/">Inicio</Link>
      </div>
      <Link to="/login">Iniciar Sesión</Link>
      <Link to="/register">Registrarse</Link>
      <Link to="/vacantes">Vacantes</Link>
      <Link to="/perfil">Perfil</Link>
    </nav>
  );
}
