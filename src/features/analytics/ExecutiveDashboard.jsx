import { useMemo, useState } from 'react';
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid,
  Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import {
  ArrowDownRight, ArrowUpRight, Bell, CheckCircle, Clock,
  DollarSign, Phone, RefreshCw, Target, TrendingUp,
} from 'lucide-react';

const PERIOD_OPTIONS = ['Esta semana', 'Este mes', 'Trimestre', 'Todo'];

const TREND_DATA = [
  { label: 'Sem 1', ventas: 18000, llamadas: 42, conversiones: 8 },
  { label: 'Sem 2', ventas: 27500, llamadas: 58, conversiones: 12 },
  { label: 'Sem 3', ventas: 22000, llamadas: 50, conversiones: 9 },
  { label: 'Sem 4', ventas: 35000, llamadas: 71, conversiones: 17 },
  { label: 'Sem 5', ventas: 41000, llamadas: 83, conversiones: 21 },
  { label: 'Sem 6', ventas: 38500, llamadas: 76, conversiones: 19 },
];

const FUNNEL_DATA = [
  { stage: 'Prospección',  count: 48, fill: '#3b82f6' },
  { stage: 'Contacto',     count: 31, fill: '#8b5cf6' },
  { stage: 'Cotización',   count: 18, fill: '#f59e0b' },
  { stage: 'Negociación',  count: 11, fill: '#14b8a6' },
  { stage: 'Cierre',       count: 7,  fill: '#10b981' },
];

const PRODUCT_COLORS = ['#2563eb', '#7c3aed', '#0891b2'];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl p-3 shadow-xl text-xs">
      <p className="font-bold text-white mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }}>{p.name}: <span className="font-bold">{typeof p.value === 'number' && p.value > 1000 ? `$${p.value.toLocaleString()}` : p.value}</span></p>
      ))}
    </div>
  );
};

export default function ExecutiveDashboard({ stats, followUps = [], onRefresh, onExport }) {
  const [period, setPeriod] = useState('Este mes');

  const overdueFollowUps = useMemo(
    () => followUps.filter(f => {
      if (f.status !== 'Pendiente') return false;
      const d = new Date(f.date);
      d.setHours(0, 0, 0, 0);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return d <= today;
    }).length,
    [followUps]
  );

  const kpis = [
    {
      id: 'conversion', category: 'Ventas',
      label: 'Tasa de Conversión', value: stats.conversionRate,
      prev: '19%', up: true,
      icon: <Target size={18} className="text-blue-500" />,
      formula: 'Cotizaciones aprobadas / total',
      bg: 'from-blue-50 to-white', border: 'border-blue-100',
    },
    {
      id: 'calls', category: 'Productividad',
      label: 'Llamadas Efectivas', value: stats.effectiveCalls,
      prev: '61%', up: true,
      icon: <Phone size={18} className="text-emerald-500" />,
      formula: 'Contactos / total marcaciones',
      bg: 'from-emerald-50 to-white', border: 'border-emerald-100',
    },
    {
      id: 'closing', category: 'Tiempo',
      label: 'Tiempo Cierre Prom.', value: stats.closingTime,
      prev: '21 días', up: true,
      icon: <Clock size={18} className="text-amber-500" />,
      formula: 'Días contacto → cierre',
      bg: 'from-amber-50 to-white', border: 'border-amber-100',
    },
    {
      id: 'sales', category: 'Financiero',
      label: 'Valor Total Ventas', value: `$${(stats.totalSales || 0).toLocaleString()}`,
      prev: '$98,200', up: true,
      icon: <DollarSign size={18} className="text-sky-500" />,
      formula: 'Suma cotizaciones aprobadas',
      bg: 'from-sky-50 to-white', border: 'border-sky-100',
    },
    {
      id: 'approval', category: 'Calidad',
      label: 'Cotizaciones Aprobadas', value: stats.quoteApprovalRate || stats.conversionRate,
      prev: '68%', up: true,
      icon: <CheckCircle size={18} className="text-violet-500" />,
      formula: 'Aprobadas / enviadas a revisión',
      bg: 'from-violet-50 to-white', border: 'border-violet-100',
    },
  ];

  const productPie = useMemo(
    () => (stats.productLines || []).map((l, i) => ({ ...l, fill: PRODUCT_COLORS[i % PRODUCT_COLORS.length] })),
    [stats.productLines]
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Analítica Ejecutiva — Call Center B2B</h2>
          <p className="text-slate-500 text-sm">Visibilidad estratégica en tiempo real · Período: <span className="font-bold text-slate-700">{period}</span></p>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="flex bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            {PERIOD_OPTIONS.map(p => (
              <button key={p} type="button" onClick={() => setPeriod(p)}
                className={`px-3 py-2 text-xs font-bold transition-all ${period === p ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-50'}`}>
                {p}
              </button>
            ))}
          </div>
          <button type="button" onClick={onExport}
            className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 shadow-sm">
            Exportar PDF
          </button>
          <button type="button" onClick={onRefresh}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 shadow-lg">
            <RefreshCw size={13} /> Actualizar
          </button>
        </div>
      </div>

      {/* Follow-ups alert */}
      {overdueFollowUps > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3 text-sm text-amber-800 font-medium">
            <Bell size={16} className="text-amber-600" />
            Tienes <span className="font-black">{overdueFollowUps}</span> follow-up{overdueFollowUps > 1 ? 's' : ''} vencido{overdueFollowUps > 1 ? 's' : ''} pendiente{overdueFollowUps > 1 ? 's' : ''}.
          </div>
          <span className="text-[10px] font-black text-amber-600 uppercase tracking-wider">Revisar → Follow-ups</span>
        </div>
      )}

      {/* 5 KPI cards */}
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Matriz de KPIs — Sección 5</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {kpis.map(kpi => (
            <div key={kpi.id} className={`bg-gradient-to-b ${kpi.bg} border ${kpi.border} rounded-2xl p-5 shadow-sm hover:shadow-md transition-all`}>
              <div className="flex justify-between items-start mb-3">
                <div className="p-2 bg-white rounded-xl shadow-sm">{kpi.icon}</div>
                <span className={`flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-full ${kpi.up ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                  {kpi.up ? <ArrowUpRight size={9} /> : <ArrowDownRight size={9} />}
                  vs {kpi.prev}
                </span>
              </div>
              <p className="text-xl font-black text-slate-800 mb-1">{kpi.value || '—'}</p>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider leading-tight">{kpi.label}</p>
              <p className="text-[9px] text-slate-400 italic mt-1">{kpi.formula}</p>
              <span className="inline-block mt-2 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-white/70 text-slate-500 border border-slate-100">
                {kpi.category}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trend area chart */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <TrendingUp size={17} className="text-blue-600" /> Evolución de ventas B2B
            </h3>
            <span className="text-[10px] font-bold text-slate-400 uppercase">{period}</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={TREND_DATA} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="gVentas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#2563eb" stopOpacity={0.18} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="ventas" name="Ventas" stroke="#2563eb" strokeWidth={2.5} fill="url(#gVentas)" dot={{ r: 3, fill: '#2563eb' }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Product pie */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-4">Ventas por producto</h3>
          {productPie.some(p => p.amount > 0) ? (
            <>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={productPie} dataKey="amount" nameKey="label" cx="50%" cy="50%" outerRadius={70} strokeWidth={2}>
                    {productPie.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                  </Pie>
                  <Tooltip formatter={v => `$${v.toLocaleString()}`} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-3">
                {productPie.map((p, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: p.fill }} />
                      <span className="text-slate-600 font-medium">{p.label}</span>
                    </div>
                    <span className="font-bold text-slate-800">${(p.amount || 0).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="h-40 flex items-center justify-center text-slate-400 text-xs">Sin ventas aprobadas aún.</div>
          )}
        </div>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Funnel bar */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Target size={17} className="text-violet-600" /> Embudo de conversión
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={FUNNEL_DATA} layout="vertical" margin={{ left: 16, right: 16 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
              <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis dataKey="stage" type="category" width={90} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" name="Oportunidades" radius={[0, 6, 6, 0]}>
                {FUNNEL_DATA.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Llamadas + conversiones */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Phone size={17} className="text-emerald-600" /> Llamadas vs Conversiones
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={TREND_DATA} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="llamadas"     name="Llamadas"      fill="#e2e8f0" radius={[4,4,0,0]} />
              <Bar dataKey="conversiones" name="Conversiones"  fill="#10b981" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex gap-4 mt-3">
            {[['#e2e8f0','Llamadas totales'],['#10b981','Conversiones']].map(([c,l]) => (
              <span key={l} className="flex items-center gap-1.5 text-xs text-slate-500">
                <span className="w-2.5 h-2.5 rounded" style={{ background: c }} />{l}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Campaign status bottom */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Target size={17} className="text-blue-600" /> Estado del pipeline
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Campañas activas',       value: stats.activeCampaigns,  color: 'bg-emerald-500', max: 10 },
            { label: 'Cotizaciones pendientes', value: stats.pendingQuotes,    color: 'bg-amber-400',   max: 20 },
            { label: 'Cotizaciones aprobadas',  value: stats.approvedQuotes,   color: 'bg-blue-500',    max: 20 },
            { label: 'Follow-ups activos',      value: followUps.filter(f => f.status === 'Pendiente').length, color: 'bg-violet-500', max: 30 },
          ].map(s => (
            <div key={s.label}>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="font-bold text-slate-600">{s.label}</span>
                <span className="font-black text-slate-800">{s.value || 0}</span>
              </div>
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className={`h-full ${s.color} rounded-full transition-all duration-700`}
                  style={{ width: `${Math.min(100, Math.round(((s.value || 0) / s.max) * 100))}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
