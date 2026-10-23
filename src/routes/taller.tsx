import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { newProject, useAppState } from "@/lib/store";
import { getCard } from "@/lib/cards";
import { RECIPES } from "@/lib/recipes";

export const Route = createFileRoute("/taller")({
  head: () => ({
    meta: [
      { title: "Taller de proyectos — ATELIER" },
      { name: "description", content: "Crea proyectos, reúne cartas y redacta tus borradores." },
      { property: "og:title", content: "Taller de proyectos — ATELIER" },
      { property: "og:description", content: "Crea proyectos, reúne cartas y redacta tus borradores." },
    ],
  }),
  component: Taller,
});

const inp = "w-full rounded-md border bg-background p-2 text-sm";

function Taller() {
  const [state, update] = useAppState();
  const [name, setName] = useState("");
  const [goal, setGoal] = useState("");
  const active = state.projects.find((p) => p.id === state.activeProjectId);

  const create = () => {
    if (!name.trim()) return;
    const p = newProject(name.trim(), goal.trim());
    update((s) => ({ ...s, projects: [...s.projects, p], activeProjectId: p.id }));
    setName(""); setGoal("");
  };
  const patch = (fields: Partial<NonNullable<typeof active>>) =>
    update((s) => ({ ...s, projects: s.projects.map((p) => (p.id === s.activeProjectId ? { ...p, ...fields } : p)) }));

  return (
    <div className="grid gap-6 lg:grid-cols-[18rem_1fr]">
      <aside className="space-y-4">
        <h1 className="text-2xl font-bold">Taller</h1>
        <div className="space-y-2 rounded-lg border p-3">
          <input className={inp} placeholder="Nombre del proyecto" value={name} onChange={(e) => setName(e.target.value)} />
          <input className={inp} placeholder="Objetivo" value={goal} onChange={(e) => setGoal(e.target.value)} />
          <button onClick={create} disabled={!name.trim()} className="w-full rounded-md bg-primary py-2 text-sm text-primary-foreground disabled:opacity-50">Crear proyecto</button>
        </div>
        <ul className="space-y-1">
          {state.projects.map((p) => (
            <li key={p.id}>
              <button onClick={() => update((s) => ({ ...s, activeProjectId: p.id }))} className={`w-full rounded-md px-3 py-2 text-left text-sm ${p.id === state.activeProjectId ? "bg-secondary font-semibold" : "hover:bg-accent"}`}>
                {p.name}
              </button>
            </li>
          ))}
        </ul>
      </aside>

      {active ? (
        <section className="space-y-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h2 className="text-xl font-semibold">{active.name}</h2>
              <p className="text-sm text-muted-foreground">{active.goal || "Sin objetivo definido"}</p>
            </div>
            <button
              onClick={() => confirm("¿Eliminar este proyecto?") && update((s) => ({ ...s, projects: s.projects.filter((p) => p.id !== active.id), activeProjectId: undefined }))}
              className="rounded-md border px-3 py-1.5 text-sm text-destructive"
            >Eliminar</button>
          </div>
          <label className="block text-sm">
            <span className="font-medium">Receta asociada</span>
            <select className={inp} value={active.recipeId ?? ""} onChange={(e) => patch({ recipeId: e.target.value || undefined, currentStepId: undefined })}>
              <option value="">Ninguna</option>
              {RECIPES.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
          </label>
          <div>
            <h3 className="mb-1 text-sm font-medium">Cartas del proyecto</h3>
            {active.cardIds.length ? (
              <div className="flex flex-wrap gap-1">
                {active.cardIds.map((id) => (
                  <span key={id} className="flex items-center gap-1 rounded bg-secondary px-2 py-0.5 text-xs">
                    <Link to="/carta/$id" params={{ id }} className="hover:underline">{id} {getCard(id)?.name}</Link>
                    <button aria-label="Quitar" onClick={() => patch({ cardIds: active.cardIds.filter((c) => c !== id) })}>×</button>
                  </span>
                ))}
              </div>
            ) : <p className="text-sm text-muted-foreground">Añade cartas desde su ficha en la <Link to="/biblioteca" className="underline">biblioteca</Link>.</p>}
          </div>
          <label className="block text-sm">
            <span className="font-medium">Texto en elaboración</span>
            <textarea rows={14} className={inp} value={active.draft} onChange={(e) => patch({ draft: e.target.value })} placeholder="Escribe aquí tu borrador. Se guarda automáticamente en este navegador." />
          </label>
          <p className="rounded-md bg-muted p-3 text-sm text-muted-foreground">El mentor inteligente todavía no está disponible.</p>
        </section>
      ) : (
        <p className="text-muted-foreground">Crea o selecciona un proyecto.</p>
      )}
    </div>
  );
}
