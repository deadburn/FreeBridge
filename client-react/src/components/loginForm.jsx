import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { loginUser } from "../api/authApi.js";
import styles from "../styles/loginForm.module.css";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Obtiene la función login del contexto de autenticación
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await loginUser({ email, password });
      console.log("Login response:", res);

      // Usar el método login del contexto para guardar la sesión
      if (res.usuario) {
        login({
          token: res.token || "token-placeholder", // Asegúrate de que el backend envíe el token
          userRole: res.usuario.rol,
          userName: res.usuario.nombre,
          userId: res.usuario.id,
        });

        // Redirigir según el rol
        if (res.usuario.rol === "Empresa") {
          navigate("/company-dashboard");
        } else {
          navigate("/freelancer-dashboard");
        }
      }
    } catch (error) {
      console.error("Error en login:", error);
      setError(error.response?.data?.error || "Error al iniciar sesión");
    }
  };

  return (
    <div className={styles.heroSection}>
      {/* Card contenedor del formulario */}
      <div className={styles.formCard}>
        <h2 className={styles.headerForm}>Iniciar Sesión</h2>

        <form onSubmit={handleSubmit}>
          <div className={styles.inputsContainer}>
            {/* Mensaje de error */}
            {error && <div className={styles.errorMessage}>{error}</div>}

            {/* Campo de email */}
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={styles.input}
            />

            {/* Campo de contraseña */}
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={styles.input}
            />

            {/* Botón de submit */}
            <button type="submit" className={styles.submitButton}>
              Iniciar Sesión
            </button>

            {/* Enlace a registro */}
            <p className={styles.footerText}>
              ¿No tienes una cuenta?{" "}
              <a href="/register" className={styles.link}>
                Regístrate aquí
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
