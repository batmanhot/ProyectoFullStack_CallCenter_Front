import { useMemo, useState } from 'react';
import { CheckCircle2, FileSearch, PlayCircle, ShieldCheck } from 'lucide-react';

const CRITERIA = [
  { key: 'opening', label: 'Apertura y saludo institucional' },
  { key: 'needs', label: 'Identificacion de necesidades' },
  { key: 'objections', label: 'Manejo de objeciones tecnicas' },
  { key: 'followup', label: 'Cierre y seguimiento' },
  { key: 'privacy', label: 'Proteccion de datos y privacidad' },
];

export default function QualityAudit({ audits, onSaveAudit }) {
  const [selectedId, setSelectedId] = useState(audits[0]?.id || '');
  const [comments, setComments] = useState('');
  const selectedCall = audits.find((audit) => audit.id === selectedId) || null;

  const criteriaState = useMemo(() => {
    const values = selectedCall?.criteria || {};
    return CRITERIA.reduce((acc, criterion) => ({ ...acc, [criterion.key]: values[criterion.key] ?? 5 }), {});
  }, [selectedCall]);

  const handleScoreChange = (criterionKey, value) => {
    if (!selectedCall) return;
    onSaveAudit({
      ...selectedCall,
      criteria: { ...criteriaState, [criterionKey]: Number(value) },
      comments: selectedCall.comments || '',
      score: Math.round(
        Object.values({ ...criteriaState, [criterionKey]: Number(value) }).reduce((sum, item) => sum + Number(item), 0) * 2,
      ),
    });
  };

  const finalizeAudit = () => {
    if (!selectedCall) return;
    const values = Object.values(criteriaState);
    const score = Math.round(values.reduce((sum, value) => sum + Number(value), 0) * 2);
    onSaveAudit({ ...selectedCall, criteria: criteriaState, comments, score });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Auditoria y Control de Calidad</h2>
        <p className="text-slate-500 text-sm">Evalua grabaciones, ajusta puntajes y registra observaciones del auditor.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200">
              <h3 className="font-bold text-slate-700 text-sm uppercase tracking-wider flex items-center gap-2">
                <FileSearch size={16} /> Grabaciones Recientes
              </h3>
            </div>
            <div className="divide-y divide-slate-100">
              {audits.map((rec) => (
                <button
                  type="button"
                  key={rec.id}
                  onClick={() => {
                    setSelectedId(rec.id);
                    setComments(rec.comments || '');
                  }}
                  className={`w-full p-4 flex items-center justify-between hover:bg-blue-50 cursor-pointer transition-colors text-left ${selectedCall?.id === rec.id ? 'bg-blue-50 border-l-4 border-blue-600' : ''}`}
                >
                  <div className="flex items-center gap-4">
                    <div className="text-blue-600"><PlayCircle size={32} /></div>
                    <div>
                      <p className="font-bold text-slate-800">{rec.client}</p>
                      <p className="text-xs text-slate-500">Agente: {rec.agent} | {rec.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-mono text-slate-400">{rec.duration}</p>
                    {rec.score ? <span className="text-sm font-bold text-emerald-600">{rec.score}/100</span> : <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded font-bold">PENDIENTE</span>}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          {selectedCall ? (
            <div className="bg-white border border-slate-200 rounded-xl shadow-lg p-6 sticky top-6">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><ShieldCheck className="text-blue-600" /> Evaluar {selectedCall.id}</h3>
              <div className="space-y-6">
                {CRITERIA.map((criterion) => (
                  <AuditCriteria key={criterion.key} label={criterion.label} value={criteriaState[criterion.key]} onChange={(value) => handleScoreChange(criterion.key, value)} />
                ))}
                <div className="pt-4 border-t border-slate-100">
                  <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Comentarios del Auditor</label>
                  <textarea className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none" placeholder="Fortalezas y areas de mejora..." value={comments} onChange={(event) => setComments(event.target.value)}></textarea>
                </div>
                <button type="button" onClick={finalizeAudit} className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                  <CheckCircle2 size={18} /> Finalizar Auditoria
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function AuditCriteria({ label, value, onChange }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="text-xs font-bold text-slate-700 uppercase leading-tight">{label}</label>
        <span className="text-xs font-bold text-blue-600">{value}/10</span>
      </div>
      <input type="range" min="0" max="10" value={value} onChange={(event) => onChange(event.target.value)} className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600" />
    </div>
  );
}