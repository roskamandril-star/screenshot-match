// Persistencia local (navegador). Estructura pensada para que un futuro mentor
// pueda leer: proyecto activo, objetivo, receta/paso, cartas, respuestas y borrador.
import { useCallback, useEffect, useState } from "react";

export interface Project {
  id: string;
  name: string;
  goal: string;
  recipeId?: string;
  currentStepId?: string;
  cardIds: string[];
  draft: string;
  decisions: { at: string; note: string }[];
  createdAt: string;
}

export interface ExerciseAnswer {
  cardId: string;
  projectId?: string;
  values: Record<string, string>;
  savedAt: string;
}

export interface AppState {
  favorites: string[];
  answers: Record<string, ExerciseAnswer>; // clave: cardId
  projects: Project[];
  activeProjectId?: string;
}

const KEY = "atelier-state-v1";
const empty: AppState = { favorites: [], answers: {}, projects: [] };

function read(): AppState {
  if (typeof window === "undefined") return empty;
  try {
    return { ...empty, ...JSON.parse(localStorage.getItem(KEY) || "{}") };
  } catch {
    return empty;
  }
}

const listeners = new Set<() => void>();
function write(s: AppState) {
  localStorage.setItem(KEY, JSON.stringify(s));
  listeners.forEach((l) => l());
}

export function useAppState() {
  const [state, setState] = useState<AppState>(empty);
  useEffect(() => {
    const sync = () => setState(read());
    sync();
    listeners.add(sync);
    return () => void listeners.delete(sync);
  }, []);
  const update = useCallback((fn: (s: AppState) => AppState) => write(fn(read())), []);
  return [state, update] as const;
}

export const toggleFavorite = (s: AppState, id: string): AppState => ({
  ...s,
  favorites: s.favorites.includes(id) ? s.favorites.filter((f) => f !== id) : [...s.favorites, id],
});

export const addCardToProject = (s: AppState, projectId: string, cardId: string): AppState => ({
  ...s,
  projects: s.projects.map((p) =>
    p.id === projectId && !p.cardIds.includes(cardId) ? { ...p, cardIds: [...p.cardIds, cardId] } : p,
  ),
});

export const newProject = (name: string, goal: string): Project => ({
  id: crypto.randomUUID(),
  name,
  goal,
  cardIds: [],
  draft: "",
  decisions: [],
  createdAt: new Date().toISOString(),
});

/** Contexto que consultará el mentor en una fase posterior. */
export function getMentorContext(s: AppState) {
  const project = s.projects.find((p) => p.id === s.activeProjectId);
  return {
    project,
    goal: project?.goal,
    recipeId: project?.recipeId,
    currentStepId: project?.currentStepId,
    selectedCards: project?.cardIds ?? [],
    answers: Object.values(s.answers),
    decisions: project?.decisions ?? [],
    draft: project?.draft ?? "",
  };
}
