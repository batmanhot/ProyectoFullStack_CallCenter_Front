import { useMemo, useState } from 'react';
import { Bell, Calendar, CheckCircle2, Clock, Phone, Plus, Trash2, X } from 'lucide-react';

const PRIORITY_STYLES = {
  Alta:  { badge: 'bg-red-100 text-red-800 border-red-200',    dot: 'bg-red-500' },
  Media: { badge: 'bg-amber-100 text-amber-800 border-amber-200', dot: 'bg-amber-500' },
  Baja:  { badge: 'bg-slate-100 text-slate-600 border-slate-200',  dot: 'bg-slate-400' },
};

const CHANNELS = [
  'Teléfono fijo',
  'Celular',
  'WhatsApp',
  'Facebook/Messenger',
  'Correo electrónico',
  'Presencial/Visita',
];

const CHANNEL_ICONS = {
  'Teléfono fijo':       <Phone size={14} className="text-blue-500" />,
  'Celular':             <Phone size={14} className="text-emerald-500" />,
  'WhatsApp':            <span className="text-[11px] font-black text-emerald-600">WA</span>,
  'Facebook/Messenger':  <span className="text-[11px] font-black text-blue-600">FB</span>,
  'Correo electrónico':  <span className="text-[11px] font-black text-violet-500">@</span>,
  'Presencial/Visita':   <span className="text-[11px] font-black text-amber-600">🤝</span>,
  // legacy values kept for backward compatibility
  'Llamada':             <Phone size={14} />,
  'Email':               <span className="text-[11px] font-black">@</span>,
};

function diffDays(dateStr) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr);
  target.setHours(0, 0, 0, 0);
  return Math.round((target - today) / 86400000);
}

const EMPTY_FORM = {
  clientName: '', agent: '', date: '', time: '', priority: 'Media',
  channel: 'Teléfono fijo', notes: '', originCall: '',
};

export default function FollowUpManager({ followUps, onSave, onDelete, onComplete, clients = [] }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState('Pendiente');

  const stats = useMemo(() => ({
    overdue:  followUps.filter(f => f.status === 'Pendiente' && diffDays(f.date) < 0).length,
    today:    followUps.filter(f => f.status === 'Pendiente' && diffDays(f.date) === 0).length,
    upcoming: followUps.filter(f => f.status === 'Pendiente' && diffDays(f.date) > 0).length,
    done:     followUps.filter(f => f.status === 'Completado').length,
  }), [followUps]);

  const filtered = useMemo(() => {
    if (filter === 'Vencidos')   return followUps.filter(f => f.status === 'Pendiente' && diffDays(f.date) < 0);
    if (filter === 'Hoy')        return followUps.filter(f => f.status === 'Pendiente' && diffDays(f.date) === 0);
    if (filter === 'Próximos')   return followUps.filter(f => f.status === 'Pendiente' && diffDays(f.date) > 0);
    if (filter === 'Completado') return followUps.filter(f => f.status === 'Completado');
    return followUps.filter(f => f.status === 'Pendiente');
  }, [followUps, filter]);

  const handleChange = (field, value) => setForm(c => ({ ...c, [field]: value }));

  const handleSubmit = () => {
    if (!form.clientName || !form.date) return;
    onSave({
      id: `FU-${Date.now()}`,
      ...form,
      status: 'Pendiente',
      createdAt: new Date().toISOString().slice(0, 10),
    });
    setForm(EMPTY_FORM);
    setShowForm(false);
  };

  const getDayLabel = (dateStr) => {
    const d = diffDays(dateStr);
    if (d < 0)  return { label: `Vencido hace ${Math.abs(d)} día${Math.abs(d) > 1 ? 's' : ''}`, cls: 'text-red-600 font-bold' };
    if (d === 0) return { label: 'Hoy', cls: 'text-emerald-600 font-bold' };
    if (d === 1) return { label: 'Mañana', cls: 'text-amber-600 font-bold' };
    return { label: `En ${d} días`, cls: 'text-slate-500' };
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Follow-ups y Recordatorios</h2>
          <p className="text-slate-500 text-sm">Agenda de seguimientos programados desde llamadas tipificadas.</p>
        </div>
        <button type="button" onClick={() => setShowForm(v => !v)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/20">
          <Plus size={16} /> Nuevo Follow-up
        </button>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Vencidos',  value: stats.overdue,  cls: 'text-red-600',     bg: 'bg-red-50 border-red-200' },
          { label: 'Hoy',       value: stats.today,    cls: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200' },
          { label: 'Próximos',  value: stats.upcoming, cls: 'text-amber-600',   bg: 'bg-amber-50 border-amber-200' },
          { label: 'Completados', value: stats.done,   cls: 'text-slate-600',   bg: 'bg-slate-50 border-slate-200' },
        ].map(k => (
          <div key={k.label} className={`border rounded-xl p-4 ${k.bg}`}>
            <p className={`text-2xl font-black ${k.cls}`}>{k.value}</p>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">{k.label}</p>
          </div>
        ))}
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white border border-blue-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-slate-800 flex items-center gap-2"><Bell size={16} className="text-blue-600" /> Nuevo Follow-up</h3>
            <button type="button" onClick={() => setShowForm(false)}><X size={16} className="text-slate-400" /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Cliente / Empresa</label>
              {clients.length > 0 ? (
                <select value={form.clientName} onChange={e => handleChange('clientName', e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Seleccionar...</option>
                  {clients.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
              ) : (
                <input type="text" placeholder="Nombre empresa..." value={form.clientName}
                  onChange={e => handleChange('clientName', e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
              )}
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Agente responsable</label>
              <input type="text" placeholder="Nombre del agente..." value={form.agent}
                onChange={e => handleChange('agent', e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Fecha programada</label>
              <input type="date" value={form.date} onChange={e => handleChange('date', e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Hora</label>
              <input type="time" value={form.time} onChange={e => handleChange('time', e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Canal</label>
              <select value={form.channel} onChange={e => handleChange('channel', e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500">
                {CHANNELS.map(ch => <option key={ch} value={ch}>{ch}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Prioridad</label>
              <select value={form.priority} onChange={e => handleChange('priority', e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500">
                <option>Alta</option><option>Media</option><option>Baja</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Notas</label>
              <textarea rows={2} placeholder="Contexto de la llamada anterior, interés del cliente..." value={form.notes}
                onChange={e => handleChange('notes', e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
            </div>
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={handleSubmit}
              className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700">
              <Bell size={15} /> Programar follow-up
            </button>
            <button type="button" onClick={() => setShowForm(false)}
              className="px-4 py-2 border border-slate-200 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-50">
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        {['Pendiente', 'Vencidos', 'Hoy', 'Próximos', 'Completado'].map(f => (
          <button key={f} type="button" onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${filter === f ? 'bg-slate-900 text-white border-slate-900' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
            {f} ({
              f === 'Pendiente'   ? followUps.filter(fu => fu.status === 'Pendiente').length :
              f === 'Vencidos'    ? stats.overdue :
              f === 'Hoy'        ? stats.today :
              f === 'Próximos'   ? stats.upcoming :
              stats.done
            })
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="bg-white border-2 border-dashed border-slate-200 rounded-2xl p-10 text-center">
            <p className="text-slate-400 font-bold">No hay follow-ups en esta categoría.</p>
          </div>
        )}
        {filtered.map(fu => {
          const pStyle = PRIORITY_STYLES[fu.priority] || PRIORITY_STYLES.Media;
          const dayInfo = getDayLabel(fu.date);
          return (
            <div key={fu.id} className={`bg-white border border-slate-200 rounded-2xl shadow-sm flex overflow-hidden ${fu.status === 'Completado' ? 'opacity-60' : ''}`}>
              <div className={`w-1.5 flex-shrink-0 ${pStyle.dot}`} />
              <div className="flex-1 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`px-2 py-0.5 rounded border text-[10px] font-bold ${pStyle.badge}`}>{fu.priority}</span>
                    <span className="flex items-center gap-1 text-xs text-slate-400 font-medium">
                      {CHANNEL_ICONS[fu.channel]} {fu.channel}
                    </span>
                    {fu.status === 'Completado' && (
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 text-[10px] font-bold border border-emerald-200">Completado</span>
                    )}
                  </div>
                  <h3 className="font-bold text-slate-800">{fu.clientName}</h3>
                  <div className="flex items-center gap-4 text-xs text-slate-500 flex-wrap">
                    <span className="flex items-center gap-1"><Calendar size={11} /> {fu.date} {fu.time && `· ${fu.time}`}</span>
                    <span className={`flex items-center gap-1 ${dayInfo.cls}`}><Clock size={11} /> {dayInfo.label}</span>
                    {fu.agent && <span>Agente: {fu.agent}</span>}
                  </div>
                  {fu.notes && <p className="text-xs text-slate-400 italic">{fu.notes}</p>}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {fu.status !== 'Completado' && (
                    <button type="button" onClick={() => onComplete(fu.id)}
                      className="flex items-center gap-1 px-3 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-all">
                      <CheckCircle2 size={13} /> Completar
                    </button>
                  )}
                  <button type="button" onClick={() => onDelete(fu.id)}
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
