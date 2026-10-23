import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CARDS, DISCIPLINE_LABEL, LEVEL_LABEL, PHASES, TYPE_LABEL } from "@/lib/cards";
import { CardTile } from "@/components/CardTile";
import { toggleFavorite, useAppState } from "@/lib/store";

export const Route = createFileRoute("/biblioteca")({
  head: () => ({
    meta: [
      { title: "Biblioteca de cartas — ATELIER" },
      { name: "description", content: "Busca y filtra cartas de storytelling y copywriting por fase, disciplina, tipo y nivel." },
      { property: "og:title", content: "Biblioteca de cartas — ATELIER" },
      { property: "og:description", content: "Busca y filtra cartas de storytelling y copywriting." },
    ],
  }),
  component: Biblioteca,
});

const sel = "rounded-md border bg-background px-2 py-1.5 text-sm";

function Biblioteca() {
  const [state, update] = useAppState();
  const [q, setQ] = useState("");
  const [phase, setPhase] = useState("");
  const [disc, setDisc] = useState("");
  const [type, setType] = useState("");
  const [level, setLevel] = useState("");
  const [onlyFav, setOnlyFav] = useState(false);

  const results = useMemo(() => {
    const s = q.trim().toLowerCase();
    return CARDS.filter(
      (c) =>
        (!s || `${c.id} ${c.name} ${c.summary} ${c.objectives.join(" ")}`.toLowerCase().includes(s)) &&
        (!phase || c.phase === phase) &&
        (!disc || c.discipline === disc || (c.discipline === "ambas" && disc !== "ambas")) &&
        (!type || c.type === type) &&
        (!level || c.level === level) &&
        (!onlyFav || state.favorites.includes(c.id)),
    );
  }, [q, phase, disc, type, level, onlyFav, state.favorites]);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Biblioteca</h1>
      <div className="flex flex-wrap gap-2">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar carta…" className={`${sel} min-w-56 flex-1`} />
        <select className={sel} value={phase} onChange={(e) => setPhase(e.target.value)}>
          <option value="">Todas las fases</option>
          {PHASES.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
        </select>
        <select className={sel} value={disc} onChange={(e) => setDisc(e.target.value)}>
          <option value="">Todas las disciplinas</option>
          {Object.entries(DISCIPLINE_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <select className={sel} value={type} onChange={(e) => setType(e.target.value)}>
          <option value="">Todos los tipos</option>
          {Object.entries(TYPE_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <select className={sel} value={level} onChange={(e) => setLevel(e.target.value)}>
          <option value="">Todos los niveles</option>
          {Object.entries(LEVEL_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <label className="flex items-center gap-1 text-sm">
          <input type="checkbox" checked={onlyFav} onChange={(e) => setOnlyFav(e.target.checked)} /> Solo favoritas
        </label>
      </div>
      <p className="text-sm text-muted-foreground">{results.length} cartas</p>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {results.map((c) => (
          <CardTile key={c.id} card={c} favorite={state.favorites.includes(c.id)} onToggleFavorite={() => update((s) => toggleFavorite(s, c.id))} />
        ))}
      </div>
    </div>
  );
}
