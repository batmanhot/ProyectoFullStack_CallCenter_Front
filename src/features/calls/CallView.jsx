import { useMemo, useState } from 'react';
import { Phone } from 'lucide-react';
import { CALL_CONFIG } from '../../data';

function formatDuration(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}

export default function CallView({ clients, callHistory, onStartCall }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterChannel, setFilterChannel] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredHistory = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return callHistory.filter(call => {
      if (filterChannel !== 'all' && call.channel !== filterChannel) return false;
      if (filterStatus !== 'all' && call.callStatus !== filterStatus) return false;
      if (!term) return true;
      return [call.companyName, call.contactName, call.phoneNumber, call.disposition, call.callStatus]
        .filter(Boolean)
        .some(value => value.toString().toLowerCase().includes(term));
    });
  }, [callHistory, filterChannel, filterStatus, searchTerm]);

  const summary = useMemo(() => {
    const totals = { total: callHistory.length, escalated: 0, closed_sale: 0, pending: 0 };
    callHistory.forEach(call => {
      if (call.escalated) totals.escalated += 1;
      if (call.callStatus === 'closed_sale') totals.closed_sale += 1;
      if (call.callStatus === 'followup') totals.pending += 1;
    });
    return totals;
  }, [callHistory]);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Consola de Llamadas</h2>
        <p className="text-slate-500 text-sm">Inicia llamadas, tipifica el canal/estado y aseguras seguimiento estratégico.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white border border-slate-200 p-4 rounded-2xl">
          <p className="text-[10px] uppercase tracking-wide text-slate-500">Total llamadas</p>
          <p className="text-2xl font-bold text-blue-700">{summary.total}</p>
        </div>
        <div className="bg-white border border-slate-200 p-4 rounded-2xl">
          <p className="text-[10px] uppercase tracking-wide text-slate-500">Escaladas</p>
          <p className="text-2xl font-bold text-amber-700">{summary.escalated}</p>
        </div>
        <div className="bg-white border border-slate-200 p-4 rounded-2xl">
          <p className="text-[10px] uppercase tracking-wide text-slate-500">Venta cerrada</p>
          <p className="text-2xl font-bold text-emerald-700">{summary.closed_sale}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
          placeholder="Buscar por cliente, contacto, teléfono, estado..."
          className="col-span-1 md:col-span-2 bg-white border border-slate-200 rounded-2xl py-2 px-3 text-sm outline-none" />

        <select value={filterChannel} onChange={e => setFilterChannel(e.target.value)}
          className="bg-white border border-slate-200 rounded-2xl py-2 px-3 text-sm outline-none">
          <option value="all">Todos los canales</option>
          {CALL_CONFIG.channels.map(ch => (
            <option key={ch.id} value={ch.id}>{ch.label}</option>
          ))}
        </select>

        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          className="bg-white border border-slate-200 rounded-2xl py-2 px-3 text-sm outline-none">
          <option value="all">Todos los estados</option>
          {CALL_CONFIG.callStatuses.map(st => (
            <option key={st.id} value={st.id}>{st.label}</option>
          ))}
        </select>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Historial completo</p>
        {filteredHistory.length === 0 ? (
          <p className="text-slate-400 text-center py-6">No se encontraron resultados.</p>
        ) : (
          <div className="space-y-2">
            {filteredHistory.map((c, i) => {
              const statusMeta = CALL_CONFIG.callStatuses.find(st => st.id === c.callStatus);
              const channelMeta = CALL_CONFIG.channels.find(ch => ch.id === c.channel);
              return (
                <div key={c.id || i} className="grid grid-cols-1 md:grid-cols-5 gap-2 items-center rounded-xl border border-slate-200 bg-slate-50 p-2">
                  <div className="text-[11px] text-slate-500">{c.timestamp?.slice(0, 16).replace('T', ' ')}</div>
                  <div className="text-sm font-bold text-slate-800">{c.companyName}</div>
                  <div className="text-[11px] text-slate-600">{c.contactName} · {c.phoneNumber}</div>
                  <div className="text-[11px] flex items-center gap-1">
                    {channelMeta ? `${channelMeta.icon} ${channelMeta.label}` : c.channel}
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${statusMeta ? statusMeta.color : 'bg-slate-300 text-slate-700'}`}>
                      {statusMeta?.label || c.callStatus}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white border border-slate-300 text-slate-700">{c.disposition?.replace(/_/g, ' ')}</span>
                    {c.escalated && <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-200 text-amber-700 font-semibold">Escalado</span>}
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">{formatDuration(c.duration || 0)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {clients.map(client => {
          const prev = callHistory.filter(c => c.companyName === client.name);
          return (
            <div
              key={client.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-blue-200 transition-all group"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-slate-800 group-hover:text-blue-700 transition-colors">
                    {client.name}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {client.contact}{client.position ? ` · ${client.position}` : ''}
                  </p>
                </div>
                <span className="text-[10px] font-bold uppercase bg-slate-50 text-slate-500 px-2 py-0.5 rounded border border-slate-200 flex-shrink-0">
                  {client.sector}
                </span>
              </div>

              <p className="text-xs text-slate-500 mb-1 flex items-center gap-1">
                <Phone size={10} /> {client.phone}
              </p>

              {prev.length > 0 && (
                <p className="text-[10px] text-slate-400 mb-3">
                  {prev.length} llamada(s) prev. — última: {prev[0]?.disposition?.replace(/_/g, ' ')}
                </p>
              )}

              <button
                type="button"
                onClick={() => onStartCall({
                  contactName:  client.contact,
                  companyName:  client.name,
                  phoneNumber:  client.phone,
                })}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-all shadow-sm"
              >
                <Phone size={13} /> Iniciar Llamada
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
