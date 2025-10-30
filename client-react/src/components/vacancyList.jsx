import { useEffect, useState } from "react";
import { getVacantes } from "../api/vacancyApi.js";
import VacancyCard from "./vacancyCard.jsx";

export default function VacancyList() {
  const [vacantes, setVacantes] = useState([]);

  useEffect(() => {
    getVacantes().then(setVacantes).catch(console.error);
  }, []);

  return (
    <div>
      <h2>Vacantes disponibles</h2>
      {vacantes.length === 0 ? (
        <p>No hay vacantes disponibles.</p>
      ) : (
        vacantes.map((v) => <VacancyCard key={v.id} vacante={v} />)
      )}
    </div>
  );
}
