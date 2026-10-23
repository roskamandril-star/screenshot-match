import { createFileRoute, Link } from "@tanstack/react-router";
import { RECIPES } from "@/lib/recipes";

export const Route = createFileRoute("/recetas/")({
  head: () => ({
    meta: [
      { title: "Recetas de trabajo — ATELIER" },
      { name: "description", content: "Secuencias de cartas para escribir una carta de ventas o los textos de una web." },
      { property: "og:title", content: "Recetas de trabajo — ATELIER" },
      { property: "og:description", content: "Secuencias de cartas para trabajos concretos." },
    ],
  }),
  component: () => (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Recetas</h1>
      <div className="grid gap-3 sm:grid-cols-2">
        {RECIPES.map((r) => (
          <Link key={r.id} to="/recetas/$id" params={{ id: r.id }} className="rounded-lg border p-5 hover:bg-accent">
            <h2 className="font-semibold">{r.name}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{r.goal}</p>
            <p className="mt-2 text-xs text-muted-foreground">{r.steps.length} pasos</p>
          </Link>
        ))}
      </div>
    </div>
  ),
});
