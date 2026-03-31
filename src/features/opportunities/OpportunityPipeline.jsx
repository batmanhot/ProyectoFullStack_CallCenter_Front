import { useMemo, useState } from 'react';
import { Building2, Calendar, ChevronRight, DollarSign, Pencil, Plus, Save, Trash2, X } from 'lucide-react';

// ─── Constants ────────────────────────────────────────────────────────────────
const STAGE_STYLES = {
  PROSPECCION: { border: 'border-blue-200',   badge: 'bg-blue-100 text-blue-800',    dot: 'bg-blue-500'   },
  CONTACTO:    { border: 'border-purple-200', badge: 'bg-purple-100 text-purple-800', dot: 'bg-purple-500' },
  COTIZACION:  { border: 'border-amber-200',  badge: 'bg-amber-100 text-amber-800',  dot: 'bg-amber-500'  },
  NEGOCIACION: { border: 'border-teal-200',   badge: 'bg-teal-100 text-teal-800',    dot: 'bg-teal-500'   },
  CIERRE:      { border: 'border-green-200',  badge: 'bg-green-100 text-green-800',  dot: 'bg-green-500'  },
  PERDIDO:     { border: 'border-red-200',    badge: 'bg-red-100 text-red-800',      dot: 'bg-red-400'    },
};

const STAGES = [
  { id: 'PROSPECCION', label: 'Prospección'      },
  { id: 'CONTACTO',    label: 'Contacto Inicial' },
  { id: 'COTIZACION',  label: 'Cotización'       },
  { id: 'NEGOCIACION', label: 'Negociación'      },
  { id: 'CIERRE',      label: 'Cierre'           },
  { id: 'PERDIDO',     label: 'Perdido'          },
];

const EMPTY_FORM = {
  id: '', clientId: '', clientName: '', product: '',
  value: '', stage: 'PROSPECCION', agent: '', date: '', notes: '',
};

// ─── Form Modal ───────────────────────────────────────────────────────────────
function OpportunityModal({ form, editingId, clients, products, onClose, onSubmit, onChange }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop — no onClick, solo cierra con X o Cancelar */}
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center">
              <ChevronRight size={18} className="text-blue-600" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900">
                {editingId ? 'Editar oportunidad' : 'Nueva oportunidad'}
              </h2>
              <p className="text-xs text-slate-400">
                {editingId ? 'Modifica los datos del seguimiento' : 'Registra una nueva oportunidad comercial B2B'}
              </p>
            </div>
          </div>
          <button type="button" onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={onSubmit} className="p-5 space-y-5">

          {/* Cliente + Producto */}
          <section>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.18em] mb-3">Empresa y producto</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Cliente B2B *</label>
                {clients.length > 0 ? (
                  <select value={form.clientId} onChange={e => onChange('clientId', e.target.value)} className="inp">
                    <option value="">Seleccionar cliente...</option>
                    {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                ) : (
                  <input type="text" placeholder="Nombre de empresa..." value={form.clientName}
                    onChange={e => onChange('clientName', e.target.value)} className="inp" />
                )}
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Producto *</label>
                {products.length > 0 ? (
                  <select value={form.product} onChange={e => onChange('product', e.target.value)} className="inp">
                    <option value="">Seleccionar producto...</option>
                    {products.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                  </select>
                ) : (
                  <input type="text" placeholder="Producto..." value={form.product}
                    onChange={e => onChange('product', e.target.value)} className="inp" />
                )}
              </div>
            </div>
          </section>

          <div className="border-t border-slate-100" />

          {/* Datos del pipeline */}
          <section>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.18em] mb-3">Datos del pipeline</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Valor estimado ($)</label>
                <input type="number" min="0" placeholder="0" value={form.value}
                  onChange={e => onChange('value', e.target.value)} className="inp" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Etapa *</label>
                <select value={form.stage} onChange={e => onChange('stage', e.target.value)} className="inp">
                  {STAGES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Agente asignado</label>
                <input type="text" placeholder="Nombre del agente..." value={form.agent}
                  onChange={e => onChange('agent', e.target.value)} className="inp" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Fecha de contacto</label>
                <input type="date" value={form.date} onChange={e => onChange('date', e.target.value)} className="inp" />
              </div>
              <div className="sm:col-span-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Notas</label>
                <textarea rows={2} placeholder="Observaciones sobre la oportunidad..." value={form.notes}
                  onChange={e => onChange('notes', e.target.value)}
                  className="inp resize-none" />
              </div>
            </div>
          </section>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
            <button type="button" onClick={onClose}
              className="px-5 py-2.5 border border-slate-200 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-50 transition-colors">
              Cancelar
            </button>
            <button type="submit"
              className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/20">
              <Save size={15} /> {editingId ? 'Guardar cambios' : 'Registrar oportunidad'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
// opportunities y onSaveOpportunity vienen de App.jsx (persistidos en localStorage)
export default function OpportunityPipeline({
  opportunities = [],
  onSaveOpportunity,
  onDeleteOpportunity,
  onAdvanceStage,
  clients = [],
  products = [],
  onNotify,
}) {
  const [form,       setForm]       = useState(EMPTY_FORM);
  const [showModal,  setShowModal]  = useState(false);
  const [editingId,  setEditingId]  = useState('');
  const [stageFilter, setStageFilter] = useState('ALL');

  // ── KPIs ──
  const kpis = useMemo(() => {
    const closed     = opportunities.filter(o => o.stage === 'CIERRE');
    const active     = opportunities.filter(o => o.stage !== 'PERDIDO');
    const closedValue = closed.reduce((s, o) => s + Number(o.value || 0), 0);
    const conversion  = opportunities.length ? Math.round((closed.length / opportunities.length) * 100) : 0;
    return { total: opportunities.length, active: active.length, closedValue, conversion };
  }, [opportunities]);

  // ── Filtered list ──
  const filtered = useMemo(
    () => stageFilter === 'ALL' ? opportunities : opportunities.filter(o => o.stage === stageFilter),
    [opportunities, stageFilter],
  );

  // ── Handlers ──
  const onChange = (field, value) => {
    setForm(cur => {
      const next = { ...cur, [field]: value };
      if (field === 'clientId') {
        const c = clients.find(cl => String(cl.id) === String(value));
        next.clientName = c?.name || '';
      }
      return next;
    });
  };

  const openNew  = ()    => { setForm(EMPTY_FORM); setEditingId(''); setShowModal(true); };
  const openEdit = opp   => { setForm({ ...opp }); setEditingId(opp.id); setShowModal(true); };
  const closeModal = ()  => { setShowModal(false); setForm(EMPTY_FORM); setEditingId(''); };

  const handleSubmit = e => {
    e.preventDefault();
    if (!form.clientName || !form.product || !form.stage) {
      onNotify?.('info', 'Completa cliente, producto y etapa.'); return;
    }
    onSaveOpportunity({
      ...form,
      id:    editingId || `OPP-${String(opportunities.length + 1).padStart(3, '0')}`,
      value: Number(form.value || 0),
    });
    onNotify?.('success', editingId ? 'Oportunidad actualizada.' : 'Oportunidad registrada.');
    closeModal();
  };

  // ────────────────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Seguimiento de Oportunidades</h2>
          <p className="text-slate-500 text-sm">Pipeline B2B: Prospección → Contacto → Cotización → Negociación → Cierre</p>
        </div>
        <button type="button" onClick={openNew}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/20">
          <Plus size={16} /> Nueva oportunidad
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total oportunidades',    value: kpis.total,                              cls: 'text-slate-800'   },
          { label: 'Activas',                value: kpis.active,                             cls: 'text-blue-600'    },
          { label: 'Tasa de conversión',     value: `${kpis.conversion}%`,                   cls: 'text-emerald-600' },
          { label: 'Valor cierre acumulado', value: `$${kpis.closedValue.toLocaleString()}`,  cls: 'text-amber-600'   },
        ].map(k => (
          <div key={k.label} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
            <p className={`text-2xl font-black ${k.cls}`}>{k.value}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mt-0.5">{k.label}</p>
          </div>
        ))}
      </div>

      {/* Stage filter tabs */}
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => setStageFilter('ALL')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${stageFilter === 'ALL' ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
          Todas ({opportunities.length})
        </button>
        {STAGES.map(s => {
          const style = STAGE_STYLES[s.id];
          const count = opportunities.filter(o => o.stage === s.id).length;
          return (
            <button type="button" key={s.id} onClick={() => setStageFilter(s.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${stageFilter === s.id ? `${style.badge} ${style.border}` : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
              {s.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Opportunity cards */}
      <div className="grid grid-cols-1 gap-4">
        {filtered.length === 0 && (
          <div className="bg-white border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center">
            <div className="flex flex-col items-center gap-3">
              <ChevronRight size={32} className="text-slate-300" />
              <p className="text-slate-400 font-bold">No hay oportunidades en esta etapa.</p>
              <button type="button" onClick={openNew}
                className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800">
                <Plus size={13} /> Registrar primera oportunidad
              </button>
            </div>
          </div>
        )}
        {filtered.map(opp => {
          const style     = STAGE_STYLES[opp.stage] || STAGE_STYLES.PROSPECCION;
          const stageLabel = STAGES.find(s => s.id === opp.stage)?.label || opp.stage;
          const stageIdx  = STAGES.findIndex(s => s.id === opp.stage);
          const canAdvance = stageIdx >= 0 && stageIdx < STAGES.length - 2;
          return (
            <div key={opp.id} className={`bg-white border ${style.border} rounded-2xl overflow-hidden shadow-sm flex`}>
              <div className={`w-2 flex-shrink-0 ${style.dot}`} />
              <div className="flex-1 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono text-slate-400">{opp.id}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${style.badge}`}>{stageLabel}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 size={14} className="text-slate-400" />
                    <h3 className="font-bold text-slate-800">{opp.clientName}</h3>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-500 flex-wrap">
                    <span className="font-medium">{opp.product}</span>
                    <span className="flex items-center gap-1"><DollarSign size={12} /> {Number(opp.value).toLocaleString()}</span>
                    {opp.date  && <span className="flex items-center gap-1"><Calendar size={12} /> {opp.date}</span>}
                    {opp.agent && <span>Agente: {opp.agent}</span>}
                  </div>
                  {opp.notes && <p className="text-xs text-slate-400 italic">{opp.notes}</p>}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {canAdvance && (
                    <button type="button" onClick={() => onAdvanceStage(opp.id)}
                      className="flex items-center gap-1 px-3 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-700 transition-all">
                      <ChevronRight size={14} /> Avanzar
                    </button>
                  )}
                  <button type="button" onClick={() => openEdit(opp)}
                    className="p-2 border border-slate-200 rounded-xl text-slate-400 hover:text-blue-600 hover:border-blue-200 transition-colors">
                    <Pencil size={14} />
                  </button>
                  <button type="button" onClick={() => onDeleteOpportunity(opp.id)}
                    className="p-2 border border-slate-200 rounded-xl text-slate-400 hover:text-rose-500 hover:border-rose-200 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {showModal && (
        <OpportunityModal
          form={form}
          editingId={editingId}
          clients={clients}
          products={products}
          onClose={closeModal}
          onSubmit={handleSubmit}
          onChange={onChange}
        />
      )}
    </div>
  );
}
