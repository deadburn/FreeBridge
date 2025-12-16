// Test script for professionMatcher logic
// Run in the browser console or with Node.js

const PROFESSION_TO_CATEGORY = {
  desarrollo: "desarrollo",
  desarrollador: "desarrollo",
  programador: "desarrollo",
  diseño: "diseño",
  diseñador: "diseño",
  marketing: "marketing",
  datos: "datos",
  escritor: "escritura",
};

const VACANCY_KEYWORDS = {
  desarrollo: ["desarrollo", "developer", "programador", "web", "backend"],
  diseño: ["diseño", "design", "ux", "ui", "grafico"],
  marketing: ["marketing", "social media", "content", "seo"],
  datos: ["datos", "data", "analytics", "scientist"],
  escritura: ["escritura", "writing", "content", "blog"],
};

function getProfessionCategory(profession) {
  if (!profession) return null;
  const profLower = profession.toLowerCase().trim();
  return PROFESSION_TO_CATEGORY[profLower] || profLower;
}

function detectVacancyCategory(vacancyName) {
  const searchText = vacancyName.toLowerCase();
  for (const [category, keywords] of Object.entries(VACANCY_KEYWORDS)) {
    const matches = keywords.filter((keyword) =>
      searchText.includes(keyword)
    ).length;
    if (matches > 0) {
      return category;
    }
  }
  return "otro";
}

function isCompatible(freelancerProf, vacancyName) {
  const profCat = getProfessionCategory(freelancerProf);
  const vacCat = detectVacancyCategory(vacancyName);
  return profCat === vacCat;
}

// Test cases
console.log("=== TEST 1: Desarrollador + Desarrollo ===");
console.log(
  "Freelancer: desarrollador -> Category:",
  getProfessionCategory("desarrollador")
);
console.log(
  "Vacancy: Desarrollador Web -> Category:",
  detectVacancyCategory("Desarrollador Web")
);
console.log("Compatible?", isCompatible("desarrollador", "Desarrollador Web"));
console.log("Expected: true (no modal)\n");

console.log("=== TEST 2: Diseñador + Desarrollo ===");
console.log(
  "Freelancer: diseñador -> Category:",
  getProfessionCategory("diseñador")
);
console.log(
  "Vacancy: Desarrollador Web -> Category:",
  detectVacancyCategory("Desarrollador Web")
);
console.log("Compatible?", isCompatible("diseñador", "Desarrollador Web"));
console.log("Expected: false (show modal)\n");

console.log("=== TEST 3: Desarrollador + Diseño ===");
console.log(
  "Freelancer: desarrollador -> Category:",
  getProfessionCategory("desarrollador")
);
console.log(
  "Vacancy: Diseñador UX/UI -> Category:",
  detectVacancyCategory("Diseñador UX/UI")
);
console.log("Compatible?", isCompatible("desarrollador", "Diseñador UX/UI"));
console.log("Expected: false (show modal)\n");

console.log("=== TEST 4: Especialista Marketing + Marketing ===");
console.log(
  "Freelancer: especialista -> Category:",
  getProfessionCategory("especialista")
);
console.log(
  "Vacancy: Community Manager -> Category:",
  detectVacancyCategory("Community Manager")
);
console.log("Compatible?", isCompatible("especialista", "Community Manager"));
console.log("Expected: depends on mapping\n");
