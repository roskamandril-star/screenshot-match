// Persistencia local (navegador). Estructura pensada para que un futuro mentor
// pueda leer: proyecto activo, objetivo, receta/paso, cartas, respuestas, decisiones y borrador.
import { useCallback, useEffect, useState } from "react";

export type StepStatus = "pendiente" | "en_curso" | "completado";

export interface StepState {
  status: StepStatus;
  output: string; // resultado del paso, propio de ese paso (no se copia a otros)
  updatedAt?: string | undefined;
  completedAt?: string | undefined;
}

export interface ActivityResult {
  text: string;          // lo que el usuario ha escrito en esta actividad
  completed: boolean;    // el usuario confirma manualmente
  updatedAt?: string | undefined;
}

export interface ProjectDecision {
  id: string;
  decision: string;
  justification: string;
  evidence: string;
  stepId?: string | undefined;
  at: string;
  updatedAt?: string | undefined;
}

export interface ProjectNote {
  id: string;
  kind: "decision" | "nota";
  text: string;
  stepId?: string | undefined;
  at: string;
}

export interface Project {
  id: string;
  name: string;
  goal: string;
  recipeId?: string | undefined;
  currentStepId?: string | undefined;
  cardIds: string[];
  draft: string;
  steps?: Record<string, StepState> | undefined;
  /** clave: `${stepId}:${activityId}` → resultado de la actividad */
  activities?: Record<string, ActivityResult> | undefined;
  decisions?: ProjectDecision[] | undefined;
  notes?: ProjectNote[] | undefined;
  /** @deprecated formato antiguo; se conserva para no perder datos */
  decisions: { at: string; note: string }[];
  createdAt: string;
}

export interface ExerciseAnswer {
  cardId: string;
  projectId?: string | undefined;
  stepId?: string | undefined;
  values: Record<string, string>;
  savedAt: string;
}

export interface AppState {
  favorites: string[];
  /** clave: answerKey(cardId, projectId). Sin proyecto = cardId (práctica libre). */
  answers: Record<string, ExerciseAnswer>;
  projects: Project[];
  activeProjectId?: string | undefined;
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
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const sync = () => setState(read());
    sync();
    setReady(true);
    listeners.add(sync);
    return () => void listeners.delete(sync);
  }, []);
  const update = useCallback((fn: (s: AppState) => AppState) => write(fn(read())), []);
  return [state, update, ready] as const;
}

export const answerKey = (cardId: string, projectId?: string) => (projectId ? `${projectId}:${cardId}` : cardId);

export const getAnswer = (s: AppState, cardId: string, projectId?: string) => s.answers[answerKey(cardId, projectId)];

export const saveAnswer = (
  s: AppState,
  cardId: string,
  values: Record<string, string>,
  projectId?: string,
  stepId?: string,
): AppState => ({
  ...s,
  answers: {
    ...s.answers,
    [answerKey(cardId, projectId)]: { cardId, projectId, stepId, values, savedAt: new Date().toISOString() },
  },
});

export const toggleFavorite = (s: AppState, id: string): AppState => ({
  ...s,
  favorites: s.favorites.includes(id) ? s.favorites.filter((f) => f !== id) : [...s.favorites, id],
});

const mapProject = (s: AppState, projectId: string, fn: (p: Project) => Project): AppState => ({
  ...s,
  projects: s.projects.map((p) => (p.id === projectId ? fn(p) : p)),
});

export const addCardToProject = (s: AppState, projectId: string, cardId: string): AppState =>
  mapProject(s, projectId, (p) => (p.cardIds.includes(cardId) ? p : { ...p, cardIds: [...p.cardIds, cardId] }));

export const newProject = (name: string, goal: string, recipeId?: string, firstStepId?: string): Project => ({
  id: crypto.randomUUID(),
  name,
  goal,
  recipeId,
  currentStepId: firstStepId,
  cardIds: [],
  draft: "",
  steps: {},
  activities: {},
  decisions: [],
  notes: [],
  createdAt: new Date().toISOString(),
});

export const getStep = (p: Project, stepId: string): StepState => p.steps?.[stepId] ?? { status: "pendiente", output: "" };

export const updateStep = (s: AppState, projectId: string, stepId: string, fields: Partial<StepState>): AppState =>
  mapProject(s, projectId, (p) => {
    const prev = getStep(p, stepId);
    const next: StepState = { ...prev, ...fields, updatedAt: new Date().toISOString() };
    if (fields.status === "completado") next.completedAt = new Date().toISOString();
    if (fields.status && fields.status !== "completado") next.completedAt = undefined;
    // escribir un resultado en un paso pendiente lo marca en curso
    if (fields.output !== undefined && next.status === "pendiente" && fields.output.trim()) next.status = "en_curso";
    return { ...p, steps: { ...p.steps, [stepId]: next } };
  });

export const goToStep = (s: AppState, projectId: string, stepId: string): AppState =>
  mapProject(s, projectId, (p) => ({ ...p, currentStepId: stepId }));

// --- Actividades ---

export const activityKey = (stepId: string, activityId: string) => `${stepId}:${activityId}`;

export const getActivity = (p: Project, stepId: string, activityId: string): ActivityResult =>
  p.activities?.[activityKey(stepId, activityId)] ?? { text: "", completed: false };

export const updateActivity = (
  s: AppState,
  projectId: string,
  stepId: string,
  activityId: string,
  fields: Partial<ActivityResult>,
): AppState =>
  mapProject(s, projectId, (p) => {
    const key = activityKey(stepId, activityId);
    const prev = p.activities?.[key] ?? { text: "", completed: false };
    const next: ActivityResult = { ...prev, ...fields, updatedAt: new Date().toISOString() };
    return { ...p, activities: { ...p.activities, [key]: next } };
  });

// --- Decisiones ---

export const addDecision = (
  s: AppState,
  projectId: string,
  decision: string,
  justification: string,
  evidence: string,
  stepId?: string,
): AppState =>
  mapProject(s, projectId, (p) => ({
    ...p,
    decisions: [
      ...(p.decisions ?? []),
      { id: crypto.randomUUID(), decision, justification, evidence, stepId, at: new Date().toISOString() },
    ],
  }));

export const editDecision = (
  s: AppState,
  projectId: string,
  decisionId: string,
  fields: Partial<Pick<ProjectDecision, "decision" | "justification" | "evidence" | "stepId">>,
): AppState =>
  mapProject(s, projectId, (p) => ({
    ...p,
    decisions: (p.decisions ?? []).map((d) =>
      d.id === decisionId ? { ...d, ...fields, updatedAt: new Date().toISOString() } : d,
    ),
  }));

export const removeDecision = (s: AppState, projectId: string, decisionId: string): AppState =>
  mapProject(s, projectId, (p) => ({
    ...p,
    decisions: (p.decisions ?? []).filter((d) => d.id !== decisionId),
  }));

export const addNote = (s: AppState, projectId: string, kind: ProjectNote["kind"], text: string, stepId?: string): AppState =>
  mapProject(s, projectId, (p) => ({
    ...p,
    notes: [...(p.notes ?? []), { id: crypto.randomUUID(), kind, text, stepId, at: new Date().toISOString() }],
  }));

export const removeNote = (s: AppState, projectId: string, noteId: string): AppState =>
  mapProject(s, projectId, (p) => ({ ...p, notes: (p.notes ?? []).filter((n) => n.id !== noteId) }));

/** Contexto que consultará el mentor en una fase posterior. */
export function getMentorContext(s: AppState) {
  const project = s.projects.find((p) => p.id === s.activeProjectId);
  return {
    project,
    goal: project?.goal,
    recipeId: project?.recipeId,
    currentStepId: project?.currentStepId,
    stepStates: project?.steps ?? {},
    activities: project?.activities ?? {},
    selectedCards: project?.cardIds ?? [],
    answers: Object.values(s.answers).filter((a) => a.projectId === project?.id),
    decisions: project?.decisions ?? [],
    notes: (project?.notes ?? []).filter((n) => n.kind === "decision"),
    draft: project?.draft ?? "",
  };
}
