import React, { useState } from "react";
import { registerUser } from "../api/authApi.js";

export default function RegisterForm() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const ROLES = {
    FREELANCER: "freelancer",
    EMPRESA: "empresa",
  };
  const [rol, setRol] = useState(ROLES.FREELANCER);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Form data being sent:", {
        nombre,
        email,
        password,
        rol,
      });

      const response = await registerUser({
        nombre,
        email,
        password,
        rol,
      });

      console.log("Registration successful:", response);
      // ...handle success...
    } catch (error) {
      console.error("Registration failed:", error);
      // ...handle error...
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Registro</h2>
      <input
        type="text"
        placeholder="Nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        required
      />
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
      <label>
        <input
          type="radio"
          name="rol"
          value={ROLES.FREELANCER}
          checked={rol === ROLES.FREELANCER}
          onChange={() => setRol(ROLES.FREELANCER)}
        />
        Freelancer
      </label>
      <label>
        <input
          type="radio"
          name="rol"
          value={ROLES.EMPRESA}
          checked={rol === ROLES.EMPRESA}
          onChange={() => setRol(ROLES.EMPRESA)}
        />
        Empresa
      </label>
      <button type="submit">Registrar</button>
    </form>
  );
}
