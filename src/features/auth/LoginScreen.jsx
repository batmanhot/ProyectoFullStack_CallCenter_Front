import { useState } from 'react';
import { LogIn, ShieldCheck } from 'lucide-react';

const DEMO_USERS = [
  { id:'admin-01', name:'Carlos Mendoza', role:'Administrador', email:'c.mendoza@callcenter.pe', avatar:'CM', roleColor:'#a78bfa', roleBg:'rgba(139,92,246,0.18)', description:'Acceso total · Configuración · Auditoría', permissions:['Todos los módulos','Configuración','Auditoría completa','Usuarios'] },
  { id:'sup-01',   name:'Marta Salinas',  role:'Supervisor',    email:'m.salinas@callcenter.pe', avatar:'MS', roleColor:'#34d399', roleBg:'rgba(52,211,153,0.15)',  description:'Aprobaciones · Supervisión · Reportes',  permissions:['Dashboard','Aprobaciones','Auditoría calidad','Reportes'] },
  { id:'agt-01',   name:'Ana García',     role:'Agente',        email:'a.garcia@callcenter.pe',  avatar:'AG', roleColor:'#60a5fa', roleBg:'rgba(96,165,250,0.15)',  description:'Llamadas · Clientes · Cotizaciones',     permissions:['Consola llamadas','CRM','Cotizaciones','Follow-ups'] },
  { id:'agt-02',   name:'Carlos Ruiz',    role:'Agente',        email:'c.ruiz@callcenter.pe',    avatar:'CR', roleColor:'#38bdf8', roleBg:'rgba(56,189,248,0.15)',  description:'Llamadas · Clientes · Cotizaciones',     permissions:['Consola llamadas','CRM','Cotizaciones','Follow-ups'] },
];

const CSS = `
  @keyframes fadeUp  { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
  @keyframes pulse-ring { 0%,100%{box-shadow:0 0 0 0 rgba(59,130,246,.5)} 50%{box-shadow:0 0 0 8px rgba(59,130,246,0)} }
  .login-fadeup  { animation: fadeUp  0.55s cubic-bezier(.22,.61,.36,1) both; }
  .login-fadein  { animation: fadeIn  0.7s ease both; }
  .user-card     { transition: all 0.2s cubic-bezier(.22,.61,.36,1); cursor:pointer; }
  .user-card:hover { transform:translateY(-1px); }
  .user-card.selected { animation: pulse-ring 1.8s ease infinite; }
  .login-scroll::-webkit-scrollbar { width:4px; }
  .login-scroll::-webkit-scrollbar-thumb { background:rgba(255,255,255,.12); border-radius:4px; }

  /* ── MÓVIL: panel anclado abajo, imagen visible arriba ── */
  @media (max-width:1023px) {
    .login-panel {
      position: fixed !important;
      bottom: 0; left: 0; right: 0;
      max-height: 66vh;
      border-radius: 24px 24px 0 0 !important;
      border-top: 1px solid rgba(255,255,255,.10) !important;
      box-shadow: 0 -16px 60px rgba(0,0,0,.55) !important;
    }
  }
`;

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

      <div className="min-h-screen w-full relative flex"
        style={{ fontFamily:"'Segoe UI',system-ui,sans-serif", background:'#020817' }}>

        {/* ── DESKTOP: columna izquierda con foto horizontal ── */}
        <div className="hidden lg:block flex-1 relative overflow-hidden">
          <img src="/bg-horizontal.png" alt="" className="absolute inset-0 w-full h-full object-cover login-fadein" style={{animationDelay:'.1s'}}/>
          <div className="absolute inset-0" style={{background:'linear-gradient(to right,rgba(2,8,23,.15) 0%,rgba(2,8,23,.55) 70%,rgba(2,8,23,.98) 100%)'}}/>
          <div className="absolute bottom-10 left-10 login-fadeup" style={{animationDelay:'.6s'}}>
            <p className="text-white/80 text-xs font-bold uppercase tracking-[.3em] mb-2">Ecosistema Integral de Ventas</p>
            <p className="text-4xl font-black text-white leading-tight" style={{textShadow:'0 2px 20px rgba(0,0,0,.6)'}}>
              Gestión B2B<br/><span style={{color:'#60a5fa'}}>de Alto Rendimiento</span>
            </p>
          </div>
        </div>

        {/* ── MÓVIL: foto vertical ocupa toda la pantalla ── */}
        <div className="lg:hidden absolute inset-0">
          <img src="/bg-vertical.jpg" alt="" className="w-full h-full object-cover login-fadein"/>
          {/* degradado en 3 zonas: oscuro arriba (marca), claro al centro (foto visible), oscuro abajo (panel) */}
          <div className="absolute inset-0" style={{background:'linear-gradient(to bottom,rgba(2,8,23,.80) 0%,rgba(2,8,23,.25) 35%,rgba(2,8,23,.25) 52%,rgba(2,8,23,.92) 68%,rgba(2,8,23,.99) 100%)'}}/>
          {/* Tagline visible sobre la foto */}
          <div className="absolute top-10 left-6 right-6 login-fadeup" style={{animationDelay:'.3s'}}>
            <p className="text-white/70 text-[10px] font-bold uppercase tracking-[.3em] mb-1">Ecosistema Integral de Ventas</p>
            <p className="text-2xl font-black text-white leading-tight" style={{textShadow:'0 2px 16px rgba(0,0,0,.7)'}}>
              Gestión B2B<br/><span style={{color:'#60a5fa'}}>de Alto Rendimiento</span>
            </p>
          </div>
        </div>

        {/* ── PANEL LOGIN (desktop: col. derecha | móvil: bottom-sheet) ── */}
        <div
          className="login-panel login-scroll relative z-10 flex flex-col justify-center overflow-y-auto
                     lg:w-[480px] lg:flex-shrink-0 lg:static lg:px-8 lg:py-10 lg:rounded-none lg:border-0 lg:shadow-none
                     w-full px-6 py-7"
          style={{
            background:'rgba(5,12,28,0.93)',
            backdropFilter:'blur(24px)',
            WebkitBackdropFilter:'blur(24px)',
            borderLeft:'1px solid rgba(255,255,255,.07)',
          }}
        >

          {/* Tirante decorativo — solo visible en móvil */}
          <div className="lg:hidden flex justify-center mb-4">
            <div className="w-10 h-1 rounded-full" style={{background:'rgba(255,255,255,.18)'}}/>
          </div>

          {/* Logo */}
          <div className="flex items-center gap-4 mb-5 login-fadeup" style={{animationDelay:'.1s'}}>
            <div className="relative">
              <img src="/app-icon.jpg" alt="CallSysPRO"
                className="w-12 h-12 lg:w-14 lg:h-14 rounded-2xl object-cover shadow-2xl"
                style={{boxShadow:'0 0 0 2px rgba(96,165,250,.4),0 8px 32px rgba(0,0,0,.5)'}}/>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2" style={{background:'#10b981',borderColor:'#020817'}}/>
            </div>
            <div>
              <h1 className="text-xl lg:text-2xl font-black text-white leading-none" style={{letterSpacing:'-.02em'}}>
                CallSys<span style={{color:'#f59e0b'}}>PRO</span>
              </h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[.2em] mt-1">Centro de Contactos B2B</p>
            </div>
          </div>

          {/* Headline */}
          <div className="mb-4 login-fadeup" style={{animationDelay:'.2s'}}>
            <h2 className="text-lg lg:text-xl font-black text-white mb-1">Bienvenido</h2>
            <p className="text-slate-400 text-sm">Selecciona tu perfil para ingresar al sistema</p>
          </div>

          {/* Demo badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4 self-start login-fadeup"
            style={{animationDelay:'.25s',background:'rgba(245,158,11,.1)',border:'1px solid rgba(245,158,11,.25)'}}>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"/>
            <span className="text-[11px] font-bold text-amber-400 uppercase tracking-widest">Modo Demo — Presentación Comercial</span>
          </div>

          {/* User cards */}
          <div className="space-y-2 mb-5">
            {DEMO_USERS.map((user, i) => {
              const isSel = selected?.id === user.id;
              return (
                <button key={user.id} type="button" onClick={()=>setSelected(user)}
                  className={`user-card w-full text-left rounded-2xl p-3 login-fadeup ${isSel?'selected':''}`}
                  style={{
                    animationDelay:`${.3+i*.07}s`,
                    background: isSel ? 'linear-gradient(135deg,rgba(37,99,235,.25),rgba(30,64,175,.15))' : 'rgba(255,255,255,.04)',
                    border: isSel ? '1px solid rgba(96,165,250,.5)' : '1px solid rgba(255,255,255,.08)',
                  }}>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black flex-shrink-0"
                      style={{background:`linear-gradient(135deg,${user.roleColor}55,${user.roleColor}22)`,border:`1px solid ${user.roleColor}40`,color:user.roleColor,boxShadow:isSel?`0 0 12px ${user.roleColor}30`:'none'}}>
                      {user.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-bold text-white text-sm">{user.name}</span>
                        <span className="text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider"
                          style={{background:user.roleBg,color:user.roleColor}}>{user.role}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate">{user.description}</p>
                    </div>
                    {isSel && (
                      <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{background:'#2563eb'}}>
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                          <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    )}
                  </div>
                  {isSel && (
                    <div className="mt-2.5 pt-2.5 flex flex-wrap gap-1.5" style={{borderTop:'1px solid rgba(255,255,255,.08)'}}>
                      {user.permissions.map(p=>(
                        <span key={p} className="text-[10px] font-semibold px-2 py-0.5 rounded-lg"
                          style={{background:'rgba(255,255,255,.08)',color:'#94a3b8'}}>{p}</span>
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Botón ingresar */}
          <button type="button" onClick={handleLogin} disabled={!selected||loading}
            className="w-full flex items-center justify-center gap-3 py-3.5 rounded-2xl font-black text-sm uppercase tracking-wider transition-all login-fadeup"
            style={{
              animationDelay:'.62s',
              background: selected&&!loading ? 'linear-gradient(135deg,#2563eb,#1d4ed8)' : 'rgba(255,255,255,.06)',
              color: selected?'white':'#475569',
              border: selected?'none':'1px solid rgba(255,255,255,.08)',
              boxShadow: selected&&!loading ? '0 8px 32px rgba(37,99,235,.35)' : 'none',
              cursor: selected&&!loading ? 'pointer':'not-allowed',
              opacity: loading?.7:1,
            }}>
            {loading ? (
              <><svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity=".25"/>
                <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
              </svg>Ingresando al sistema...</>
            ) : (
              <><LogIn size={17}/>{selected?`Ingresar como ${selected.name.split(' ')[0]}`:'Selecciona un perfil'}</>
            )}
          </button>

          {/* Footer */}
          <div className="flex items-center justify-center gap-2 mt-4 login-fadeup" style={{animationDelay:'.7s'}}>
            <ShieldCheck size={12} className="text-slate-600"/>
            <span className="text-[11px] text-slate-600">Datos guardados localmente · Sesión de demostración</span>
          </div>

        </div>
      </div>
    </>
  );
}
