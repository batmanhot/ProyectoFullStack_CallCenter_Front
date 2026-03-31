import { useMemo, useRef, useState } from 'react';
import {
  Activity, Bell, Box, CheckSquare, FileText, GraduationCap,
  LayoutDashboard, LogOut, MessageSquare, Phone, RotateCcw,
  Search, Settings, ShieldCheck, Target, Users, X,
} from 'lucide-react';

import { DATA } from './data';
import { useLocalStorage } from './hooks/useLocalStorage';

// ── Feature imports ──────────────────────────────────────────────────────────
import LoginScreen        from './features/auth/LoginScreen';
import ExecutiveDashboard from './features/analytics/ExecutiveDashboard';
import DatabaseSecurity   from './features/admin/DatabaseSecurity';
import CampaignManager    from './features/campaigns/CampaignManager';
import MultichannelConfig from './features/channels/MultichannelConfig';
import CRMView            from './features/clients/CRMView';
import CallView           from './features/calls/CallView';          // ← extraído de App
import CallConsole        from './features/calls/CallConsole';
import FollowUpManager    from './features/followups/FollowUpManager';
import OpportunityPipeline from './features/opportunities/OpportunityPipeline';
import ProductManager     from './features/products/ProductManager';
import QualityAudit       from './features/quality/QualityAudit';
import QuoteGenerator     from './features/quotes/QuoteGenerator';
import SalesClosure       from './features/sales/SalesClosure';
import TrainingCenter     from './features/training/TrainingCenter';

// ──────────────────────────────────────────────────────────────────────────────
// SEED DATA — usa DATA como única fuente de verdad (punto 2)
// No se duplican ni transforman los productos aquí; data.js ya tiene todos los campos.
// ──────────────────────────────────────────────────────────────────────────────
const SEED_CAMPAIGNS = [
  { id:'CMP-001', name:'Campaña Minería Norte — Planchas A4', product:'Planchas de Metal A4', status:'Activa',  progress:65, goal:100000, currentVentas:65000, agents:4, startDate:'2026-03-01' },
  { id:'CMP-002', name:'Reactivación Motores Industriales',    product:'Carbón para Motores',  status:'Pausada', progress:30, goal: 50000, currentVentas:15000, agents:2, startDate:'2026-03-10' },
];
const SEED_QUOTES = [
  { id:'COT-001', clientId:1, client:'Minera del Norte S.A.', items:[{productId:1,quantity:3,price:1200}], subtotal:3600, discount:5, total:3420,  status:'BORRADOR',             updatedAt:'2026-03-28 09:00', notes:'' },
  { id:'COT-002', clientId:2, client:'Aceros Industriales',   items:[{productId:3,quantity:6,price:850}],  subtotal:5100, discount:0, total:5100,  status:'PENDIENTE_APROBACION', updatedAt:'2026-03-26 09:15', notes:'' },
];
const SEED_OPPORTUNITIES = [
  { id:'OPP-001', clientId:1, clientName:'Minera del Norte S.A.', product:'Planchas de Metal A4', value:36000, stage:'COTIZACION',  agent:'Ana Garcia',  date:'2026-03-10', notes:'Cliente interesado en volumen mensual.' },
  { id:'OPP-002', clientId:2, clientName:'Aceros Industriales',   product:'Válvulas Hidráulicas', value:17000, stage:'NEGOCIACION', agent:'Carlos Ruiz', date:'2026-03-15', notes:'Esperan aprobación de directorio.'    },
  { id:'OPP-003', clientId:3, clientName:'Válvulas del Sur S.A.C.',product:'Carbón para Motores',  value: 9000, stage:'PROSPECCION', agent:'Luis Torres', date:'2026-03-22', notes:'Primera llamada de contacto.'         },
  { id:'OPP-004', clientId:1, clientName:'Minera del Norte S.A.', product:'Carbón para Motores',  value:13500, stage:'CIERRE',      agent:'Ana Garcia',  date:'2026-03-05', notes:'Contrato firmado.'                    },
];
const SEED_AUDITS = [
  { id:'REC-992', agent:'Ana Garcia',  client:'Minera del Norte', date:'2026-03-27', duration:'05:24', score:null, comments:'', criteria:{} },
  { id:'REC-881', agent:'Carlos Ruiz', client:'Aceros Latam',     date:'2026-03-26', duration:'03:15', score:85,   comments:'Buen manejo comercial.', criteria:{opening:8,needs:9,objections:8,followup:9,privacy:8} },
];
const SEED_TRAINING = [
  { id:1, title:'Conocimiento de Producto: Planchas de Metal A4', category:'Tecnico',   duration:'45 min', status:'Completado', description:'Especificaciones técnicas, resistencia y aplicaciones en minería.', question:'¿Cuál es el principal beneficio de las Planchas A4 en entornos de alta corrosión minera?', options:['Resistencia al impacto térmico','Tratamiento anticorrosivo grado 4','Bajo costo de mantenimiento'], correctAnswer:'Tratamiento anticorrosivo grado 4', selectedAnswer:'Tratamiento anticorrosivo grado 4', feedback:'Módulo aprobado.' },
  { id:2, title:'Guiones de Ventas Outbound B2B',                  category:'Comercial', duration:'30 min', status:'En curso',   description:'Técnicas de prospección y manejo de objeciones.', question:'¿Qué técnica ayuda más a descubrir necesidades?', options:['Hablar primero del precio','Usar preguntas abiertas','Enviar catálogo sin contexto'], correctAnswer:'Usar preguntas abiertas', selectedAnswer:'', feedback:'' },
  { id:3, title:'Protección de Datos y Cumplimiento Normativo',    category:'Legal',     duration:'20 min', status:'Pendiente',  description:'Protocolos de seguridad e información.', question:'Antes de exportar datos de clientes, ¿qué validación es obligatoria?', options:['Confirmar permiso y registrar trazabilidad','Solo avisar por chat','Cambiar el nombre del archivo'], correctAnswer:'Confirmar permiso y registrar trazabilidad', selectedAnswer:'', feedback:'' },
];
const SEED_LOGS = [
  { id:'LOG-001', module:'Seguridad',  event:'Descarga de Base',      user:'Admin_01',    role:'Administrador', date:'2026-03-28 10:15', obj:'DB-MINERIA', alert:true  },
  { id:'LOG-002', module:'Cotizacion', event:'Aprobacion Cotizacion', user:'Sup_Marta',   role:'Supervisor',    date:'2026-03-28 09:45', obj:'COT-002',    alert:false },
  { id:'LOG-003', module:'CRM',        event:'Acceso a Contacto',     user:'Agente_Juan', role:'Agente',        date:'2026-03-28 09:12', obj:'CLI-902',    alert:false },
];
const SEED_CHANNELS = [
  { id:'wa',   name:'WhatsApp Business API',      type:'Webhook', status:'Conectado',     latency:'12ms', endpoint:'https://api.callcenter.local/whatsapp', enabled:true  },
  { id:'sip',  name:'Telefonía IP (SIP Trunk)',   type:'SIP',     status:'Conectado',     latency:'45ms', endpoint:'sip:trunk@callcenter.local',             enabled:true  },
  { id:'smtp', name:'Servidor Correo Industrial', type:'SMTP',    status:'Error de Auth', latency:'--',   endpoint:'smtp://mail.callcenter.local',            enabled:false },
];
const SEED_FOLLOWUPS = [
  { id:'FU-001', clientName:'Minera del Norte S.A.', agent:'Ana Garcia',  date:'2026-03-28', time:'10:00', priority:'Alta',  channel:'Llamada',  notes:'Interesado en volumen mensual.', status:'Pendiente', createdAt:'2026-03-26' },
  { id:'FU-002', clientName:'Aceros Industriales',   agent:'Carlos Ruiz', date:'2026-03-30', time:'15:00', priority:'Media', channel:'WhatsApp', notes:'Esperan decisión de directorio.', status:'Pendiente', createdAt:'2026-03-27' },
];
const SEED_CALL_HISTORY = [
  { companyName:'Minera del Norte S.A.', contactName:'John Doe',  phoneNumber:'555-0101', disposition:'CONTACTO_EFECTIVO',   duration:324, notes:'Muy interesado en planchas.', timestamp:'2026-03-26T10:30:00' },
  { companyName:'Minera del Norte S.A.', contactName:'John Doe',  phoneNumber:'555-0101', disposition:'VOLVER_A_LLAMAR',     duration:87,  notes:'En reunión, pide rellamar.',  timestamp:'2026-03-25T14:10:00' },
  { companyName:'Aceros Industriales',   contactName:'Pedro Luis', phoneNumber:'555-0200', disposition:'SOLICITA_COTIZACION', duration:512, notes:'Necesita 6 válvulas urgente.', timestamp:'2026-03-27T09:00:00' },
];

// ── Helpers ──────────────────────────────────────────────────────────────────
const ts = () => {
  const n = new Date();
  return `${n.toISOString().slice(0, 10)} ${n.toTimeString().slice(0, 5)}`;
};

// Punto 3: fecha dinámica en lugar de hardcodeada
const todayLabel = () =>
  new Date().toLocaleDateString('es-PE', { day: 'numeric', month: 'short', year: 'numeric' });

// ── Menu ─────────────────────────────────────────────────────────────────────
const MENU = [
  { id:'dashboard',     label:'Dashboard',           icon:LayoutDashboard, group:'Transversales' },
  { id:'crm',           label:'Clientes',            icon:Users,           group:'Estrategicos'  },
  { id:'products',      label:'Productos',           icon:Box,             group:'Estrategicos'  },
  { id:'campaigns',     label:'Campañas',            icon:Target,          group:'Estrategicos'  },
  { id:'calls',         label:'Consola Llamadas',    icon:Phone,           group:'Operativos'    },
  { id:'followups',     label:'Follow-ups',          icon:Bell,            group:'Operativos'    },
  { id:'opportunities', label:'Oportunidades',       icon:Activity,        group:'Operativos'    },
  { id:'quotes',        label:'Cotizaciones B2B',    icon:FileText,        group:'Operativos'    },
  { id:'closure',       label:'Cierre & Aprobación', icon:CheckSquare,     group:'Operativos'    },
  { id:'quality',       label:'Auditoría Calidad',   icon:ShieldCheck,     group:'Soporte'       },
  { id:'training',      label:'Capacitación',        icon:GraduationCap,   group:'Soporte'       },
  { id:'channels',      label:'Canales',             icon:MessageSquare,   group:'Soporte'       },
  { id:'security',      label:'Seguridad',           icon:Settings,        group:'Soporte'       },
];
const GROUPS = ['Transversales', 'Estrategicos', 'Operativos', 'Soporte'];

// ── Global Search ─────────────────────────────────────────────────────────────
function GlobalSearch({ clients, quotes, products, onNavigate, onClose }) {
  const [q, setQ] = useState('');
  const results = useMemo(() => {
    if (q.trim().length < 2) return [];
    const lq = q.toLowerCase();
    return [
      ...clients.filter(c => c.name.toLowerCase().includes(lq) || (c.contact||'').toLowerCase().includes(lq))
        .map(c => ({ type:'Cliente',    label:c.name,  sub:c.contact,                              tab:'crm'      })),
      ...quotes.filter(qt => qt.client?.toLowerCase().includes(lq) || qt.id.toLowerCase().includes(lq))
        .map(qt => ({ type:'Cotización', label:qt.id,   sub:`${qt.client} · $${qt.total?.toLocaleString()}`, tab:'quotes'   })),
      ...products.filter(p => p.name.toLowerCase().includes(lq))
        .map(p  => ({ type:'Producto',   label:p.name,  sub:`$${p.price} / ${p.unit}`,               tab:'products' })),
    ].slice(0, 8);
  }, [q, clients, quotes, products]);

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-start justify-center pt-24 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200">
        <div className="flex items-center gap-3 p-4 border-b border-slate-100">
          <Search size={18} className="text-slate-400 flex-shrink-0" />
          <input autoFocus type="text" placeholder="Buscar clientes, cotizaciones, productos..." value={q}
            onChange={e => setQ(e.target.value)}
            className="flex-1 text-sm outline-none text-slate-800 placeholder:text-slate-400" />
          <button type="button" onClick={onClose}><X size={18} className="text-slate-400" /></button>
        </div>
        {q.trim().length >= 2 ? (
          <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
            {results.length === 0
              ? <p className="p-4 text-sm text-slate-400 text-center">Sin resultados para "{q}"</p>
              : results.map((r, i) => (
                <button key={i} type="button" onClick={() => { onNavigate(r.tab); onClose(); }}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 text-left transition-colors">
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-500 flex-shrink-0">{r.type}</span>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{r.label}</p>
                    {r.sub && <p className="text-xs text-slate-400">{r.sub}</p>}
                  </div>
                </button>
              ))}
          </div>
        ) : (
          <div className="p-4 grid grid-cols-3 gap-2">
            {MENU.slice(0, 6).map(m => (
              <button key={m.id} type="button" onClick={() => { onNavigate(m.id); onClose(); }}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 border border-slate-200 transition-colors">
                <m.icon size={13} className="text-blue-500" /> {m.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [currentUser,  setCurrentUser]  = useState(null);
  const [activeTab,    setActiveTab]    = useState('dashboard');
  const [showSearch,   setShowSearch]   = useState(false);
  const [notification, setNotification] = useState(null);
  const [activeCall,   setActiveCall]   = useState(null);
  const [apiKey,       setApiKey]       = useState('');

  // ── Persistent state (localStorage) ──────────────────────────────────────
  // Punto 2: productos se inicializan desde DATA.products (fuente única)
  const [clients,         setClients]         = useLocalStorage('cc_clients',       DATA.clients.map(c => ({ ...c })));
  const [products,        setProducts]        = useLocalStorage('cc_products',      DATA.products.map(p => ({ ...p })));
  const [campaigns,       setCampaigns]       = useLocalStorage('cc_campaigns',     SEED_CAMPAIGNS);
  const [quotes,          setQuotes]          = useLocalStorage('cc_quotes',        SEED_QUOTES);
  const [opportunities,   setOpportunities]   = useLocalStorage('cc_opportunities', SEED_OPPORTUNITIES); // ← punto 5
  const [audits,          setAudits]          = useLocalStorage('cc_audits',        SEED_AUDITS);
  const [trainingModules, setTrainingModules] = useLocalStorage('cc_training',      SEED_TRAINING);
  const [encryptionActive,setEncryptionActive]= useLocalStorage('cc_encryption',    true);
  const [securityLogs,    setSecurityLogs]    = useLocalStorage('cc_logs',          SEED_LOGS);
  const [channels,        setChannels]        = useLocalStorage('cc_channels',      SEED_CHANNELS);
  const [followUps,       setFollowUps]       = useLocalStorage('cc_followups',     SEED_FOLLOWUPS);
  const [callHistory,     setCallHistory]     = useLocalStorage('cc_callhistory',   SEED_CALL_HISTORY);

  // ── Audit ─────────────────────────────────────────────────────────────────
  const audit = (event, objId, module = 'Sistema', alert = false) => {
    if (!currentUser) return;
    setSecurityLogs(cur => [{
      id:     `LOG-${String(cur.length + 1).padStart(3, '0')}`,
      module, event,
      user:   currentUser.name,
      role:   currentUser.role,
      date:   ts(),
      obj:    objId || '—',
      alert,
    }, ...cur]);
  };

  const timerRef = useRef(null);
  const notify = (type, text) => {
    setNotification({ type, text });
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setNotification(null), 3500);
  };

  const handleLogin  = user => { setCurrentUser(user); audit(`Inicio de sesión — ${user.role}`, user.id, 'Sistema'); };
  const handleLogout = ()   => { audit(`Cierre de sesión — ${currentUser?.role}`, currentUser?.id, 'Sistema'); setCurrentUser(null); setActiveTab('dashboard'); };
  const resetDemo    = ()   => { if (!window.confirm('¿Resetear todos los datos al estado inicial de la demo?')) return; localStorage.clear(); window.location.reload(); };

  // ── Follow-up badge ───────────────────────────────────────────────────────
  const overdueFollowUps = useMemo(() =>
    followUps.filter(f => {
      if (f.status !== 'Pendiente') return false;
      const d = new Date(f.date); d.setHours(0,0,0,0);
      const t = new Date();       t.setHours(0,0,0,0);
      return d <= t;
    }).length,
  [followUps]);

  // ── Dashboard stats ───────────────────────────────────────────────────────
  const dashboardStats = useMemo(() => {
    const approved  = quotes.filter(q => q.status === 'APROBADA');
    const pending   = quotes.filter(q => q.status === 'PENDIENTE_APROBACION');
    const sent      = quotes.filter(q => q.status !== 'BORRADOR');
    return {
      conversionRate:    quotes.length ? `${Math.round(approved.length / quotes.length * 100)}%` : '0%',
      quoteApprovalRate: sent.length   ? `${Math.round(approved.length / sent.length * 100)}%`   : '0%',
      effectiveCalls:    `${Math.min(95, 45 + clients.length * 5)}%`,
      closingTime:       `${Math.max(7, 18 - approved.length)} días`,
      totalSales:        approved.reduce((s, q) => s + q.total, 0),
      pendingQuotes:     pending.length,
      activeCampaigns:   campaigns.filter(c => c.status === 'Activa').length,
      approvedQuotes:    approved.length,
      productLines:      products.map(p => ({
        label:  p.name,
        amount: approved.reduce((s, q) =>
          s + (q.items||[]).filter(it => it.productId === p.id).reduce((ss, it) => ss + it.quantity * it.price, 0),
        0),
      })),
    };
  }, [campaigns, clients.length, quotes, products]);

  // ── CRUD: Clients ─────────────────────────────────────────────────────────
  const saveClient   = c  => { setClients(cur => c.id ? cur.map(x => x.id===c.id?c:x) : [...cur,{...c,id:Math.max(0,...cur.map(x=>x.id))+1}]); audit(c.id?'Cliente actualizado':'Cliente creado', c.id||'nuevo','CRM'); notify('success',c.id?'Cliente actualizado.':'Cliente creado.'); };
  const deleteClient = id => { setClients(cur=>cur.filter(c=>c.id!==id)); setQuotes(cur=>cur.filter(q=>q.clientId!==id)); audit('Cliente eliminado',id,'CRM',true); notify('success','Cliente eliminado.'); };

  // ── CRUD: Products ────────────────────────────────────────────────────────
  const saveProduct   = p  => { setProducts(cur => p.id ? cur.map(x=>x.id===p.id?p:x) : [...cur,{...p,id:Math.max(0,...cur.map(x=>x.id))+1}]); audit(p.id?'Producto actualizado':'Producto creado',p.id||'nuevo','Producto'); notify('success',p.id?'Producto actualizado.':'Producto creado.'); };
  const deleteProduct = id => { setProducts(cur=>cur.filter(p=>p.id!==id)); audit('Producto eliminado',id,'Producto',true); notify('success','Producto eliminado.'); };

  // ── CRUD: Campaigns ───────────────────────────────────────────────────────
  const saveCampaign   = c  => { setCampaigns(cur=>c.id?cur.map(x=>x.id===c.id?c:x):[...cur,{...c,id:`CMP-${String(cur.length+1).padStart(3,'0')}`}]); audit(c.id?'Campaña actualizada':'Campaña creada',c.id||'nueva','Campaña'); notify('success',c.id?'Campaña actualizada.':'Campaña creada.'); };
  const toggleCampaign = id => { setCampaigns(cur=>cur.map(c=>c.id===id?{...c,status:c.status==='Activa'?'Pausada':'Activa'}:c)); audit('Campaña pausada/activada',id,'Campaña'); notify('info','Estado actualizado.'); };
  const deleteCampaign = id => { setCampaigns(cur=>cur.filter(c=>c.id!==id)); audit('Campaña eliminada',id,'Campaña',true); notify('success','Campaña eliminada.'); };

  // ── CRUD: Quotes ──────────────────────────────────────────────────────────
  const saveQuote = (quote, submit=false) => {
    setQuotes(cur => {
      const client  = clients.find(c => c.id === quote.clientId);
      const payload = { ...quote, client:client?.name||'Sin asignar', status:submit?'PENDIENTE_APROBACION':'BORRADOR', updatedAt:ts() };
      if (quote.id) return cur.map(q => q.id===quote.id ? payload : q);
      return [...cur, { ...payload, id:`COT-${String(cur.length+1).padStart(3,'0')}` }];
    });
    audit(submit?'Cotización enviada a aprobación':'Cotización guardada como borrador',quote.id||'nueva','Cotizacion');
    notify('success', submit?'Cotización enviada a aprobación.':'Borrador guardado.');
  };
  const deleteQuote = id => { setQuotes(cur=>cur.filter(q=>q.id!==id)); audit('Cotización eliminada',id,'Cotizacion',true); notify('success','Cotización eliminada.'); };
  const updateQuoteStatus = (id, status) => {
    setQuotes(cur=>cur.map(q=>q.id===id?{...q,status,updatedAt:ts()}:q));
    audit(status==='APROBADA'?'Cotización aprobada':'Cotización rechazada',id,'Cotizacion',status==='RECHAZADA');
    notify('success',status==='APROBADA'?'Cotización aprobada.':'Cotización rechazada.');
  };

  // ── CRUD: Opportunities (punto 5) ─────────────────────────────────────────
  const saveOpportunity   = opp => { setOpportunities(cur => opp.id && cur.some(o=>o.id===opp.id) ? cur.map(o=>o.id===opp.id?opp:o) : [...cur,opp]); audit(opp.id?'Oportunidad actualizada':'Oportunidad registrada',opp.id||'nueva','Oportunidad'); };
  const deleteOpportunity = id  => { setOpportunities(cur=>cur.filter(o=>o.id!==id)); audit('Oportunidad eliminada',id,'Oportunidad',true); notify('success','Oportunidad eliminada.'); };
  const advanceStage      = id  => {
    const STAGES = ['PROSPECCION','CONTACTO','COTIZACION','NEGOCIACION','CIERRE','PERDIDO'];
    setOpportunities(cur=>cur.map(o=>{
      if (o.id!==id) return o;
      const idx = STAGES.indexOf(o.stage);
      if (idx >= STAGES.length-2) return o;
      return {...o, stage:STAGES[idx+1]};
    }));
    audit('Oportunidad avanzada de etapa',id,'Oportunidad');
    notify('success','Oportunidad avanzada.');
  };

  // ── Other handlers ────────────────────────────────────────────────────────
  const saveAudit    = a  => { setAudits(cur=>cur.map(x=>x.id===a.id?a:x)); audit(`Auditoría guardada — score ${a.score}`,a.id,'Seguridad'); notify('success',`Auditoría ${a.id} guardada.`); };
  const submitAnswer = (mid,ans) => { setTrainingModules(cur=>cur.map(m=>{ if(m.id!==mid) return m; const ok=ans===m.correctAnswer; audit(ok?'Módulo aprobado':'Intento fallido',mid,'Capacitacion'); return {...m,selectedAnswer:ans,status:ok?'Completado':'En curso',feedback:ok?'Respuesta correcta. Módulo aprobado.':'Respuesta incorrecta. Revisa el contenido.'}; })); notify('info','Evaluación procesada.'); };
  const runAudit     = ()  => { setSecurityLogs(cur=>[{id:`LOG-${String(cur.length+1).padStart(3,'0')}`,module:'Seguridad',event:'Auditoría de Seguridad Ejecutada',user:currentUser?.name||'Admin',role:currentUser?.role||'Administrador',date:ts(),obj:encryptionActive?'AES-256':'REVISION_MANUAL',alert:!encryptionActive},...cur]); notify('success','Auditoría ejecutada.'); };
  const configureChannel = (chId,ep) => { setChannels(cur=>cur.map(ch=>ch.id===chId?{...ch,endpoint:ep,status:'Conectado',enabled:true,latency:'18ms'}:ch)); audit('Canal configurado',chId,'Sistema'); notify('success','Canal configurado.'); };
  const toggleChannel    = chId     => { setChannels(cur=>cur.map(ch=>{ if(ch.id!==chId) return ch; const en=!ch.enabled; return {...ch,enabled:en,status:en?'Conectado':'Desconectado',latency:en?(ch.latency==='--'?'22ms':ch.latency):'--'}; })); audit('Canal actualizado',chId,'Sistema'); notify('info','Canal actualizado.'); };
  const saveFollowUp     = fu => { setFollowUps(cur=>[...cur,fu]); audit('Follow-up programado',fu.clientName,'Follow-up'); notify('success','Follow-up programado.'); };
  const deleteFollowUp   = id => { setFollowUps(cur=>cur.filter(f=>f.id!==id)); audit('Follow-up eliminado',id,'Follow-up'); notify('success','Follow-up eliminado.'); };
  const completeFollowUp = id => { setFollowUps(cur=>cur.map(f=>f.id===id?{...f,status:'Completado'}:f)); audit('Follow-up completado',id,'Follow-up'); notify('success','Follow-up completado.'); };
  const startCall  = contact => { setActiveCall(contact); audit('Llamada iniciada',contact.companyName,'Llamada'); notify('info',`Llamada — ${contact.contactName}`); };
  const hangUp     = ()      => { setActiveCall(null); };
  const saveCall   = data    => {
    setActiveCall(null);
    setCallHistory(cur => [{ ...data, id:`CALL-${Date.now()}` }, ...cur]);
    audit(`Llamada tipificada: ${data.disposition?.replace(/_/g,' ')}`,data.companyName,'Llamada');

    if (data.escalated) {
      setClients(cur => cur.map(client => client.name === data.companyName ? { ...client, status: 'Escalado a Cierre' } : client));
      audit('Cliente escalado',data.companyName,'Llamada');
      notify('info','Cliente escalado para acción de cierre.');
    } else {
      notify('success','Llamada registrada.');
    }

    if (data.callStatus === 'closed_sale') {
      audit('Venta cerrada desde llamada',data.companyName,'Llamada');
      notify('success','Cliente marcado como Venta Cerrada.');
    }

    if (data.scheduleFollowUp?.date) {
      setFollowUps(cur=>[...cur,{id:`FU-${Date.now()}`,clientName:data.companyName,agent:currentUser?.name||'Agente',date:data.scheduleFollowUp.date,time:'',priority:'Alta',channel:data.channel || 'Llamada',notes:data.notes||'Follow-up automático.',status:'Pendiente',createdAt:ts().slice(0,10)}]);
      audit('Follow-up automático generado',data.companyName,'Follow-up');
    }
  };

  // ── Render guard ──────────────────────────────────────────────────────────
  if (!currentUser) return <LoginScreen onLogin={handleLogin} />;

  // ── Content router ────────────────────────────────────────────────────────
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <ExecutiveDashboard stats={dashboardStats} followUps={followUps}
          onRefresh={() => notify('info','Dashboard actualizado.')}
          onExport={() => { audit('Dashboard exportado','PDF','Sistema'); notify('success','Exportación preparada.'); }} />;
      case 'crm':
        return <CRMView clients={clients} onSaveClient={saveClient} onDeleteClient={deleteClient} onNotify={notify} />;
      case 'products':
        return <ProductManager products={products} onSave={saveProduct} onDelete={deleteProduct} onNotify={notify} />;
      case 'campaigns':
        return <CampaignManager campaigns={campaigns} products={products} onSaveCampaign={saveCampaign} onToggleCampaign={toggleCampaign} onDeleteCampaign={deleteCampaign} />;
      case 'calls':
        // Punto 1: CallView extraído — ya no es JSX inline aquí
        return <CallView clients={clients} callHistory={callHistory} onStartCall={startCall} />;
      case 'followups':
        return <FollowUpManager followUps={followUps} clients={clients} onSave={saveFollowUp} onDelete={deleteFollowUp} onComplete={completeFollowUp} />;
      case 'opportunities':
        // Punto 5: recibe estado desde App.jsx, persiste en localStorage
        return <OpportunityPipeline
          opportunities={opportunities}
          onSaveOpportunity={saveOpportunity}
          onDeleteOpportunity={deleteOpportunity}
          onAdvanceStage={advanceStage}
          clients={clients}
          products={products}
          onNotify={notify}
        />;
      case 'quotes':
        return <QuoteGenerator clients={clients} products={products} quotes={quotes}
          onSaveQuote={saveQuote} onDeleteQuote={deleteQuote} onNotify={notify}
          onAudit={(ev,obj) => audit(ev,obj,'Cotizacion')} currentUser={currentUser} />;
      case 'closure':
        return <SalesClosure quotes={quotes} userRole={currentUser.role}
          onApprove={id => updateQuoteStatus(id,'APROBADA')}
          onReject={id  => updateQuoteStatus(id,'RECHAZADA')} />;
      case 'quality':
        return <QualityAudit audits={audits} onSaveAudit={saveAudit} />;
      case 'training':
        return <TrainingCenter modules={trainingModules} onSubmitAnswer={submitAnswer} />;
      case 'channels':
        return <MultichannelConfig channels={channels} apiKey={apiKey}
          onConfigureChannel={configureChannel} onToggleChannel={toggleChannel}
          onGenerateApiKey={() => {
            const k = `ccbi-${Math.random().toString(36).slice(2,8)}-${Math.random().toString(36).slice(2,8)}`;
            setApiKey(k);
            audit('API key generada','ccbi-***','Sistema');
            notify('success','API key generada.');
          }} />;
      case 'security':
        return <DatabaseSecurity encryptionActive={encryptionActive} logs={securityLogs}
          onToggleEncryption={() => { setEncryptionActive(v=>!v); audit('Cifrado modificado','AES-256','Seguridad'); notify('info','Cifrado actualizado.'); }}
          onRunAudit={runAudit} />;
      default:
        return null;
    }
  };

  const roleColor = { Administrador:'text-violet-400', Supervisor:'text-emerald-400', Agente:'text-blue-400' };

  // ── Layout ────────────────────────────────────────────────────────────────
  return (
    <div className="flex min-h-screen bg-slate-100 font-sans text-slate-900">

      {/* Sidebar */}
      <aside className="w-64 bg-slate-950 text-slate-300 flex flex-col sticky top-0 h-screen border-r border-slate-800/50">
        <div className="p-5 border-b border-slate-800/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-lg shadow-blue-900/50">CC</div>
            <div>
              <h1 className="font-black text-white text-sm tracking-tight uppercase leading-tight">CallCenter B2B</h1>
              <p className="text-[9px] font-bold text-blue-400 uppercase tracking-[0.2em]">Ecosistema Integral</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-5">
          {GROUPS.map(group => {
            const items = MENU.filter(m => m.group === group);
            return (
              <div key={group}>
                <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.25em] mb-2 px-2">{group}</p>
                <ul className="space-y-0.5">
                  {items.map(item => {
                    const Icon   = item.icon;
                    const active = activeTab === item.id;
                    const badge  = item.id === 'followups' && overdueFollowUps > 0 ? overdueFollowUps : null;
                    return (
                      <li key={item.id}>
                        <button type="button" onClick={() => setActiveTab(item.id)}
                          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' : 'text-slate-400 hover:bg-slate-800/70 hover:text-slate-200'}`}>
                          <Icon size={15} />
                          <span className="flex-1 text-left">{item.label}</span>
                          {badge && (
                            <span className="w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-black flex items-center justify-center flex-shrink-0">
                              {badge}
                            </span>
                          )}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </nav>

        {/* User footer */}
        <div className="p-3 border-t border-slate-800/60">
          <div className="bg-slate-900/60 rounded-xl p-3 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-400 text-xs font-black flex-shrink-0">
              {currentUser.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">{currentUser.name}</p>
              <p className={`text-[10px] font-bold ${roleColor[currentUser.role] || 'text-slate-400'}`}>{currentUser.role}</p>
            </div>
            <div className="flex gap-1">
              <button type="button" onClick={resetDemo}  title="Reset demo"      className="text-slate-600 hover:text-slate-400 transition-colors"><RotateCcw size={12} /></button>
              <button type="button" onClick={handleLogout} title="Cerrar sesión" className="text-slate-600 hover:text-rose-400 transition-colors"><LogOut    size={12} /></button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-slate-200 px-8 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Punto 3: fecha dinámica */}
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
              Sesión: <span className="text-slate-700">{todayLabel()}</span>
            </div>
            {overdueFollowUps > 0 && (
              <button type="button" onClick={() => setActiveTab('followups')}
                className="flex items-center gap-1.5 text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-lg hover:bg-amber-100">
                <Bell size={11} /> {overdueFollowUps} follow-up{overdueFollowUps>1?'s':''} vencido{overdueFollowUps>1?'s':''}
              </button>
            )}
          </div>
          <div className="flex items-center gap-3">
            {notification && (
              <div className={`px-4 py-1.5 rounded-lg text-xs font-bold border transition-all ${notification.type==='success' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>
                {notification.text}
              </div>
            )}
            <button type="button" onClick={() => setShowSearch(true)}
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold text-slate-500 transition-colors border border-slate-200">
              <Search size={13} /> Buscar
              <kbd className="text-[9px] font-black text-slate-400 bg-white px-1.5 py-0.5 rounded border border-slate-200 ml-1">⌘K</kbd>
            </button>
            <div className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider border ${
              currentUser.role==='Supervisor'    ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
              currentUser.role==='Administrador' ? 'bg-violet-50  text-violet-700  border-violet-200'  :
                                                   'bg-blue-50    text-blue-700    border-blue-200'
            }`}>
              {currentUser.role}
            </div>
          </div>
        </header>

        <div className="p-8">
          <div className="animate-in fade-in duration-300">{renderContent()}</div>
        </div>
      </main>

      {showSearch && (
        <GlobalSearch clients={clients} quotes={quotes} products={products}
          onNavigate={tab => setActiveTab(tab)}
          onClose={() => setShowSearch(false)} />
      )}
      {activeCall && (
        <CallConsole activeCall={activeCall} callHistory={callHistory} onHangUp={hangUp} onSave={saveCall} />
      )}
    </div>
  );
}
