import { useMemo, useState } from 'react';
import {
  BarChart2, Calendar, Pause, Pencil, Play,
  Plus, Save, Search, Target, Trash2, Users, X,
} from 'lucide-react';

// ─── Constants ────────────────────────────────────────────────────────────────
const EMPTY = {
  id: '', name: '', product: '', status: 'Activa',
  progress: 0, goal: 0, currentVentas: 0, agents: 1, startDate: '',
};

// ─── Form Modal ───────────────────────────────────────────────────────────────
function CampaignFormModal({ form, editing, products, onClose, onSubmit, onChange }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop — sin onClick: solo cierra con X o Cancelar */}
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-emerald-50 rounded-xl flex items-center justify-center">
              <Target size={18} className="text-emerald-600" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900">
                {editing ? 'Editar campaña' : 'Nueva campaña'}
              </h2>
              <p className="text-xs text-slate-400">
                {editing ? 'Modifica los datos de la campaña' : 'Registra una nueva campaña outbound'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={onSubmit} className="p-6 space-y-6">

          {/* Sección: Identificación */}
          <section>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.18em] mb-4">
              Datos de la campaña
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <Field label="Nombre de la campaña *">
                  <input
                    value={form.name}
                    onChange={e => onChange('name', e.target.value)}
                    placeholder="Ej: Campaña Minería Norte — Planchas A4"
                    className="inp"
                  />
                </Field>
              </div>
              <Field label="Producto principal *">
                <select
                  value={form.product}
                  onChange={e => onChange('product', e.target.value)}
                  className="inp"
                >
                  <option value="">Seleccionar producto...</option>
                  {products.map(p => (
                    <option key={p.id} value={p.name}>{p.name}</option>
                  ))}
                </select>
              </Field>
              <Field label="Estado inicial">
                <select
                  value={form.status}
                  onChange={e => onChange('status', e.target.value)}
                  className="inp"
                >
                  <option value="Activa">Activa</option>
                  <option value="Pausada">Pausada</option>
                </select>
              </Field>
            </div>
          </section>

          <div className="border-t border-slate-100" />

          {/* Sección: Métricas */}
          <section>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.18em] mb-4">
              Métricas y planificación
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Fecha de inicio *">
                <input
                  type="date"
                  value={form.startDate}
                  onChange={e => onChange('startDate', e.target.value)}
                  className="inp"
                />
              </Field>
              <Field label="Número de agentes">
                <input
                  type="number"
                  min="1"
                  value={form.agents}
                  onChange={e => onChange('agents', e.target.value)}
                  className="inp"
                />
              </Field>
              <Field label="Meta de ventas ($)">
                <input
                  type="number"
                  min="0"
                  value={form.goal}
                  onChange={e => onChange('goal', e.target.value)}
                  placeholder="0"
                  className="inp"
                />
              </Field>
              <Field label="Ventas actuales ($)">
                <input
                  type="number"
                  min="0"
                  value={form.currentVentas}
                  onChange={e => onChange('currentVentas', e.target.value)}
                  placeholder="0"
                  className="inp"
                />
              </Field>
              <div className="sm:col-span-2">
                <Field label={`Progreso actual: ${form.progress}%`}>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={form.progress}
                    onChange={e => onChange('progress', e.target.value)}
                    className="w-full accent-blue-600"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>0%</span><span>50%</span><span>100%</span>
                  </div>
                </Field>
              </div>
            </div>
          </section>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 border border-slate-200 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/20"
            >
              <Save size={15} />
              {editing ? 'Guardar cambios' : 'Crear campaña'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function CampaignManager({ campaigns, products, onSaveCampaign, onToggleCampaign, onDeleteCampaign }) {
  const [search,    setSearch]    = useState('');
  const [statusF,   setStatusF]   = useState('ALL');
  const [form,      setForm]      = useState(EMPTY);
  const [editing,   setEditing]   = useState(false);
  const [showModal, setShowModal] = useState(false);

  // ── Filtered list ──
  const filtered = useMemo(() => campaigns.filter(c => {
    const q  = search.toLowerCase();
    const ms = c.name.toLowerCase().includes(q) || c.product.toLowerCase().includes(q);
    return ms && (statusF === 'ALL' || c.status === statusF);
  }), [campaigns, search, statusF]);

  // ── KPIs ──
  const kpis = useMemo(() => ({
    total:  campaigns.length,
    active: campaigns.filter(c => c.status === 'Activa').length,
    goal:   campaigns.reduce((s, c) => s + Number(c.goal || 0), 0),
    sales:  campaigns.reduce((s, c) => s + Number(c.currentVentas || 0), 0),
  }), [campaigns]);

  // ── Handlers ──
  const onChange = (f, v) => setForm(c => ({ ...c, [f]: v }));

  const openNew = () => {
    setForm(EMPTY);
    setEditing(false);
    setShowModal(true);
  };

  const openEdit = camp => {
    setForm({ ...EMPTY, ...camp });
    setEditing(true);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setForm(EMPTY);
    setEditing(false);
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!form.name || !form.product || !form.startDate) {
      return;
    }
    onSaveCampaign({
      ...form,
      progress:      Number(form.progress),
      goal:          Number(form.goal),
      currentVentas: Number(form.currentVentas),
      agents:        Number(form.agents),
    });
    closeModal();
  };

  // ── Progress color ──
  const progressColor = pct =>
    pct >= 75 ? 'bg-emerald-500' : pct >= 40 ? 'bg-blue-500' : 'bg-amber-400';

  // ──────────────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Campañas Outbound</h2>
          <p className="text-slate-500 text-sm">Planifica, monitorea y gestiona campañas de ventas B2B.</p>
        </div>
        <button
          type="button"
          onClick={openNew}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/20"
        >
          <Plus size={16} /> Nueva campaña
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total campañas',  value: kpis.total,                           cls: 'text-slate-800'   },
          { label: 'Activas',         value: kpis.active,                          cls: 'text-emerald-600' },
          { label: 'Meta total',      value: `$${kpis.goal.toLocaleString()}`,      cls: 'text-blue-600'    },
          { label: 'Ventas actuales', value: `$${kpis.sales.toLocaleString()}`,     cls: 'text-amber-600'   },
        ].map(k => (
          <div key={k.label} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
            <p className={`text-2xl font-black ${k.cls}`}>{k.value}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mt-0.5">{k.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            placeholder="Buscar campaña o producto..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
        </div>
        <select
          value={statusF}
          onChange={e => setStatusF(e.target.value)}
          className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none bg-white focus:ring-2 focus:ring-blue-500"
        >
          <option value="ALL">Todos los estados</option>
          <option value="Activa">Activas</option>
          <option value="Pausada">Pausadas</option>
        </select>
      </div>

      {/* Table — no form here */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-5 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-wider">Campaña</th>
              <th className="px-5 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-wider hidden md:table-cell">Producto</th>
              <th className="px-5 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-wider hidden lg:table-cell">Progreso</th>
              <th className="px-5 py-3 text-right text-[10px] font-black text-slate-400 uppercase tracking-wider hidden md:table-cell">Ventas / Meta</th>
              <th className="px-5 py-3 text-center text-[10px] font-black text-slate-400 uppercase tracking-wider hidden md:table-cell">Agentes</th>
              <th className="px-5 py-3 text-center text-[10px] font-black text-slate-400 uppercase tracking-wider">Estado</th>
              <th className="px-5 py-3 text-right text-[10px] font-black text-slate-400 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-5 py-12 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <Target size={32} className="text-slate-300" />
                    <p className="text-slate-400 font-medium text-sm">No se encontraron campañas.</p>
                    <button
                      type="button"
                      onClick={openNew}
                      className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800"
                    >
                      <Plus size={13} /> Crear primera campaña
                    </button>
                  </div>
                </td>
              </tr>
            )}
            {filtered.map(camp => {
              const pct = Number(camp.progress || 0);
              return (
                <tr key={camp.id} className="hover:bg-slate-50 transition-colors">

                  {/* Campaign name */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        camp.status === 'Activa' ? 'bg-emerald-50' : 'bg-slate-100'
                      }`}>
                        <Target size={14} className={camp.status === 'Activa' ? 'text-emerald-600' : 'text-slate-400'} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">{camp.name}</p>
                        <p className="text-[11px] text-slate-400 flex items-center gap-1">
                          <Calendar size={10} /> Inicio: {camp.startDate}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Product */}
                  <td className="px-5 py-4 hidden md:table-cell">
                    <span className="text-xs font-medium text-slate-700">{camp.product}</span>
                  </td>

                  {/* Progress bar */}
                  <td className="px-5 py-4 hidden lg:table-cell">
                    <div className="flex items-center gap-2 min-w-[120px]">
                      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${progressColor(pct)}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-black text-slate-500 flex-shrink-0">{pct}%</span>
                    </div>
                  </td>

                  {/* Sales / Goal */}
                  <td className="px-5 py-4 text-right hidden md:table-cell">
                    <p className="font-bold text-slate-800">${Number(camp.currentVentas).toLocaleString()}</p>
                    <p className="text-[11px] text-slate-400">de ${Number(camp.goal).toLocaleString()}</p>
                  </td>

                  {/* Agents */}
                  <td className="px-5 py-4 text-center hidden md:table-cell">
                    <span className="flex items-center justify-center gap-1 text-xs text-slate-600">
                      <Users size={12} className="text-slate-400" /> {camp.agents}
                    </span>
                  </td>

                  {/* Status badge */}
                  <td className="px-5 py-4 text-center">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${
                      camp.status === 'Activa'
                        ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                        : 'bg-slate-100 text-slate-500 border-slate-200'
                    }`}>
                      {camp.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1">
                      {/* Pause / Resume */}
                      <button
                        type="button"
                        onClick={() => onToggleCampaign(camp.id)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          camp.status === 'Activa'
                            ? 'text-slate-400 hover:text-amber-600 hover:bg-amber-50'
                            : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50'
                        }`}
                        title={camp.status === 'Activa' ? 'Pausar' : 'Activar'}
                      >
                        {camp.status === 'Activa' ? <Pause size={14} /> : <Play size={14} />}
                      </button>
                      {/* Edit */}
                      <button
                        type="button"
                        onClick={() => openEdit(camp)}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Editar campaña"
                      >
                        <Pencil size={14} />
                      </button>
                      {/* Stats quick-view */}
                      <button
                        type="button"
                        className="p-1.5 text-slate-400 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-colors"
                        title="Ver métricas"
                      >
                        <BarChart2 size={14} />
                      </button>
                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(`¿Eliminar la campaña "${camp.name}"?\nEsta acción no se puede deshacer.`))
                            onDeleteCampaign(camp.id);
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Eliminar campaña"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <CampaignFormModal
          form={form}
          editing={editing}
          products={products}
          onClose={closeModal}
          onSubmit={handleSubmit}
          onChange={onChange}
        />
      )}
    </div>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function Field({ label, children }) {
  return (
    <label className="block">
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
        {label}
      </span>
      {children}
    </label>
  );
}
