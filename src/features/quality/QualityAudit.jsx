import { useMemo, useState } from 'react';
import {
  Building2, CheckCircle2, Mail, MessageSquare,
  Pencil, Phone, Plus, Save, ShieldCheck,
  Star, TrendingUp, Users2, X,
} from 'lucide-react';

// ─── Criterios de calidad — válidos para cualquier canal ─────────────────────
const CRITERIA = [
  { key: 'opening',    label: 'Apertura y presentación institucional' },
  { key: 'needs',      label: 'Identificación de necesidades del cliente' },
  { key: 'objections', label: 'Manejo de objeciones comerciales' },
  { key: 'followup',   label: 'Cierre y compromiso de seguimiento' },
  { key: 'privacy',    label: 'Trato y protección de datos del cliente' },
];

const CHANNEL_ICONS = {
  telefono:   <Phone       size={13} className="text-blue-500" />,
  celular:    <Phone       size={13} className="text-emerald-500" />,
  whatsapp:   <MessageSquare size={13} className="text-green-500" />,
  facebook:   <Users2      size={13} className="text-blue-600" />,
  email:      <Mail        size={13} className="text-violet-500" />,
  presencial: <Building2   size={13} className="text-amber-600" />,
};

const CHANNEL_LABELS = {
  telefono:'Teléfono', celular:'Celular', whatsapp:'WhatsApp',
  facebook:'Facebook', email:'Email', presencial:'Presencial',
};

function scoreColor(s) {
  if (s >= 80) return 'text-emerald-600';
  if (s >= 60) return 'text-amber-600';
  return 'text-red-600';
}
function scoreBg(s) {
  if (s >= 80) return 'bg-emerald-100 text-emerald-800 border-emerald-200';
  if (s >= 60) return 'bg-amber-100  text-amber-800  border-amber-200';
  return               'bg-red-100   text-red-700    border-red-200';
}
function scoreLabel(s) {
  if (s >= 80) return 'Excelente';
  if (s >= 60) return 'Aceptable';
  return               'Por mejorar';
}

// ─── Modal de evaluación ──────────────────────────────────────────────────────
function EvalModal({ record, onClose, onSave }) {
  const [criteria, setCriteria] = useState(
    CRITERIA.reduce((acc, c) => ({ ...acc, [c.key]: record?.criteria?.[c.key] ?? 5 }), {})
  );
  const [comments, setComments] = useState(record?.comments || '');
  const [agent,    setAgent]    = useState(record?.agent    || '');
  const [client,   setClient]   = useState(record?.client   || '');
  const [channel,  setChannel]  = useState(record?.channel  || 'telefono');
  const [date,     setDate]     = useState(record?.date     || new Date().toISOString().slice(0,10));

  const score = useMemo(
    () => Math.round(Object.values(criteria).reduce((s,v) => s + Number(v), 0) * 2),
    [criteria]
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 sticky top-0 bg-white z-10 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center">
              <ShieldCheck size={18} className="text-blue-600" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900">
                {record?.id?.startsWith('REC-new') ? 'Nueva evaluación' : `Evaluación — ${record?.id}`}
              </h2>
              <p className="text-xs text-slate-400">Calidad de atención al cliente · Multicanal</p>
            </div>
          </div>
          <button type="button" onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">

          {/* Datos del contacto evaluado */}
          <section>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.18em] mb-3">
              Datos del contacto
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Agente *</label>
                <input value={agent} onChange={e=>setAgent(e.target.value)} placeholder="Nombre del agente"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"/>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Cliente / Empresa *</label>
                <input value={client} onChange={e=>setClient(e.target.value)} placeholder="Empresa contactada"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"/>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Canal</label>
                <select value={channel} onChange={e=>setChannel(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500">
                  {Object.entries(CHANNEL_LABELS).map(([k,v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Fecha</label>
                <input type="date" value={date} onChange={e=>setDate(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"/>
              </div>
            </div>
          </section>

          <div className="border-t border-slate-100" />

          {/* Score preview */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-0.5">Puntaje actual</p>
              <p className={`text-3xl font-black ${scoreColor(score)}`}>
                {score}<span className="text-base font-bold text-slate-400">/100</span>
              </p>
            </div>
            <div className={`px-3 py-1.5 rounded-full text-xs font-bold border ${scoreBg(score)}`}>
              {scoreLabel(score)}
            </div>
          </div>

          {/* Criterios */}
          <section>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.18em] mb-4">
              Criterios de evaluación (0–10 por criterio)
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
                  <input type="range" min="0" max="10" value={criteria[c.key]}
                    onChange={e => setCriteria(cur => ({...cur,[c.key]:Number(e.target.value)}))}
                    className="w-full h-1.5 bg-slate-100 rounded-full appearance-none cursor-pointer accent-blue-600"/>
                </div>
              ))}
            </div>
          </section>

          <div className="border-t border-slate-100" />

          {/* Comentarios */}
          <section>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.18em] block mb-3">
              Observaciones del evaluador
            </label>
            <textarea rows={3} value={comments} onChange={e=>setComments(e.target.value)}
              placeholder="Fortalezas, áreas de mejora, recomendaciones para el agente..."
              className="w-full border border-slate-200 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none"/>
          </section>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 border-t border-slate-100 p-5 flex items-center justify-end gap-3 bg-white rounded-b-2xl">
          <button type="button" onClick={onClose}
            className="px-5 py-2.5 border border-slate-200 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-50 transition-colors">
            Cancelar
          </button>
          <button type="button"
            onClick={() => onSave({...record, agent, client, channel, date, criteria, comments, score})}
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/20">
            <Save size={15}/> Guardar evaluación
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
    const scored = audits.filter(a => a.score > 0);
    const avgScore = scored.length
      ? Math.round(scored.reduce((s,a) => s+a.score, 0) / scored.length) : 0;
    return { total:audits.length, scored:scored.length, pending:audits.filter(a=>!a.score||a.score===0).length, avgScore };
  }, [audits]);

  const openNew = () => setModalRecord({
    id: `REC-new-${Date.now()}`, agent:'', client:'', channel:'telefono',
    date: new Date().toISOString().slice(0,10), score:null, comments:'', criteria:{},
  });

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Auditoría de Calidad</h2>
          <p className="text-slate-500 text-sm">
            Evalúa la calidad de atención de cada agente en <strong>todos los canales</strong>: 
            teléfono, celular, WhatsApp, Facebook, email y visitas presenciales.
          </p>
        </div>
        <button type="button" onClick={openNew}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/20">
          <Plus size={16}/> Nueva evaluación
        </button>
      </div>

      {/* Explicación del módulo */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-start gap-3">
        <ShieldCheck size={20} className="text-blue-600 flex-shrink-0 mt-0.5"/>
        <div className="text-sm text-blue-800">
          <p className="font-bold mb-1">¿Para qué sirve este módulo?</p>
          <p className="text-blue-700 leading-relaxed">
            El supervisor o auditor selecciona un contacto que desea evaluar (puede ser cualquier canal: 
            una llamada telefónica, un chat de WhatsApp, un mensaje de Facebook, un email o una visita presencial) 
            y califica la calidad de la atención del agente según 5 criterios. 
            El resultado queda registrado y afecta el score del agente en el ranking del dashboard.
          </p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label:'Total evaluaciones', value:stats.total,    cls:'text-slate-800'             },
          { label:'Evaluadas',          value:stats.scored,   cls:'text-blue-600'              },
          { label:'Pendientes',         value:stats.pending,  cls:'text-amber-600'             },
          { label:'Score promedio',     value:stats.avgScore>0?`${stats.avgScore}/100`:'—', cls:scoreColor(stats.avgScore) },
        ].map(k => (
          <div key={k.label} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
            <p className={`text-2xl font-black ${k.cls}`}>{k.value}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mt-0.5">{k.label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-700 text-sm uppercase tracking-wider flex items-center gap-2">
            <TrendingUp size={15} className="text-blue-500"/> Registro de evaluaciones
          </h3>
          <span className="text-xs text-slate-400">{audits.length} evaluaciones</span>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-white border-b border-slate-100">
            <tr>
              <th className="px-5 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-wider">ID</th>
              <th className="px-5 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-wider">Agente</th>
              <th className="px-5 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-wider hidden md:table-cell">Cliente</th>
              <th className="px-5 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-wider hidden lg:table-cell">Canal</th>
              <th className="px-5 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-wider hidden md:table-cell">Fecha</th>
              <th className="px-5 py-3 text-center text-[10px] font-black text-slate-400 uppercase tracking-wider">Puntaje</th>
              <th className="px-5 py-3 text-right text-[10px] font-black text-slate-400 uppercase tracking-wider">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {audits.length === 0 && (
              <tr>
                <td colSpan={7} className="px-5 py-12 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <Star size={32} className="text-slate-300"/>
                    <p className="text-slate-400 font-medium text-sm">Sin evaluaciones registradas.</p>
                    <button type="button" onClick={openNew}
                      className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800">
                      <Plus size={13}/> Crear primera evaluación
                    </button>
                  </div>
                </td>
              </tr>
            )}
            {audits.map(rec => (
              <tr key={rec.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-5 py-4 font-mono text-xs text-slate-500">{rec.id}</td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center text-blue-700 text-[10px] font-black flex-shrink-0">
                      {rec.agent?.split(' ').map(n=>n[0]).join('').slice(0,2)||'?'}
                    </div>
                    <span className="font-medium text-slate-700 text-sm">{rec.agent||'—'}</span>
                  </div>
                </td>
                <td className="px-5 py-4 hidden md:table-cell text-sm text-slate-600">{rec.client||'—'}</td>
                <td className="px-5 py-4 hidden lg:table-cell">
                  <div className="flex items-center gap-1.5 text-xs text-slate-600">
                    {CHANNEL_ICONS[rec.channel]||<Phone size={13}/>}
                    {CHANNEL_LABELS[rec.channel]||rec.channel||'—'}
                  </div>
                </td>
                <td className="px-5 py-4 hidden md:table-cell text-xs text-slate-400">{rec.date}</td>
                <td className="px-5 py-4 text-center">
                  {rec.score > 0 ? (
                    <span className={`text-[11px] font-black px-2 py-1 rounded-full border ${scoreBg(rec.score)}`}>
                      {rec.score}/100
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-amber-100 text-amber-700 border border-amber-200">
                      Pendiente
                    </span>
                  )}
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end">
                    <button type="button" onClick={() => setModalRecord(rec)}
                      className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Evaluar contacto">
                      <Pencil size={14}/>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalRecord && (
        <EvalModal
          record={modalRecord}
          onClose={() => setModalRecord(null)}
          onSave={rec => { onSaveAudit(rec); setModalRecord(null); }}
        />
      )}
    </div>
  );
}
