import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
      <Link to="/">Inicio</Link>
      <Link to="/login">Iniciar Sesión</Link>
      <Link to="/register">Registrarse</Link>
      <Link to="/vacantes">Vacantes</Link>
      <Link to="/perfil">Perfil</Link>
    </nav>
  );
}
