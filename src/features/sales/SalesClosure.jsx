import { CheckCircle2, Clock, DollarSign, FileCheck, MessageSquare, XCircle } from 'lucide-react';

function agingDays(updatedAt) {
  if (!updatedAt) return 0;
  const updated = new Date(updatedAt.replace(' ', 'T'));
  const now = new Date();
  return Math.floor((now - updated) / 86400000);
}

function AgingBadge({ days }) {
  if (days <= 1) return null;
  const urgent = days >= 5;
  const warning = days >= 3;
  return (
    <span className={`flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-full border ${
      urgent  ? 'bg-red-50 text-red-700 border-red-200' :
      warning ? 'bg-amber-50 text-amber-700 border-amber-200' :
                'bg-slate-50 text-slate-600 border-slate-200'
    }`}>
      <Clock size={9} />
      {days}d pendiente{urgent ? ' ⚠️' : ''}
    </span>
  );
}

export default function SalesClosure({ quotes, onApprove, onReject, userRole = 'Supervisor', config = {} }) {
  const requireApproval    = config?.quotes?.requireApproval    ?? true;
  const approvalThreshold  = config?.quotes?.approvalThreshold  ?? 10000;
  const currency           = config?.company?.currency          || 'USD';

  const approvals  = quotes.filter(q => q.status === 'PENDIENTE_APROBACION');
  const approved   = quotes.filter(q => q.status === 'APROBADA');
  const rejected   = quotes.filter(q => q.status === 'RECHAZADA');

  const totalPending  = approvals.reduce((s, q) => s + q.total, 0);
  const totalApproved = approved.reduce((s, q) => s + q.total, 0);
  const urgentCount   = approvals.filter(q => agingDays(q.updatedAt) >= 5).length;

  // Si requireApproval está desactivado en config, solo Admin/Supervisor pueden operar
  const isSupervisor = userRole === 'Supervisor' || userRole === 'Administrador';
  const canApprove   = isSupervisor && requireApproval;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Cierre de Ventas y Aprobaciones</h2>
          <p className="text-slate-500 text-sm">
            {requireApproval
              ? `Flujo de aprobación — cotizaciones sobre ${currency} ${approvalThreshold.toLocaleString()} requieren supervisión.`
              : 'Aprobación automática activa — las cotizaciones se procesan sin revisión manual.'}
          </p>
        </div>
        <div className="flex gap-3">
          {urgentCount > 0 && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-bold">
              <Clock size={16} /> {urgentCount} urgente{urgentCount > 1 ? 's' : ''} (+5d)
            </div>
          )}
          <div className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg shadow-blue-900/20">
            <FileCheck size={20} />
            <span className="text-sm font-bold">{approvals.length} pendientes</span>
          </div>
        </div>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Pendientes de aprobación', value: approvals.length,  sub: `$${totalPending.toLocaleString()}`, cls: 'text-amber-600' },
          { label: 'Aprobadas',                value: approved.length,   sub: `$${totalApproved.toLocaleString()}`, cls: 'text-emerald-600' },
          { label: 'Rechazadas',               value: rejected.length,   sub: 'este período',  cls: 'text-red-600' },
          { label: 'Tasa de aprobación',
            value: (approved.length + rejected.length) > 0
              ? `${Math.round(approved.length / (approved.length + rejected.length) * 100)}%`
              : '—',
            sub: 'sobre procesadas', cls: 'text-blue-600' },
        ].map(k => (
          <div key={k.label} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
            <p className={`text-2xl font-black ${k.cls}`}>{k.value}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mt-0.5">{k.label}</p>
            <p className="text-[10px] text-slate-400 mt-1">{k.sub}</p>
          </div>
        ))}
      </div>

      {!isSupervisor && requireApproval && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800 font-medium flex items-center gap-2">
          <FileCheck size={16} /> Solo supervisores y administradores pueden aprobar o rechazar cotizaciones.
        </div>
      )}
      {!requireApproval && (
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-800 flex items-center gap-2">
          <CheckCircle2 size={16} className="text-blue-600"/> Aprobación automática activada en Configuración. Las cotizaciones se aprueban sin revisión manual.
        </div>
      )}

      {/* Pending approvals */}
      <div>
        <h3 className="text-sm font-bold text-slate-600 uppercase tracking-wider mb-3">Pendientes de aprobación</h3>
        <div className="grid grid-cols-1 gap-4">
          {approvals.length === 0 ? (
            <div className="bg-white border-2 border-dashed border-slate-200 rounded-2xl p-12 flex flex-col items-center text-center">
              <CheckCircle2 className="text-slate-300 mb-3" size={32} />
              <h3 className="text-slate-700 font-bold">Sin cierres pendientes</h3>
              <p className="text-slate-400 text-sm mt-1">Todas las cotizaciones han sido procesadas.</p>
            </div>
          ) : approvals.map(item => {
            const days = agingDays(item.updatedAt);
            return (
              <div key={item.id} className={`bg-white border rounded-2xl overflow-hidden shadow-sm flex flex-col md:flex-row ${days >= 5 ? 'border-red-200' : days >= 3 ? 'border-amber-200' : 'border-slate-200'}`}>
                <div className={`w-2 flex-shrink-0 ${days >= 5 ? 'bg-red-500' : days >= 3 ? 'bg-amber-500' : 'bg-blue-500'}`} />
                <div className="flex-1 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-mono font-bold text-slate-400">{item.id}</span>
                      <h3 className="font-bold text-slate-800 text-lg">{item.client}</h3>
                      <AgingBadge days={days} />
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-500 flex-wrap">
                      <span className="flex items-center gap-1 font-bold text-slate-700">
                        <DollarSign size={14} /> ${item.total.toLocaleString()}
                      </span>
                      <span>{item.items?.length || 0} producto(s)</span>
                      <span className="flex items-center gap-1"><Clock size={13} /> Enviada: {item.updatedAt}</span>
                    </div>
                    {item.discount > 0 && (
                      <p className="text-xs text-slate-400">Descuento aplicado: {item.discount}%</p>
                    )}
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    {approvalThreshold > 0 && item.total < approvalThreshold && (
                      <span className="text-[10px] text-slate-400 italic">Bajo umbral config.</span>
                    )}
                    <button type="button"
                      onClick={() => canApprove && onReject(item.id)}
                      disabled={!canApprove}
                      className="flex items-center justify-center gap-2 px-4 py-2.5 text-rose-600 border border-rose-200 hover:bg-rose-50 rounded-xl font-bold text-sm transition-all disabled:opacity-40">
                      <XCircle size={18} /> Rechazar
                    </button>
                    <button type="button"
                      onClick={() => canApprove && onApprove(item.id)}
                      disabled={!canApprove}
                      className="flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm transition-all shadow-md disabled:opacity-40">
                      <CheckCircle2 size={18} /> Aprobar
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Approved history */}
      {approved.length > 0 && (
        <div>
          <h3 className="text-sm font-bold text-slate-600 uppercase tracking-wider mb-3">Aprobadas recientes</h3>
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-500 text-[10px] uppercase">
                <tr>
                  <th className="px-5 py-3 text-left font-black">Código</th>
                  <th className="px-5 py-3 text-left font-black">Cliente</th>
                  <th className="px-5 py-3 text-right font-black">Total</th>
                  <th className="px-5 py-3 text-left font-black">Aprobada</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {approved.map(q => (
                  <tr key={q.id} className="hover:bg-slate-50">
                    <td className="px-5 py-3 font-mono text-xs text-slate-400">{q.id}</td>
                    <td className="px-5 py-3 font-medium text-slate-800">{q.client}</td>
                    <td className="px-5 py-3 text-right font-bold text-emerald-700">${q.total.toLocaleString()}</td>
                    <td className="px-5 py-3 text-xs text-slate-500">{q.updatedAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
