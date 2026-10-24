import { Link } from "@tanstack/react-router";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { getCard } from "@/lib/cards";
import type { Recipe, RecipeStep } from "@/lib/recipes";
import { getStep, goToStep, updateStep, useAppState, type Project, type StepStatus } from "@/lib/store";

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

export function RecipeRunner({ recipe, project }: { recipe: Recipe; project: Project }) {
  const [, update] = useAppState();
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

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-sm font-semibold">Progreso de la receta</h3>
          <span className="text-sm text-muted-foreground">{completedCount}/{recipe.steps.length} completados</span>
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
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-xs text-muted-foreground">Paso {currentIdx + 1} de {recipe.steps.length}</div>
            <h3 className="text-lg font-semibold">{step.title}</h3>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm"><span className="font-medium">Objetivo: </span>{step.description}</p>
          <p className="text-sm"><span className="font-medium">Actividad: </span>{step.activity}</p>
        </div>

        <div>
          <h4 className="mb-1.5 text-sm font-medium">Cartas relacionadas</h4>
          <div className="flex flex-wrap gap-1.5">
            {step.cards.map((id) => {
              const card = getCard(id);
              return (
                <Link
                  key={id}
                  to="/carta/$id"
                  params={{ id }}
                  search={{ proyecto: project.id, paso: step.id }}
                  className="rounded-md border bg-secondary px-2.5 py-1 text-xs hover:bg-accent"
                >
                  {id} {card?.name ?? ""}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="rounded-md bg-muted/50 p-3 text-sm">
          <span className="font-medium">Resultado esperado: </span>{step.output}
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
                    paso {depIdx + 1}{dep ? ` (${dep.title})` : ""}
                  </button>
                </span>
              );
            })}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2 border-t pt-3">
          <span className="text-sm font-medium">Estado:</span>
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

      <div className="flex items-center justify-between gap-2">
        <button
          onClick={goPrev}
          disabled={!hasPrev}
          className="rounded-md border px-4 py-2 text-sm disabled:opacity-40 hover:bg-accent"
        >
          ← Anterior
        </button>
        <Badge variant="secondary">Paso {currentIdx + 1} / {recipe.steps.length}</Badge>
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
