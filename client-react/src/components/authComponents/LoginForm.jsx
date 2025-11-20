import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { loginUser } from "../../api/authApi.js";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import styles from "../../styles/modules_forms/LoginForm.module.css";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Obtiene la función login del contexto de autenticación
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await loginUser({ email, password });

      // Usar el método login del contexto para guardar la sesión
      if (res.usuario) {
        login({
          token: res.token || "token-placeholder",
          userRole: res.usuario.rol,
          userName: res.usuario.nombre,
          userId: res.usuario.id,
        });

        // Redirigir según el rol
        if (res.usuario.rol === "Empresa") {
          navigate("/company-dashboard");
        } else {
          navigate("/freelance-dashboard");
        }
      }
    } catch (error) {
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
            <div className={styles.passwordContainer}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={styles.input}
              />
              <button
                type="button"
                className={styles.togglePassword}
                onClick={() => setShowPassword(!showPassword)}
                aria-label={
                  showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                }
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {/* Botón de submit */}
            <button type="submit" className={styles.submitButton}>
              Iniciar Sesión
            </button>

            {/* Enlace para recuperar contraseña */}
            <p
              className={styles.footerText}
              style={{ textAlign: "center", marginTop: "0.5rem" }}
            >
              <a href="/forgot-password" className={styles.link}>
                ¿Olvidaste tu contraseña?
              </a>
            </p>

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
