import { CheckCircle2, Clock, DollarSign, FileCheck, XCircle } from 'lucide-react';

export default function SalesClosure({ quotes, onApprove, onReject, userRole = 'Supervisor' }) {
  const approvals = quotes.filter((quote) => quote.status === 'PENDIENTE_APROBACION');

  const handleAction = (id, status) => {
    if (userRole !== 'Supervisor') {
      return;
    }
    if (status === 'APROBADA') {
      onApprove(id);
      return;
    }
    onReject(id);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Cierre de Ventas y Aprobaciones</h2>
          <p className="text-slate-500 text-sm">Valida o rechaza las cotizaciones enviadas por el equipo comercial.</p>
        </div>
        <div className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg shadow-blue-900/20">
          <FileCheck size={20} />
          <span className="text-sm font-bold">{approvals.length} pendientes</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {approvals.length ? approvals.map((item) => (
          <div key={item.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm flex flex-col md:flex-row">
            <div className="w-2 bg-amber-500"></div>
            <div className="flex-1 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-mono font-bold text-slate-400">{item.id}</span>
                  <h3 className="font-bold text-slate-800 text-lg">{item.client}</h3>
                </div>
                <div className="flex items-center gap-4 text-sm text-slate-500 flex-wrap">
                  <span className="flex items-center gap-1"><DollarSign size={14} /> {item.total.toLocaleString()}</span>
                  <span>{item.items.length} item(s)</span>
                  <span className="flex items-center gap-1"><Clock size={14} /> Actualizada {item.updatedAt}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => handleAction(item.id, 'RECHAZADA')} className="flex items-center justify-center gap-2 px-4 py-2 text-rose-600 border border-rose-200 hover:bg-rose-50 rounded-xl font-bold text-sm transition-all">
                  <XCircle size={18} /> Rechazar
                </button>
                <button type="button" onClick={() => handleAction(item.id, 'APROBADA')} className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm transition-all shadow-md shadow-emerald-900/10">
                  <CheckCircle2 size={18} /> Aprobar cierre
                </button>
              </div>
            </div>
          </div>
        )) : (
          <div className="bg-white border-2 border-dashed border-slate-200 rounded-2xl p-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4"><CheckCircle2 className="text-slate-300" size={32} /></div>
            <h3 className="text-slate-800 font-bold italic">No hay cierres pendientes</h3>
            <p className="text-slate-400 text-sm max-w-xs mt-1">Todas las cotizaciones enviadas ya fueron procesadas por supervision.</p>
          </div>
        )}
      </div>
    </div>
  );
}