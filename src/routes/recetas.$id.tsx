import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getRecipe } from "@/lib/recipes";
import { getCard } from "@/lib/cards";
import { RecipeProjects } from "@/components/RecipeProjects";

export const Route = createFileRoute("/recetas/$id")({
  loader: ({ params }) => {
    const recipe = getRecipe(params.id);
    if (!recipe) throw notFound();
    return { recipe };
  },
  head: ({ loaderData }) => {
    const t = loaderData ? `${loaderData.recipe.name} — ATELIER` : "Receta no encontrada — ATELIER";
    const d = loaderData?.recipe.goal ?? "Receta no encontrada";
    return { meta: [{ title: t }, { name: "description", content: d }, { property: "og:title", content: t }, { property: "og:description", content: d }] };
  },
  notFoundComponent: () => <p>Receta no encontrada. <Link to="/recetas" className="underline">Volver</Link></p>,
  component: RecipePage,
});

function RecipePage() {
  const { recipe } = Route.useLoaderData();
  return (
    <div className="max-w-3xl space-y-4">
      <Link to="/recetas" className="text-sm text-muted-foreground hover:underline">← Recetas</Link>
      <h1 className="text-2xl font-bold">{recipe.name}</h1>
      <p className="text-muted-foreground">{recipe.goal}</p>
      <p className="rounded-md bg-muted p-3 text-sm text-muted-foreground">
        Crea un proyecto para ejecutar esta receta paso a paso en el Taller.
      </p>
      <RecipeProjects recipe={recipe} />
      <ol className="space-y-3">
        {recipe.steps.map((s, i) => (
          <li key={s.id} className="rounded-lg border p-4">
            <div className="text-xs text-muted-foreground">Paso {i + 1}</div>
            <h2 className="font-semibold">{s.title}</h2>
            <p className="text-sm"><strong>Objetivo:</strong> {s.description}</p>
            <p className="text-sm"><strong>Actividad:</strong> {s.activity}</p>
            <div className="mt-2 flex flex-wrap gap-1">
              {s.cards.map((id) => (
                <Link key={id} to="/carta/$id" params={{ id }} className="rounded bg-secondary px-2 py-0.5 text-xs hover:underline">
                  {id} {getCard(id)?.name}
                </Link>
              ))}
            </div>
            <p className="mt-2 text-sm"><strong>Resultado:</strong> {s.output}</p>
            {s.usesOutputsOf && (
              <p className="text-xs text-muted-foreground">
                Usa resultados de: {s.usesOutputsOf.map((o) => `paso ${recipe.steps.findIndex((x) => x.id === o) + 1}`).join(", ")}
              </p>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
