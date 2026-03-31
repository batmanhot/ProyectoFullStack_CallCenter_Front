// src/features/quotes/QuoteWorkflowPage.jsx
import React, { useState } from 'react';
import { ROLES, currentQuotes, currentUser, quoteStatuses, b2bClients } from '../../api/mockData';
import { Eye, CheckCircle2, XCircle } from 'lucide-react';

const StatusBadge = ({ status }) => {
  const config = {
    [quoteStatuses.DRAFT]: 'bg-slate-100 text-slate-800 border-slate-200',
    [quoteStatuses.PENDING]: 'bg-amber-100 text-amber-900 border-amber-200',
    [quoteStatuses.APPROVED]: 'bg-emerald-100 text-emerald-900 border-emerald-200',
    [quoteStatuses.REJECTED]: 'bg-rose-100 text-rose-900 border-rose-200',
  };
  const styles = config[status] || config.DRAFT;
  return <span className={`px-2 py-0.5 rounded text-xs font-semibold border ${styles}`}>{status}</span>;
};

const QuoteWorkflowPage = () => {
  const [quotes, setQuotes] = useState(currentQuotes);

  // Simulación de acción del Supervisor
  const handleUpdateStatus = (quoteId, newStatus) => {
    setQuotes(quotes.map(q => q.id === quoteId ? { ...q, status: newStatus } : q));
    console.log(`Cotización ${quoteId} actualizada a ${newStatus} por ${currentUser.name}`);
  };

  const getCompanyName = (id) => b2bClients.find(c => c.id === id)?.companyName || 'N/A';

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Workflow de Cotizaciones</h1>
          <p className="text-slate-600 mt-1">Simulación de Control Institucional ({currentUser.role})</p>
        </div>
        <button className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition">
          + Nueva Cotización (Industrial)
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-600 uppercase">
            <tr>
              <th className="px-5 py-4">Código</th>
              <th className="px-5 py-4">Cliente B2B</th>
              <th className="px-5 py-4 text-right">Monto</th>
              <th className="px-5 py-4">Estado</th>
              <th className="px-5 py-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-800">
            {quotes.map(quote => (
              <tr key={quote.id} className="hover:bg-slate-50/50">
                <td className="px-5 py-4 font-mono font-medium">{quote.id}</td>
                <td className="px-5 py-4 font-medium">{getCompanyName(quote.companyId)}</td>
                <td className="px-5 py-4 text-right font-bold tabular-nums">${quote.total.toLocaleString()}</td>
                <td className="px-5 py-4"><StatusBadge status={quote.status} /></td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <button title="Ver detalles" className="text-slate-500 hover:text-blue-600 p-1.5 rounded"><Eye className="h-4 w-4" /></button>
                    
                    {/* Control de Acciones para SUPERVISOR */}
                    {currentUser.role === ROLES.SUPERVISOR && quote.status === quoteStatuses.PENDING && (
                      <>
                        <button 
                          onClick={() => handleUpdateStatus(quote.id, quoteStatuses.APPROVED)}
                          title="Aprobar" 
                          className="text-emerald-500 hover:text-emerald-700 p-1.5 rounded bg-emerald-50 hover:bg-emerald-100">
                            <CheckCircle2 className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleUpdateStatus(quote.id, quoteStatuses.REJECTED)}
                          title="Rechazar" 
                          className="text-rose-500 hover:text-rose-700 p-1.5 rounded bg-rose-50 hover:bg-rose-100">
                            <XCircle className="h-4 w-4" />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default QuoteWorkflowPage;