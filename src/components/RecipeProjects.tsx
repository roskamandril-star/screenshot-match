import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import type { Recipe } from "@/lib/recipes";
import { getStep, newProject, useAppState } from "@/lib/store";

/** Crear un proyecto desde una receta o continuar uno existente asociado a ella. */
export function RecipeProjects({ recipe }: { recipe: Recipe }) {
  const [state, update] = useAppState();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const existing = state.projects.filter((p) => p.recipeId === recipe.id);

  const create = () => {
    if (!name.trim()) return;
    const p = newProject(name.trim(), recipe.goal, recipe.id, recipe.steps[0]?.id);
    update((s) => ({ ...s, projects: [...s.projects, p], activeProjectId: p.id }));
    navigate({ to: "/taller", search: { proyecto: p.id } });
  };

  return (
    <div className="space-y-3 rounded-lg border p-4">
      <h2 className="font-semibold">Trabajar con esta receta</h2>
      <div className="flex flex-wrap gap-2">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nombre del nuevo proyecto" aria-label="Nombre del nuevo proyecto" className="min-w-56 flex-1 rounded-md border bg-background p-2 text-sm" />
        <button onClick={create} disabled={!name.trim()} className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground disabled:opacity-50">Crear proyecto</button>
      </div>
      {existing.length > 0 && (
        <div>
          <p className="mb-1 text-sm font-medium">Continuar un proyecto existente</p>
          <ul className="space-y-1">
            {existing.map((p) => {
              const done = recipe.steps.filter((s) => getStep(p, s.id).status === "completado").length;
              return (
                <li key={p.id}>
                  <Link to="/taller" search={{ proyecto: p.id }} className="text-sm underline">
                    {p.name} — {done}/{recipe.steps.length} pasos completados
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
