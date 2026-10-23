import { Link } from "@tanstack/react-router";
import type { Card } from "@/lib/cards";
import { DISCIPLINE_LABEL, LEVEL_LABEL, TYPE_LABEL } from "@/lib/cards";

export function CardTile({ card, favorite, onToggleFavorite }: { card: Card; favorite?: boolean; onToggleFavorite?: () => void }) {
  return (
    <div className="flex flex-col rounded-lg border bg-card p-4">
      <div className="flex items-start justify-between gap-2">
        <span className="font-mono text-xs text-muted-foreground">{card.id}</span>
        {onToggleFavorite && (
          <button onClick={onToggleFavorite} aria-label={favorite ? "Quitar de favoritos" : "Añadir a favoritos"} className="text-lg leading-none text-primary">
            {favorite ? "★" : "☆"}
          </button>
        )}
      </div>
      <Link to="/carta/$id" params={{ id: card.id }} className="mt-1 font-semibold hover:underline">
        {card.name}
      </Link>
      <p className="mt-2 flex-1 text-sm text-muted-foreground">{card.summary}</p>
      <div className="mt-3 flex flex-wrap gap-1 text-xs">
        <span className="rounded bg-secondary px-2 py-0.5 capitalize">{card.phase}</span>
        <span className="rounded bg-secondary px-2 py-0.5">{DISCIPLINE_LABEL[card.discipline]}</span>
        <span className="rounded bg-secondary px-2 py-0.5">{TYPE_LABEL[card.type]}</span>
        <span className="rounded bg-secondary px-2 py-0.5">{LEVEL_LABEL[card.level]}</span>
        {card.status === "pendiente" && <span className="rounded bg-muted px-2 py-0.5 text-muted-foreground">Contenido pendiente</span>}
      </div>
    </div>
  );
}
