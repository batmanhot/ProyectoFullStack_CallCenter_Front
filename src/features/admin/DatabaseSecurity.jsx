import { useMemo, useState } from 'react';
import { AlertTriangle, Download, Filter, History, Key, RefreshCw, ShieldAlert, ShieldCheck } from 'lucide-react';

const MODULE_COLORS = {
  'Cotizacion':   'bg-blue-100 text-blue-700',
  'CRM':          'bg-purple-100 text-purple-700',
  'Llamada':      'bg-emerald-100 text-emerald-700',
  'Seguridad':    'bg-red-100 text-red-700',
  'Campaña':      'bg-amber-100 text-amber-700',
  'Capacitacion': 'bg-sky-100 text-sky-700',
  'Sistema':      'bg-slate-100 text-slate-600',
  'Producto':     'bg-orange-100 text-orange-700',
  'Follow-up':    'bg-teal-100 text-teal-700',
  'PDF':          'bg-indigo-100 text-indigo-700',
};

function exportCSV(logs) {
  const header = 'ID,Módulo,Evento,Usuario,Rol,Fecha/Hora,Objeto,Alerta';
  const rows = logs.map(l => [l.id,l.module||'—',l.event,l.user,l.role||'—',l.date,l.obj,l.alert?'SÍ':'NO'].join(','));
  const csv  = [header,...rows].join('\n');
  const blob = new Blob([csv], { type:'text/csv' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url; a.download = `auditoria_${new Date().toISOString().slice(0,10)}.csv`;
  a.click(); URL.revokeObjectURL(url);
}

export default function DatabaseSecurity({ encryptionActive, logs, onToggleEncryption, onRunAudit }) {
  const [moduleFilter, setModuleFilter] = useState('ALL');
  const [alertFilter,  setAlertFilter]  = useState('ALL');
  const [search,       setSearch]       = useState('');

  const modules = useMemo(() => ['ALL',...new Set(logs.map(l=>l.module||'Sistema').filter(Boolean))], [logs]);

  const filtered = useMemo(() => logs.filter(l => {
    const q = search.toLowerCase();
    const ms = !q || l.event.toLowerCase().includes(q) || l.user.toLowerCase().includes(q) || (l.obj||'').toLowerCase().includes(q) || (l.module||'').toLowerCase().includes(q);
    const mm = moduleFilter==='ALL' || (l.module||'Sistema')===moduleFilter;
    const ma = alertFilter==='ALL' || (alertFilter==='alert'?l.alert:!l.alert);
    return ms && mm && ma;
  }), [logs, moduleFilter, alertFilter, search]);

  const stats = useMemo(() => ({
    total:   logs.length,
    alerts:  logs.filter(l=>l.alert).length,
    today:   logs.filter(l=>l.date?.startsWith(new Date().toISOString().slice(0,10))).length,
    modules: new Set(logs.map(l=>l.module||'Sistema')).size,
  }), [logs]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Seguridad y Auditoría</h2>
          <p className="text-slate-500 text-sm">Trazabilidad completa de todas las operaciones del sistema.</p>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => exportCSV(filtered)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 shadow-sm">
            <Download size={13}/> Exportar CSV
          </button>
          <button type="button" onClick={onRunAudit}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 shadow-lg">
            <RefreshCw size={13}/> Ejecutar auditoría
          </button>
        </div>
      </div>

      {/* System status + KPIs */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-1 bg-slate-900 text-white rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400"><ShieldAlert size={20}/></div>
            <h3 className="font-bold text-sm">Estado del sistema</h3>
          </div>
          <button type="button" onClick={onToggleEncryption}
            className="w-full flex justify-between items-center p-3 bg-slate-800 rounded-xl text-left">
            <span className="text-xs font-medium">Cifrado AES-256</span>
            <div className={`w-10 h-5 rounded-full relative transition-colors ${encryptionActive?'bg-emerald-500':'bg-slate-600'}`}>
              <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${encryptionActive?'left-6':'left-1'}`}/>
            </div>
          </button>
          <div className="flex justify-between items-center p-3 bg-slate-800 rounded-xl">
            <span className="text-xs font-medium">Anonimización</span>
            <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-1 rounded font-bold">ACTIVO</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-slate-800 rounded-xl">
            <span className="text-xs font-medium">Auditoría en tiempo real</span>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded font-bold">ACTIVO</span>
          </div>
        </div>

        <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label:'Eventos totales',  value:stats.total,   cls:'text-slate-800',  icon:<History size={14}/> },
            { label:'Alertas críticas', value:stats.alerts,  cls:'text-red-600',    icon:<AlertTriangle size={14}/> },
            { label:'Hoy',              value:stats.today,   cls:'text-blue-600',   icon:<ShieldCheck size={14}/> },
            { label:'Módulos auditados',value:stats.modules, cls:'text-violet-600', icon:<Key size={14}/> },
          ].map(k => (
            <div key={k.label} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-1.5 text-slate-400 mb-2">{k.icon}<p className="text-[10px] font-bold uppercase tracking-wide">{k.label}</p></div>
              <p className={`text-2xl font-black ${k.cls}`}>{k.value}</p>
            </div>
          ))}

          {/* Role control */}
          <div className="col-span-2 md:col-span-4 bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
            <h4 className="font-bold text-slate-700 text-xs uppercase tracking-wider mb-3 flex items-center gap-2"><Key size={13} className="text-amber-500"/> Control de acceso por rol</h4>
            <div className="grid grid-cols-3 gap-3">
              {[
                { role:'Administrador', perms:'Acceso total · Configuración · Auditoría', color:'bg-violet-100 text-violet-800 border-violet-200' },
                { role:'Supervisor',    perms:'Aprobaciones · Reportes · Auditoría calidad', color:'bg-emerald-100 text-emerald-800 border-emerald-200' },
                { role:'Agente',        perms:'Llamadas · CRM · Cotizaciones (borrador)', color:'bg-blue-100 text-blue-800 border-blue-200' },
              ].map(r => (
                <div key={r.role} className={`border rounded-xl p-3 ${r.color}`}>
                  <p className="font-bold text-sm">{r.role}</p>
                  <p className="text-[11px] mt-1 opacity-80">{r.perms}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Audit log */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <h3 className="font-bold text-slate-700 text-xs uppercase tracking-widest flex items-center gap-2 flex-shrink-0">
            <History size={14}/> Log de trazabilidad
          </h3>
          <div className="flex flex-wrap gap-2 ml-auto">
            <input placeholder="Buscar evento, usuario..." value={search} onChange={e=>setSearch(e.target.value)}
              className="border border-slate-200 rounded-lg px-3 py-1.5 text-xs outline-none focus:ring-1 focus:ring-blue-400 bg-white w-44"/>
            <select value={moduleFilter} onChange={e=>setModuleFilter(e.target.value)}
              className="border border-slate-200 rounded-lg px-2 py-1.5 text-xs outline-none bg-white focus:ring-1 focus:ring-blue-400">
              {modules.map(m=><option key={m} value={m}>{m==='ALL'?'Todos los módulos':m}</option>)}
            </select>
            <select value={alertFilter} onChange={e=>setAlertFilter(e.target.value)}
              className="border border-slate-200 rounded-lg px-2 py-1.5 text-xs outline-none bg-white focus:ring-1 focus:ring-blue-400">
              <option value="ALL">Todos</option>
              <option value="alert">Solo alertas</option>
              <option value="normal">Sin alertas</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead className="bg-white border-b border-slate-100">
              <tr>
                {['ID','Módulo','Evento','Usuario','Rol','Fecha / Hora','Objeto','⚠'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="px-4 py-8 text-center text-slate-400 text-xs">Sin registros en esta selección.</td></tr>
              )}
              {filtered.map(log => {
                const modCls = MODULE_COLORS[log.module||'Sistema'] || MODULE_COLORS['Sistema'];
                return (
                  <tr key={log.id} className={`hover:bg-slate-50 transition-colors ${log.alert?'bg-red-50/30':''}`}>
                    <td className="px-4 py-3 font-mono text-[11px] text-slate-400">{log.id}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${modCls}`}>{log.module||'Sistema'}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-sm font-medium ${log.alert?'text-red-700':'text-slate-700'}`}>{log.event}</span>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-500">{log.user}</td>
                    <td className="px-4 py-3 text-xs text-slate-400">{log.role||'—'}</td>
                    <td className="px-4 py-3 text-xs text-slate-500">{log.date}</td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-400">{log.obj}</td>
                    <td className="px-4 py-3 text-center">
                      {log.alert && <AlertTriangle size={14} className="text-red-500 mx-auto"/>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 text-[10px] text-slate-400 flex justify-between">
          <span>Mostrando {filtered.length} de {logs.length} registros</span>
          <span>Auditoría automática · Todas las operaciones quedan registradas</span>
        </div>
      </div>
    </div>
  );
}
