import { useState } from "react";
import {
  addDecision,
  editDecision,
  removeDecision,
  useAppState,
  type Project,
  type ProjectDecision,
} from "@/lib/store";

const inp = "w-full rounded-md border bg-background p-2 text-sm";

export function DecisionsPanel({ project }: { project: Project }) {
  const [, update] = useAppState();
  const decisions = project.decisions ?? [];
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ decision: "", justification: "", evidence: "" });

  const startAdd = () => {
    setEditingId("__new");
    setForm({ decision: "", justification: "", evidence: "" });
  };
  const startEdit = (d: ProjectDecision) => {
    setEditingId(d.id);
    setForm({ decision: d.decision, justification: d.justification, evidence: d.evidence });
  };
  const cancel = () => {
    setEditingId(null);
    setForm({ decision: "", justification: "", evidence: "" });
  };
  const save = () => {
    if (!form.decision.trim()) return;
    if (editingId === "__new") {
      update((s) => addDecision(s, project.id, form.decision.trim(), form.justification.trim(), form.evidence.trim(), project.currentStepId));
    } else if (editingId) {
      update((s) => editDecision(s, project.id, editingId, { decision: form.decision.trim(), justification: form.justification.trim(), evidence: form.evidence.trim() }));
    }
    cancel();
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Decisiones del proyecto</h3>
        {editingId === null && (
          <button onClick={startAdd} className="rounded-md border px-3 py-1 text-xs hover:bg-accent">
            + Añadir decisión
          </button>
        )}
      </div>

      {editingId !== null && (
        <div className="space-y-2 rounded-lg border p-4">
          <label className="block">
            <span className="text-sm font-medium">Decisión</span>
            <input className={`${inp} mt-1`} value={form.decision} onChange={(e) => setForm({ ...form, decision: e.target.value })} placeholder="Qué has decidido" />
          </label>
          <label className="block">
            <span className="text-sm font-medium">Justificación</span>
            <textarea rows={2} className={`${inp} mt-1`} value={form.justification} onChange={(e) => setForm({ ...form, justification: e.target.value })} placeholder="Por qué" />
          </label>
          <label className="block">
            <span className="text-sm font-medium">Evidencias disponibles</span>
            <textarea rows={2} className={`${inp} mt-1`} value={form.evidence} onChange={(e) => setForm({ ...form, evidence: e.target.value })} placeholder="Qué datos o pruebas la respaldan" />
          </label>
          <div className="flex gap-2">
            <button onClick={save} disabled={!form.decision.trim()} className="rounded-md bg-primary px-4 py-1.5 text-sm text-primary-foreground disabled:opacity-50">
              Guardar
            </button>
            <button onClick={cancel} className="rounded-md border px-4 py-1.5 text-sm hover:bg-accent">
              Cancelar
            </button>
          </div>
        </div>
      )}

      {decisions.length === 0 && editingId === null ? (
        <p className="text-sm text-muted-foreground">Aún no has registrado decisiones. Las decisiones ayudan a justificar las elecciones del proyecto y consultarlas más adelante.</p>
      ) : (
        <ul className="space-y-2">
          {decisions.map((d) => (
            <li key={d.id} className="rounded-lg border p-3 space-y-1">
              <div className="flex items-start justify-between gap-2">
                <p className="font-medium text-sm">{d.decision}</p>
                {editingId !== d.id && editingId === null && (
                  <div className="flex gap-1 shrink-0">
                    <button onClick={() => startEdit(d)} className="text-xs text-muted-foreground hover:text-foreground">Editar</button>
                    <button
                      onClick={() => confirm("¿Eliminar esta decisión?") && update((s) => removeDecision(s, project.id, d.id))}
                      className="text-xs text-destructive hover:opacity-70"
                    >Eliminar</button>
                  </div>
                )}
              </div>
              {d.justification && <p className="text-sm text-muted-foreground"><span className="font-medium">Justificación: </span>{d.justification}</p>}
              {d.evidence && <p className="text-sm text-muted-foreground"><span className="font-medium">Evidencias: </span>{d.evidence}</p>}
              <p className="text-xs text-muted-foreground">
                {new Date(d.updatedAt ?? d.at).toLocaleString("es-ES")}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
