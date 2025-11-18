import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { resetPassword } from "../api/authApi.js";
import styles from "../styles/modules_forms/LoginForm.module.css";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Obtener el token de los parámetros de la URL
    const tokenParam = searchParams.get("token");
    if (!tokenParam) {
      setError("Token inválido o faltante");
    } else {
      setToken(tokenParam);
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    // Validaciones
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (!token) {
      setError("Token inválido");
      return;
    }

    setLoading(true);

    try {
      const response = await resetPassword(token, password);
      setMessage(response.message);

      // Limpiar el formulario
      setPassword("");
      setConfirmPassword("");

      // Redirigir a login después de 3 segundos
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error) {
      console.error("Error al restablecer contraseña:", error);
      setError(
        error.response?.data?.error ||
          "Error al restablecer la contraseña. El enlace puede haber expirado."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.heroSection}>
      <div className={styles.formCard}>
        <h2 className={styles.headerForm}>Restablecer Contraseña</h2>
        <p
          style={{
            textAlign: "center",
            color: "#7f8c8d",
            marginBottom: "1.5rem",
          }}
        >
          Ingresa tu nueva contraseña
        </p>

        <form onSubmit={handleSubmit}>
          <div className={styles.inputsContainer}>
            {/* Mensaje de éxito */}
            {message && (
              <div
                style={{
                  backgroundColor: "#d4edda",
                  color: "#155724",
                  padding: "0.875rem",
                  borderRadius: "8px",
                  borderLeft: "4px solid #28a745",
                  fontSize: "0.95rem",
                  textAlign: "center",
                }}
              >
                {message}
                <br />
                <small>Redirigiendo al inicio de sesión...</small>
              </div>
            )}

            {/* Mensaje de error */}
            {error && <div className={styles.errorMessage}>{error}</div>}

            {/* Campo de nueva contraseña */}
            <input
              type="password"
              placeholder="Nueva contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className={styles.input}
              disabled={loading || !token}
            />

            {/* Campo de confirmar contraseña */}
            <input
              type="password"
              placeholder="Confirmar contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              className={styles.input}
              disabled={loading || !token}
            />

            {/* Indicador de requisitos de contraseña */}
            <div
              style={{
                fontSize: "0.85rem",
                color: "#7f8c8d",
                marginTop: "-0.5rem",
              }}
            >
              La contraseña debe tener al menos 6 caracteres
            </div>

            {/* Botón de submit */}
            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading || !token}
              style={{ opacity: loading || !token ? 0.6 : 1 }}
            >
              {loading ? "Guardando..." : "Restablecer Contraseña"}
            </button>

            {/* Enlace para volver al login */}
            <p className={styles.footerText}>
              ¿Ya tienes acceso?{" "}
              <a href="/login" className={styles.link}>
                Iniciar sesión
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
