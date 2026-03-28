import { useState } from 'react';
import { ShieldCheck } from 'lucide-react';

export function QuotesView({ role }) {
  const [quotes, setQuotes] = useState([
    { id: 'COT-001', client: 'Minera del Norte', amount: 15400, status: 'PENDIENTE', date: '2024-03-20' },
    { id: 'COT-002', client: 'Aceros Latam', amount: 8200, status: 'APROBADA', date: '2024-03-21' },
  ]);

  const approveQuote = (id) => {
    if (role !== 'Supervisor') return alert('Solo supervisores pueden aprobar');
    setQuotes(quotes.map((q) => (q.id === id ? { ...q, status: 'APROBADA' } : q)));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center">
        <h2 className="text-xl font-bold">Flujo de Aprobaciones</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold">+ Generar Cotizacion</button>
      </div>
      <table className="w-full text-left">
        <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
          <tr>
            <th className="px-6 py-4">ID</th>
            <th className="px-6 py-4">Cliente B2B</th>
            <th className="px-6 py-4">Monto</th>
            <th className="px-6 py-4">Estado</th>
            <th className="px-6 py-4 text-right">Accion</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {quotes.map((q) => (
            <tr key={q.id} className="hover:bg-slate-50 transition-colors">
              <td className="px-6 py-4 font-mono text-xs">{q.id}</td>
              <td className="px-6 py-4 font-medium">{q.client}</td>
              <td className="px-6 py-4">${q.amount.toLocaleString()}</td>
              <td className="px-6 py-4">
                <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${q.status === 'APROBADA' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                  {q.status}
                </span>
              </td>
              <td className="px-6 py-4 text-right">
                {q.status === 'PENDIENTE' && (
                  <button onClick={() => approveQuote(q.id)} className="text-blue-600 hover:text-blue-800 text-xs font-bold flex items-center gap-1 ml-auto">
                    <ShieldCheck size={14} /> Aprobar (Supervisor)
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}