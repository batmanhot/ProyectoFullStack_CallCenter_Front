import { useMemo, useState } from 'react';
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid,
  Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import {
  Activity, ArrowDownRight, ArrowUpRight, Bell,
  CheckCircle2, Clock, DollarSign, Phone,
  RefreshCw, Star, Target, TrendingUp, Users,
} from 'lucide-react';

// ─── Static rich demo data ────────────────────────────────────────────────────
const TREND_DATA = [
  { label:'Sem 1', ventas:22000, llamadas:38, conversiones: 6 },
  { label:'Sem 2', ventas:31500, llamadas:54, conversiones:11 },
  { label:'Sem 3', ventas:28000, llamadas:47, conversiones: 9 },
  { label:'Sem 4', ventas:47000, llamadas:72, conversiones:18 },
  { label:'Sem 5', ventas:58500, llamadas:89, conversiones:24 },
  { label:'Sem 6', ventas:52000, llamadas:81, conversiones:21 },
  { label:'Sem 7', ventas:71000, llamadas:95, conversiones:29 },
  { label:'Sem 8', ventas:65000, llamadas:88, conversiones:26 },
];

const FUNNEL_DATA = [
  { stage:'Prospección',  count:62, fill:'#3b82f6' },
  { stage:'Contacto',     count:44, fill:'#8b5cf6' },
  { stage:'Cotización',   count:27, fill:'#f59e0b' },
  { stage:'Negociación',  count:16, fill:'#14b8a6' },
  { stage:'Cierre',       count:11, fill:'#10b981' },
];

const CHANNEL_DATA = [
  { canal:'Teléfono',  count:42, fill:'#3b82f6' },
  { canal:'Celular',   count:28, fill:'#10b981' },
  { canal:'WhatsApp',  count:35, fill:'#22c55e' },
  { canal:'Facebook',  count:14, fill:'#6366f1' },
  { canal:'Email',     count:18, fill:'#8b5cf6' },
  { canal:'Presencial',count: 8, fill:'#f59e0b' },
];

const AGENTS = [
  { name:'Ana García',   role:'Agente',     calls:34, conversions:14, score:92, trend:'+8%' },
  { name:'Carlos Ruiz',  role:'Agente',     calls:29, conversions:11, score:87, trend:'+5%' },
  { name:'Luis Torres',  role:'Agente',     calls:22, conversions: 7, score:79, trend:'+2%' },
  { name:'Marta Salinas',role:'Supervisor', calls:12, conversions: 6, score:94, trend:'+12%'},
];

const PRODUCT_COLORS = ['#2563eb','#7c3aed','#0891b2'];
const PERIOD_OPTIONS  = ['Esta semana','Este mes','Trimestre','Todo'];

// ─── Tooltip personalizado ────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl p-3 shadow-xl text-xs">
      <p className="font-bold text-white mb-1">{label}</p>
      {payload.map((p,i) => (
        <p key={i} style={{ color:p.color }}>
          {p.name}: <span className="font-bold">
            {typeof p.value==='number'&&p.value>1000?`$${p.value.toLocaleString()}`:p.value}
          </span>
        </p>
      ))}
    </div>
  );
};

// ─── KPI Card ─────────────────────────────────────────────────────────────────
function KpiCard({ icon, label, value, prev, up, formula, accent, category }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-all border border-slate-100">
      <div className="flex justify-between items-start mb-3">
        <div className="p-2.5 rounded-xl" style={{ background:`${accent}15` }}>
          {icon}
        </div>
        <span className={`flex items-center gap-0.5 text-[10px] font-black px-2 py-0.5 rounded-full ${up?'bg-emerald-100 text-emerald-700':'bg-red-100 text-red-700'}`}>
          {up?<ArrowUpRight size={10}/>:<ArrowDownRight size={10}/>} {prev}
        </span>
      </div>
      <p className="text-2xl font-black text-slate-800 mb-0.5">{value}</p>
      <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider leading-tight">{label}</p>
      <p className="text-[9px] text-slate-400 italic mt-1">{formula}</p>
      <span className="inline-block mt-2 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
        style={{ background:`${accent}10`, color:accent }}>
        {category}
      </span>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function ExecutiveDashboard({ stats, followUps=[], config={}, onRefresh, onExport }) {
  const [period, setPeriod] = useState('Este mes');

  const alertThreshold = config?.notifications?.alertThresholdDays ?? 1;

  const overdueFollowUps = useMemo(()=>
    followUps.filter(f=>{
      if(f.status!=='Pendiente') return false;
      const d=new Date(f.date); d.setHours(0,0,0,0);
      const t=new Date();       t.setHours(0,0,0,0);
      return (t-d)/86400000 >= alertThreshold;
    }).length,
  [followUps, alertThreshold]);

  const productPie = useMemo(()=>
    (stats.productLines||[]).map((l,i)=>({...l,fill:PRODUCT_COLORS[i%PRODUCT_COLORS.length]})),
  [stats.productLines]);

  const kpis = [
    { icon:<Target   size={18} style={{color:'#2563eb'}}/>, label:'Tasa de Conversión',    value:stats.conversionRate,   prev:'19%',    up:true,  formula:'Cotizaciones aprobadas / total',   accent:'#2563eb', category:'Ventas'       },
    { icon:<Phone    size={18} style={{color:'#10b981'}}/>, label:'Llamadas Efectivas',    value:stats.effectiveCalls,   prev:'61%',    up:true,  formula:'Contactos / total marcaciones',    accent:'#10b981', category:'Productividad'},
    { icon:<Clock    size={18} style={{color:'#f59e0b'}}/>, label:'Tiempo Cierre Prom.',   value:stats.closingTime,      prev:'21 días',up:true,  formula:'Días contacto → cierre',           accent:'#f59e0b', category:'Tiempo'       },
    { icon:<DollarSign size={18} style={{color:'#0891b2'}}/>,label:'Ventas Aprobadas',    value:`$${(stats.totalSales||0).toLocaleString()}`, prev:'$98.2k', up:true, formula:'Suma cotizaciones aprobadas', accent:'#0891b2', category:'Financiero' },
    { icon:<CheckCircle2 size={18} style={{color:'#7c3aed'}}/>,label:'Tasa Aprobación',   value:stats.quoteApprovalRate||'72%', prev:'68%', up:true, formula:'Aprobadas / enviadas a revisión', accent:'#7c3aed', category:'Calidad'   },
  ];

  return (
    <div className="space-y-6">

      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Dashboard Ejecutivo</h2>
          <p className="text-slate-500 text-sm">
            Visibilidad en tiempo real · <span className="font-bold text-slate-700">{period}</span>
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="flex bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            {PERIOD_OPTIONS.map(p=>(
              <button key={p} type="button" onClick={()=>setPeriod(p)}
                className={`px-3 py-2 text-xs font-bold transition-all ${period===p?'bg-slate-900 text-white':'text-slate-500 hover:bg-slate-50'}`}>
                {p}
              </button>
            ))}
          </div>
          <button type="button" onClick={onRefresh}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 shadow-lg">
            <RefreshCw size={13}/> Actualizar
          </button>
        </div>
      </div>

      {/* ── Follow-up alert ── */}
      {overdueFollowUps>0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3 text-sm text-amber-800 font-medium">
            <Bell size={16} className="text-amber-600"/>
            <span><span className="font-black">{overdueFollowUps}</span> follow-up{overdueFollowUps>1?'s':''} vencido{overdueFollowUps>1?'s':''} pendiente{overdueFollowUps>1?'s':''}.</span>
          </div>
          <span className="text-[10px] font-black text-amber-600 uppercase tracking-wider hidden sm:block">→ Follow-ups</span>
        </div>
      )}

      {/* ── 5 KPIs ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {kpis.map((k,i)=><KpiCard key={i} {...k}/>)}
      </div>

      {/* ── Row 1: Trend + Product pie ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Trend area */}
        <div className="lg:col-span-2 bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <TrendingUp size={16} className="text-blue-600"/> Evolución de ventas B2B
            </h3>
            <span className="text-[10px] font-bold text-slate-400 uppercase bg-slate-50 px-2 py-1 rounded-lg">{period}</span>
          </div>
          <ResponsiveContainer width="100%" height={210}>
            <AreaChart data={TREND_DATA} margin={{top:4,right:4,bottom:0,left:0}}>
              <defs>
                <linearGradient id="gV" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#2563eb" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/>
              <XAxis dataKey="label" tick={{fontSize:11,fill:'#94a3b8'}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fontSize:11,fill:'#94a3b8'}} axisLine={false} tickLine={false} tickFormatter={v=>`$${(v/1000).toFixed(0)}k`}/>
              <Tooltip content={<CustomTooltip/>}/>
              <Area type="monotone" dataKey="ventas" name="Ventas" stroke="#2563eb" strokeWidth={2.5} fill="url(#gV)" dot={{r:3,fill:'#2563eb'}}/>
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Product pie */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-4">Ventas por producto</h3>
          {productPie.some(p=>p.amount>0) ? (
            <>
              <ResponsiveContainer width="100%" height={150}>
                <PieChart>
                  <Pie data={productPie} dataKey="amount" nameKey="label" cx="50%" cy="50%" outerRadius={65} strokeWidth={2}>
                    {productPie.map((e,i)=><Cell key={i} fill={e.fill}/>)}
                  </Pie>
                  <Tooltip formatter={v=>`$${Number(v).toLocaleString()}`}/>
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-3">
                {productPie.map((p,i)=>(
                  <div key={i} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{background:p.fill}}/>
                      <span className="text-slate-600 font-medium truncate max-w-[110px]">{p.label}</span>
                    </div>
                    <span className="font-bold text-slate-800">${(p.amount||0).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="h-40 flex items-center justify-center text-slate-400 text-xs">Sin ventas aprobadas aún.</div>
          )}
        </div>
      </div>

      {/* ── Row 2: Funnel + Canales + Llamadas vs Conversiones ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

        {/* Funnel */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-5 flex items-center gap-2">
            <Target size={16} className="text-violet-600"/> Embudo de conversión
          </h3>
          <ResponsiveContainer width="100%" height={190}>
            <BarChart data={FUNNEL_DATA} layout="vertical" margin={{left:8,right:8}}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9"/>
              <XAxis type="number" tick={{fontSize:11,fill:'#94a3b8'}} axisLine={false} tickLine={false}/>
              <YAxis dataKey="stage" type="category" width={82} tick={{fontSize:11,fill:'#64748b'}} axisLine={false} tickLine={false}/>
              <Tooltip content={<CustomTooltip/>}/>
              <Bar dataKey="count" name="Oportunidades" radius={[0,6,6,0]}>
                {FUNNEL_DATA.map((e,i)=><Cell key={i} fill={e.fill}/>)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Canal bar */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-5 flex items-center gap-2">
            <Phone size={16} className="text-emerald-600"/> Contactos por canal
          </h3>
          <ResponsiveContainer width="100%" height={190}>
            <BarChart data={CHANNEL_DATA} margin={{top:4,right:4,bottom:0,left:0}}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/>
              <XAxis dataKey="canal" tick={{fontSize:10,fill:'#94a3b8'}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fontSize:11,fill:'#94a3b8'}} axisLine={false} tickLine={false}/>
              <Tooltip content={<CustomTooltip/>}/>
              <Bar dataKey="count" name="Contactos" radius={[4,4,0,0]}>
                {CHANNEL_DATA.map((e,i)=><Cell key={i} fill={e.fill}/>)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Llamadas vs Conversiones */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-5 flex items-center gap-2">
            <Activity size={16} className="text-blue-600"/> Llamadas vs Conversiones
          </h3>
          <ResponsiveContainer width="100%" height={190}>
            <BarChart data={TREND_DATA.slice(-6)} margin={{top:4,right:4,bottom:0,left:0}}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/>
              <XAxis dataKey="label" tick={{fontSize:11,fill:'#94a3b8'}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fontSize:11,fill:'#94a3b8'}} axisLine={false} tickLine={false}/>
              <Tooltip content={<CustomTooltip/>}/>
              <Bar dataKey="llamadas"     name="Llamadas"     fill="#e2e8f0" radius={[3,3,0,0]}/>
              <Bar dataKey="conversiones" name="Conversiones" fill="#10b981" radius={[3,3,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
          <div className="flex gap-4 mt-2">
            {[['#e2e8f0','Llamadas'],['#10b981','Conversiones']].map(([c,l])=>(
              <span key={l} className="flex items-center gap-1.5 text-xs text-slate-500">
                <span className="w-2.5 h-2.5 rounded" style={{background:c}}/>{l}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Row 3: Agent ranking + Pipeline status ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Agent ranking */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Users size={16} className="text-blue-600"/> Ranking de agentes
          </h3>
          <div className="space-y-3">
            {AGENTS.map((a,i)=>(
              <div key={a.name} className="flex items-center gap-3">
                {/* Rank */}
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 ${
                  i===0?'bg-amber-100 text-amber-700':i===1?'bg-slate-100 text-slate-600':i===2?'bg-orange-100 text-orange-600':'bg-slate-50 text-slate-400'
                }`}>
                  {i===0?<Star size={12}/>:i+1}
                </div>
                {/* Avatar */}
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-700 text-xs font-black flex-shrink-0">
                  {a.name.split(' ').map(n=>n[0]).join('').slice(0,2)}
                </div>
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-slate-800 truncate">{a.name}</p>
                    <span className="text-xs font-black text-emerald-600 flex-shrink-0">{a.trend}</span>
                  </div>
                  <div className="flex gap-3 text-[11px] text-slate-400 mt-0.5">
                    <span>{a.calls} contactos</span>
                    <span className="text-blue-600 font-bold">{a.conversions} cierres</span>
                    <span>Score: <span className="font-bold text-slate-600">{a.score}</span></span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pipeline status */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <TrendingUp size={16} className="text-blue-600"/> Estado del pipeline
          </h3>
          <div className="space-y-4">
            {[
              { label:'Campañas activas',        value:stats.activeCampaigns||3,  total:6,  color:'#10b981', bg:'#10b98115' },
              { label:'Cotizaciones pendientes',  value:stats.pendingQuotes||2,    total:10, color:'#f59e0b', bg:'#f59e0b15' },
              { label:'Cotizaciones aprobadas',   value:stats.approvedQuotes||3,   total:10, color:'#2563eb', bg:'#2563eb15' },
              { label:'Follow-ups activos',       value:followUps.filter(f=>f.status==='Pendiente').length||3, total:20, color:'#7c3aed', bg:'#7c3aed15' },
              { label:'Oportunidades en pipeline',value:5, total:10, color:'#0891b2', bg:'#0891b215' },
            ].map(s=>(
              <div key={s.label}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="font-bold text-slate-600">{s.label}</span>
                  <span className="font-black text-slate-800">{s.value}</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{background:s.bg}}>
                  <div className="h-full rounded-full transition-all duration-700"
                    style={{width:`${Math.min(100,Math.round((s.value/s.total)*100))}%`, background:s.color}}/>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
