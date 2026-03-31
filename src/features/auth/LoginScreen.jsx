import { useState } from 'react';
import { LogIn, ShieldCheck } from 'lucide-react';

/* ─── Demo users ─────────────────────────────────────────────────────────────*/
const DEMO_USERS = [
  {
    id: 'admin-01',
    name: 'Carlos Mendoza',
    role: 'Administrador',
    email: 'c.mendoza@callcenter.pe',
    avatar: 'CM',
    roleColor: '#a78bfa',
    roleBg: 'rgba(139,92,246,0.18)',
    description: 'Acceso total · Configuración · Auditoría',
    permissions: ['Todos los módulos', 'Configuración', 'Auditoría completa', 'Usuarios'],
  },
  {
    id: 'sup-01',
    name: 'Marta Salinas',
    role: 'Supervisor',
    email: 'm.salinas@callcenter.pe',
    avatar: 'MS',
    roleColor: '#34d399',
    roleBg: 'rgba(52,211,153,0.15)',
    description: 'Aprobaciones · Supervisión · Reportes',
    permissions: ['Dashboard', 'Aprobaciones', 'Auditoría calidad', 'Reportes'],
  },
  {
    id: 'agt-01',
    name: 'Ana García',
    role: 'Agente',
    email: 'a.garcia@callcenter.pe',
    avatar: 'AG',
    roleColor: '#60a5fa',
    roleBg: 'rgba(96,165,250,0.15)',
    description: 'Llamadas · Clientes · Cotizaciones',
    permissions: ['Consola llamadas', 'CRM', 'Cotizaciones', 'Follow-ups'],
  },
  {
    id: 'agt-02',
    name: 'Carlos Ruiz',
    role: 'Agente',
    email: 'c.ruiz@callcenter.pe',
    avatar: 'CR',
    roleColor: '#38bdf8',
    roleBg: 'rgba(56,189,248,0.15)',
    description: 'Llamadas · Clientes · Cotizaciones',
    permissions: ['Consola llamadas', 'CRM', 'Cotizaciones', 'Follow-ups'],
  },
];

/* ─── Keyframes injected once ────────────────────────────────────────────────*/
const CSS = `
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(22px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes shimmer {
    0%   { background-position: -200% center; }
    100% { background-position:  200% center; }
  }
  @keyframes pulse-ring {
    0%,100% { box-shadow: 0 0 0 0 rgba(59,130,246,0.5); }
    50%      { box-shadow: 0 0 0 8px rgba(59,130,246,0); }
  }
  .login-fadeup   { animation: fadeUp 0.55s cubic-bezier(.22,.61,.36,1) both; }
  .login-fadein   { animation: fadeIn 0.7s ease both; }
  .login-shimmer  {
    background: linear-gradient(90deg,transparent 0%,rgba(255,255,255,0.07) 50%,transparent 100%);
    background-size: 200% auto;
    animation: shimmer 2.5s linear infinite;
  }
  .user-card {
    transition: all 0.2s cubic-bezier(.22,.61,.36,1);
    cursor: pointer;
  }
  .user-card:hover { transform: translateY(-1px); }
  .user-card.selected { animation: pulse-ring 1.8s ease infinite; }
`;

/* ─── Component ──────────────────────────────────────────────────────────────*/
export default function LoginScreen({ onLogin }) {
  const [selected, setSelected] = useState(null);
  const [loading,  setLoading]  = useState(false);

  const handleLogin = () => {
    if (!selected) return;
    setLoading(true);
    setTimeout(() => onLogin(selected), 900);
  };

  return (
    <>
      <style>{CSS}</style>

      {/*
        ── LAYOUT ──
        Mobile  : single column, vertical bg fills screen
        Desktop : two columns — left = photo, right = glass panel
      */}
      <div
        className="min-h-screen w-full relative flex"
        style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", background: '#020817' }}
      >

        {/* ── LEFT PANEL — background photo (desktop only) ── */}
        <div
          className="hidden lg:block flex-1 relative overflow-hidden"
          style={{ minWidth: 0 }}
        >
          {/* Horizontal photo */}
          <img
            src="/bg-horizontal.png"
            alt=""
            className="absolute inset-0 w-full h-full object-cover login-fadein"
            style={{ animationDelay: '0.1s' }}
          />
          {/* Dark gradient overlay to blend into right panel */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to right, rgba(2,8,23,0.15) 0%, rgba(2,8,23,0.55) 70%, rgba(2,8,23,0.98) 100%)',
            }}
          />
          {/* Brand tagline bottom-left */}
          <div
            className="absolute bottom-10 left-10 login-fadeup"
            style={{ animationDelay: '0.6s' }}
          >
            <p className="text-white/80 text-xs font-bold uppercase tracking-[0.3em] mb-2">
              Ecosistema Integral de Ventas
            </p>
            <p
              className="text-4xl font-black text-white leading-tight"
              style={{ textShadow: '0 2px 20px rgba(0,0,0,0.6)' }}
            >
              Gestión B2B<br />
              <span style={{ color: '#60a5fa' }}>de Alto Rendimiento</span>
            </p>
          </div>
        </div>

        {/* ── MOBILE background (vertical photo) ── */}
        <div className="lg:hidden absolute inset-0">
          <img
            src="/bg-vertical.jpg"
            alt=""
            className="w-full h-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to bottom, rgba(2,8,23,0.5) 0%, rgba(2,8,23,0.85) 40%, rgba(2,8,23,0.97) 100%)' }}
          />
        </div>

        {/* ── RIGHT PANEL — login form ── */}
        <div
          className="relative z-10 w-full lg:w-[480px] flex-shrink-0 flex flex-col justify-center px-8 py-10 overflow-y-auto"
          style={{
            background: 'rgba(5,12,28,0.92)',
            backdropFilter: 'blur(20px)',
            borderLeft: '1px solid rgba(255,255,255,0.07)',
          }}
        >
          {/* ── Logo + brand ── */}
          <div
            className="flex items-center gap-4 mb-8 login-fadeup"
            style={{ animationDelay: '0.1s' }}
          >
            <div className="relative">
              <img
                src="/app-icon.jpg"
                alt="CallSysPRO"
                className="w-14 h-14 rounded-2xl object-cover shadow-2xl"
                style={{ boxShadow: '0 0 0 2px rgba(96,165,250,0.4), 0 8px 32px rgba(0,0,0,0.5)' }}
              />
              <div
                className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2"
                style={{ background: '#10b981', borderColor: '#020817' }}
              />
            </div>
            <div>
              <h1
                className="text-2xl font-black text-white leading-none tracking-tight"
                style={{ letterSpacing: '-0.02em' }}
              >
                CallSys<span style={{ color: '#f59e0b' }}>PRO</span>
              </h1>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">
                Centro de Contactos B2B
              </p>
            </div>
          </div>

          {/* ── Headline ── */}
          <div
            className="mb-6 login-fadeup"
            style={{ animationDelay: '0.2s' }}
          >
            <h2 className="text-xl font-black text-white mb-1">Bienvenido</h2>
            <p className="text-slate-400 text-sm">Selecciona tu perfil para ingresar al sistema</p>
          </div>

          {/* ── Demo badge ── */}
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6 self-start login-fadeup"
            style={{
              animationDelay: '0.25s',
              background: 'rgba(245,158,11,0.1)',
              border: '1px solid rgba(245,158,11,0.25)',
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-[11px] font-bold text-amber-400 uppercase tracking-widest">
              Modo Demo — Presentación Comercial
            </span>
          </div>

          {/* ── User cards ── */}
          <div className="space-y-2.5 mb-6">
            {DEMO_USERS.map((user, i) => {
              const isSelected = selected?.id === user.id;
              return (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => setSelected(user)}
                  className={`user-card w-full text-left rounded-2xl p-3.5 login-fadeup ${isSelected ? 'selected' : ''}`}
                  style={{
                    animationDelay: `${0.3 + i * 0.07}s`,
                    background: isSelected
                      ? `linear-gradient(135deg, rgba(37,99,235,0.25) 0%, rgba(30,64,175,0.15) 100%)`
                      : 'rgba(255,255,255,0.04)',
                    border: isSelected
                      ? '1px solid rgba(96,165,250,0.5)'
                      : '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-black flex-shrink-0"
                      style={{
                        background: `linear-gradient(135deg, ${user.roleColor}55, ${user.roleColor}22)`,
                        border: `1px solid ${user.roleColor}40`,
                        color: user.roleColor,
                        boxShadow: isSelected ? `0 0 12px ${user.roleColor}30` : 'none',
                      }}
                    >
                      {user.avatar}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-bold text-white text-sm">{user.name}</span>
                        <span
                          className="text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider"
                          style={{ background: user.roleBg, color: user.roleColor }}
                        >
                          {user.role}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">{user.description}</p>
                    </div>

                    {/* Check */}
                    {isSelected && (
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ background: '#2563eb' }}
                      >
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                          <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Permissions expand */}
                  {isSelected && (
                    <div
                      className="mt-3 pt-3 flex flex-wrap gap-1.5"
                      style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}
                    >
                      {user.permissions.map(p => (
                        <span
                          key={p}
                          className="text-[10px] font-semibold px-2 py-0.5 rounded-lg"
                          style={{ background: 'rgba(255,255,255,0.08)', color: '#94a3b8' }}
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* ── Login button ── */}
          <button
            type="button"
            onClick={handleLogin}
            disabled={!selected || loading}
            className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-black text-sm uppercase tracking-wider transition-all login-fadeup"
            style={{
              animationDelay: '0.62s',
              background: selected && !loading
                ? 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)'
                : 'rgba(255,255,255,0.06)',
              color: selected ? 'white' : '#475569',
              border: selected ? 'none' : '1px solid rgba(255,255,255,0.08)',
              boxShadow: selected && !loading ? '0 8px 32px rgba(37,99,235,0.35)' : 'none',
              cursor: selected && !loading ? 'pointer' : 'not-allowed',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? (
              <>
                <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25"/>
                  <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                </svg>
                Ingresando al sistema...
              </>
            ) : (
              <>
                <LogIn size={17} />
                {selected ? `Ingresar como ${selected.name.split(' ')[0]}` : 'Selecciona un perfil'}
              </>
            )}
          </button>

          {/* ── Footer ── */}
          <div
            className="flex items-center justify-center gap-2 mt-6 login-fadeup"
            style={{ animationDelay: '0.7s' }}
          >
            <ShieldCheck size={12} className="text-slate-600" />
            <span className="text-[11px] text-slate-600">
              Datos guardados localmente · Sesión de demostración
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
