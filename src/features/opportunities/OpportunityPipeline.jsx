import { useMemo, useState } from 'react';
import { Building2, Calendar, ChevronRight, DollarSign, Pencil, Plus, Save, Trash2, X } from 'lucide-react';

const STAGE_STYLES = {
  PROSPECCION: { border: 'border-blue-200',   badge: 'bg-blue-100 text-blue-800',    dot: 'bg-blue-500' },
  CONTACTO:    { border: 'border-purple-200', badge: 'bg-purple-100 text-purple-800', dot: 'bg-purple-500' },
  COTIZACION:  { border: 'border-amber-200',  badge: 'bg-amber-100 text-amber-800',   dot: 'bg-amber-500' },
  NEGOCIACION: { border: 'border-teal-200',   badge: 'bg-teal-100 text-teal-800',    dot: 'bg-teal-500' },
  CIERRE:      { border: 'border-green-200',  badge: 'bg-green-100 text-green-800',   dot: 'bg-green-500' },
  PERDIDO:     { border: 'border-red-200',    badge: 'bg-red-100 text-red-800',       dot: 'bg-red-400' },
};

const STAGES = [
  { id: 'PROSPECCION', label: 'Prospección' },
  { id: 'CONTACTO',    label: 'Contacto Inicial' },
  { id: 'COTIZACION',  label: 'Cotización' },
  { id: 'NEGOCIACION', label: 'Negociación' },
  { id: 'CIERRE',      label: 'Cierre' },
  { id: 'PERDIDO',     label: 'Perdido' },
];

const INITIAL_OPPORTUNITIES = [
  { id: 'OPP-001', clientId: 1, clientName: 'Minera del Norte S.A.', product: 'Planchas de Metal A4', value: 36000, stage: 'COTIZACION',  agent: 'Ana Garcia',  date: '2026-03-10', notes: 'Cliente interesado en volumen mensual.' },
  { id: 'OPP-002', clientId: 2, clientName: 'Aceros Industriales',   product: 'Válvulas Hidráulicas', value: 17000, stage: 'NEGOCIACION', agent: 'Carlos Ruiz', date: '2026-03-15', notes: 'Esperan aprobación de directorio.' },
  { id: 'OPP-003', clientId: 3, clientName: 'Válvulas del Sur S.A.C.',product: 'Carbón para Motores',  value:  9000, stage: 'PROSPECCION', agent: 'Luis Torres', date: '2026-03-22', notes: 'Primera llamada de contacto realizada.' },
  { id: 'OPP-004', clientId: 1, clientName: 'Minera del Norte S.A.', product: 'Carbón para Motores',  value: 13500, stage: 'CIERRE',       agent: 'Ana Garcia',  date: '2026-03-05', notes: 'Contrato firmado.' },
];

const EMPTY_FORM = { id: '', clientId: '', clientName: '', product: '', value: '', stage: 'PROSPECCION', agent: '', date: '', notes: '' };

export default function OpportunityPipeline({ clients = [], products = [], onNotify }) {
  const [opportunities, setOpportunities] = useState(INITIAL_OPPORTUNITIES);
  const [form, setForm] = useState(EMPTY_FORM);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState('');
  const [stageFilter, setStageFilter] = useState('ALL');

  const kpis = useMemo(() => {
    const closed = opportunities.filter((o) => o.stage === 'CIERRE');
    const active  = opportunities.filter((o) => o.stage !== 'PERDIDO');
    const closedValue = closed.reduce((s, o) => s + Number(o.value || 0), 0);
    const conversion = opportunities.length ? Math.round((closed.length / opportunities.length) * 100) : 0;
    return { total: opportunities.length, active: active.length, closedValue, conversion };
  }, [opportunities]);

  const filtered = useMemo(
    () => (stageFilter === 'ALL' ? opportunities : opportunities.filter((o) => o.stage === stageFilter)),
    [opportunities, stageFilter],
  );

  const handleChange = (field, value) => {
    setForm((cur) => {
      const next = { ...cur, [field]: value };
      if (field === 'clientId') {
        const c = clients.find((cl) => String(cl.id) === String(value));
        next.clientName = c?.name || '';
      }
      return next;
    });
  };

  const resetForm = () => { setForm(EMPTY_FORM); setShowForm(false); setEditingId(''); };

  const handleSubmit = () => {
    if (!form.clientName || !form.product || !form.stage) {
      onNotify?.('info', 'Completa cliente, producto y etapa.'); return;
    }
    setOpportunities((cur) => {
      if (editingId) return cur.map((o) => (o.id === editingId ? { ...form, id: editingId, value: Number(form.value || 0) } : o));
      const nextId = `OPP-${String(cur.length + 1).padStart(3, '0')}`;
      return [...cur, { ...form, id: nextId, value: Number(form.value || 0) }];
    });
    onNotify?.('success', editingId ? 'Oportunidad actualizada.' : 'Oportunidad registrada.');
    resetForm();
  };

  const handleEdit = (opp) => { setForm({ ...opp }); setEditingId(opp.id); setShowForm(true); };

  const advanceStage = (id) => {
    setOpportunities((cur) => cur.map((o) => {
      if (o.id !== id) return o;
      const idx = STAGES.findIndex((s) => s.id === o.stage);
      if (idx >= STAGES.length - 2) return o;
      return { ...o, stage: STAGES[idx + 1].id };
    }));
    onNotify?.('success', 'Oportunidad avanzada de etapa.');
  };

  const deleteOpp = (id) => {
    setOpportunities((cur) => cur.filter((o) => o.id !== id));
    onNotify?.('success', 'Oportunidad eliminada.');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Seguimiento de Oportunidades</h2>
          <p className="text-slate-500 text-sm">Pipeline B2B: Prospección → Contacto → Cotización → Negociación → Cierre</p>
        </div>
        <button type="button" onClick={() => { resetForm(); setShowForm(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/20">
          <Plus size={16} /> Nueva Oportunidad
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total oportunidades',     value: kpis.total },
          { label: 'Activas',                 value: kpis.active },
          { label: 'Tasa de conversión',      value: `${kpis.conversion}%` },
          { label: 'Valor cierre acumulado',  value: `$${kpis.closedValue.toLocaleString()}` },
        ].map((k) => (
          <div key={k.label} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wide mb-1">{k.label}</p>
            <p className="text-2xl font-black text-slate-800">{k.value}</p>
          </div>
        ))}
      </div>

      {/* Stage filter tabs */}
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => setStageFilter('ALL')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${stageFilter === 'ALL' ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
          Todas ({opportunities.length})
        </button>
        {STAGES.map((s) => {
          const style = STAGE_STYLES[s.id];
          const count = opportunities.filter((o) => o.stage === s.id).length;
          return (
            <button type="button" key={s.id} onClick={() => setStageFilter(s.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${stageFilter === s.id ? `${style.badge} ${style.border}` : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
              {s.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-slate-800">{editingId ? 'Editar Oportunidad' : 'Nueva Oportunidad'}</h3>
            <button type="button" onClick={resetForm} className="text-slate-400 hover:text-slate-700"><X size={18} /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Cliente B2B</label>
              {clients.length > 0 ? (
                <select value={form.clientId} onChange={(e) => handleChange('clientId', e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Seleccionar cliente...</option>
                  {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              ) : (
                <input type="text" placeholder="Nombre de empresa..." value={form.clientName}
                  onChange={(e) => handleChange('clientName', e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
              )}
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Producto</label>
              {products.length > 0 ? (
                <select value={form.product} onChange={(e) => handleChange('product', e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Seleccionar producto...</option>
                  {products.map((p) => <option key={p.id} value={p.name}>{p.name}</option>)}
                </select>
              ) : (
                <input type="text" placeholder="Producto..." value={form.product}
                  onChange={(e) => handleChange('product', e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
              )}
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Valor estimado ($)</label>
              <input type="number" min="0" placeholder="0" value={form.value}
                onChange={(e) => handleChange('value', e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Etapa</label>
              <select value={form.stage} onChange={(e) => handleChange('stage', e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500">
                {STAGES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Agente asignado</label>
              <input type="text" placeholder="Nombre del agente..." value={form.agent}
                onChange={(e) => handleChange('agent', e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Fecha de contacto</label>
              <input type="date" value={form.date} onChange={(e) => handleChange('date', e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Notas</label>
              <textarea rows={2} placeholder="Observaciones de la oportunidad..." value={form.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button type="button" onClick={handleSubmit}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700">
              <Save size={16} /> {editingId ? 'Actualizar' : 'Registrar'}
            </button>
            <button type="button" onClick={resetForm}
              className="px-4 py-2 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50">
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Opportunity list */}
      <div className="grid grid-cols-1 gap-4">
        {filtered.length === 0 && (
          <div className="bg-white border-2 border-dashed border-slate-200 rounded-2xl p-10 text-center">
            <p className="text-slate-400 font-bold">No hay oportunidades en esta etapa.</p>
          </div>
        )}
        {filtered.map((opp) => {
          const style = STAGE_STYLES[opp.stage] || STAGE_STYLES.PROSPECCION;
          const stageLabel = STAGES.find((s) => s.id === opp.stage)?.label || opp.stage;
          const stageIdx = STAGES.findIndex((s) => s.id === opp.stage);
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
                    {opp.date && <span className="flex items-center gap-1"><Calendar size={12} /> {opp.date}</span>}
                    {opp.agent && <span>Agente: {opp.agent}</span>}
                  </div>
                  {opp.notes && <p className="text-xs text-slate-400 italic">{opp.notes}</p>}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {canAdvance && (
                    <button type="button" onClick={() => advanceStage(opp.id)}
                      className="flex items-center gap-1 px-3 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-700 transition-all">
                      <ChevronRight size={14} /> Avanzar
                    </button>
                  )}
                  <button type="button" onClick={() => handleEdit(opp)}
                    className="p-2 border border-slate-200 rounded-xl text-slate-400 hover:text-blue-600 hover:border-blue-200 transition-colors">
                    <Pencil size={14} />
                  </button>
                  <button type="button" onClick={() => deleteOpp(opp.id)}
                    className="p-2 border border-slate-200 rounded-xl text-slate-400 hover:text-rose-500 hover:border-rose-200 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
