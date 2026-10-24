export interface RecipeActivity {
  id: string;
  title: string;
  goal: string;          // qué se pretende conseguir
  instructions: string;  // qué debe hacer el usuario
  cardIds: string[];     // qué cartas pueden ayudar
  expectedOutput: string; // qué resultado debe obtener
  outputLabel: string;  // etiqueta corta del resultado (para consultas desde otras etapas)
}

export interface RecipeStep {
  id: string;
  title: string;
  description: string;
  cards: string[];
  activity: string; // qué hace el usuario en este paso
  output: string; // resultado que produce y se reutiliza en pasos posteriores
  usesOutputsOf?: string[];
  activities?: RecipeActivity[];
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
      {
        id: "s1",
        title: "Investigar al cliente",
        description: "Recoge su lenguaje, problemas, deseos y objeciones.",
        activity: "Completa el ejercicio de D01 con frases reales y anota el problema, deseo y objeciones principales.",
        cards: ["D01", "D02", "D03", "D05"],
        output: "Banco de frases y mapa de objeciones",
        activities: [
          {
            id: "a1",
            title: "Recoger expresiones reales del cliente",
            goal: "Construir un banco de frases literales del cliente que sirva de materia prima para todo el texto.",
            instructions: "Reúne frases textuales de al menos 2 fuentes (entrevistas, reseñas, soporte, foros). CóPIALAS literalmente, sin corregir ni parafrasear. Anota la fuente de cada frase. Clasifícalas en: problema, deseo, objeción o desencadenante. Marca las que se repiten o tienen más carga emocional.",
            cardIds: ["D01"],
            expectedOutput: "Un banco con 10-20 frases literales clasificadas, de las cuales 3-5 se marcan como clave.",
            outputLabel: "Banco de frases",
          },
          {
            id: "a2",
            title: "Identificar el problema y el deseo",
            goal: "Distinguir el problema real que mueve al cliente a actuar y el resultado concreto que quiere conseguir.",
            instructions: "A partir de las frases recogidas, identifica el problema de fondo (no el síntoma que menciona). Luego define el deseo principal: qué quiere conseguir, en qué cambiará su situación. Sé específico: describe la situación concreta, no una abstracción.",
            cardIds: ["D02", "D03"],
            expectedOutput: "Un enunciado de problema real y un enunciado de deseo, cada uno en 1-2 frases concretas.",
            outputLabel: "Problema y deseo",
          },
          {
            id: "a3",
            title: "Determinar el nivel de consciencia",
            goal: "Situar al lector según lo que ya sabe del problema y de la solución para ajustar el mensaje.",
            instructions: "Determina si el lector: (a) no sabe que tiene el problema, (b) sabe que tiene el problema pero no conoce soluciones, (c) conoce soluciones pero no la tuya, o (d) ya conoce tu solución. Esto determina cuánta educación necesita antes de la oferta.",
            cardIds: ["D04"],
            expectedOutput: "El nivel de consciencia identificado y una frase sobre qué implica para el enfoque del texto.",
            outputLabel: "Nivel de consciencia",
          },
          {
            id: "a4",
            title: "Identificar y clasificar las objeciones",
            goal: "Anticipar todas las resistencias que pueden frenar la decisión de compra.",
            instructions: "Lista todas las objeciones que el cliente podría tener: de precio, de desconfianza, de tiempo, de complejidad, de competencia, de «no me sirve para mi caso». Clasifícalas por frecuencia e intensidad. Marca las 3-5 más importantes que el texto deberá responder.",
            cardIds: ["D05"],
            expectedOutput: "Un mapa con 5-10 objeciones clasificadas, con las 3-5 prioritarias marcadas.",
            outputLabel: "Mapa de objeciones",
          },
        ],
      },
      {
        id: "s2",
        title: "Reunir pruebas y contexto",
        description: "Inventaria evidencias y analiza la competencia.",
        activity: "Haz una lista de pruebas verificables y de lo que dicen 2–3 competidores.",
        cards: ["D06", "D07"],
        output: "Lista de pruebas y diferenciadores",
        usesOutputsOf: ["s1"],
        activities: [
          {
            id: "a1",
            title: "Inventariar pruebas disponibles",
            goal: "Saber qué evidencias reales respaldan las afirmaciones que vas a hacer.",
            instructions: "Lista todas las pruebas que puedes aportar: datos, testimonios, casos, demostraciones, certificaciones. Marca cuáles son verificables y cuáles necesitas conseguir.",
            cardIds: ["D06"],
            expectedOutput: "Un inventario de pruebas clasificadas por tipo, con las verificables marcadas.",
            outputLabel: "Inventario de pruebas",
          },
          {
            id: "a2",
            title: "Analizar el contexto competitivo",
            goal: "Conocer qué dicen las alternativas para diferenciarse y no repetir su mensaje.",
            instructions: "Revisa 2-3 competidores. Anota qué prometen, cómo entran, qué estructura usan. Identifica qué hacen todos igual (y que tú puedes hacer distinto).",
            cardIds: ["D07"],
            expectedOutput: "Un resumen competitivo con 2-3 diferenciadores potenciales.",
            outputLabel: "Análisis competitivo",
          },
        ],
      },
      {
        id: "s3",
        title: "Definir la estrategia",
        description: "Promesa, gran idea y mecanismo.",
        activity: "Redacta la promesa en una frase y el concepto que organiza la carta.",
        cards: ["E01", "E02", "E03"],
        output: "Promesa y concepto central",
        usesOutputsOf: ["s1", "s2"],
        activities: [
          {
            id: "a1",
            title: "Formular la promesa",
            goal: "Definir una promesa atractiva que puedas sostener con pruebas.",
            instructions: "Escribe la promesa central en una sola frase. Comprueba que es atractiva y que tienes pruebas para respaldarla.",
            cardIds: ["E01"],
            expectedOutput: "Una frase de promesa, con la prueba que la respalda.",
            outputLabel: "Promesa",
          },
          {
            id: "a2",
            title: "Encontrar la gran idea",
            goal: "Encontrar el concepto único que organiza todo el mensaje.",
            instructions: "Busca el ángulo o concepto que unifica todo: la idea que hace que la promesa sea creíble y memorable.",
            cardIds: ["E02"],
            expectedOutput: "Un enunciado de gran idea en 1-2 frases.",
            outputLabel: "Gran idea",
          },
          {
            id: "a3",
            title: "Definir el mecanismo",
            goal: "Explicar por qué la solución funciona.",
            instructions: "Describe el mecanismo: cómo y por qué funciona tu solución. Esto hace creíble el resultado.",
            cardIds: ["E03"],
            expectedOutput: "Una explicación del mecanismo en 2-3 frases.",
            outputLabel: "Mecanismo",
          },
        ],
      },
      {
        id: "s4",
        title: "Estructurar el argumento",
        description: "Ordena las piezas de la carta.",
        activity: "Ordena las secciones de la carta y qué argumento va en cada una.",
        cards: ["E06", "E07"],
        output: "Esquema de la carta",
        usesOutputsOf: ["s3"],
        activities: [
          {
            id: "a1",
            title: "Elegir la estructura",
            goal: "Escoger la estructura de texto según formato y objetivo.",
            instructions: "Decide qué estructura de carta de ventas vas a usar y por qué.",
            cardIds: ["E07"],
            expectedOutput: "La estructura elegida y una justificación breve.",
            outputLabel: "Estructura",
          },
          {
            id: "a2",
            title: "Ordenar los argumentos",
            goal: "Ordenar las razones para que se refuercen entre sí.",
            instructions: "Lista los argumentos en orden. Asigna cada argumento a una sección de la estructura.",
            cardIds: ["E06"],
            expectedOutput: "Un esquema con secciones y el argumento de cada una.",
            outputLabel: "Esquema de argumentos",
          },
        ],
      },
      {
        id: "s5",
        title: "Redactar",
        description: "Titular, apertura, beneficios, prueba, objeciones, oferta y llamada a la acción.",
        activity: "Escribe el borrador completo en el editor del proyecto siguiendo el esquema.",
        cards: ["C01", "C02", "C06", "C07", "C08", "C09", "C10"],
        output: "Borrador completo",
        usesOutputsOf: ["s1", "s3", "s4"],
        activities: [
          {
            id: "a1",
            title: "Escribir el titular",
            goal: "Captar atención con un beneficio claro.",
            instructions: "Escribe 3-5 titulares. Elige el mejor. Usa frases del banco de frases del cliente.",
            cardIds: ["C01"],
            expectedOutput: "Un titular elegido y 2-4 descartados.",
            outputLabel: "Titular",
          },
          {
            id: "a2",
            title: "Escribir la apertura",
            goal: "Conseguir que el lector siga leyendo tras el titular.",
            instructions: "Escribe la apertura: la primera frase o párrafo que mantiene al lector.",
            cardIds: ["C02"],
            expectedOutput: "El texto de apertura.",
            outputLabel: "Apertura",
          },
          {
            id: "a3",
            title: "Desarrollar beneficios y prueba",
            goal: "Comunicar valor y generar confianza.",
            instructions: "Traduce características en beneficios. Presenta las pruebas que respaldan tus afirmaciones.",
            cardIds: ["C06", "C07"],
            expectedOutput: "Secciones de beneficios y pruebas redactadas.",
            outputLabel: "Beneficios y prueba",
          },
          {
            id: "a4",
            title: "Responder objeciones",
            goal: "Reducir fricción resolviendo dudas dentro del texto.",
            instructions: "Responde a las objeciones prioritarias que identificaste en el mapa de objeciones.",
            cardIds: ["C08"],
            expectedOutput: "Sección de respuestas a objeciones.",
            outputLabel: "Respuesta a objeciones",
          },
          {
            id: "a5",
            title: "Presentar la oferta y la llamada a la acción",
            goal: "Explicar qué se obtiene e impulsar la acción.",
            instructions: "Describe la oferta sin ambigüedad. Escribe la llamada a la acción clara y motivadora.",
            cardIds: ["C09", "C10"],
            expectedOutput: "Sección de oferta y CTA.",
            outputLabel: "Oferta y CTA",
          },
        ],
      },
      {
        id: "s6",
        title: "Revisar",
        description: "Claridad, credibilidad y conversión.",
        activity: "Revisa el borrador con las cartas de diagnóstico y anota los cambios.",
        cards: ["R01", "R02", "R04"],
        output: "Versión final",
        usesOutputsOf: ["s5"],
        activities: [
          {
            id: "a1",
            title: "Prueba de claridad",
            goal: "Comprobar que el texto se entiende a la primera.",
            instructions: "Revisa el borrador: ¿se entiende cada frase sin releer? Anota las frases confusas y propón una alternativa.",
            cardIds: ["R01"],
            expectedOutput: "Lista de frases confusas con sus alternativas.",
            outputLabel: "Revisión de claridad",
          },
          {
            id: "a2",
            title: "Auditoría de credibilidad",
            goal: "Verificar que cada afirmación está respaldada.",
            instructions: "Revisa cada afirmación del texto: ¿tiene prueba? Anota las afirmaciones sin respaldo.",
            cardIds: ["R02"],
            expectedOutput: "Lista de afirmaciones sin respaldo y cómo resolverlas.",
            outputLabel: "Auditoría de credibilidad",
          },
          {
            id: "a3",
            title: "Auditoría de conversión",
            goal: "Evaluar si el texto empuja a la acción deseada.",
            instructions: "Evalúa si la carta conduce naturalmente a la acción. Anota qué frenarías o reforzarías.",
            cardIds: ["R04"],
            expectedOutput: "Lista de cambios para mejorar conversión.",
            outputLabel: "Auditoría de conversión",
          },
        ],
      },
    ],
  },
  {
    id: "textos-web",
    name: "Escribir los textos de una página web",
    goal: "Crear los textos principales de una web coherentes con el público y la oferta.",
    steps: [
      {
        id: "s1",
        title: "Conocer al visitante",
        description: "Lenguaje, nivel de consciencia y deseo principal.",
        activity: "Completa D01 y describe qué sabe el visitante y qué busca.",
        cards: ["D01", "D03", "D04"],
        output: "Perfil del visitante",
        activities: [
          {
            id: "a1",
            title: "Recoger el lenguaje del visitante",
            goal: "Reunir las expresiones reales del visitante de la web.",
            instructions: "Reúne frases literales de visitantes o clientes potenciales. Clasifícalas y marca las clave.",
            cardIds: ["D01"],
            expectedOutput: "Un banco de frases clasificadas con 3-5 clave marcadas.",
            outputLabel: "Banco de frases",
          },
          {
            id: "a2",
            title: "Definir el deseo principal",
            goal: "Identificar el resultado que el visitante quiere conseguir.",
            instructions: "A partir de las frases, define el deseo principal del visitante en 1-2 frases concretas.",
            cardIds: ["D03"],
            expectedOutput: "Un enunciado de deseo principal.",
            outputLabel: "Deseo principal",
          },
          {
            id: "a3",
            title: "Determinar el nivel de consciencia",
            goal: "Ajustar el mensaje al nivel de información del visitante.",
            instructions: "Determina el nivel de consciencia del visitante y qué implica para el enfoque.",
            cardIds: ["D04"],
            expectedOutput: "Nivel de consciencia e implicación para el texto.",
            outputLabel: "Nivel de consciencia",
          },
        ],
      },
      {
        id: "s2",
        title: "Elegir ángulo y promesa",
        description: "Cómo entrar y qué prometer.",
        activity: "Escribe el mensaje principal de la web en una o dos frases.",
        cards: ["E01", "E04"],
        output: "Mensaje principal",
        usesOutputsOf: ["s1"],
        activities: [
          {
            id: "a1",
            title: "Elegir el ángulo de entrada",
            goal: "Decidir por dónde entrar al tema para captar a este visitante.",
            instructions: "Define el ángulo de entrada: cómo vas a presentar el tema.",
            cardIds: ["E04"],
            expectedOutput: "Un enunciado de ángulo de entrada.",
            outputLabel: "Ángulo",
          },
          {
            id: "a2",
            title: "Formular la promesa",
            goal: "Definir la promesa principal de la web.",
            instructions: "Escribe la promesa en 1-2 frases. Comprueba que puedes sostenerla con pruebas.",
            cardIds: ["E01"],
            expectedOutput: "Una frase de promesa.",
            outputLabel: "Promesa",
          },
        ],
      },
      {
        id: "s3",
        title: "Estructurar las páginas",
        description: "Qué secciones y en qué orden.",
        activity: "Lista las secciones de cada página en orden.",
        cards: ["E07", "E06"],
        output: "Mapa de secciones",
        usesOutputsOf: ["s2"],
        activities: [
          {
            id: "a1",
            title: "Elegir la estructura",
            goal: "Escoger la estructura de la web según formato y objetivo.",
            instructions: "Decide qué estructura de páginas vas a usar y por qué.",
            cardIds: ["E07"],
            expectedOutput: "La estructura elegida con justificación breve.",
            outputLabel: "Estructura",
          },
          {
            id: "a2",
            title: "Mapear las secciones",
            goal: "Listar las secciones de cada página en orden.",
            instructions: "Lista las secciones de cada página y qué argumento va en cada una.",
            cardIds: ["E06"],
            expectedOutput: "Un mapa de secciones con el argumento de cada una.",
            outputLabel: "Mapa de secciones",
          },
        ],
      },
      {
        id: "s4",
        title: "Redactar la página principal",
        description: "Titular, apertura, beneficios y llamada a la acción.",
        activity: "Escribe los textos de la página principal en el editor del proyecto.",
        cards: ["C01", "C02", "C06", "C10"],
        output: "Textos de la página principal",
        usesOutputsOf: ["s2", "s3"],
        activities: [
          {
            id: "a1",
            title: "Escribir el titular",
            goal: "Captar atención con un beneficio claro.",
            instructions: "Escribe 3-5 titulares. Elige el mejor. Usa frases del banco de frases.",
            cardIds: ["C01"],
            expectedOutput: "Un titular elegido y descartes.",
            outputLabel: "Titular",
          },
          {
            id: "a2",
            title: "Escribir la apertura",
            goal: "Conseguir que el visitante siga leyendo.",
            instructions: "Escribe la apertura de la página principal.",
            cardIds: ["C02"],
            expectedOutput: "El texto de apertura.",
            outputLabel: "Apertura",
          },
          {
            id: "a3",
            title: "Desarrollar beneficios",
            goal: "Comunicar el valor de forma clara.",
            instructions: "Traduce características en beneficios para el visitante.",
            cardIds: ["C06"],
            expectedOutput: "Sección de beneficios redactada.",
            outputLabel: "Beneficios",
          },
          {
            id: "a4",
            title: "Escribir la llamada a la acción",
            goal: "Indicar el siguiente paso de forma clara y motivadora.",
            instructions: "Escribe la llamada a la acción de la página principal.",
            cardIds: ["C10"],
            expectedOutput: "La llamada a la acción.",
            outputLabel: "CTA",
          },
        ],
      },
      {
        id: "s5",
        title: "Revisar",
        description: "Claridad y continuidad entre secciones.",
        activity: "Revisa el borrador con las cartas de diagnóstico y anota los cambios.",
        cards: ["R01", "R03"],
        output: "Textos revisados",
        usesOutputsOf: ["s4"],
        activities: [
          {
            id: "a1",
            title: "Prueba de claridad",
            goal: "Comprobar que el texto se entiende a la primera.",
            instructions: "Revisa el borrador: ¿se entiende cada frase? Anota las confusas y propón alternativas.",
            cardIds: ["R01"],
            expectedOutput: "Lista de frases confusas con alternativas.",
            outputLabel: "Revisión de claridad",
          },
          {
            id: "a2",
            title: "Prueba de continuidad",
            goal: "Revisar que cada parte lleva naturalmente a la siguiente.",
            instructions: "Revisa que cada sección conecta con la siguiente sin saltos. Anota las transiciones rotas.",
            cardIds: ["R03"],
            expectedOutput: "Lista de transiciones a corregir.",
            outputLabel: "Revisión de continuidad",
          },
        ],
      },
    ],
  },
];

export const getRecipe = (id: string) => RECIPES.find((r) => r.id === id);
