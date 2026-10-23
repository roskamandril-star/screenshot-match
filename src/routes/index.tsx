import { createFileRoute, Link } from "@tanstack/react-router";
import { PHASES, CARDS } from "@/lib/cards";
import { RECIPES } from "@/lib/recipes";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ATELIER — Storytelling y copywriting" },
      { name: "description", content: "Biblioteca de cartas, recetas y taller para aprender storytelling y copywriting." },
      { property: "og:title", content: "ATELIER — Storytelling y copywriting" },
      { property: "og:description", content: "Biblioteca de cartas, recetas y taller para aprender storytelling y copywriting." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold">ATELIER</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Técnicas de storytelling y copywriting en forma de cartas, organizadas en cuatro fases y combinables en recetas de trabajo.
        </p>
      </section>
      <div className="grid gap-4 sm:grid-cols-3">
        <Link to="/biblioteca" className="rounded-lg border p-5 hover:bg-accent">
          <h2 className="font-semibold">Biblioteca</h2>
          <p className="mt-1 text-sm text-muted-foreground">{CARDS.length} cartas para consultar y practicar.</p>
        </Link>
        <Link to="/recetas" className="rounded-lg border p-5 hover:bg-accent">
          <h2 className="font-semibold">Recetas</h2>
          <p className="mt-1 text-sm text-muted-foreground">{RECIPES.length} secuencias de trabajo.</p>
        </Link>
        <Link to="/taller" className="rounded-lg border p-5 hover:bg-accent">
          <h2 className="font-semibold">Taller</h2>
          <p className="mt-1 text-sm text-muted-foreground">Tus proyectos y borradores.</p>
        </Link>
      </div>
      <section>
        <h2 className="mb-3 text-lg font-semibold">Las cuatro fases</h2>
        <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {PHASES.map((p, i) => (
            <li key={p.id} className="rounded-lg border p-4">
              <div className="text-xs text-muted-foreground">Fase {i + 1}</div>
              <div className="font-semibold">{p.label}</div>
              <p className="mt-1 text-sm text-muted-foreground">{p.description}</p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
