import VacancyList from "../components/VacancyList.jsx";
import VacancyForm from "../components/vacancyForm.jsx";

export default function Vacancies() {
  return (
    <div>
      <VacancyForm />
      <hr />
      <VacancyList />
    </div>
  );
}
