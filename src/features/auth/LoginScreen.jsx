import { useState } from 'react';
import { LogIn, ShieldCheck } from 'lucide-react';

const DEMO_USERS = [
  { id:'admin-01', name:'Carlos Mendoza', role:'Administrador', email:'c.mendoza@callcenter.pe', avatar:'CM', roleColor:'#a78bfa', roleBg:'rgba(139,92,246,0.18)', description:'Acceso total · Configuración · Auditoría', permissions:['Todos los módulos','Configuración','Auditoría completa','Usuarios'] },
  { id:'sup-01',   name:'Marta Salinas',  role:'Supervisor',    email:'m.salinas@callcenter.pe', avatar:'MS', roleColor:'#34d399', roleBg:'rgba(52,211,153,0.15)',  description:'Aprobaciones · Supervisión · Reportes',  permissions:['Dashboard','Aprobaciones','Auditoría calidad','Reportes'] },
  { id:'agt-01',   name:'Ana García',     role:'Agente',        email:'a.garcia@callcenter.pe',  avatar:'AG', roleColor:'#60a5fa', roleBg:'rgba(96,165,250,0.15)',  description:'Llamadas · Clientes · Cotizaciones',     permissions:['Consola llamadas','CRM','Cotizaciones','Follow-ups'] },
  { id:'agt-02',   name:'Carlos Ruiz',    role:'Agente',        email:'c.ruiz@callcenter.pe',    avatar:'CR', roleColor:'#38bdf8', roleBg:'rgba(56,189,248,0.15)',  description:'Llamadas · Clientes · Cotizaciones',     permissions:['Consola llamadas','CRM','Cotizaciones','Follow-ups'] },
];

const CSS = `
  @keyframes fadeUp  { from{opacity:0;transform:translateY(26px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
  @keyframes pulse-ring { 0%,100%{box-shadow:0 0 0 0 rgba(59,130,246,.45)} 50%{box-shadow:0 0 0 8px rgba(59,130,246,0)} }
  @keyframes shimmer-border {
    0%   { border-color: rgba(255,255,255,.18); }
    50%  { border-color: rgba(255,255,255,.32); }
    100% { border-color: rgba(255,255,255,.18); }
  }

  .login-fadeup  { animation: fadeUp 0.55s cubic-bezier(.22,.61,.36,1) both; }
  .login-fadein  { animation: fadeIn 0.7s ease both; }
  .user-card     { transition: all 0.2s cubic-bezier(.22,.61,.36,1); cursor:pointer; }
  .user-card:hover { transform:translateY(-2px); }
  .user-card.selected { animation: pulse-ring 1.8s ease infinite; }
  .login-scroll::-webkit-scrollbar { width:4px; }
  .login-scroll::-webkit-scrollbar-thumb { background:rgba(255,255,255,.20); border-radius:4px; }

  /* ════════════════════════════════════════════════════
     MÓVIL — glassmorphism integrado con la foto
  ════════════════════════════════════════════════════ */
  @media (max-width:1023px) {

    /* Panel principal: glass azul-noche semitransparente */
    .login-panel {
      position: fixed !important;
      bottom: 0; left: 0; right: 0;
      max-height: 72vh;
      border-radius: 28px 28px 0 0 !important;
      background: rgba(6, 14, 40, 0.58) !important;
      backdrop-filter: blur(32px) saturate(160%) brightness(0.9) !important;
      -webkit-backdrop-filter: blur(32px) saturate(160%) brightness(0.9) !important;
      /* Borde superior brillante + sombra hacia arriba suave */
      border-top: 1px solid rgba(255,255,255,.22) !important;
      border-left: 1px solid rgba(255,255,255,.08) !important;
      border-right: 1px solid rgba(255,255,255,.08) !important;
      box-shadow:
        0 -2px 0 rgba(96,165,250,.15),
        0 -32px 80px rgba(2,8,23,.50),
        inset 0 1px 0 rgba(255,255,255,.10) !important;
    }

    /* Cards de usuario: glass más claro y translúcido */
    .mobile-card-default {
      background: rgba(255,255,255,.07) !important;
      border: 1px solid rgba(255,255,255,.13) !important;
      backdrop-filter: blur(4px) !important;
    }
    .mobile-card-default:hover {
      background: rgba(255,255,255,.12) !important;
      border-color: rgba(255,255,255,.20) !important;
    }
    .mobile-card-selected {
      background: linear-gradient(135deg, rgba(37,99,235,.30), rgba(30,64,175,.18)) !important;
      border: 1px solid rgba(96,165,250,.55) !important;
    }

    /* Demo badge más translúcido */
    .mobile-demo-badge {
      background: rgba(245,158,11,.12) !important;
      border: 1px solid rgba(245,158,11,.30) !important;
    }

    /* Headline y textos: ligeramente más brillantes para contrastar
       con el fondo translúcido en lugar del opaco */
    .login-panel h2 { text-shadow: 0 1px 8px rgba(0,0,0,.6); }
    .login-panel .subtitle-text { color: rgba(185,200,225,.80) !important; }
    .login-panel .desc-text     { color: rgba(155,175,210,.68) !important; }
    .login-panel .footer-text   { color: rgba(130,155,195,.55) !important; }
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

        {/* ══════════════════════════════════════════════════════
            DESKTOP — columna izquierda, foto horizontal
        ══════════════════════════════════════════════════════ */}
        <div className="hidden lg:block flex-1 relative overflow-hidden">
          <img src="/bg-horizontal.png" alt=""
            className="absolute inset-0 w-full h-full object-cover login-fadein"
            style={{animationDelay:'.1s'}}/>
          <div className="absolute inset-0"
            style={{background:'linear-gradient(to right,rgba(2,8,23,.15) 0%,rgba(2,8,23,.55) 70%,rgba(2,8,23,.98) 100%)'}}/>
          <div className="absolute bottom-10 left-10 login-fadeup" style={{animationDelay:'.6s'}}>
            <p className="text-white/80 text-xs font-bold uppercase tracking-[.3em] mb-2">Ecosistema Integral de Ventas</p>
            <p className="text-4xl font-black text-white leading-tight" style={{textShadow:'0 2px 20px rgba(0,0,0,.6)'}}>
              Gestión B2B<br/><span style={{color:'#60a5fa'}}>de Alto Rendimiento</span>
            </p>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════
            MÓVIL — foto vertical cubre toda la pantalla
            Degradado suave: la zona central queda visible
        ══════════════════════════════════════════════════════ */}
        <div className="lg:hidden absolute inset-0">
          <img src="/bg-vertical.jpg" alt=""
            className="w-full h-full object-cover login-fadein"/>
          {/*
            Degradado en 4 zonas:
            • Arriba (0-20%): oscuro para leer el tagline
            • Centro-alto (20-35%): muy claro → foto bien visible
            • Centro-bajo (35-58%): se va oscureciendo gradualmente
            • Abajo (58-100%): suficiente oscuridad para el panel glass
            La intención es que se aprecie la foto en la zona media-alta
          */}
          <div className="absolute inset-0" style={{
            background:'linear-gradient(to bottom,' +
              'rgba(2,8,23,.75) 0%,' +
              'rgba(2,8,23,.20) 22%,' +
              'rgba(2,8,23,.10) 36%,' +
              'rgba(2,8,23,.32) 52%,' +
              'rgba(2,8,23,.65) 62%,' +
              'rgba(2,8,23,.82) 72%,' +
              'rgba(2,8,23,.90) 100%)'
          }}/>

          {/* Tagline sobre la foto — zona superior */}
          <div className="absolute top-10 left-6 right-6 login-fadeup" style={{animationDelay:'.25s'}}>
            <p className="text-white/65 text-[10px] font-bold uppercase tracking-[.32em] mb-1.5">
              Ecosistema Integral de Ventas
            </p>
            <p className="text-[1.6rem] font-black text-white leading-tight"
              style={{textShadow:'0 2px 18px rgba(0,0,0,.75)'}}>
              Gestión B2B<br/>
              <span style={{color:'#60a5fa',textShadow:'0 0 24px rgba(96,165,250,.4)'}}>
                de Alto Rendimiento
              </span>
            </p>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════
            PANEL DE LOGIN
            Desktop : columna derecha fija
            Móvil   : bottom-sheet glass flotante sobre la foto
        ══════════════════════════════════════════════════════ */}
        <div
          className="login-panel login-scroll relative z-10 flex flex-col justify-center overflow-y-auto
                     lg:w-[480px] lg:flex-shrink-0 lg:static
                     lg:px-8 lg:py-10
                     lg:rounded-none lg:border-0 lg:shadow-none
                     w-full px-6 py-6"
          style={{
            /* Desktop: panel sólido oscuro (sin cambio) */
            background:'rgba(5,12,28,0.93)',
            backdropFilter:'blur(20px)',
            WebkitBackdropFilter:'blur(20px)',
            borderLeft:'1px solid rgba(255,255,255,.07)',
          }}
        >

          {/* Tirante — solo móvil */}
          <div className="lg:hidden flex justify-center mb-5">
            <div style={{
              width:44, height:4, borderRadius:4,
              background:'rgba(255,255,255,.28)',
              boxShadow:'0 0 8px rgba(255,255,255,.15)',
            }}/>
          </div>

          {/* Logo */}
          <div className="flex items-center gap-3 mb-5 login-fadeup" style={{animationDelay:'.1s'}}>
            <div className="relative flex-shrink-0">
              <img src="/app-icon.jpg" alt="CallSysPRO"
                className="w-11 h-11 lg:w-14 lg:h-14 rounded-2xl object-cover"
                style={{boxShadow:'0 0 0 2px rgba(96,165,250,.45),0 8px 28px rgba(0,0,0,.55)'}}/>
              <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2"
                style={{background:'#10b981',borderColor:'#020817'}}/>
            </div>
            <div>
              <h1 className="text-xl lg:text-2xl font-black text-white leading-none"
                style={{letterSpacing:'-.02em'}}>
                CallSys<span style={{color:'#f59e0b'}}>PRO</span>
              </h1>
              <p className="text-[10px] font-bold uppercase tracking-[.22em] mt-0.5 subtitle-text"
                style={{color:'#64748b'}}>
                Centro de Contactos B2B
              </p>
            </div>
          </div>

          {/* Headline */}
          <div className="mb-3.5 login-fadeup" style={{animationDelay:'.18s'}}>
            <h2 className="text-lg lg:text-xl font-black text-white mb-0.5">Bienvenido</h2>
            <p className="text-sm subtitle-text" style={{color:'#94a3b8'}}>
              Selecciona tu perfil para ingresar al sistema
            </p>
          </div>

          {/* Demo badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4 self-start login-fadeup mobile-demo-badge"
            style={{
              animationDelay:'.24s',
              background:'rgba(245,158,11,.10)',
              border:'1px solid rgba(245,158,11,.28)',
            }}>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"/>
            <span className="text-[11px] font-bold text-amber-400 uppercase tracking-widest">
              Modo Demo — Presentación Comercial
            </span>
          </div>

          {/* User cards */}
          <div className="space-y-2 mb-5">
            {DEMO_USERS.map((user, i) => {
              const isSel = selected?.id === user.id;
              return (
                <button key={user.id} type="button" onClick={()=>setSelected(user)}
                  className={`user-card w-full text-left rounded-2xl p-3 login-fadeup
                    ${isSel ? 'mobile-card-selected' : 'mobile-card-default'}
                    ${isSel ? 'selected' : ''}`}
                  style={{
                    animationDelay:`${.30+i*.07}s`,
                    /* Valores base para desktop (se sobreescriben en móvil por CSS) */
                    background: isSel
                      ? 'linear-gradient(135deg,rgba(37,99,235,.25),rgba(30,64,175,.15))'
                      : 'rgba(255,255,255,.04)',
                    border: isSel
                      ? '1px solid rgba(96,165,250,.50)'
                      : '1px solid rgba(255,255,255,.08)',
                  }}>
                  <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black flex-shrink-0"
                      style={{
                        background:`linear-gradient(135deg,${user.roleColor}55,${user.roleColor}22)`,
                        border:`1px solid ${user.roleColor}40`,
                        color:user.roleColor,
                        boxShadow:isSel?`0 0 14px ${user.roleColor}35`:'none',
                      }}>
                      {user.avatar}
                    </div>
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-bold text-white text-sm">{user.name}</span>
                        <span className="text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider"
                          style={{background:user.roleBg,color:user.roleColor}}>
                          {user.role}
                        </span>
                      </div>
                      <p className="text-[11px] truncate desc-text" style={{color:'#64748b'}}>
                        {user.description}
                      </p>
                    </div>
                    {/* Check */}
                    {isSel && (
                      <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{background:'#2563eb',boxShadow:'0 0 12px rgba(37,99,235,.5)'}}>
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                          <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    )}
                  </div>
                  {/* Permisos expandidos al seleccionar */}
                  {isSel && (
                    <div className="mt-2.5 pt-2.5 flex flex-wrap gap-1.5"
                      style={{borderTop:'1px solid rgba(255,255,255,.10)'}}>
                      {user.permissions.map(p=>(
                        <span key={p} className="text-[10px] font-semibold px-2 py-0.5 rounded-lg"
                          style={{background:'rgba(255,255,255,.10)',color:'#94a3b8'}}>
                          {p}
                        </span>
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Botón Ingresar */}
          <button type="button" onClick={handleLogin} disabled={!selected||loading}
            className="w-full flex items-center justify-center gap-3 py-3.5 rounded-2xl font-black text-sm uppercase tracking-wider transition-all login-fadeup"
            style={{
              animationDelay:'.60s',
              background: selected&&!loading
                ? 'linear-gradient(135deg,#2563eb 0%,#1d4ed8 100%)'
                : 'rgba(255,255,255,.08)',
              color: selected?'white':'rgba(150,165,195,.6)',
              border: selected?'none':'1px solid rgba(255,255,255,.10)',
              boxShadow: selected&&!loading
                ? '0 8px 32px rgba(37,99,235,.40), 0 0 0 1px rgba(96,165,250,.20)'
                : 'none',
              cursor: selected&&!loading?'pointer':'not-allowed',
              opacity: loading?.72:1,
            }}>
            {loading ? (
              <>
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity=".25"/>
                  <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                </svg>
                Ingresando al sistema...
              </>
            ) : (
              <>
                <LogIn size={16}/>
                {selected ? `Ingresar como ${selected.name.split(' ')[0]}` : 'Selecciona un perfil'}
              </>
            )}
          </button>

          {/* Footer */}
          <div className="flex items-center justify-center gap-2 mt-4 login-fadeup" style={{animationDelay:'.7s'}}>
            <ShieldCheck size={11} className="footer-text" style={{color:'rgba(100,130,180,.55)'}}/>
            <span className="text-[11px] footer-text" style={{color:'rgba(100,130,180,.55)'}}>
              Datos guardados localmente · Sesión de demostración
            </span>
          </div>

        </div>
      </div>
    </>
  );
}
