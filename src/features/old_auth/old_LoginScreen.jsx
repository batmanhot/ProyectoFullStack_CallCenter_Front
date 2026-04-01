import { useState } from 'react';
import { LogIn, ShieldCheck } from 'lucide-react';

const DEMO_USERS = [
  {
    id: 'admin-01',
    name: 'Carlos Mendoza',
    role: 'Administrador',
    email: 'c.mendoza@callcenter.pe',
    avatar: 'CM',
    color: 'bg-violet-600',
    description: 'Acceso total al sistema, configuración y auditoría',
    permissions: ['Todos los módulos', 'Configuración del sistema', 'Auditoría completa', 'Gestión de usuarios'],
  },
  {
    id: 'sup-01',
    name: 'Marta Salinas',
    role: 'Supervisor',
    email: 'm.salinas@callcenter.pe',
    avatar: 'MS',
    color: 'bg-emerald-600',
    description: 'Aprobación de cotizaciones, supervisión de agentes y reportes',
    permissions: ['Dashboard gerencial', 'Aprobación cotizaciones', 'Auditoría de calidad', 'Reportes'],
  },
  {
    id: 'agt-01',
    name: 'Ana García',
    role: 'Agente',
    email: 'a.garcia@callcenter.pe',
    avatar: 'AG',
    color: 'bg-blue-600',
    description: 'Gestión de llamadas, cotizaciones y seguimiento de clientes',
    permissions: ['Consola de llamadas', 'Clientes y CRM', 'Cotizaciones (borrador)', 'Follow-ups'],
  },
  {
    id: 'agt-02',
    name: 'Carlos Ruiz',
    role: 'Agente',
    email: 'c.ruiz@callcenter.pe',
    avatar: 'CR',
    color: 'bg-sky-600',
    description: 'Gestión de llamadas, cotizaciones y seguimiento de clientes',
    permissions: ['Consola de llamadas', 'Clientes y CRM', 'Cotizaciones (borrador)', 'Follow-ups'],
  },
];

export default function LoginScreen({ onLogin }) {
  const [selected, setSelected] = useState(null);
  const [loading, setLoading]   = useState(false);

  const handleLogin = () => {
    if (!selected) return;
    setLoading(true);
    setTimeout(() => onLogin(selected), 800);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      {/* Background grid */}
      <div className="fixed inset-0 opacity-[0.04]"
        style={{ backgroundImage: 'linear-gradient(#94a3b8 1px,transparent 1px),linear-gradient(90deg,#94a3b8 1px,transparent 1px)', backgroundSize: '40px 40px' }} />

      <div className="relative w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-lg shadow-blue-900/50">
              CC
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-black text-white tracking-tight uppercase">CallCenter B2B</h1>
              <p className="text-[11px] font-bold text-blue-400 uppercase tracking-[0.2em]">Ecosistema Integral</p>
            </div>
          </div>
          <p className="text-slate-400 text-sm">Selecciona un usuario para ingresar al sistema</p>
          <div className="inline-flex items-center gap-2 mt-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">Modo Demo — Presentación Comercial</span>
          </div>
        </div>

        {/* User cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {DEMO_USERS.map(user => {
            const isSelected = selected?.id === user.id;
            return (
              <button key={user.id} type="button" onClick={() => setSelected(user)}
                className={`text-left p-4 rounded-2xl border transition-all ${
                  isSelected
                    ? 'bg-blue-600/10 border-blue-500 ring-1 ring-blue-500'
                    : 'bg-white/5 border-white/10 hover:bg-white/8 hover:border-white/20'
                }`}>
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl ${user.color} flex items-center justify-center text-white text-sm font-black flex-shrink-0 shadow-lg`}>
                    {user.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <p className="font-bold text-white text-sm">{user.name}</p>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        user.role === 'Administrador' ? 'bg-violet-500/20 text-violet-400' :
                        user.role === 'Supervisor'    ? 'bg-emerald-500/20 text-emerald-400' :
                                                        'bg-blue-500/20 text-blue-400'
                      }`}>{user.role}</span>
                    </div>
                    <p className="text-[11px] text-slate-500">{user.email}</p>
                    <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">{user.description}</p>
                  </div>
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                  )}
                </div>

                {/* Permissions preview */}
                {isSelected && (
                  <div className="mt-3 pt-3 border-t border-white/10">
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-wider mb-1.5">Accesos</p>
                    <div className="flex flex-wrap gap-1">
                      {user.permissions.map(p => (
                        <span key={p} className="text-[10px] font-medium text-slate-300 bg-white/10 px-2 py-0.5 rounded">{p}</span>
                      ))}
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Login button */}
        <button type="button" onClick={handleLogin} disabled={!selected || loading}
          className="w-full flex items-center justify-center gap-3 py-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-black rounded-2xl transition-all text-sm uppercase tracking-wider shadow-xl shadow-blue-900/40">
          {loading ? (
            <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.3"/>
              <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
            </svg>
          ) : <LogIn size={18} />}
          {loading ? 'Ingresando...' : selected ? `Ingresar como ${selected.name}` : 'Selecciona un usuario'}
        </button>

        <div className="flex items-center justify-center gap-2 mt-5 text-slate-600 text-[11px]">
          <ShieldCheck size={12} />
          <span>Sesión de demo — Los datos se guardan localmente en este navegador</span>
        </div>
      </div>
    </div>
  );
}
