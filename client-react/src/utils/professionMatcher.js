/**
 * Mapeo de profesiones a categorías de vacantes
 * Permite determinar qué tipo de vacantes son compatibles con cada profesión
 */
const PROFESSION_CATEGORIES = {
  // Desarrollo
  desarrollo: [
    "desarrollo",
    "developer",
    "programador",
    "web",
    "backend",
    "frontend",
    "fullstack",
    "mobile",
    "devops",
    "qa",
    "testing",
  ],
  desarrollador: [
    "desarrollo",
    "developer",
    "programador",
    "web",
    "backend",
    "frontend",
    "fullstack",
    "mobile",
    "devops",
    "qa",
    "testing",
  ],
  programador: [
    "desarrollo",
    "developer",
    "programador",
    "web",
    "backend",
    "frontend",
    "fullstack",
    "mobile",
    "devops",
    "qa",
    "testing",
  ],
  "ingeniero de software": [
    "desarrollo",
    "developer",
    "programador",
    "web",
    "backend",
    "frontend",
    "fullstack",
    "mobile",
    "devops",
    "qa",
    "testing",
  ],

  // Diseño
  diseño: [
    "diseño",
    "design",
    "ux",
    "ui",
    "grafico",
    "graphic",
    "ilustrador",
    "ilustration",
    "web designer",
  ],
  diseñador: [
    "diseño",
    "design",
    "ux",
    "ui",
    "grafico",
    "graphic",
    "ilustrador",
    "ilustration",
    "web designer",
  ],
  "diseñador gráfico": [
    "diseño",
    "design",
    "ux",
    "ui",
    "grafico",
    "graphic",
    "ilustrador",
    "ilustration",
    "web designer",
  ],
  "ui/ux": [
    "diseño",
    "design",
    "ux",
    "ui",
    "grafico",
    "graphic",
    "ilustrador",
    "ilustration",
    "web designer",
  ],
  ilustrador: [
    "diseño",
    "design",
    "ux",
    "ui",
    "grafico",
    "graphic",
    "ilustrador",
    "ilustration",
    "web designer",
  ],

  // Marketing
  marketing: [
    "marketing",
    "market",
    "social media",
    "community",
    "content",
    "seo",
    "publicidad",
    "advertising",
    "analista",
  ],
  especialista: [
    "marketing",
    "market",
    "social media",
    "community",
    "content",
    "seo",
    "publicidad",
    "advertising",
    "analista",
  ],
  "especialista en marketing": [
    "marketing",
    "market",
    "social media",
    "community",
    "content",
    "seo",
    "publicidad",
    "advertising",
    "analista",
  ],
  "community manager": [
    "marketing",
    "market",
    "social media",
    "community",
    "content",
    "seo",
    "publicidad",
    "advertising",
    "analista",
  ],
  copywriter: [
    "marketing",
    "market",
    "social media",
    "community",
    "content",
    "seo",
    "publicidad",
    "advertising",
    "analista",
  ],
  "content creator": [
    "marketing",
    "market",
    "social media",
    "community",
    "content",
    "seo",
    "publicidad",
    "advertising",
    "analista",
  ],

  // Data/Analytics
  datos: [
    "datos",
    "data",
    "analytics",
    "scientist",
    "bi",
    "business",
    "python",
    "sql",
  ],
  "data scientist": [
    "datos",
    "data",
    "analytics",
    "scientist",
    "bi",
    "business",
    "python",
    "sql",
  ],
  "data analyst": [
    "datos",
    "data",
    "analytics",
    "scientist",
    "bi",
    "business",
    "python",
    "sql",
  ],
  analista: [
    "datos",
    "data",
    "analytics",
    "scientist",
    "bi",
    "business",
    "python",
    "sql",
  ],

  // Escritura/Contenido
  escritor: [
    "escritura",
    "writing",
    "content",
    "blog",
    "copywriting",
    "redacción",
    "articulos",
  ],
  redactor: [
    "escritura",
    "writing",
    "content",
    "blog",
    "copywriting",
    "redacción",
    "articulos",
  ],
  editor: [
    "escritura",
    "writing",
    "content",
    "blog",
    "copywriting",
    "redacción",
    "articulos",
  ],
};

/**
 * Mapeo inverso: palabras clave en vacantes a categorías
 */
const VACANCY_KEYWORDS = {
  desarrollo: [
    // Palabras clave principales
    "desarrollo",
    "desarrollador",
    "developer",
    "programador",
    "programming",
    "programmer",
    // Web
    "web",
    "website",
    "backend",
    "backend developer",
    "frontend",
    "frontend developer",
    "fullstack",
    "full stack",
    // Mobile
    "mobile",
    "app",
    "aplicacion",
    "application",
    "android",
    "ios",
    "react native",
    "flutter",
    "swift",
    "kotlin",
    // Especialidades
    "devops",
    "qa",
    "testing",
    "test",
    "quality assurance",
    "codigo",
    "code",
    "software",
    "software engineer",
    "engineer",
    "ingenieria",
    "engineering",
    "api",
    "database",
    "datos",
    "python",
    "javascript",
    "java",
    "c++",
    "c#",
    "php",
    "ruby",
    "golang",
    "rust",
    "typescript",
    "nodejs",
    "node.js",
    "react",
    "angular",
    "vue",
    "sql",
    "mysql",
    "postgresql",
    "mongodb",
  ],
  diseño: [
    // Palabras clave principales
    "diseño",
    "diseñador",
    "design",
    "designer",
    "graphic",
    "graphics",
    "grafico",
    // UX/UI
    "ux",
    "ui",
    "user experience",
    "user interface",
    "uxui",
    "ux/ui",
    "interface",
    "experiencia",
    // Ilustración y arte
    "ilustrador",
    "ilustration",
    "illustration",
    "ilustrar",
    "digital art",
    "arte",
    "art",
    // Web Design
    "web designer",
    "web design",
    "website design",
    // Herramientas y estilos
    "figma",
    "adobe",
    "photoshop",
    "illustrator",
    "xd",
    "sketch",
    "creativo",
    "creative",
    "visual",
    "visual design",
    "branding",
    "marca",
    "logo",
    "icono",
    "icon",
    "prototipo",
    "prototype",
    "wireframe",
    "mockup",
    "layout",
    "colores",
    "tipografia",
    "typography",
  ],
  marketing: [
    // Palabras clave principales
    "marketing",
    "market",
    "especialista",
    "expert",
    // Social Media
    "social media",
    "redes sociales",
    "social",
    "community",
    "community manager",
    "social media manager",
    "instafram",
    "instagram",
    "facebook",
    "tiktok",
    // Contenido
    "content",
    "contenido",
    "content creator",
    "creador",
    "creator",
    "blog",
    "blogging",
    // SEO y SEM
    "seo",
    "sem",
    "search engine",
    "posicionamiento",
    // Publicidad
    "publicidad",
    "advertising",
    "ads",
    "advertisement",
    "campaña",
    "campaign",
    // Copywriting
    "copywriting",
    "copywriter",
    "copy",
    "redaccion",
    "redactor",
    // Estrategia
    "estrategia",
    "strategy",
    "digital marketing",
    "email marketing",
    "marketing digital",
    "promocion",
    "promotion",
    "promocional",
    "digital",
    "online",
    "web marketing",
    "analytics",
    "analisis",
    "analista",
  ],
  datos: [
    // Palabras clave principales
    "datos",
    "data",
    "analytics",
    "analista",
    "analyst",
    "data scientist",
    "scientist",
    "ciencia de datos",
    // Análisis
    "analysis",
    "analisis",
    "analysis",
    "reporting",
    "reportes",
    "informe",
    "insight",
    "insights",
    // Business Intelligence
    "bi",
    "business intelligence",
    "inteligencia de negocios",
    "inteligencia comercial",
    // Tecnologías
    "python",
    "r",
    "sql",
    "tableau",
    "power bi",
    "excel",
    "machine learning",
    "ml",
    "estadistica",
    "estadistica",
    "statistics",
    // Big Data
    "big data",
    "hadoop",
    "spark",
    "data warehouse",
    "database",
    "basedatos",
  ],
  escritura: [
    // Palabras clave principales
    "escritura",
    "writing",
    "escritor",
    "writer",
    "redaccion",
    "redactor",
    "redactora",
    "editor",
    "edicion",
    // Contenido
    "content",
    "contenido",
    "content writer",
    "content creator",
    // Blog y Artículos
    "blog",
    "blogging",
    "blogger",
    "articulo",
    "article",
    "post",
    "articulos",
    "articles",
    // Copywriting
    "copywriting",
    "copywriter",
    "copy",
    "publicidad",
    // SEO y Web
    "seo",
    "web content",
    "web writing",
    "landing page",
    // Libros y Publicación
    "libro",
    "book",
    "novel",
    "novela",
    "novela",
    "publicacion",
    "publication",
    // Redes Sociales
    "social media",
    "social content",
    "description",
    // Otras formas de escritura
    "transcripcion",
    "transcription",
    "resumen",
    "summary",
    "guion",
    "script",
    "corrector",
    "proofreading",
  ],
};

/**
 * Mapeo de profesiones a su categoría base
 */
const PROFESSION_TO_CATEGORY = {
  // Desarrollo
  desarrollo: "desarrollo",
  desarrollador: "desarrollo",
  programador: "desarrollo",
  "ingeniero de software": "desarrollo",
  developer: "desarrollo",
  "software engineer": "desarrollo",
  "web developer": "desarrollo",
  "backend developer": "desarrollo",
  "frontend developer": "desarrollo",
  fullstack: "desarrollo",
  mobile: "desarrollo",
  devops: "desarrollo",
  qa: "desarrollo",
  testing: "desarrollo",
  tester: "desarrollo",

  // Diseño
  diseño: "diseño",
  diseñador: "diseño",
  "diseñador gráfico": "diseño",
  "ui/ux": "diseño",
  ilustrador: "diseño",
  design: "diseño",
  "graphic designer": "diseño",
  "ux designer": "diseño",
  "ui designer": "diseño",
  ilustration: "diseño",

  // Marketing
  marketing: "marketing",
  especialista: "marketing",
  "especialista en marketing": "marketing",
  "community manager": "marketing",
  copywriter: "marketing",
  "content creator": "marketing",
  "social media manager": "marketing",
  seo: "marketing",
  publicidad: "marketing",

  // Data/Analytics
  datos: "datos",
  "data scientist": "datos",
  "data analyst": "datos",
  analista: "datos",
  analytics: "datos",
  "business intelligence": "datos",

  // Escritura/Contenido
  escritor: "escritura",
  redactor: "escritura",
  editor: "escritura",
  writer: "escritura",
  copywriting: "escritura",
  "content writer": "escritura",
};

/**
 * Determina la categoría profesional basada en la profesión del freelancer
 * @param {string} profession - La profesión del freelancer
 * @returns {string} La categoría principal (desarrollo, diseño, marketing, datos, escritura)
 */
export const getProfessionCategory = (profession) => {
  if (!profession) return null;

  const profLower = profession.toLowerCase().trim();

  // Búsqueda exacta primero en el nuevo mapeo
  if (PROFESSION_TO_CATEGORY[profLower]) {
    return PROFESSION_TO_CATEGORY[profLower];
  }

  // Buscar coincidencias en PROFESSION_CATEGORIES (para compatibilidad)
  if (PROFESSION_CATEGORIES[profLower]) {
    const categories = PROFESSION_CATEGORIES[profLower];
    // Retornar la categoría base del primer elemento
    return categories[0];
  }

  // Buscar coincidencias parciales
  for (const [key, categories] of Object.entries(PROFESSION_CATEGORIES)) {
    if (profLower.includes(key) || key.includes(profLower)) {
      return categories[0];
    }
  }

  // Búsqueda por palabras individuales
  const words = profLower.split(/[\s\-_,]/);
  for (const word of words) {
    const cleanWord = word.trim();
    if (cleanWord.length > 2) {
      if (PROFESSION_TO_CATEGORY[cleanWord]) {
        return PROFESSION_TO_CATEGORY[cleanWord];
      }

      if (PROFESSION_CATEGORIES[cleanWord]) {
        return PROFESSION_CATEGORIES[cleanWord][0];
      }

      for (const [key, categories] of Object.entries(PROFESSION_CATEGORIES)) {
        if (cleanWord.includes(key) || key.includes(cleanWord)) {
          return categories[0];
        }
      }
    }
  }

  // Si no hay coincidencia, retornar la profesión normalizada
  return profLower;
};

/**
 * Detecta la categoría de una vacante basada en su nombre y descripción
 * @param {Object} vacancy - Objeto de vacante con propiedades nombre, descripcion, requisitos
 * @returns {string} La categoría detectada
 */
export const detectVacancyCategory = (vacancy) => {
  if (!vacancy) return null;

  // Manejar ambas propiedades: nomb_vacante y nombre
  const vacancyName = vacancy.nomb_vacante || vacancy.nombre || "";
  const searchText = `${vacancyName} ${vacancy.descripcion || ""} ${
    vacancy.requisitos || ""
  }`.toLowerCase();

  // Contar coincidencias por categoría
  const categoryScores = {};

  for (const [category, keywords] of Object.entries(VACANCY_KEYWORDS)) {
    categoryScores[category] = keywords.filter((keyword) =>
      searchText.includes(keyword)
    ).length;
  }

  // Retornar la categoría con mayor puntuación
  const topCategory = Object.entries(categoryScores).reduce(
    (max, [category, score]) => (score > max[1] ? [category, score] : max),
    [null, 0]
  );

  const result = topCategory[0] || "otro";
  return result;
};

/**
 * Verifica si la categoría de la vacante es compatible con la profesión del freelancer
 * @param {string} freelancerProfession - Profesión del freelancer
 * @param {Object} vacancy - Objeto de vacante
 * @returns {boolean} True si son compatibles, False si no
 */
export const isVacancyCompatible = (freelancerProfession, vacancy) => {
  const profCategory = getProfessionCategory(freelancerProfession);
  const vacancyCategory = detectVacancyCategory(vacancy);

  if (!profCategory || !vacancyCategory) {
    // Si no se puede determinar, asumir que es compatible
    return true;
  }

  // Normalizar para comparación
  const profCatLower = profCategory.toLowerCase();
  const vacCatLower = vacancyCategory.toLowerCase();

  // Verificar si son exactamente la misma categoría
  if (profCatLower === vacCatLower) {
    return true;
  }

  // Verificar si una contiene a la otra (para subcategorías)
  if (
    profCatLower.includes(vacCatLower) ||
    vacCatLower.includes(profCatLower)
  ) {
    return true;
  }

  return false;
};

/**
 * Obtiene un mensaje descriptivo sobre la compatibilidad
 * @param {string} freelancerProfession - Profesión del freelancer
 * @param {Object} vacancy - Objeto de vacante
 * @returns {Object} { isCompatible, message, freelancerCategory, vacancyCategory }
 */
export const getCompatibilityMessage = (freelancerProfession, vacancy) => {
  const freelancerCategory = getProfessionCategory(freelancerProfession);
  const vacancyCategory = detectVacancyCategory(vacancy);
  const isCompatible = isVacancyCompatible(freelancerProfession, vacancy);

  let message = "";
  if (!isCompatible) {
    message = `Tu perfil es de ${freelancerCategory}, pero esta vacante es para ${vacancyCategory}. ¿Deseas continuar de todas formas?`;
  }

  return {
    isCompatible,
    message,
    freelancerCategory,
    vacancyCategory,
  };
};
