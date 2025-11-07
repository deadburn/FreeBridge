import React from "react";
import { useState } from "react";
import { loginUser } from "../api/authApi.js";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await loginUser({ email, password });
      console.log("Login response:", res);

      // Guardar información del usuario
      if (res.usuario) {
        localStorage.setItem("userRole", res.usuario.rol);
        localStorage.setItem("userName", res.usuario.nombre);
        localStorage.setItem("userId", res.usuario.id);
      }

      // Aquí puedes redirigir según el rol
      if (res.usuario.rol === "Empresa") {
        // navigate('/dashboard-empresa');
        alert("Bienvenido al panel de Empresa");
      } else {
        // navigate('/dashboard-freelancer');
        alert("Bienvenido al panel de Freelancer");
      }
    } catch (error) {
      console.error("Error en login:", error);
      alert(error.response?.data?.error || "Error al iniciar sesión");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Iniciar Sesión</h2>
      <input
        type="email"
        placeholder="Correo"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Entrar</button>
    </form>
  );
}
