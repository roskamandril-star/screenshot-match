// Modelo de datos de cartas. Añadir cartas = añadir objetos a CARDS.

export type Phase = "descubrir" | "decidir" | "construir" | "revisar";
export type Discipline = "storytelling" | "copywriting" | "ambas";
export type CardType = "investigacion" | "estrategia" | "tecnica" | "diagnostico";
export type Level = "inicial" | "intermedio" | "avanzado";

export interface ExerciseField {
  id: string;
  label: string;
  help?: string;
  multiline?: boolean;
}

export interface Exercise {
  intro: string;
  fields: ExerciseField[];
}

export interface Reference {
  author: string;
  title: string;
  note?: string;
}

export interface Card {
  id: string;
  name: string;
  phase: Phase;
  discipline: Discipline;
  type: CardType;
  level: Level;
  status: "completa" | "pendiente";
  objectives: string[];
  summary: string;
  explanation?: string;
  whenToUse?: string[];
  whenNotToUse?: string[];
  steps?: string[];
  example?: string;
  counterExample?: string;
  exercise?: Exercise;
  criteria?: string[];
  mistakes?: string[];
  related: string[];
  references?: Reference[];
}

export const PHASES: { id: Phase; label: string; description: string }[] = [
  { id: "descubrir", label: "Descubrir", description: "Investigación del público, problemas, deseos, objeciones y evidencias." },
  { id: "decidir", label: "Decidir", description: "Estrategia, promesas, ángulos, estructuras y argumentos." },
  { id: "construir", label: "Construir", description: "Redacción, narración, persuasión y desarrollo de textos." },
  { id: "revisar", label: "Revisar", description: "Evaluación de claridad, credibilidad, coherencia y conversión." },
];

export const DISCIPLINE_LABEL: Record<Discipline, string> = {
  storytelling: "Storytelling",
  copywriting: "Copywriting",
  ambas: "Ambas",
};
export const TYPE_LABEL: Record<CardType, string> = {
  investigacion: "Investigación",
  estrategia: "Estrategia",
  tecnica: "Técnica",
  diagnostico: "Diagnóstico",
};
export const LEVEL_LABEL: Record<Level, string> = {
  inicial: "Inicial",
  intermedio: "Intermedio",
  avanzado: "Avanzado",
};

type Stub = Pick<Card, "id" | "name" | "phase" | "discipline" | "type" | "level" | "summary" | "objectives" | "related">;
const stub = (c: Stub): Card => ({ ...c, status: "pendiente" });

const D01: Card = {
  id: "D01",
  name: "La voz del cliente",
  phase: "descubrir",
  discipline: "ambas",
  type: "investigacion",
  level: "inicial",
  status: "completa",
  objectives: [
    "Escribir con las palabras que usa el cliente, no con las de la empresa.",
    "Detectar problemas, deseos y objeciones reales.",
    "Evitar textos genéricos basados en suposiciones.",
  ],
  summary:
    "Recoge y organiza las expresiones literales de tus clientes para que tus textos suenen a lo que ellos ya piensan y dicen.",
  explanation:
    "Las personas reconocen su propio lenguaje. Cuando un texto describe un problema con las mismas palabras que el lector usaría, la sensación es «esto lo han escrito para mí». La voz del cliente consiste en reunir frases literales (de entrevistas, reseñas, correos de soporte, foros, encuestas) y clasificarlas según lo que revelan: el dolor de partida, el resultado deseado, las dudas antes de comprar y los momentos de cambio.\n\nNo se trata de inventar cómo habla el cliente, sino de escucharlo y copiar. La investigación se convierte así en materia prima: titulares, aperturas, beneficios y respuestas a objeciones pueden salir casi directamente de estas frases.",
  whenToUse: [
    "Al empezar cualquier proyecto de texto persuasivo o narrativo.",
    "Cuando los textos actuales suenan corporativos o abstractos.",
    "Cuando no sabes qué problema priorizar.",
  ],
  whenNotToUse: [
    "Cuando no tienes acceso a ninguna fuente real: primero consíguela (aunque sean 5 entrevistas) en lugar de imaginarla.",
    "Para textos puramente informativos o legales donde el tono está fijado.",
  ],
  steps: [
    "Elige entre 2 y 4 fuentes: entrevistas, reseñas (propias o de la competencia), soporte, foros, encuestas abiertas.",
    "Copia frases literales, sin corregirlas ni resumirlas. Anota la fuente de cada una.",
    "Clasifica cada frase: problema, deseo, objeción o desencadenante (qué les hizo buscar una solución).",
    "Marca las expresiones que se repiten o que tienen mayor carga emocional.",
    "Selecciona 3–5 frases clave que usarás como base del mensaje.",
  ],
  example:
    "Producto: software de facturación para autónomos.\n\nFrase recogida en una reseña: «Me pasaba los domingos peleándome con Excel para sacar las facturas».\n\nUso en el texto: «Deja de dedicar tus domingos a pelearte con Excel. Tus facturas, listas en dos minutos».\n\nLa expresión «pelearme con Excel» y «los domingos» vienen del cliente; el texto resultante es concreto y reconocible.",
  counterExample:
    "«Optimiza tu gestión administrativa con nuestra solución integral de facturación».\n\nNingún cliente describe así su problema. El texto es correcto pero intercambiable con el de cualquier competidor y no conecta con una experiencia concreta.",
  exercise: {
    intro:
      "Aplica la técnica a tu propio proyecto. Usa frases reales; si aún no las tienes, anota dónde vas a conseguirlas.",
    fields: [
      { id: "producto", label: "Producto o servicio", help: "¿Sobre qué vas a escribir?" },
      { id: "fuentes", label: "Fuentes consultadas", help: "Entrevistas, reseñas, foros…", multiline: true },
      { id: "problemas", label: "Frases literales sobre el problema", multiline: true },
      { id: "deseos", label: "Frases literales sobre el deseo o resultado", multiline: true },
      { id: "objeciones", label: "Frases literales sobre dudas u objeciones", multiline: true },
      { id: "clave", label: "Las 3 frases clave que usarás", multiline: true },
    ],
  },
  criteria: [
    "Las frases son literales y tienen fuente identificable.",
    "Hay frases en al menos tres categorías (problema, deseo, objeción).",
    "Las frases clave son concretas (situaciones, objetos, momentos), no abstractas.",
    "Podrías usar al menos una frase clave en un titular sin apenas reescribirla.",
  ],
  mistakes: [
    "Parafrasear al cliente con lenguaje de marketing y perder lo que hacía valiosa la frase.",
    "Usar una sola fuente y tomar su sesgo como verdad.",
    "Inventar frases «que diría el cliente».",
    "Recoger mucho material y no clasificarlo ni seleccionar.",
  ],
  related: ["D02", "D03", "D05", "C01", "C06"],
  references: [
    {
      author: "Joanna Wiebe (Copyhackers)",
      title: "Investigación de «voice of customer» y review mining",
      note: "Práctica difundida en sus cursos y artículos sobre copywriting basado en investigación.",
    },
  ],
};

export const CARDS: Card[] = [
  D01,
  stub({ id: "D02", name: "El problema verdadero", phase: "descubrir", discipline: "ambas", type: "investigacion", level: "inicial", summary: "Distinguir el síntoma que el cliente menciona del problema de fondo que le mueve a actuar.", objectives: ["Identificar el problema real"], related: ["D01", "D03", "E01"] }),
  stub({ id: "D03", name: "El deseo que mueve", phase: "descubrir", discipline: "ambas", type: "investigacion", level: "inicial", summary: "Identificar el resultado o cambio que el cliente quiere conseguir.", objectives: ["Definir el deseo principal"], related: ["D01", "D02", "C06"] }),
  stub({ id: "D04", name: "La escalera de consciencia", phase: "descubrir", discipline: "copywriting", type: "investigacion", level: "intermedio", summary: "Situar al lector según lo que ya sabe del problema y de la solución.", objectives: ["Ajustar el mensaje al nivel del lector"], related: ["E04", "C02"] }),
  stub({ id: "D05", name: "El mapa de objeciones", phase: "descubrir", discipline: "copywriting", type: "investigacion", level: "inicial", summary: "Inventariar las dudas que frenan la decisión.", objectives: ["Anticipar resistencias"], related: ["D01", "C08", "R02"] }),
  stub({ id: "D06", name: "La prueba disponible", phase: "descubrir", discipline: "copywriting", type: "investigacion", level: "inicial", summary: "Reunir las evidencias reales que respaldan lo que vas a afirmar.", objectives: ["Saber qué puedes demostrar"], related: ["E01", "C07", "R02"] }),
  stub({ id: "D07", name: "El contexto competitivo", phase: "descubrir", discipline: "copywriting", type: "investigacion", level: "intermedio", summary: "Conocer qué dicen las alternativas para no repetir su mensaje.", objectives: ["Diferenciarse"], related: ["E02", "E04"] }),
  stub({ id: "E01", name: "La promesa defendible", phase: "decidir", discipline: "copywriting", type: "estrategia", level: "inicial", summary: "Formular una promesa atractiva que puedas sostener con pruebas.", objectives: ["Definir la promesa central"], related: ["D06", "C01", "R02"] }),
  stub({ id: "E02", name: "La gran idea", phase: "decidir", discipline: "ambas", type: "estrategia", level: "avanzado", summary: "Encontrar el concepto único que organiza todo el mensaje.", objectives: ["Unificar el mensaje"], related: ["E01", "E04", "D07"] }),
  stub({ id: "E03", name: "El mecanismo de la solución", phase: "decidir", discipline: "copywriting", type: "estrategia", level: "intermedio", summary: "Explicar por qué funciona la solución.", objectives: ["Hacer creíble el resultado"], related: ["C05", "C07"] }),
  stub({ id: "E04", name: "El ángulo de entrada", phase: "decidir", discipline: "ambas", type: "estrategia", level: "intermedio", summary: "Elegir por dónde entrar al tema para captar a este lector.", objectives: ["Elegir el enfoque"], related: ["D04", "C02"] }),
  stub({ id: "E05", name: "El conflicto narrativo", phase: "decidir", discipline: "storytelling", type: "estrategia", level: "intermedio", summary: "Definir la tensión que da interés a la historia.", objectives: ["Crear tensión"], related: ["C03", "C04"] }),
  stub({ id: "E06", name: "La arquitectura del argumento", phase: "decidir", discipline: "copywriting", type: "estrategia", level: "intermedio", summary: "Ordenar las razones para que se refuercen entre sí.", objectives: ["Ordenar argumentos"], related: ["E07", "R03"] }),
  stub({ id: "E07", name: "La estructura adecuada", phase: "decidir", discipline: "ambas", type: "estrategia", level: "inicial", summary: "Escoger la estructura de texto según formato y objetivo.", objectives: ["Elegir estructura"], related: ["E06", "C01"] }),
  stub({ id: "C01", name: "El titular que promete", phase: "construir", discipline: "copywriting", type: "tecnica", level: "inicial", summary: "Escribir un titular que comunique un beneficio claro.", objectives: ["Captar atención"], related: ["D01", "E01", "C02"] }),
  stub({ id: "C02", name: "La apertura que atrapa", phase: "construir", discipline: "ambas", type: "tecnica", level: "inicial", summary: "Conseguir que el lector siga leyendo tras el titular.", objectives: ["Retener"], related: ["C01", "E04"] }),
  stub({ id: "C03", name: "La escena que demuestra", phase: "construir", discipline: "storytelling", type: "tecnica", level: "intermedio", summary: "Mostrar con una escena concreta en lugar de afirmar.", objectives: ["Mostrar, no contar"], related: ["E05", "C04"] }),
  stub({ id: "C04", name: "El protagonista y su transformación", phase: "construir", discipline: "storytelling", type: "tecnica", level: "intermedio", summary: "Construir un personaje cuyo cambio refleje el del lector.", objectives: ["Generar identificación"], related: ["E05", "C03"] }),
  stub({ id: "C05", name: "El puente entre problema y solución", phase: "construir", discipline: "copywriting", type: "tecnica", level: "inicial", summary: "Conectar el problema descrito con la solución propuesta.", objectives: ["Transición lógica"], related: ["E03", "C06"] }),
  stub({ id: "C06", name: "Beneficios que importan", phase: "construir", discipline: "copywriting", type: "tecnica", level: "inicial", summary: "Traducir características en resultados que el lector valora.", objectives: ["Comunicar valor"], related: ["D03", "D01"] }),
  stub({ id: "C07", name: "La demostración persuasiva", phase: "construir", discipline: "copywriting", type: "tecnica", level: "intermedio", summary: "Presentar pruebas de forma convincente.", objectives: ["Generar confianza"], related: ["D06", "E03"] }),
  stub({ id: "C08", name: "La respuesta a la objeción", phase: "construir", discipline: "copywriting", type: "tecnica", level: "intermedio", summary: "Resolver dudas dentro del propio texto.", objectives: ["Reducir fricción"], related: ["D05"] }),
  stub({ id: "C09", name: "La oferta comprensible", phase: "construir", discipline: "copywriting", type: "tecnica", level: "inicial", summary: "Explicar qué se obtiene, cómo y a qué precio sin ambigüedad.", objectives: ["Claridad de oferta"], related: ["C10", "R04"] }),
  stub({ id: "C10", name: "La llamada a la acción", phase: "construir", discipline: "copywriting", type: "tecnica", level: "inicial", summary: "Indicar el siguiente paso de forma clara y motivadora.", objectives: ["Provocar acción"], related: ["C09", "R04"] }),
  stub({ id: "R01", name: "La prueba de claridad", phase: "revisar", discipline: "ambas", type: "diagnostico", level: "inicial", summary: "Comprobar que el texto se entiende a la primera.", objectives: ["Claridad"], related: ["R03"] }),
  stub({ id: "R02", name: "La auditoría de credibilidad", phase: "revisar", discipline: "copywriting", type: "diagnostico", level: "intermedio", summary: "Verificar que cada afirmación está respaldada.", objectives: ["Credibilidad"], related: ["D06", "E01"] }),
  stub({ id: "R03", name: "La prueba de continuidad", phase: "revisar", discipline: "ambas", type: "diagnostico", level: "intermedio", summary: "Revisar que cada parte lleva naturalmente a la siguiente.", objectives: ["Coherencia"], related: ["E06", "R01"] }),
  stub({ id: "R04", name: "La auditoría de conversión", phase: "revisar", discipline: "copywriting", type: "diagnostico", level: "avanzado", summary: "Evaluar si el texto empuja a la acción deseada.", objectives: ["Conversión"], related: ["C09", "C10"] }),
];

export const getCard = (id: string) => CARDS.find((c) => c.id === id);
