import { useMemo } from 'react';
import { ArrowUpRight, BarChart, CheckCircle, Clock, DollarSign, Target, TrendingUp } from 'lucide-react';

export default function ExecutiveDashboard({ stats, onExport, onRefresh }) {
  const cards = [
    { label: 'Tasa de Conversion', value: stats.conversionRate, growth: `+${stats.approvedQuotes}`, icon: <Target className="text-blue-600" />, sub: 'Cotizaciones aprobadas vs total' },
    { label: 'Llamadas Efectivas', value: stats.effectiveCalls, growth: `+${stats.activeCampaigns}`, icon: <TrendingUp className="text-emerald-600" />, sub: 'Impacto de campanas activas' },
    { label: 'Tiempo de Cierre', value: stats.closingTime, growth: `-${stats.pendingQuotes}`, icon: <Clock className="text-amber-600" />, sub: 'Pendientes por resolver' },
    { label: 'Valor Total Ventas', value: `$${stats.totalSales.toLocaleString()}`, growth: '+12%', icon: <DollarSign className="text-sky-600" />, sub: 'Monto aprobado acumulado' },
  ];

  const productLines = useMemo(() => {
    const maxAmount = Math.max(...stats.productLines.map((line) => line.amount), 1);
    return stats.productLines.map((line) => ({
      ...line,
      percentage: Math.max(8, Math.round((line.amount / maxAmount) * 100)),
    }));
  }, [stats.productLines]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Analitica de Ventas Estrategica</h2>
          <p className="text-slate-500 text-sm">Monitoreo en vivo del rendimiento comercial y operativo del call center.</p>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={onExport} className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 shadow-sm">
            Exportar a PDF
          </button>
          <button type="button" onClick={onRefresh} className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 shadow-lg transition-all">
            Actualizar Datos
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-slate-50 rounded-xl">{stat.icon}</div>
              <span className="flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-full bg-emerald-50 text-emerald-600">
                {stat.growth} <ArrowUpRight size={10} />
              </span>
            </div>
            <p className="text-2xl font-black text-slate-800">{stat.value}</p>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">{stat.label}</p>
            <p className="text-[10px] text-slate-400 italic mt-2 border-t border-slate-50 pt-2">{stat.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
            <BarChart size={18} className="text-blue-600" /> Ventas por linea de producto
          </h3>
          <div className="space-y-4">
            {productLines.map((line) => (
              <ProductBar key={line.label} label={line.label} percentage={line.percentage} amount={`$${line.amount.toLocaleString()}`} />
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
            <CheckCircle size={18} className="text-emerald-600" /> Estado de cotizaciones
          </h3>
          <div className="flex items-center justify-center h-48 relative">
            <div className="w-40 h-40 rounded-full border-[16px] border-emerald-500 border-t-amber-400 border-r-slate-300 relative flex items-center justify-center">
              <div className="text-center">
                <p className="text-2xl font-black text-slate-800">{stats.conversionRate}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Aprobadas</p>
              </div>
            </div>
            <div className="absolute right-0 space-y-2">
              <Legend label="Aprobadas" color="bg-emerald-500" />
              <Legend label="Pendientes" color="bg-amber-400" />
              <Legend label="Rechazadas" color="bg-slate-300" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductBar({ label, percentage, amount }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs font-bold">
        <span className="text-slate-600">{label}</span>
        <span className="text-slate-800">{amount}</span>
      </div>
      <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
        <div className="h-full bg-blue-500 transition-all duration-1000" style={{ width: `${percentage}%` }}></div>
      </div>
    </div>
  );
}

function Legend({ label, color }) {
  return (
    <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
      <div className={`w-3 h-3 rounded-full ${color}`}></div>
      {label}
    </div>
  );
}