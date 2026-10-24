import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getCard } from "@/lib/cards";
import type { RecipeActivity, RecipeStep } from "@/lib/recipes";
import { getActivity, updateActivity, useAppState, type Project } from "@/lib/store";

export function ActivityPanel({
  recipeId,
  step,
  activity,
  project,
  index,
}: {
  recipeId: string;
  step: RecipeStep;
  activity: RecipeActivity;
  project: Project;
  index: number;
}) {
  const [state, update, ready] = useAppState();
  const saved = ready ? getActivity(project, step.id, activity.id) : { text: "", completed: false };
  const [text, setText] = useState(saved.text);
  const [completed, setCompleted] = useState(saved.completed);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (ready) {
      const s = getActivity(project, step.id, activity.id);
      setText(s.text);
      setCompleted(s.completed);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, project.id, recipeId, step.id, activity.id]);

  const save = () => {
    update((s) => updateActivity(s, project.id, step.id, activity.id, { text, completed }));
    setMsg("Guardado");
    setTimeout(() => setMsg(""), 2000);
  };

  const toggleComplete = () => {
    const next = !completed;
    setCompleted(next);
    update((s) => updateActivity(s, project.id, step.id, activity.id, { text, completed: next }));
  };

  const autoSave = (value: string) => {
    setText(value);
    update((s) => updateActivity(s, project.id, step.id, activity.id, { text: value, completed }));
  };

  return (
    <div className="rounded-lg border p-4 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="text-xs text-muted-foreground">Actividad {index + 1}</div>
          <h4 className="font-semibold">{activity.title}</h4>
        </div>
        <button
          onClick={toggleComplete}
          className={`shrink-0 rounded-md border px-3 py-1 text-xs transition-colors ${
            completed
              ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
              : "border-border text-muted-foreground hover:bg-accent"
          }`}
        >
          {completed ? "✓ Completada" : "Marcar completada"}
        </button>
      </div>

      <div className="space-y-1.5 text-sm">
        <p><span className="font-medium">Qué se pretende: </span>{activity.goal}</p>
        <p><span className="font-medium">Qué hacer: </span>{activity.instructions}</p>
      </div>

      <div>
        <div className="mb-1 flex flex-wrap gap-1.5">
          {activity.cardIds.map((id) => {
            const card = getCard(id);
            return (
              <Link
                key={id}
                to="/carta/$id"
                params={{ id }}
                search={{ proyecto: project.id, paso: step.id }}
                className="rounded-md border bg-secondary px-2 py-0.5 text-xs hover:bg-accent"
              >
                {id} {card?.name ?? ""}
              </Link>
            );
          })}
        </div>
      </div>

      <div>
        <label className="block">
          <span className="text-sm font-medium">Tu trabajo</span>
          <textarea
            rows={6}
            value={text}
            onChange={(e) => autoSave(e.target.value)}
            onBlur={save}
            placeholder="Escribe aquí el resultado de esta actividad. Se guarda automáticamente en este navegador."
            className="mt-1 w-full rounded-md border bg-background p-2 text-sm"
          />
        </label>
        <div className="mt-1 flex items-center gap-2">
          {msg && <span className="text-xs text-muted-foreground">{msg}</span>}
          {saved.updatedAt && !msg && (
            <span className="text-xs text-muted-foreground">
              Último guardado: {new Date(saved.updatedAt).toLocaleString("es-ES")}
            </span>
          )}
        </div>
      </div>

      <div className="rounded-md bg-muted/50 p-2.5 text-sm">
        <span className="font-medium">Resultado esperado: </span>{activity.expectedOutput}
      </div>
    </div>
  );
}
