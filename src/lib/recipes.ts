export interface RecipeStep {
  id: string;
  title: string;
  description: string;
  cards: string[];
  activity: string; // qué hace el usuario en este paso
  output: string; // resultado que produce y se reutiliza en pasos posteriores
  usesOutputsOf?: string[];
}

export interface Recipe {
  id: string;
  name: string;
  goal: string;
  steps: RecipeStep[];
}

export const RECIPES: Recipe[] = [
  {
    id: "carta-de-ventas",
    name: "Escribir una carta de ventas",
    goal: "Redactar una carta de ventas completa, desde la investigación hasta la revisión final.",
    steps: [
      { id: "s1", title: "Investigar al cliente", description: "Recoge su lenguaje, problemas, deseos y objeciones.", activity: "Completa el ejercicio de D01 con frases reales y anota el problema, deseo y objeciones principales.", cards: ["D01", "D02", "D03", "D05"], output: "Banco de frases y mapa de objeciones" },
      { id: "s2", title: "Reunir pruebas y contexto", description: "Inventaria evidencias y analiza la competencia.", activity: "Haz una lista de pruebas verificables y de lo que dicen 2–3 competidores.", cards: ["D06", "D07"], output: "Lista de pruebas y diferenciadores" },
      { id: "s3", title: "Definir la estrategia", description: "Promesa, gran idea y mecanismo.", activity: "Redacta la promesa en una frase y el concepto que organiza la carta.", cards: ["E01", "E02", "E03"], output: "Promesa y concepto central", usesOutputsOf: ["s1", "s2"] },
      { id: "s4", title: "Estructurar el argumento", description: "Ordena las piezas de la carta.", activity: "Ordena las secciones de la carta y qué argumento va en cada una.", cards: ["E06", "E07"], output: "Esquema de la carta", usesOutputsOf: ["s3"] },
      { id: "s5", title: "Redactar", description: "Titular, apertura, beneficios, prueba, objeciones, oferta y llamada a la acción.", activity: "Escribe el borrador completo en el editor del proyecto siguiendo el esquema.", cards: ["C01", "C02", "C06", "C07", "C08", "C09", "C10"], output: "Borrador completo", usesOutputsOf: ["s1", "s3", "s4"] },
      { id: "s6", title: "Revisar", description: "Claridad, credibilidad y conversión.", activity: "Revisa el borrador con las cartas de diagnóstico y anota los cambios.", cards: ["R01", "R02", "R04"], output: "Versión final", usesOutputsOf: ["s5"] },
    ],
  },
  {
    id: "textos-web",
    name: "Escribir los textos de una página web",
    goal: "Crear los textos principales de una web coherentes con el público y la oferta.",
    steps: [
      { id: "s1", title: "Conocer al visitante", description: "Lenguaje, nivel de consciencia y deseo principal.", activity: "Completa D01 y describe qué sabe el visitante y qué busca.", cards: ["D01", "D03", "D04"], output: "Perfil del visitante" },
      { id: "s2", title: "Elegir ángulo y promesa", description: "Cómo entrar y qué prometer.", activity: "Escribe el mensaje principal de la web en una o dos frases.", cards: ["E01", "E04"], output: "Mensaje principal", usesOutputsOf: ["s1"] },
      { id: "s3", title: "Estructurar las páginas", description: "Qué secciones y en qué orden.", activity: "Lista las secciones de cada página en orden.", cards: ["E07", "E06"], output: "Mapa de secciones", usesOutputsOf: ["s2"] },
      { id: "s4", title: "Redactar la página principal", description: "Titular, apertura, beneficios y llamada a la acción.", activity: "Escribe los textos de la página principal en el editor del proyecto.", cards: ["C01", "C02", "C06", "C10"], output: "Textos de la página principal", usesOutputsOf: ["s2", "s3"] },
      { id: "s5", title: "Revisar", description: "Claridad y continuidad entre secciones.", activity: "Revisa el borrador con las cartas de diagnóstico y anota los cambios.", cards: ["R01", "R03"], output: "Textos revisados", usesOutputsOf: ["s4"] },
    ],
  },
];

export const getRecipe = (id: string) => RECIPES.find((r) => r.id === id);
