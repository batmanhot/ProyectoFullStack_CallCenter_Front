import { useMemo, useState } from 'react';
import {
  Bell, Building2, Calendar, CheckCircle2, ChevronRight,
  Clock, FileText, Filter, Mail, MessageSquare,
  Pencil, Phone, Plus, Save, Search, Trash2, TrendingUp, Users2, X,
} from 'lucide-react';
import CallConsole from './CallConsole';

// ─── Constants ────────────────────────────────────────────────────────────────

const CHANNELS = [
  { id: 'telefono',  label: 'Teléfono fijo',   icon: <Phone size={14} className="text-blue-500" />        },
  { id: 'celular',   label: 'Celular',          icon: <Phone size={14} className="text-emerald-500" />     },
  { id: 'whatsapp',  label: 'WhatsApp',         icon: <MessageSquare size={14} className="text-emerald-600" /> },
  { id: 'facebook',  label: 'Facebook/Messenger', icon: <Users2 size={14} className="text-blue-600" />     },
  { id: 'email',     label: 'Correo electrónico', icon: <Mail size={14} className="text-violet-500" />     },
  { id: 'presencial',label: 'Presencial/Visita', icon: <Building2 size={14} className="text-amber-600" />  },
];

const CHANNEL_META = Object.fromEntries(CHANNELS.map(c => [c.id, c]));

const DISPOSITIONS = [
  { id: 'interesado',        label: 'Interesado',              color: 'bg-emerald-100 text-emerald-800 border-emerald-200', dot: 'bg-emerald-500',  followUp: false },
  { id: 'solicita_cot',      label: 'Solicita Cotización',     color: 'bg-blue-100 text-blue-800 border-blue-200',          dot: 'bg-blue-500',     followUp: false },
  { id: 'volver_llamar',     label: 'Volver a contactar',      color: 'bg-amber-100 text-amber-800 border-amber-200',       dot: 'bg-amber-500',    followUp: true  },
  { id: 'en_evaluacion',     label: 'En evaluación interna',   color: 'bg-violet-100 text-violet-800 border-violet-200',    dot: 'bg-violet-500',   followUp: true  },
  { id: 'no_contesta',       label: 'No contesta',             color: 'bg-slate-100 text-slate-600 border-slate-200',       dot: 'bg-slate-400',    followUp: true  },
  { id: 'no_interesa',       label: 'No le interesa',          color: 'bg-red-100 text-red-700 border-red-200',             dot: 'bg-red-500',      followUp: false },
  { id: 'cerrado',           label: 'Venta cerrada',           color: 'bg-emerald-100 text-emerald-900 border-emerald-300', dot: 'bg-emerald-600',  followUp: false },
  { id: 'datos_erroneos',    label: 'Datos incorrectos',       color: 'bg-slate-100 text-slate-500 border-slate-200',       dot: 'bg-slate-300',    followUp: false },
];

const DISP_META = Object.fromEntries(DISPOSITIONS.map(d => [d.id, d]));

const EMPTY_FORM = {
  id: '', clientId: '', clientName: '', contactName: '', phone: '',
  channel: 'telefono', disposition: '', notes: '',
  date: new Date().toISOString().slice(0, 10),
  time: new Date().toTimeString().slice(0, 5),
  duration: '', agent: '', followUpDate: '',
};

// ─── Register/Edit Modal ──────────────────────────────────────────────────────
function InteractionModal({ form, editingId, clients, currentUser, onClose, onSubmit, onChange }) {
  const disp = DISP_META[form.disposition];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 sticky top-0 bg-white z-10 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center">
              <Phone size={18} className="text-blue-600" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900">
                {editingId ? 'Editar interacción' : 'Registrar interacción'}
              </h2>
              <p className="text-xs text-slate-400">
                {editingId ? 'Modifica los datos del contacto' : 'Registra cualquier contacto: llamada, WhatsApp, Facebook, visita...'}
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

          {/* Sección: Empresa y contacto */}
          <section>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.18em] mb-3">Empresa y contacto</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Empresa *</label>
                {clients.length > 0 ? (
                  <select
                    value={form.clientId}
                    onChange={e => {
                      const c = clients.find(x => String(x.id) === e.target.value);
                      onChange('clientId',    e.target.value);
                      onChange('clientName',  c?.name    || '');
                      onChange('contactName', c?.contact || '');
                      onChange('phone',       c?.phone   || '');
                    }}
                    className="inp"
                  >
                    <option value="">Seleccionar empresa...</option>
                    {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                ) : (
                  <input type="text" placeholder="Nombre de empresa..." value={form.clientName}
                    onChange={e => onChange('clientName', e.target.value)} className="inp" />
                )}
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Contacto / Persona</label>
                <input type="text" placeholder="Nombre de quien atendió..." value={form.contactName}
                  onChange={e => onChange('contactName', e.target.value)} className="inp" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Número / Cuenta</label>
                <input type="text" placeholder="Teléfono, celular, usuario FB..." value={form.phone}
                  onChange={e => onChange('phone', e.target.value)} className="inp" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Agente que contactó</label>
                <input type="text" placeholder="Nombre del agente..." value={form.agent || currentUser?.name || ''}
                  onChange={e => onChange('agent', e.target.value)} className="inp" />
              </div>
            </div>
          </section>

          <div className="border-t border-slate-100" />

          {/* Sección: Canal y fecha */}
          <section>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.18em] mb-3">Canal de comunicación</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
              {CHANNELS.map(ch => (
                <button key={ch.id} type="button"
                  onClick={() => onChange('channel', ch.id)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-semibold transition-all ${
                    form.channel === ch.id
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}>
                  {ch.icon} {ch.label}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Fecha *</label>
                <input type="date" value={form.date} onChange={e => onChange('date', e.target.value)} className="inp" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Hora</label>
                <input type="time" value={form.time} onChange={e => onChange('time', e.target.value)} className="inp" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Duración (min)</label>
                <input type="number" min="0" placeholder="0" value={form.duration}
                  onChange={e => onChange('duration', e.target.value)} className="inp" />
              </div>
            </div>
          </section>

          <div className="border-t border-slate-100" />

          {/* Sección: Estado / Resultado */}
          <section>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.18em] mb-3">Estado del contacto *</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {DISPOSITIONS.map(d => (
                <button key={d.id} type="button"
                  onClick={() => onChange('disposition', d.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-bold transition-all ${
                    form.disposition === d.id
                      ? `${d.color} ring-2 ring-offset-1 ring-blue-500`
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}>
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${form.disposition === d.id ? d.dot : 'bg-slate-300'}`} />
                  {d.label}
                </button>
              ))}
            </div>
            {disp?.followUp && (
              <div className="mt-3 bg-amber-50 border border-amber-200 rounded-xl p-3">
                <label className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                  <Bell size={10} /> Programar seguimiento para
                </label>
                <input type="date" value={form.followUpDate}
                  onChange={e => onChange('followUpDate', e.target.value)}
                  className="w-full border border-amber-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-500 bg-white" />
              </div>
            )}
          </section>

          <div className="border-t border-slate-100" />

          {/* Sección: Notas */}
          <section>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.18em] mb-3">Notas del contacto</p>
            <textarea
              rows={3}
              value={form.notes}
              onChange={e => onChange('notes', e.target.value)}
              placeholder="Detalles del producto consultado, volumen de compra, plazos, objeciones, próximos pasos..."
              className="inp resize-none"
            />
          </section>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 border-t border-slate-100 p-5 flex items-center justify-end gap-3 rounded-b-2xl">
          <button type="button" onClick={onClose}
            className="px-5 py-2.5 border border-slate-200 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-50 transition-colors">
            Cancelar
          </button>
          <button type="button" onClick={onSubmit}
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/20">
            <Save size={15} /> {editingId ? 'Guardar cambios' : 'Registrar contacto'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Quick Action Panel (escalar al cliente) ──────────────────────────────────
function EscalationPanel({ interaction, clients, onClose, onNavigate }) {
  const client = clients.find(c => String(c.id) === String(interaction.clientId));
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="p-5 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp size={16} className="text-blue-600" /> Escalar — {interaction.clientName}
            </h3>
            <button type="button" onClick={onClose}><X size={18} className="text-slate-400" /></button>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Selecciona la acción para asegurar la venta con este cliente.
          </p>
        </div>
        <div className="p-5 space-y-2">
          {[
            { label: 'Crear cotización B2B',      icon: <FileText size={16} />,    tab: 'quotes',        color: 'bg-blue-600 text-white hover:bg-blue-700',        desc: 'Genera una propuesta comercial para este cliente' },
            { label: 'Registrar oportunidad',     icon: <TrendingUp size={16} />,  tab: 'opportunities', color: 'bg-emerald-600 text-white hover:bg-emerald-700',   desc: 'Agrega al pipeline de seguimiento comercial' },
            { label: 'Programar follow-up',       icon: <Bell size={16} />,        tab: 'followups',     color: 'bg-amber-500 text-white hover:bg-amber-600',        desc: 'Agenda el próximo contacto con fecha y hora' },
            { label: 'Ver ficha del cliente',     icon: <Building2 size={16} />,   tab: 'crm',           color: 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50', desc: 'Historial completo, contactos y etapa comercial' },
          ].map(a => (
            <button key={a.tab} type="button"
              onClick={() => { onNavigate(a.tab); onClose(); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all border border-transparent ${a.color}`}>
              <span className="flex-shrink-0">{a.icon}</span>
              <div className="text-left">
                <p>{a.label}</p>
                <p className={`text-[11px] font-normal mt-0.5 ${a.tab === 'crm' ? 'text-slate-400' : 'opacity-75'}`}>{a.desc}</p>
              </div>
              <ChevronRight size={14} className="ml-auto flex-shrink-0 opacity-60" />
            </button>
          ))}
        </div>
        {client && (
          <div className="mx-5 mb-5 bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-500">
            <p className="font-bold text-slate-700 mb-1">{client.name}</p>
            <p>{client.contact} · {client.phone}</p>
            <p>Etapa actual: <span className="font-bold text-blue-600">{client.status}</span></p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function CallCenter({
  callHistory = [],
  clients = [],
  onSaveCall,
  onDeleteCall,
  onNotify,
  onNavigate,
  currentUser,
  config = {},
}) {
  const [showModal,     setShowModal]     = useState(false);
  const [editingId,     setEditingId]     = useState('');
  const [form,          setForm]          = useState(EMPTY_FORM);
  const [escalating,    setEscalating]    = useState(null);
  const [activeConsole, setActiveConsole] = useState(null);   // ← consola activa
  const [search,        setSearch]        = useState('');
  const [channelFilter, setChannelFilter] = useState('ALL');
  const [dispFilter,    setDispFilter]    = useState('ALL');
  const [dateFilter,    setDateFilter]    = useState('');

  // Lanzar consola con contexto del cliente / interacción
  const launchConsole = (item) => {
    setActiveConsole({
      companyName:  item.clientName,
      contactName:  item.contactName || item.clientName,
      phoneNumber:  item.phone || '',
      clientId:     item.clientId,
      channel:      item.channel || 'telefono',
      agentName:    currentUser?.name || '',
    });
  };

  // ── Filtered history ──
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return callHistory.filter(c => {
      const matchSearch =
        !q ||
        (c.clientName  || '').toLowerCase().includes(q) ||
        (c.contactName || '').toLowerCase().includes(q) ||
        (c.notes       || '').toLowerCase().includes(q) ||
        (c.phone       || '').toLowerCase().includes(q) ||
        (c.agent       || '').toLowerCase().includes(q);
      const matchChannel = channelFilter === 'ALL' || c.channel === channelFilter;
      const matchDisp    = dispFilter    === 'ALL' || c.disposition === dispFilter;
      const matchDate    = !dateFilter   || c.date === dateFilter;
      return matchSearch && matchChannel && matchDisp && matchDate;
    });
  }, [callHistory, search, channelFilter, dispFilter, dateFilter]);

  // ── KPIs ──
  const kpis = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return {
      total:      callHistory.length,
      today:      callHistory.filter(c => c.date === today).length,
      interested: callHistory.filter(c => ['interesado','solicita_cot','cerrado'].includes(c.disposition)).length,
      pending:    callHistory.filter(c => ['volver_llamar','no_contesta','en_evaluacion'].includes(c.disposition)).length,
    };
  }, [callHistory]);

  // ── Handlers ──
  const onChange = (f, v) => setForm(cur => ({ ...cur, [f]: v }));

  const openNew = () => {
    setForm({ ...EMPTY_FORM, agent: currentUser?.name || '', date: new Date().toISOString().slice(0,10), time: new Date().toTimeString().slice(0,5) });
    setEditingId('');
    setShowModal(true);
  };

  const openEdit = item => {
    setForm({ ...EMPTY_FORM, ...item });
    setEditingId(item.id);
    setShowModal(true);
  };

  const closeModal = () => { setShowModal(false); setForm(EMPTY_FORM); setEditingId(''); };

  const handleSubmit = () => {
    if (!form.clientName || !form.disposition) {
      onNotify?.('info', 'Completa empresa y estado del contacto.'); return;
    }
    onSaveCall({
      ...form,
      id:        editingId || `INT-${Date.now()}`,
      timestamp: `${form.date}T${form.time || '00:00'}:00`,
    }, !!editingId);
    onNotify?.('success', editingId ? 'Interacción actualizada.' : 'Interacción registrada.');
    closeModal();
  };

  const handleDelete = id => {
    if (!window.confirm('¿Eliminar esta interacción del historial?')) return;
    onDeleteCall?.(id);
    onNotify?.('success', 'Interacción eliminada.');
  };

  // ──────────────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Centro de Contactos</h2>
          <p className="text-slate-500 text-sm">
            Registra y gestiona todas las interacciones: llamadas, WhatsApp, Facebook, email y visitas presenciales.
          </p>
        </div>
        <button type="button" onClick={openNew}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/20">
          <Plus size={16} /> Registrar contacto
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total contactos',   value: kpis.total,      cls: 'text-slate-800'   },
          { label: 'Hoy',               value: kpis.today,      cls: 'text-blue-600'    },
          { label: 'Con interés',       value: kpis.interested, cls: 'text-emerald-600' },
          { label: 'Pendientes seguim.',value: kpis.pending,    cls: 'text-amber-600'   },
        ].map(k => (
          <div key={k.label} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
            <p className={`text-2xl font-black ${k.cls}`}>{k.value}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mt-0.5">{k.label}</p>
          </div>
        ))}
      </div>

      {/* Channels quick-stat */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.18em] mb-3">Contactos por canal</p>
        <div className="flex flex-wrap gap-3">
          {CHANNELS.map(ch => {
            const count = callHistory.filter(c => c.channel === ch.id).length;
            if (count === 0) return null;
            return (
              <div key={ch.id} className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
                {ch.icon}
                <span className="text-xs font-bold text-slate-700">{ch.label}</span>
                <span className="text-xs font-black text-slate-500 bg-white border border-slate-200 rounded-full px-2">{count}</span>
              </div>
            );
          })}
          {callHistory.length === 0 && <p className="text-xs text-slate-400">Sin contactos registrados aún.</p>}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            placeholder="Buscar empresa, contacto, notas, agente..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
        </div>
        <select value={channelFilter} onChange={e => setChannelFilter(e.target.value)}
          className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none bg-white focus:ring-2 focus:ring-blue-500">
          <option value="ALL">Todos los canales</option>
          {CHANNELS.map(ch => <option key={ch.id} value={ch.id}>{ch.label}</option>)}
        </select>
        <select value={dispFilter} onChange={e => setDispFilter(e.target.value)}
          className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none bg-white focus:ring-2 focus:ring-blue-500">
          <option value="ALL">Todos los estados</option>
          {DISPOSITIONS.map(d => <option key={d.id} value={d.id}>{d.label}</option>)}
        </select>
        <input type="date" value={dateFilter} onChange={e => setDateFilter(e.target.value)}
          className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none bg-white focus:ring-2 focus:ring-blue-500"
          title="Filtrar por fecha" />
        {(search || channelFilter !== 'ALL' || dispFilter !== 'ALL' || dateFilter) && (
          <button type="button" onClick={() => { setSearch(''); setChannelFilter('ALL'); setDispFilter('ALL'); setDateFilter(''); }}
            className="flex items-center gap-1 px-3 py-2.5 text-xs font-bold text-slate-500 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
            <Filter size={12} /> Limpiar
          </button>
        )}
      </div>

      {/* Interaction table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-700 text-sm uppercase tracking-wider">
            Historial de contactos
          </h3>
          <span className="text-xs text-slate-400">
            {filtered.length} de {callHistory.length} registros
          </span>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-white border-b border-slate-100">
            <tr>
              <th className="px-5 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-wider">Empresa / Contacto</th>
              <th className="px-5 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-wider hidden md:table-cell">Canal</th>
              <th className="px-5 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-wider hidden lg:table-cell">Fecha / Hora</th>
              <th className="px-5 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-wider">Estado</th>
              <th className="px-5 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-wider hidden xl:table-cell">Notas</th>
              <th className="px-5 py-3 text-right text-[10px] font-black text-slate-400 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <Phone size={32} className="text-slate-300" />
                    <p className="text-slate-400 font-medium text-sm">
                      {callHistory.length === 0 ? 'Sin contactos registrados.' : 'Sin resultados para esta búsqueda.'}
                    </p>
                    {callHistory.length === 0 && (
                      <button type="button" onClick={openNew}
                        className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800">
                        <Plus size={13} /> Registrar primer contacto
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            )}
            {filtered.map(item => {
              const chMeta   = CHANNEL_META[item.channel];
              const dispMeta = DISP_META[item.disposition];
              return (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">

                  {/* Company / Contact */}
                  <td className="px-5 py-4">
                    <p className="font-bold text-slate-800">{item.clientName}</p>
                    <p className="text-[11px] text-slate-400">
                      {item.contactName && `${item.contactName} · `}{item.phone}
                    </p>
                    {item.agent && <p className="text-[10px] text-slate-400">Agente: {item.agent}</p>}
                  </td>

                  {/* Channel */}
                  <td className="px-5 py-4 hidden md:table-cell">
                    <div className="flex items-center gap-1.5 text-xs text-slate-600">
                      {chMeta?.icon}
                      <span>{chMeta?.label || item.channel}</span>
                    </div>
                    {item.duration && <p className="text-[11px] text-slate-400 mt-0.5">{item.duration} min</p>}
                  </td>

                  {/* Date / Time */}
                  <td className="px-5 py-4 hidden lg:table-cell">
                    <p className="text-xs font-medium text-slate-700 flex items-center gap-1">
                      <Calendar size={11} /> {item.date}
                    </p>
                    {item.time && <p className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Clock size={10} /> {item.time}
                    </p>}
                  </td>

                  {/* Disposition */}
                  <td className="px-5 py-4">
                    {dispMeta ? (
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full border ${dispMeta.color}`}>
                        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dispMeta.dot}`} />
                        {dispMeta.label}
                      </span>
                    ) : <span className="text-xs text-slate-400">—</span>}
                    {item.followUpDate && (
                      <p className="text-[10px] text-amber-600 flex items-center gap-1 mt-1">
                        <Bell size={9} /> Seguim: {item.followUpDate}
                      </p>
                    )}
                  </td>

                  {/* Notes */}
                  <td className="px-5 py-4 hidden xl:table-cell max-w-[200px]">
                    <p className="text-xs text-slate-500 truncate" title={item.notes}>
                      {item.notes || '—'}
                    </p>
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1">
                      {/* Escalar */}
                      <button type="button" onClick={() => setEscalating(item)}
                        className="flex items-center gap-1 px-2.5 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-[10px] font-bold transition-colors"
                        title="Escalar — crear cotización, oportunidad o follow-up">
                        <TrendingUp size={11} /> Escalar
                      </button>
                      {/* Edit */}
                      <button type="button" onClick={() => openEdit(item)}
                        className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                        title="Editar contacto">
                        <Pencil size={14} />
                      </button>
                      {/* Delete */}
                      <button type="button" onClick={() => handleDelete(item.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Eliminar">
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

      {/* Modals */}
      {showModal && (
        <InteractionModal
          form={form}
          editingId={editingId}
          clients={clients}
          currentUser={currentUser}
          onClose={closeModal}
          onSubmit={handleSubmit}
          onChange={onChange}
        />
      )}

      {escalating && (
        <EscalationPanel
          interaction={escalating}
          clients={clients}
          onClose={() => setEscalating(null)}
          onNavigate={onNavigate}
        />
      )}

      {/* Consola de contacto activo — fiel al diseño de la imagen */}
      {activeConsole && (
        <CallConsole
          activeCall={activeConsole}
          callHistory={callHistory}
          config={config}
          onHangUp={() => setActiveConsole(null)}
          onSave={(data, isEdit) => {
            onSaveCall(data, isEdit);
          }}
        />
      )}
    </div>
  );
}
