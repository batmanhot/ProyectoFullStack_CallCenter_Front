import { useMemo, useState } from 'react';
import { CheckCircle2, FileSearch, Mic, Pencil, PlayCircle, Plus, Save, ShieldCheck, X } from 'lucide-react';

// ─── Constants ────────────────────────────────────────────────────────────────
const CRITERIA = [
  { key: 'opening',    label: 'Apertura y saludo institucional'  },
  { key: 'needs',      label: 'Identificación de necesidades'    },
  { key: 'objections', label: 'Manejo de objeciones técnicas'    },
  { key: 'followup',   label: 'Cierre y seguimiento'             },
  { key: 'privacy',    label: 'Protección de datos y privacidad' },
];

function scoreColor(score) {
  if (score >= 80) return 'text-emerald-600';
  if (score >= 60) return 'text-amber-600';
  return 'text-red-600';
}

function scoreBg(score) {
  if (score >= 80) return 'bg-emerald-100 text-emerald-800 border-emerald-200';
  if (score >= 60) return 'bg-amber-100 text-amber-800 border-amber-200';
  return 'bg-red-100 text-red-700 border-red-200';
}

// ─── Audit Modal ──────────────────────────────────────────────────────────────
function AuditModal({ record, onClose, onSave }) {
  const [criteria, setCriteria] = useState(
    CRITERIA.reduce((acc, c) => ({ ...acc, [c.key]: record?.criteria?.[c.key] ?? 5 }), {})
  );
  const [comments, setComments] = useState(record?.comments || '');

  const score = useMemo(
    () => Math.round(Object.values(criteria).reduce((s, v) => s + Number(v), 0) * 2),
    [criteria]
  );

  const handleSave = () => {
    onSave({ ...record, criteria, comments, score });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop — no onClick, solo cierra con X o Cancelar */}
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 sticky top-0 bg-white z-10 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center">
              <ShieldCheck size={18} className="text-blue-600" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900">Evaluar grabación — {record?.id}</h2>
              <p className="text-xs text-slate-400">
                {record?.agent} · {record?.client} · {record?.date}
              </p>
            </div>
          </div>
          <button type="button" onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">

          {/* Score preview */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-0.5">
                Puntaje actual
              </p>
              <p className={`text-3xl font-black ${scoreColor(score)}`}>{score}<span className="text-base font-bold text-slate-400">/100</span></p>
            </div>
            <div className={`px-3 py-1.5 rounded-full text-xs font-bold border ${scoreBg(score)}`}>
              {score >= 80 ? 'Excelente' : score >= 60 ? 'Regular' : 'Por mejorar'}
            </div>
          </div>

          {/* Criteria sliders */}
          <section>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.18em] mb-4">
              Criterios de evaluación
            </p>
            <div className="space-y-4">
              {CRITERIA.map(c => (
                <div key={c.key}>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-bold text-slate-700">{c.label}</label>
                    <span className="text-xs font-black text-blue-600 tabular-nums">
                      {criteria[c.key]}<span className="text-slate-400 font-normal">/10</span>
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={criteria[c.key]}
                    onChange={e => setCriteria(cur => ({ ...cur, [c.key]: Number(e.target.value) }))}
                    className="w-full h-1.5 bg-slate-100 rounded-full appearance-none cursor-pointer accent-blue-600"
                  />
                </div>
              ))}
            </div>
          </section>

          <div className="border-t border-slate-100" />

          {/* Comments */}
          <section>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.18em] block mb-3">
              Comentarios del auditor
            </label>
            <textarea
              rows={3}
              value={comments}
              onChange={e => setComments(e.target.value)}
              placeholder="Fortalezas observadas, áreas de mejora, recomendaciones..."
              className="w-full border border-slate-200 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </section>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 border-t border-slate-100 p-5 flex items-center justify-end gap-3 bg-white rounded-b-2xl">
          <button type="button" onClick={onClose}
            className="px-5 py-2.5 border border-slate-200 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-50 transition-colors">
            Cancelar
          </button>
          <button type="button" onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/20">
            <Save size={15} /> Guardar evaluación
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function QualityAudit({ audits, onSaveAudit }) {
  const [modalRecord, setModalRecord] = useState(null);

  const stats = useMemo(() => {
    const scored   = audits.filter(a => a.score !== null);
    const avgScore = scored.length
      ? Math.round(scored.reduce((s, a) => s + a.score, 0) / scored.length)
      : 0;
    return {
      total:   audits.length,
      scored:  scored.length,
      pending: audits.filter(a => !a.score).length,
      avgScore,
    };
  }, [audits]);

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Auditoría y Control de Calidad</h2>
          <p className="text-slate-500 text-sm">Evalúa grabaciones de llamadas y registra el puntaje de cada agente.</p>
        </div>
        <button type="button" onClick={() => setModalRecord({ id: `REC-${Date.now()}`, agent: '', client: '', date: new Date().toISOString().slice(0, 10), duration: '00:00', score: null, comments: '', criteria: {} })}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/20">
          <Plus size={16} /> Nueva auditoría
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total grabaciones', value: stats.total,   cls: 'text-slate-800'   },
          { label: 'Evaluadas',         value: stats.scored,  cls: 'text-blue-600'    },
          { label: 'Pendientes',        value: stats.pending, cls: 'text-amber-600'   },
          { label: 'Score promedio',    value: stats.avgScore > 0 ? `${stats.avgScore}/100` : '—', cls: scoreColor(stats.avgScore) },
        ].map(k => (
          <div key={k.label} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
            <p className={`text-2xl font-black ${k.cls}`}>{k.value}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mt-0.5">{k.label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center gap-2">
          <FileSearch size={15} className="text-slate-500" />
          <h3 className="font-bold text-slate-700 text-sm uppercase tracking-wider">Grabaciones recientes</h3>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-white border-b border-slate-100">
            <tr>
              <th className="px-5 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-wider">Grabación</th>
              <th className="px-5 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-wider hidden md:table-cell">Agente</th>
              <th className="px-5 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-wider hidden lg:table-cell">Cliente</th>
              <th className="px-5 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-wider hidden md:table-cell">Duración</th>
              <th className="px-5 py-3 text-center text-[10px] font-black text-slate-400 uppercase tracking-wider">Puntaje</th>
              <th className="px-5 py-3 text-right text-[10px] font-black text-slate-400 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {audits.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <Mic size={32} className="text-slate-300" />
                    <p className="text-slate-400 font-medium text-sm">Sin grabaciones registradas.</p>
                  </div>
                </td>
              </tr>
            )}
            {audits.map(rec => (
              <tr key={rec.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <PlayCircle size={16} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="font-mono text-xs font-bold text-slate-700">{rec.id}</p>
                      <p className="text-[11px] text-slate-400">{rec.date}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 hidden md:table-cell text-sm font-medium text-slate-700">{rec.agent}</td>
                <td className="px-5 py-4 hidden lg:table-cell text-sm text-slate-600">{rec.client}</td>
                <td className="px-5 py-4 hidden md:table-cell font-mono text-xs text-slate-400">{rec.duration}</td>
                <td className="px-5 py-4 text-center">
                  {rec.score !== null && rec.score !== undefined && rec.score > 0 ? (
                    <span className={`text-sm font-black px-2 py-1 rounded-full border text-[11px] ${scoreBg(rec.score)}`}>
                      {rec.score}/100
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-amber-100 text-amber-700 border border-amber-200">
                      Pendiente
                    </span>
                  )}
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-1">
                    <button type="button" onClick={() => setModalRecord(rec)}
                      className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Evaluar grabación">
                      <Pencil size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modalRecord && (
        <AuditModal
          record={modalRecord}
          onClose={() => setModalRecord(null)}
          onSave={record => { onSaveAudit(record); setModalRecord(null); }}
        />
      )}
    </div>
  );
}
