import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getCard, DISCIPLINE_LABEL, LEVEL_LABEL, TYPE_LABEL, type Card } from "@/lib/cards";
import { CardTile } from "@/components/CardTile";
import { addCardToProject, toggleFavorite, useAppState } from "@/lib/store";

export const Route = createFileRoute("/carta/$id")({
  loader: ({ params }) => {
    const card = getCard(params.id);
    if (!card) throw notFound();
    return { card };
  },
  head: ({ loaderData }) => {
    const t = loaderData ? `${loaderData.card.id} ${loaderData.card.name} — ATELIER` : "Carta no encontrada — ATELIER";
    const d = loaderData?.card.summary ?? "Carta no encontrada";
    return { meta: [{ title: t }, { name: "description", content: d }, { property: "og:title", content: t }, { property: "og:description", content: d }] };
  },
  notFoundComponent: () => <p>Carta no encontrada. <Link to="/biblioteca" className="underline">Volver a la biblioteca</Link></p>,
  component: CardPage,
});

const TABS = ["Aprender", "Aplicar", "Ejemplo", "Errores", "Relacionadas", "Fuentes"] as const;
type Tab = (typeof TABS)[number];

function Pending() {
  return <p className="rounded-md bg-muted p-3 text-sm text-muted-foreground">Contenido pendiente de desarrollo.</p>;
}

function List({ items }: { items?: string[] | undefined }) {
  if (!items?.length) return <Pending />;
  return <ul className="list-disc space-y-1 pl-5">{items.map((i) => <li key={i}>{i}</li>)}</ul>;
}

function CardPage() {
  const { card } = Route.useLoaderData();
  const [state, update] = useAppState();
  const [tab, setTab] = useState<Tab>("Aprender");
  const [projectId, setProjectId] = useState("");
  const fav = state.favorites.includes(card.id);
  useEffect(() => setTab("Aprender"), [card.id]);

  return (
    <div className="space-y-4">
      <Link to="/biblioteca" className="text-sm text-muted-foreground hover:underline">← Biblioteca</Link>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="font-mono text-sm text-muted-foreground">{card.id} · <span className="capitalize">{card.phase}</span> · {DISCIPLINE_LABEL[card.discipline]} · {TYPE_LABEL[card.type]} · {LEVEL_LABEL[card.level]}</div>
          <h1 className="text-2xl font-bold">{card.name}</h1>
          <p className="mt-1 max-w-2xl text-muted-foreground">{card.summary}</p>
          {card.status === "pendiente" && <p className="mt-2 text-sm font-medium">Ficha resumida: contenido completo pendiente.</p>}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button onClick={() => update((s) => toggleFavorite(s, card.id))} className="rounded-md border px-3 py-1.5 text-sm">
            {fav ? "★ Favorita" : "☆ Añadir a favoritos"}
          </button>
          {state.projects.length > 0 ? (
            <div className="flex gap-1">
              <select value={projectId} onChange={(e) => setProjectId(e.target.value)} className="rounded-md border bg-background px-2 py-1.5 text-sm">
                <option value="">Elegir proyecto…</option>
                {state.projects.map((p) => <option key={p.id} value={p.id}>{p.name}{p.cardIds.includes(card.id) ? " ✓" : ""}</option>)}
              </select>
              <button disabled={!projectId} onClick={() => update((s) => addCardToProject(s, projectId, card.id))} className="rounded-md bg-primary px-3 py-1.5 text-sm text-primary-foreground disabled:opacity-50">
                Añadir
              </button>
            </div>
          ) : (
            <Link to="/taller" className="text-sm underline">Crea un proyecto para añadir cartas</Link>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-1 border-b">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`-mb-px border-b-2 px-3 py-2 text-sm ${tab === t ? "border-primary font-semibold" : "border-transparent text-muted-foreground"}`}>
            {t}
          </button>
        ))}
      </div>

      <div className="max-w-3xl space-y-4">
        {tab === "Aprender" && <Learn card={card} />}
        {tab === "Aplicar" && <Apply card={card} />}
        {tab === "Ejemplo" && (card.example ? (
          <>
            <Section title="Ejemplo"><p className="whitespace-pre-line">{card.example}</p></Section>
            <Section title="Contraejemplo"><p className="whitespace-pre-line">{card.counterExample}</p></Section>
          </>
        ) : <Pending />)}
        {tab === "Errores" && <Section title="Errores habituales"><List items={card.mistakes} /></Section>}
        {tab === "Relacionadas" && (
          <div className="grid gap-3 sm:grid-cols-2">
            {card.related.map((id) => { const r = getCard(id); return r ? <CardTile key={id} card={r} /> : null; })}
          </div>
        )}
        {tab === "Fuentes" && (card.references?.length ? (
          <ul className="space-y-2">{card.references.map((r) => <li key={r.title}><strong>{r.author}</strong> — {r.title}{r.note && <div className="text-sm text-muted-foreground">{r.note}</div>}</li>)}</ul>
        ) : <Pending />)}
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return <section><h2 className="mb-2 font-semibold">{title}</h2>{children}</section>;
}

function Learn({ card }: { card: Card }) {
  return (
    <>
      <Section title="Objetivos y problemas que resuelve"><List items={card.objectives} /></Section>
      <Section title="Explicación">{card.explanation ? <p className="whitespace-pre-line">{card.explanation}</p> : <Pending />}</Section>
      <Section title="Cuándo utilizarla"><List items={card.whenToUse} /></Section>
      <Section title="Cuándo no utilizarla"><List items={card.whenNotToUse} /></Section>
      <Section title="Paso a paso">{card.steps ? <ol className="list-decimal space-y-1 pl-5">{card.steps.map((s) => <li key={s}>{s}</li>)}</ol> : <Pending />}</Section>
    </>
  );
}

function Apply({ card }: { card: Card }) {
  const [state, update] = useAppState();
  const saved = state.answers[card.id];
  const [values, setValues] = useState<Record<string, string>>({});
  const [msg, setMsg] = useState("");
  useEffect(() => { if (saved) setValues(saved.values); }, [saved?.savedAt]);

  if (!card.exercise) return <Pending />;
  const save = () => {
    update((s) => ({ ...s, answers: { ...s.answers, [card.id]: { cardId: card.id, projectId: s.activeProjectId, values, savedAt: new Date().toISOString() } } }));
    setMsg("Respuesta guardada.");
  };
  return (
    <div className="space-y-4">
      <p>{card.exercise.intro}</p>
      {card.exercise.fields.map((f) => (
        <label key={f.id} className="block">
          <span className="font-medium">{f.label}</span>
          {f.help && <span className="block text-sm text-muted-foreground">{f.help}</span>}
          {f.multiline ? (
            <textarea rows={4} value={values[f.id] ?? ""} onChange={(e) => setValues({ ...values, [f.id]: e.target.value })} className="mt-1 w-full rounded-md border bg-background p-2 text-sm" />
          ) : (
            <input value={values[f.id] ?? ""} onChange={(e) => setValues({ ...values, [f.id]: e.target.value })} className="mt-1 w-full rounded-md border bg-background p-2 text-sm" />
          )}
        </label>
      ))}
      <div className="flex items-center gap-3">
        <button onClick={save} className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground">Guardar respuesta</button>
        <span className="text-sm text-muted-foreground">{msg || (saved && `Última vez guardada: ${new Date(saved.savedAt).toLocaleString("es-ES")}`)}</span>
      </div>
      {card.criteria && (
        <Section title="Autoevaluación: criterios">
          <List items={card.criteria} />
        </Section>
      )}
    </div>
  );
}
