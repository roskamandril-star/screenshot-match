import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { getCard } from "@/lib/cards";
import type { Recipe, RecipeStep } from "@/lib/recipes";
import { ActivityPanel } from "@/components/ActivityPanel";
import { DecisionsPanel } from "@/components/DecisionsPanel";
import {
  getActivity,
  getStep,
  goToStep,
  updateStep,
  useAppState,
  type Project,
  type StepStatus,
} from "@/lib/store";

const STATUS_LABEL: Record<StepStatus, string> = {
  pendiente: "Pendiente",
  en_curso: "En curso",
  completado: "Completado",
};

const STATUS_STYLE: Record<StepStatus, string> = {
  pendiente: "border-muted-foreground/40 bg-muted text-muted-foreground",
  en_curso: "border-primary/40 bg-primary/10 text-primary",
  completado: "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
};

const STATUS_DOT: Record<StepStatus, string> = {
  pendiente: "bg-muted-foreground/40",
  en_curso: "bg-primary",
  completado: "bg-emerald-500",
};

const STATUSES: StepStatus[] = ["pendiente", "en_curso", "completado"];

const TABS = ["Actividades", "Resultados", "Decisiones"] as const;
type Tab = (typeof TABS)[number];

export function RecipeRunner({ recipe, project }: { recipe: Recipe; project: Project }) {
  const [, update] = useAppState();
  const [tab, setTab] = useState<Tab>("Actividades");
  const currentStepId = project.currentStepId ?? recipe.steps[0]?.id ?? "";
  const currentIdx = recipe.steps.findIndex((s) => s.id === currentStepId);
  const step = recipe.steps[currentIdx] ?? recipe.steps[0];

  if (!step) return null;

  const completedCount = recipe.steps.filter((s) => getStep(project, s.id).status === "completado").length;
  const progressPct = Math.round((completedCount / recipe.steps.length) * 100);
  const hasPrev = currentIdx > 0;
  const hasNext = currentIdx < recipe.steps.length - 1;

  const selectStep = (id: string) => update((s) => goToStep(s, project.id, id));
  const setStatus = (status: StepStatus) => update((s) => updateStep(s, project.id, step.id, { status }));
  const goPrev = () => hasPrev && selectStep(recipe.steps[currentIdx - 1].id);
  const goNext = () => hasNext && selectStep(recipe.steps[currentIdx + 1].id);

  // Actividades completadas en la etapa actual
  const activities = step.activities ?? [];
  const completedActivities = activities.filter(
    (a) => getActivity(project, step.id, a.id).completed,
  ).length;

  // Resultados de etapas anteriores para consultar
  const previousSteps = recipe.steps.slice(0, currentIdx);
  const hasPriorResults = previousSteps.some((s) =>
    (s.activities ?? []).some((a) => {
      const r = getActivity(project, s.id, a.id);
      return r.text.trim() !== "" || r.completed;
    }),
  );

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-sm font-semibold">Progreso de la receta</h3>
          <span className="text-sm text-muted-foreground">{completedCount}/{recipe.steps.length} etapas completadas</span>
        </div>
        <Progress value={progressPct} />
      </div>

      <div className="flex flex-wrap gap-1">
        {recipe.steps.map((s, i) => {
          const st = getStep(project, s.id);
          const isCurrent = s.id === currentStepId;
          return (
            <button
              key={s.id}
              onClick={() => selectStep(s.id)}
              className={`flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs transition-colors ${isCurrent ? "border-primary bg-secondary font-semibold" : "hover:bg-accent"}`}
            >
              <span className={`inline-block h-2 w-2 rounded-full ${STATUS_DOT[st.status]}`} />
              <span>{i + 1}. {s.title}</span>
            </button>
          );
        })}
      </div>

      <div className="rounded-lg border p-5 space-y-4">
        <div>
          <div className="text-xs text-muted-foreground">Etapa {currentIdx + 1} de {recipe.steps.length}</div>
          <h3 className="text-lg font-semibold">{step.title}</h3>
          <p className="text-sm text-muted-foreground mt-0.5">{step.description}</p>
        </div>

        {step.usesOutputsOf && step.usesOutputsOf.length > 0 && (
          <div className="text-sm text-muted-foreground">
            <span className="font-medium">Depende de: </span>
            {step.usesOutputsOf.map((depId, i) => {
              const depIdx = recipe.steps.findIndex((s) => s.id === depId);
              const dep = depIdx >= 0 ? recipe.steps[depIdx] : undefined;
              return (
                <span key={depId}>
                  {i > 0 && ", "}
                  <button
                    onClick={() => dep && selectStep(depId)}
                    className="underline hover:text-foreground"
                  >
                    etapa {depIdx + 1}{dep ? ` (${dep.title})` : ""}
                  </button>
                </span>
              );
            })}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2 border-t pt-3">
          <span className="text-sm font-medium">Estado de la etapa:</span>
          <div className="flex gap-1">
            {STATUSES.map((st) => (
              <button
                key={st}
                onClick={() => setStatus(st)}
                className={`rounded-md border px-3 py-1 text-xs transition-colors ${getStep(project, step.id).status === st ? STATUS_STYLE[st] : "border-border text-muted-foreground hover:bg-accent"}`}
              >
                {STATUS_LABEL[st]}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-1 border-b">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`-mb-px border-b-2 px-3 py-2 text-sm ${tab === t ? "border-primary font-semibold" : "border-transparent text-muted-foreground"}`}
          >
            {t}
            {t === "Actividades" && activities.length > 0 && ` (${completedActivities}/${activities.length})`}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {tab === "Actividades" && (
          <div className="space-y-3">
            {activities.length > 0 ? (
              activities.map((a, i) => (
                <ActivityPanel
                  key={a.id}
                  recipeId={recipe.id}
                  step={step}
                  activity={a}
                  project={project}
                  index={i}
                />
              ))
            ) : (
              <p className="text-sm text-muted-foreground">Las actividades de esta etapa se definirán próximamente.</p>
            )}
          </div>
        )}

        {tab === "Resultados" && (
          <div className="space-y-4">
            <div>
              <h4 className="mb-2 text-sm font-medium">Resultados de esta etapa</h4>
              {activities.length > 0 ? (
                <div className="space-y-2">
                  {activities.map((a) => {
                    const r = getActivity(project, step.id, a.id);
                    return (
                      <div key={a.id} className="rounded-md border p-3">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-medium">{a.outputLabel}</span>
                          {r.completed && (
                            <Badge variant="secondary" className="text-xs">Completada</Badge>
                          )}
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground whitespace-pre-line">
                          {r.text.trim() || "Sin contenido todavía."}
                        </p>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No hay actividades con resultados en esta etapa.</p>
              )}
            </div>

            <div>
              <h4 className="mb-2 text-sm font-medium">Resultados de etapas anteriores</h4>
              {hasPriorResults ? (
                <div className="space-y-2">
                  {previousSteps.map((s) => {
                    const stepActivities = (s.activities ?? []).filter((a) => {
                      const r = getActivity(project, s.id, a.id);
                      return r.text.trim() !== "" || r.completed;
                    });
                    if (stepActivities.length === 0) return null;
                    return (
                      <div key={s.id} className="rounded-md border p-3">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-semibold">{s.title}</span>
                          <button
                            onClick={() => selectStep(s.id)}
                            className="text-xs underline text-muted-foreground hover:text-foreground"
                          >
                            Ir a esta etapa
                          </button>
                        </div>
                        <div className="mt-2 space-y-1.5">
                          {stepActivities.map((a) => {
                            const r = getActivity(project, s.id, a.id);
                            return (
                              <div key={a.id} className="rounded bg-muted/50 p-2">
                                <div className="flex items-center justify-between gap-2">
                                  <span className="text-xs font-medium">{a.outputLabel}</span>
                                  {r.completed && <span className="text-xs text-emerald-600 dark:text-emerald-400">✓</span>}
                                </div>
                                <p className="mt-0.5 text-sm text-muted-foreground whitespace-pre-line">
                                  {r.text.trim() || "Sin contenido."}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No hay resultados de etapas anteriores todavía.</p>
              )}
            </div>
          </div>
        )}

        {tab === "Decisiones" && <DecisionsPanel project={project} />}
      </div>

      <div className="flex items-center justify-between gap-2">
        <button
          onClick={goPrev}
          disabled={!hasPrev}
          className="rounded-md border px-4 py-2 text-sm disabled:opacity-40 hover:bg-accent"
        >
          ← Anterior
        </button>
        <Badge variant="secondary">Etapa {currentIdx + 1} / {recipe.steps.length}</Badge>
        <button
          onClick={goNext}
          disabled={!hasNext}
          className="rounded-md border px-4 py-2 text-sm disabled:opacity-40 hover:bg-accent"
        >
          Siguiente →
        </button>
      </div>
    </div>
  );
}
