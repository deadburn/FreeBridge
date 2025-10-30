export default function VacancyCard({ vacante }) {
  return (
    <div className="border rounded-lg p-3 mb-2 shadow">
      <h3>{vacante.titulo}</h3>
      <p>{vacante.descripcion}</p>
      <small>{vacante.empresa}</small>
    </div>
  );
}
