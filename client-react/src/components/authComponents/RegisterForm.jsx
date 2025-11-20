import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../api/authApi.js";
import Modal from "../commonComponents/Modal.jsx";
import TermsAndConditions from "../commonComponents/TermsAndConditions.jsx";
import PrivacyPolicy from "../commonComponents/PrivacyPolicy.jsx";
import SuccessModal from "../commonComponents/SuccessModal.jsx";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import styles from "../../styles/modules_forms/RegisterForm.module.css";

export default function RegisterForm() {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  // Estados para controlar los modales
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [registeredUserName, setRegisteredUserName] = useState("");

  const ROLES = {
    FREELANCER: "freelancer",
    EMPRESA: "empresa",
  };
  const [rol, setRol] = useState(ROLES.FREELANCER);

  // Validar coincidencia de contraseñas
  const handlePasswordChange = (value) => {
    setPassword(value);
    if (confirmPassword && value !== confirmPassword) {
      setPasswordsMatch(false);
    } else {
      setPasswordsMatch(true);
    }
  };

  const handleConfirmPasswordChange = (value) => {
    setConfirmPassword(value);
    if (password && value !== password) {
      setPasswordsMatch(false);
    } else {
      setPasswordsMatch(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar que se aceptaron los términos
    if (!acceptTerms) {
      alert("Debes aceptar los Términos y Condiciones para continuar");
      return;
    }

    // Validar que las contraseñas coincidan
    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    try {
      const response = await registerUser({
        nombre,
        email,
        password,
        rol,
      });

      // Guardar nombre del usuario y mostrar modal de éxito
      setRegisteredUserName(nombre);
      setShowSuccessModal(true);
    } catch (error) {
      alert(
        "Error al registrar usuario: " +
          (error.response?.data?.message ||
            error.message ||
            "Intenta nuevamente")
      );
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    // Limpiar formulario
    setNombre("");
    setEmail("");
    setPassword("");
    setAcceptTerms(false);
    setRol(ROLES.FREELANCER);
    // Navegar a login
    navigate("/login");
  };

  return (
    <div className={styles.heroSection}>
      {/* Card contenedor del formulario */}
      <div className={styles.formCard}>
        <h2 className={styles.headerForm}>Crear Cuenta</h2>

        <form onSubmit={handleSubmit}>
          <div className={styles.inputsContainer}>
            {/* Campo de nombre */}
            <input
              type="text"
              placeholder="Nombre Freelancer o Empresa"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />

            {/* Campo de email */}
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            {/* Campo de contraseña */}
            <div className={styles.passwordContainer}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Contraseña"
                value={password}
                onChange={(e) => handlePasswordChange(e.target.value)}
                className={
                  !passwordsMatch && password && confirmPassword
                    ? styles.inputError
                    : ""
                }
                required
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

            {/* Campo de confirmación de contraseña */}
            <div className={styles.passwordContainer}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirmar Contraseña"
                value={confirmPassword}
                onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                className={
                  !passwordsMatch && password && confirmPassword
                    ? styles.inputError
                    : ""
                }
                required
              />
              <button
                type="button"
                className={styles.togglePassword}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={
                  showConfirmPassword
                    ? "Ocultar contraseña"
                    : "Mostrar contraseña"
                }
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {/* Mensaje de error si las contraseñas no coinciden */}
            {!passwordsMatch && password && confirmPassword && (
              <div className={styles.passwordError}>
                Las contraseñas no coinciden
              </div>
            )}

            {/* Divisor para sección de roles */}
            <p className={styles.roleDivider}>Selecciona tu tipo de cuenta</p>

            {/* Opciones de rol */}
            <div className={styles.roleContainer}>
              <label className={styles.roleLabel}>
                <input
                  type="radio"
                  name="rol"
                  value={ROLES.FREELANCER}
                  checked={rol === ROLES.FREELANCER}
                  onChange={() => setRol(ROLES.FREELANCER)}
                />
                Freelancer
              </label>

              <label className={styles.roleLabel}>
                <input
                  type="radio"
                  name="rol"
                  value={ROLES.EMPRESA}
                  checked={rol === ROLES.EMPRESA}
                  onChange={() => setRol(ROLES.EMPRESA)}
                />
                Empresa
              </label>
            </div>

            {/* Checkbox de términos y condiciones con enlaces a modales */}
            <div className={styles.termsContainer}>
              <label className={styles.termsLabel}>
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  required
                />
                <span>
                  Acepto los{" "}
                  <button
                    type="button"
                    className={styles.linkButton}
                    onClick={() => setShowTermsModal(true)}
                  >
                    Términos y Condiciones
                  </button>{" "}
                  y la{" "}
                  <button
                    type="button"
                    className={styles.linkButton}
                    onClick={() => setShowPrivacyModal(true)}
                  >
                    Política de Privacidad
                  </button>
                </span>
              </label>
              <span>
                Si ya tienes una cuenta{" "}
                <button
                  type="button"
                  className={styles.linkButton}
                  onClick={() => navigate("/login")}
                >
                  Inicia Sesión
                </button>
              </span>
            </div>

            {/* Botón de submit */}
            <button type="submit" className={styles.submitButton}>
              Registrarse
            </button>
          </div>
        </form>
      </div>

      {/* Modales para Términos y Condiciones */}
      <Modal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
        title="Términos y Condiciones"
      >
        <TermsAndConditions />
      </Modal>

      {/* Modal para Política de Privacidad */}
      <Modal
        isOpen={showPrivacyModal}
        onClose={() => setShowPrivacyModal(false)}
        title="Política de Privacidad"
      >
        <PrivacyPolicy />
      </Modal>

      {/* Modal de registro exitoso */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleSuccessModalClose}
        userName={registeredUserName}
      />
    </div>
  );
}
