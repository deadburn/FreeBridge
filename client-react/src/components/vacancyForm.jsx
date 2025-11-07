import React from "react";
import { useState } from "react";
import { crearVacante } from "../api/vacancyApi.js";

export default function VacancyForm() {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await crearVacante({ titulo, descripcion });
    alert("Vacante creada correctamente");
    setTitulo("");
    setDescripcion("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Crear Vacante</h2>
      <input
        type="text"
        placeholder="Título"
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
        required
      />
      <textarea
        placeholder="Descripción"
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
        required
      />
      <button type="submit">Crear</button>
    </form>
  );
}
