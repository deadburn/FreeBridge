import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { forgotPassword } from "../api/authApi";
import styles from "../styles/modules_forms/LoginForm.module.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const response = await forgotPassword(email);
      setMessage(response.message);

      // Limpiar el formulario
      setEmail("");

      // Redirigir a login después de 5 segundos
      setTimeout(() => {
        navigate("/login");
      }, 5000);
    } catch (error) {
      console.error("Error al solicitar recuperación:", error);
      setError(
        error.response?.data?.error ||
          "Error al procesar la solicitud. Intenta nuevamente."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.heroSection}>
      <div className={styles.formCard}>
        <h2 className={styles.headerForm}>Recuperar Contraseña</h2>
        <p
          style={{
            textAlign: "center",
            color: "#7f8c8d",
            marginBottom: "1.5rem",
          }}
        >
          Ingresa tu correo electrónico y te enviaremos un enlace para
          restablecer tu contraseña.
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
              </div>
            )}

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
              disabled={loading}
            />

            {/* Botón de submit */}
            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading}
              style={{ opacity: loading ? 0.6 : 1 }}
            >
              {loading ? "Enviando..." : "Enviar Enlace de Recuperación"}
            </button>

            {/* Enlace para volver al login */}
            <p className={styles.footerText}>
              ¿Recordaste tu contraseña?{" "}
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
