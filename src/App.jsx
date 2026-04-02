import { useMemo, useState } from 'react';
import {
  Activity, Bell, Box, CheckSquare, FileText, GraduationCap,
  LayoutDashboard, LogOut, Menu, MessageSquare, Phone, RotateCcw,
  Search, Settings, ShieldCheck, Target, Users, Wrench, X,
} from 'lucide-react';

import { DATA } from './data';
import { useLocalStorage } from './hooks/useLocalStorage';

import LoginScreen        from './features/auth/LoginScreen';
import ExecutiveDashboard from './features/analytics/ExecutiveDashboard';
import DatabaseSecurity   from './features/admin/DatabaseSecurity';
import CampaignManager    from './features/campaigns/CampaignManager';
import MultichannelConfig from './features/channels/MultichannelConfig';
import CRMView            from './features/clients/CRMView';
import CallCenter         from './features/calls/CallCenter';
import FollowUpManager    from './features/followups/FollowUpManager';
import OpportunityPipeline from './features/opportunities/OpportunityPipeline';
import ProductManager     from './features/products/ProductManager';
import QualityAudit       from './features/quality/QualityAudit';
import QuoteGenerator     from './features/quotes/QuoteGenerator';
import SalesClosure       from './features/sales/SalesClosure';
import TrainingCenter     from './features/training/TrainingCenter';
import AppConfig, { DEFAULT_CONFIG } from './features/config/AppConfig';

// ─── SEED DATA — rico para demo comercial ────────────────────────────────────
const SEED_CAMPAIGNS = [
  { id:'CMP-001', name:'Campaña Minería Norte — Planchas A4',        product:'Planchas de Metal A4',  status:'Activa',   progress:65, goal:120000, currentVentas:78000,  agents:4, startDate:'2026-03-01' },
  { id:'CMP-002', name:'Reactivación Motores Industriales Q2',       product:'Carbón para Motores',   status:'Activa',   progress:42, goal: 80000, currentVentas:33600,  agents:3, startDate:'2026-03-10' },
  { id:'CMP-003', name:'Válvulas Hidráulicas — Sector Manufactura',  product:'Válvulas Hidráulicas',  status:'Pausada',  progress:18, goal: 60000, currentVentas:10800,  agents:2, startDate:'2026-03-15' },
  { id:'CMP-004', name:'Expansión Metalúrgica Sur — Q2 2026',        product:'Planchas de Metal A4',  status:'Activa',   progress:55, goal: 95000, currentVentas:52250,  agents:5, startDate:'2026-02-15' },
];

const SEED_QUOTES = [
  { id:'COT-001', clientId:1, client:'Minera del Norte S.A.',  items:[{productId:1,quantity:50,price:1200}],  subtotal:60000, discount:5,  total:57000, status:'APROBADA',             updatedAt:'2026-03-15 09:00', notes:'Entrega en 30 días. Prioridad alta.' },
  { id:'COT-002', clientId:2, client:'Aceros Industriales',    items:[{productId:3,quantity:24,price:850}],   subtotal:20400, discount:0,  total:20400, status:'APROBADA',             updatedAt:'2026-03-18 09:15', notes:'Urgente. Director aprobó.' },
  { id:'COT-003', clientId:3, client:'Válvulas del Sur S.A.C.',items:[{productId:2,quantity:80,price:450}],   subtotal:36000, discount:8,  total:33120, status:'APROBADA',             updatedAt:'2026-03-20 11:00', notes:'Licitación trimestral.' },
  { id:'COT-004', clientId:1, client:'Minera del Norte S.A.',  items:[{productId:2,quantity:120,price:450}],  subtotal:54000, discount:10, total:48600, status:'PENDIENTE_APROBACION', updatedAt:'2026-03-27 08:30', notes:'Revisión supervisor pendiente.' },
  { id:'COT-005', clientId:2, client:'Aceros Industriales',    items:[{productId:1,quantity:30,price:1200}],  subtotal:36000, discount:3,  total:34920, status:'PENDIENTE_APROBACION', updatedAt:'2026-03-28 14:00', notes:'Segunda propuesta ajustada.' },
  { id:'COT-006', clientId:3, client:'Válvulas del Sur S.A.C.',items:[{productId:3,quantity:12,price:850}],   subtotal:10200, discount:0,  total:10200, status:'BORRADOR',             updatedAt:'2026-03-29 10:00', notes:'' },
  { id:'COT-007', clientId:1, client:'Minera del Norte S.A.',  items:[{productId:1,quantity:20,price:1200},{productId:3,quantity:10,price:850}], subtotal:32500, discount:5, total:30875, status:'BORRADOR', updatedAt:'2026-03-30 09:00', notes:'Propuesta combo.' },
];

const SEED_OPPORTUNITIES = [
  { id:'OPP-001', clientId:1, clientName:'Minera del Norte S.A.',  product:'Planchas de Metal A4', value:120000, stage:'CIERRE',      agent:'Ana Garcia',  date:'2026-03-05', notes:'Contrato firmado. Entrega Q2.' },
  { id:'OPP-002', clientId:2, clientName:'Aceros Industriales',    product:'Válvulas Hidráulicas', value: 48000, stage:'NEGOCIACION', agent:'Carlos Ruiz', date:'2026-03-15', notes:'Esperan aprobación de directorio. Alta probabilidad.' },
  { id:'OPP-003', clientId:3, clientName:'Válvulas del Sur S.A.C.',product:'Carbón para Motores',  value: 36000, stage:'COTIZACION',  agent:'Luis Torres', date:'2026-03-18', notes:'Cotización COT-003 en revisión.' },
  { id:'OPP-004', clientId:1, clientName:'Minera del Norte S.A.',  product:'Carbón para Motores',  value: 54000, stage:'NEGOCIACION', agent:'Ana Garcia',  date:'2026-03-22', notes:'Segunda reunión programada.' },
  { id:'OPP-005', clientId:2, clientName:'Aceros Industriales',    product:'Planchas de Metal A4', value: 72000, stage:'CONTACTO',    agent:'Carlos Ruiz', date:'2026-03-28', notes:'Referido por cliente existente.' },
  { id:'OPP-006', clientId:3, clientName:'Válvulas del Sur S.A.C.',product:'Válvulas Hidráulicas', value: 24000, stage:'PROSPECCION', agent:'Luis Torres', date:'2026-03-30', notes:'Primer contacto por Facebook.' },
];

const SEED_AUDITS = [
  { id:'REC-001', agent:'Ana Garcia',  client:'Minera del Norte', date:'2026-03-27', duration:'08:42', score:92, comments:'Excelente apertura y cierre. Manejo impecable de objeciones técnicas.', criteria:{opening:10,needs:9,objections:9,followup:9,privacy:9} },
  { id:'REC-002', agent:'Carlos Ruiz', client:'Aceros Latam',     date:'2026-03-26', duration:'05:15', score:85, comments:'Buen manejo comercial. Mejorar tiempo de respuesta ante dudas técnicas.', criteria:{opening:8,needs:9,objections:8,followup:9,privacy:8} },
  { id:'REC-003', agent:'Luis Torres', client:'Válvulas del Sur',  date:'2026-03-25', duration:'06:30', score:78, comments:'Adecuado. Reforzar protocolo de privacidad de datos.', criteria:{opening:8,needs:8,objections:7,followup:8,privacy:7} },
  { id:'REC-004', agent:'Ana Garcia',  client:'Aceros Industriales',date:'2026-03-29',duration:'12:18', score:null, comments:'', criteria:{} },
];

const SEED_TRAINING = [
  { id:1, title:'Conocimiento de Producto: Planchas de Metal A4', category:'Tecnico',   duration:'45 min', status:'Completado', description:'Especificaciones técnicas, resistencia y aplicaciones en minería.', question:'¿Cuál es el principal beneficio de las Planchas A4 en entornos de alta corrosión minera?', options:['Resistencia al impacto térmico','Tratamiento anticorrosivo grado 4','Bajo costo de mantenimiento'], correctAnswer:'Tratamiento anticorrosivo grado 4', selectedAnswer:'Tratamiento anticorrosivo grado 4', feedback:'Módulo aprobado.' },
  { id:2, title:'Guiones de Ventas Outbound B2B',                  category:'Comercial', duration:'30 min', status:'Completado', description:'Técnicas de prospección y manejo de objeciones B2B.', question:'¿Qué técnica ayuda más a descubrir necesidades?', options:['Hablar primero del precio','Usar preguntas abiertas sobre operación y volumen','Enviar catálogo sin contexto'], correctAnswer:'Usar preguntas abiertas sobre operación y volumen', selectedAnswer:'Usar preguntas abiertas sobre operación y volumen', feedback:'Respuesta correcta. Módulo aprobado.' },
  { id:3, title:'Protección de Datos y Cumplimiento Normativo',    category:'Legal',     duration:'20 min', status:'En curso',   description:'Protocolos de seguridad e información.', question:'Antes de exportar datos de clientes, ¿qué validación es obligatoria?', options:['Confirmar permiso y registrar trazabilidad','Solo avisar por chat','Cambiar el nombre del archivo'], correctAnswer:'Confirmar permiso y registrar trazabilidad', selectedAnswer:'', feedback:'' },
  { id:4, title:'Manejo de Objeciones en Sector Metalúrgico',      category:'Comercial', duration:'35 min', status:'Pendiente',  description:'Estrategias específicas para clientes del sector metalúrgico e industrial pesado.', question:'Cuando un cliente dice "el precio es muy alto", la mejor respuesta es:', options:['Bajar el precio inmediatamente','Demostrar el valor técnico y ROI del producto','Ofrecer un producto diferente'], correctAnswer:'Demostrar el valor técnico y ROI del producto', selectedAnswer:'', feedback:'' },
];

const SEED_LOGS = [
  { id:'LOG-001', module:'Seguridad',  event:'Descarga de Base de Datos', user:'Carlos Mendoza', role:'Administrador', date:'2026-03-28 10:15', obj:'DB-MINERIA',   alert:true  },
  { id:'LOG-002', module:'Cotizacion', event:'Cotización aprobada',        user:'Marta Salinas',  role:'Supervisor',    date:'2026-03-28 09:45', obj:'COT-002',      alert:false },
  { id:'LOG-003', module:'CRM',        event:'Cliente creado',             user:'Ana Garcia',     role:'Agente',        date:'2026-03-28 09:12', obj:'CLI-001',      alert:false },
  { id:'LOG-004', module:'Cotizacion', event:'Cotización aprobada',        user:'Marta Salinas',  role:'Supervisor',    date:'2026-03-27 15:30', obj:'COT-001',      alert:false },
  { id:'LOG-005', module:'Llamada',    event:'Contacto registrado',        user:'Carlos Ruiz',    role:'Agente',        date:'2026-03-27 11:00', obj:'INT-003',      alert:false },
  { id:'LOG-006', module:'Oportunidad',event:'Oportunidad avanzada',       user:'Ana Garcia',     role:'Agente',        date:'2026-03-27 09:15', obj:'OPP-001',      alert:false },
  { id:'LOG-007', module:'Seguridad',  event:'Intento de acceso fallido',  user:'unknown',        role:'—',             date:'2026-03-26 22:41', obj:'AUTH',         alert:true  },
  { id:'LOG-008', module:'Cotizacion', event:'PDF generado',               user:'Ana Garcia',     role:'Agente',        date:'2026-03-26 16:00', obj:'COT-003',      alert:false },
];

const SEED_CHANNELS = [
  { id:'wa',   name:'WhatsApp Business API',      type:'Webhook', status:'Conectado',     latency:'12ms', endpoint:'https://api.callcenter.local/whatsapp', enabled:true  },
  { id:'sip',  name:'Telefonía IP (SIP Trunk)',   type:'SIP',     status:'Conectado',     latency:'45ms', endpoint:'sip:trunk@callcenter.local',             enabled:true  },
  { id:'smtp', name:'Servidor Correo Industrial', type:'SMTP',    status:'Error de Auth', latency:'--',   endpoint:'smtp://mail.callcenter.local',            enabled:false },
];

const SEED_FOLLOWUPS = [
  { id:'FU-001', clientName:'Minera del Norte S.A.', agent:'Ana Garcia',  date:'2026-03-31', time:'10:00', priority:'Alta',  channel:'Teléfono fijo', notes:'Confirmar detalles de entrega COT-001. Contrato pendiente de firma.',   status:'Pendiente',  createdAt:'2026-03-28' },
  { id:'FU-002', clientName:'Aceros Industriales',   agent:'Carlos Ruiz', date:'2026-03-31', time:'15:00', priority:'Alta',  channel:'WhatsApp',      notes:'Resolución de directorio para COT-005. Cierre inminente.',              status:'Pendiente',  createdAt:'2026-03-28' },
  { id:'FU-003', clientName:'Válvulas del Sur S.A.C.',agent:'Luis Torres',date:'2026-04-02', time:'11:00', priority:'Media', channel:'Celular',       notes:'Segunda reunión técnica. Presentar catálogo de válvulas premium.',      status:'Pendiente',  createdAt:'2026-03-27' },
  { id:'FU-004', clientName:'Aceros Industriales',   agent:'Ana Garcia',  date:'2026-03-25', time:'09:00', priority:'Alta',  channel:'Teléfono fijo', notes:'Llamada completada. Cliente confirmó interés.',                         status:'Completado', createdAt:'2026-03-24' },
  { id:'FU-005', clientName:'Minera del Norte S.A.', agent:'Carlos Ruiz', date:'2026-03-26', time:'14:30', priority:'Media', channel:'WhatsApp',      notes:'Envío de ficha técnica Planchas A4 anticorrosivo.',                    status:'Completado', createdAt:'2026-03-25' },
];

const SEED_CALL_HISTORY = [
  { id:'INT-001', clientId:1, clientName:'Minera del Norte S.A.', contactName:'John Doe',    phone:'555-0101', channel:'telefono',   disposition:'interesado',    notes:'Muy interesado en planchas A4. Pide cotización 50 ton. Reunión técnica agendada.',  date:'2026-03-26', time:'10:30', duration:'15', agent:'Ana Garcia',  followUpDate:'',           timestamp:'2026-03-26T10:30:00' },
  { id:'INT-002', clientId:1, clientName:'Minera del Norte S.A.', contactName:'Marta Gomez', phone:'555-0124', channel:'whatsapp',   disposition:'solicita_cot',  notes:'Coordinadora técnica. Solicita cotización detallada con especificaciones.',       date:'2026-03-27', time:'08:15', duration:'5',  agent:'Ana Garcia',  followUpDate:'',           timestamp:'2026-03-27T08:15:00' },
  { id:'INT-003', clientId:2, clientName:'Aceros Industriales',   contactName:'Pedro Luis',  phone:'555-0200', channel:'celular',    disposition:'solicita_cot',  notes:'Director de planta. Necesita 24 válvulas hidráulicas urgente. Entrega en 2 sem.', date:'2026-03-27', time:'09:00', duration:'20', agent:'Carlos Ruiz', followUpDate:'',           timestamp:'2026-03-27T09:00:00' },
  { id:'INT-004', clientId:3, clientName:'Válvulas del Sur S.A.C.',contactName:'Carmen Rios', phone:'555-0310', channel:'facebook',  disposition:'en_evaluacion', notes:'Contacto por Facebook Ads. Evaluando presupuesto Q2. Muy receptiva.',            date:'2026-03-27', time:'11:45', duration:'8',  agent:'Luis Torres', followUpDate:'2026-04-02', timestamp:'2026-03-27T11:45:00' },
  { id:'INT-005', clientId:2, clientName:'Aceros Industriales',   contactName:'Pedro Luis',  phone:'555-0200', channel:'email',      disposition:'volver_llamar', notes:'No responde. Dejé mensaje de voz. Reintento programado.',                         date:'2026-03-28', time:'08:00', duration:'2',  agent:'Carlos Ruiz', followUpDate:'2026-03-31', timestamp:'2026-03-28T08:00:00' },
  { id:'INT-006', clientId:1, clientName:'Minera del Norte S.A.', contactName:'John Doe',    phone:'555-0101', channel:'telefono',   disposition:'cerrado',       notes:'Contrato firmado. OPP-001 cerrado. Primer pedido: 50 ton planchas.',             date:'2026-03-29', time:'10:00', duration:'25', agent:'Ana Garcia',  followUpDate:'',           timestamp:'2026-03-29T10:00:00' },
  { id:'INT-007', clientId:3, clientName:'Válvulas del Sur S.A.C.',contactName:'Luis Paredes',phone:'555-0311', channel:'celular',   disposition:'interesado',    notes:'Jefe de logística. Interesado en carbón para motores en cantidad.',             date:'2026-03-29', time:'14:30', duration:'12', agent:'Luis Torres', followUpDate:'',           timestamp:'2026-03-29T14:30:00' },
  { id:'INT-008', clientId:2, clientName:'Aceros Industriales',   contactName:'Pedro Luis',  phone:'555-0200', channel:'whatsapp',   disposition:'solicita_cot',  notes:'Confirmó por WhatsApp interés en propuesta COT-005.',                           date:'2026-03-30', time:'09:45', duration:'3',  agent:'Carlos Ruiz', followUpDate:'',           timestamp:'2026-03-30T09:45:00' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const ts = () => { const n=new Date(); return `${n.toISOString().slice(0,10)} ${n.toTimeString().slice(0,5)}`; };
const todayLabel = () => new Date().toLocaleDateString('es-PE', { day:'numeric', month:'short', year:'numeric' });

// ─── Menu ─────────────────────────────────────────────────────────────────────
const MENU = [
  { id:'dashboard',     label:'Dashboard',           icon:LayoutDashboard, group:'Transversales' },
  { id:'crm',           label:'Clientes',            icon:Users,           group:'Estrategicos'  },
  { id:'products',      label:'Productos',           icon:Box,             group:'Estrategicos'  },
  { id:'campaigns',     label:'Campañas',            icon:Target,          group:'Estrategicos'  },
  { id:'calls',         label:'Centro Contactos',    icon:Phone,           group:'Operativos'    },
  { id:'followups',     label:'Follow-ups',          icon:Bell,            group:'Operativos'    },
  { id:'opportunities', label:'Oportunidades',       icon:Activity,        group:'Operativos'    },
  { id:'quotes',        label:'Cotizaciones B2B',    icon:FileText,        group:'Operativos'    },
  { id:'closure',       label:'Cierre & Aprobación', icon:CheckSquare,     group:'Operativos'    },
  { id:'quality',       label:'Auditoría Calidad',   icon:ShieldCheck,     group:'Soporte'       },
  { id:'training',      label:'Capacitación',        icon:GraduationCap,   group:'Soporte'       },
  { id:'channels',      label:'Canales',             icon:MessageSquare,   group:'Soporte'       },
  { id:'security',      label:'Seguridad',           icon:Settings,        group:'Soporte'       },
  { id:'config',        label:'Configuración',       icon:Wrench,          group:'Soporte'       },
];
const GROUPS = ['Transversales','Estrategicos','Operativos','Soporte'];

// ─── Global Search ─────────────────────────────────────────────────────────────
function GlobalSearch({ clients, quotes, products, onNavigate, onClose }) {
  const [q, setQ] = useState('');
  const results = useMemo(() => {
    if (q.trim().length < 2) return [];
    const lq = q.toLowerCase();
    return [
      ...clients.filter(c=>c.name.toLowerCase().includes(lq)||(c.contact||'').toLowerCase().includes(lq)).map(c=>({type:'Cliente',label:c.name,sub:c.contact,tab:'crm'})),
      ...quotes.filter(qt=>qt.client?.toLowerCase().includes(lq)||qt.id.toLowerCase().includes(lq)).map(qt=>({type:'Cotización',label:qt.id,sub:`${qt.client} · $${qt.total?.toLocaleString()}`,tab:'quotes'})),
      ...products.filter(p=>p.name.toLowerCase().includes(lq)).map(p=>({type:'Producto',label:p.name,sub:`$${p.price} / ${p.unit}`,tab:'products'})),
    ].slice(0,8);
  }, [q, clients, quotes, products]);

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-start justify-center pt-24 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200">
        <div className="flex items-center gap-3 p-4 border-b border-slate-100">
          <Search size={18} className="text-slate-400 flex-shrink-0"/>
          <input autoFocus type="text" placeholder="Buscar clientes, cotizaciones, productos..." value={q}
            onChange={e=>setQ(e.target.value)} className="flex-1 text-sm outline-none text-slate-800 placeholder:text-slate-400"/>
          <button type="button" onClick={onClose}><X size={18} className="text-slate-400"/></button>
        </div>
        {q.trim().length >= 2 ? (
          <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
            {results.length===0 ? <p className="p-4 text-sm text-slate-400 text-center">Sin resultados para "{q}"</p>
            : results.map((r,i)=>(
              <button key={i} type="button" onClick={()=>{onNavigate(r.tab);onClose();}}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 text-left transition-colors">
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-500 flex-shrink-0">{r.type}</span>
                <div><p className="text-sm font-bold text-slate-800">{r.label}</p>{r.sub&&<p className="text-xs text-slate-400">{r.sub}</p>}</div>
              </button>
            ))}
          </div>
        ):(
          <div className="p-4 grid grid-cols-3 gap-2">
            {MENU.slice(0,6).map(m=>(
              <button key={m.id} type="button" onClick={()=>{onNavigate(m.id);onClose();}}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 border border-slate-200 transition-colors">
                <m.icon size={13} className="text-blue-500"/> {m.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── App ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [currentUser,  setCurrentUser]  = useState(null);
  const [activeTab,    setActiveTab]    = useState('dashboard');
  const [showSearch,   setShowSearch]   = useState(false);
  const [notification, setNotification] = useState(null);
  const [apiKey,       setApiKey]       = useState('');
  const [sidebarOpen,  setSidebarOpen]  = useState(false); // ← mobile sidebar toggle

  // ── Persistent state ──────────────────────────────────────────────────────
  const [clients,         setClients]         = useLocalStorage('cc_clients',       DATA.clients.map(c=>({...c})));
  const [products,        setProducts]        = useLocalStorage('cc_products',      DATA.products.map(p=>({...p})));
  const [campaigns,       setCampaigns]       = useLocalStorage('cc_campaigns',     SEED_CAMPAIGNS);
  const [quotes,          setQuotes]          = useLocalStorage('cc_quotes',        SEED_QUOTES);
  const [opportunities,   setOpportunities]   = useLocalStorage('cc_opportunities', SEED_OPPORTUNITIES);
  const [audits,          setAudits]          = useLocalStorage('cc_audits',        SEED_AUDITS);
  const [trainingModules, setTrainingModules] = useLocalStorage('cc_training',      SEED_TRAINING);
  const [appConfig,       setAppConfig]       = useLocalStorage('cc_config',         DEFAULT_CONFIG);
  const [securityLogs,    setSecurityLogs]    = useLocalStorage('cc_logs',          SEED_LOGS);
  const [channels,        setChannels]        = useLocalStorage('cc_channels',      SEED_CHANNELS);
  const [followUps,       setFollowUps]       = useLocalStorage('cc_followups',     SEED_FOLLOWUPS);
  const [callHistory,     setCallHistory]     = useLocalStorage('cc_callhistory',   SEED_CALL_HISTORY);

  // ── Audit ─────────────────────────────────────────────────────────────────
  const audit = (event, objId, module='Sistema', alert=false) => {
    if (!currentUser) return;
    setSecurityLogs(cur=>[{ id:`LOG-${String(cur.length+1).padStart(3,'0')}`, module, event, user:currentUser.name, role:currentUser.role, date:ts(), obj:objId||'—', alert }, ...cur]);
  };

  const notify = (type, text) => {
    setNotification({type,text});
    clearTimeout(window.__ccTimer);
    window.__ccTimer = setTimeout(()=>setNotification(null), 3500);
  };

  const handleLogin  = user => { setCurrentUser(user); audit(`Inicio de sesión — ${user.role}`, user.id,'Sistema'); };
  const handleLogout = ()   => { audit(`Cierre de sesión — ${currentUser?.role}`, currentUser?.id,'Sistema'); setCurrentUser(null); setActiveTab('dashboard'); };
  const resetDemo    = ()   => { if(!window.confirm('¿Resetear todos los datos al estado inicial de la demo?')) return; localStorage.clear(); window.location.reload(); };

  const navigate = tab => { setActiveTab(tab); setSidebarOpen(false); };

  // ── Follow-up badge — usa config.notifications.alertThresholdDays ──────────
  const overdueFollowUps = useMemo(()=>{
    const threshold = appConfig?.notifications?.alertThresholdDays ?? 1;
    return followUps.filter(f=>{
      if(f.status!=='Pendiente') return false;
      const d=new Date(f.date); d.setHours(0,0,0,0);
      const t=new Date(); t.setHours(0,0,0,0);
      return (t-d)/86400000 >= threshold;
    }).length;
  },[followUps, appConfig]);

  // ── Dashboard stats ───────────────────────────────────────────────────────
  const dashboardStats = useMemo(()=>{
    const approved = quotes.filter(q=>q.status==='APROBADA');
    const pending  = quotes.filter(q=>q.status==='PENDIENTE_APROBACION');
    const sent     = quotes.filter(q=>q.status!=='BORRADOR');
    return {
      conversionRate:    quotes.length ? `${Math.round(approved.length/quotes.length*100)}%` : '0%',
      quoteApprovalRate: sent.length   ? `${Math.round(approved.length/sent.length*100)}%`   : '0%',
      effectiveCalls:    `${Math.min(95,45+clients.length*5)}%`,
      closingTime:       `${Math.max(7,18-approved.length)} días`,
      totalSales:        approved.reduce((s,q)=>s+q.total,0),
      pendingQuotes:     pending.length,
      activeCampaigns:   campaigns.filter(c=>c.status==='Activa').length,
      approvedQuotes:    approved.length,
      productLines:      products.map(p=>({ label:p.name, amount:approved.reduce((s,q)=>s+(q.items||[]).filter(it=>it.productId===p.id).reduce((ss,it)=>ss+it.quantity*it.price,0),0) })),
    };
  },[campaigns,clients.length,quotes,products]);

  // ── CRUD: Clients ─────────────────────────────────────────────────────────
  const saveClient   = c  => { setClients(cur=>c.id?cur.map(x=>x.id===c.id?c:x):[...cur,{...c,id:Math.max(0,...cur.map(x=>x.id))+1}]); audit(c.id?'Cliente actualizado':'Cliente creado',c.id||'nuevo','CRM'); notify('success',c.id?'Cliente actualizado.':'Cliente creado.'); };
  const deleteClient = id => { setClients(cur=>cur.filter(c=>c.id!==id)); setQuotes(cur=>cur.filter(q=>q.clientId!==id)); audit('Cliente eliminado',id,'CRM',true); notify('success','Cliente eliminado.'); };

  // ── CRUD: Products ────────────────────────────────────────────────────────
  const saveProduct   = p  => { setProducts(cur=>p.id?cur.map(x=>x.id===p.id?p:x):[...cur,{...p,id:Math.max(0,...cur.map(x=>x.id))+1}]); audit(p.id?'Producto actualizado':'Producto creado',p.id||'nuevo','Producto'); notify('success',p.id?'Producto actualizado.':'Producto creado.'); };
  const deleteProduct = id => { setProducts(cur=>cur.filter(p=>p.id!==id)); audit('Producto eliminado',id,'Producto',true); notify('success','Producto eliminado.'); };

  // ── CRUD: Campaigns ───────────────────────────────────────────────────────
  const saveCampaign   = c  => { setCampaigns(cur=>c.id?cur.map(x=>x.id===c.id?c:x):[...cur,{...c,id:`CMP-${String(cur.length+1).padStart(3,'0')}`}]); audit(c.id?'Campaña actualizada':'Campaña creada',c.id||'nueva','Campaña'); notify('success',c.id?'Campaña actualizada.':'Campaña creada.'); };
  const toggleCampaign = id => { setCampaigns(cur=>cur.map(c=>c.id===id?{...c,status:c.status==='Activa'?'Pausada':'Activa'}:c)); audit('Campaña pausada/activada',id,'Campaña'); notify('info','Estado actualizado.'); };
  const deleteCampaign = id => { setCampaigns(cur=>cur.filter(c=>c.id!==id)); audit('Campaña eliminada',id,'Campaña',true); notify('success','Campaña eliminada.'); };

  // ── CRUD: Quotes ──────────────────────────────────────────────────────────
  const saveQuote = (quote,submit=false) => {
    setQuotes(cur=>{ const client=clients.find(c=>c.id===quote.clientId); const payload={...quote,client:client?.name||'Sin asignar',status:submit?'PENDIENTE_APROBACION':'BORRADOR',updatedAt:ts()}; if(quote.id) return cur.map(q=>q.id===quote.id?payload:q); return [...cur,{...payload,id:`COT-${String(cur.length+1).padStart(3,'0')}`}]; });
    audit(submit?'Cotización enviada a aprobación':'Cotización guardada como borrador',quote.id||'nueva','Cotizacion');
    notify('success',submit?'Cotización enviada a aprobación.':'Borrador guardado.');
  };
  const deleteQuote = id => { setQuotes(cur=>cur.filter(q=>q.id!==id)); audit('Cotización eliminada',id,'Cotizacion',true); notify('success','Cotización eliminada.'); };
  const updateQuoteStatus = (id,status) => { setQuotes(cur=>cur.map(q=>q.id===id?{...q,status,updatedAt:ts()}:q)); audit(status==='APROBADA'?'Cotización aprobada':'Cotización rechazada',id,'Cotizacion',status==='RECHAZADA'); notify('success',status==='APROBADA'?'Cotización aprobada.':'Cotización rechazada.'); };

  // ── CRUD: Opportunities ───────────────────────────────────────────────────
  const saveOpportunity   = opp => { setOpportunities(cur=>opp.id&&cur.some(o=>o.id===opp.id)?cur.map(o=>o.id===opp.id?opp:o):[...cur,opp]); audit(opp.id?'Oportunidad actualizada':'Oportunidad registrada',opp.id||'nueva','Oportunidad'); };
  const deleteOpportunity = id  => { setOpportunities(cur=>cur.filter(o=>o.id!==id)); audit('Oportunidad eliminada',id,'Oportunidad',true); notify('success','Oportunidad eliminada.'); };
  const advanceStage      = id  => { const ST=['PROSPECCION','CONTACTO','COTIZACION','NEGOCIACION','CIERRE','PERDIDO']; setOpportunities(cur=>cur.map(o=>{ if(o.id!==id) return o; const i=ST.indexOf(o.stage); if(i>=ST.length-2) return o; return {...o,stage:ST[i+1]}; })); audit('Oportunidad avanzada',id,'Oportunidad'); notify('success','Oportunidad avanzada.'); };

  // ── Other handlers ────────────────────────────────────────────────────────
  const saveAudit    = a   => {
    setAudits(cur => {
      const exists = cur.find(x => x.id === a.id);
      if (exists) return cur.map(x => x.id === a.id ? a : x);
      return [...cur, a];
    });
    audit(`Evaluación guardada — score ${a.score}`, a.id, 'Seguridad');
    notify('success', `Evaluación ${a.id} guardada.`);
  };
  const submitAnswer = (mid,ans) => { setTrainingModules(cur=>cur.map(m=>{ if(m.id!==mid) return m; const ok=ans===m.correctAnswer; audit(ok?'Módulo aprobado':'Intento fallido',mid,'Capacitacion'); return {...m,selectedAnswer:ans,status:ok?'Completado':'En curso',feedback:ok?'Respuesta correcta. Módulo aprobado.':'Respuesta incorrecta. Revisa el contenido.'}; })); notify('info','Evaluación procesada.'); };
  const configureChannel = (chId,ep) => { setChannels(cur=>cur.map(ch=>ch.id===chId?{...ch,endpoint:ep,status:'Conectado',enabled:true,latency:'18ms'}:ch)); audit('Canal configurado',chId,'Sistema'); notify('success','Canal configurado.'); };
  const toggleChannel    = chId     => { setChannels(cur=>cur.map(ch=>{ if(ch.id!==chId) return ch; const en=!ch.enabled; return {...ch,enabled:en,status:en?'Conectado':'Desconectado',latency:en?(ch.latency==='--'?'22ms':ch.latency):'--'}; })); audit('Canal actualizado',chId,'Sistema'); notify('info','Canal actualizado.'); };
  const saveFollowUp     = fu => { setFollowUps(cur=>[...cur,fu]); audit('Follow-up programado',fu.clientName,'Follow-up'); notify('success','Follow-up programado.'); };
  const deleteFollowUp   = id => { setFollowUps(cur=>cur.filter(f=>f.id!==id)); audit('Follow-up eliminado',id,'Follow-up'); notify('success','Follow-up eliminado.'); };
  const completeFollowUp = id => { setFollowUps(cur=>cur.map(f=>f.id===id?{...f,status:'Completado'}:f)); audit('Follow-up completado',id,'Follow-up'); notify('success','Follow-up completado.'); };
  const saveCall = (data,isEdit=false) => {
    setCallHistory(cur=>isEdit?cur.map(c=>c.id===data.id?data:c):[{...data,id:data.id||`INT-${Date.now()}`},...cur]);
    audit(`Contacto ${isEdit?'actualizado':'registrado'}: ${data.disposition?.replace(/_/g,' ')}`,data.clientName,'Llamada');
    notify('success',isEdit?'Contacto actualizado.':'Contacto registrado.');
    // Auto follow-up respeta config.contacts.autoFollowUp
    const autoFU = appConfig?.contacts?.autoFollowUp ?? true;
    if(!isEdit && autoFU && data.followUpDate){
      setFollowUps(cur=>[...cur,{
        id:`FU-${Date.now()}`,clientName:data.clientName,
        agent:data.agent||currentUser?.name||'Agente',
        date:data.followUpDate,time:'',priority:'Media',
        channel:data.channel==='whatsapp'?'WhatsApp':'Teléfono fijo',
        notes:data.notes||'Seguimiento generado desde contacto.',
        status:'Pendiente',createdAt:new Date().toISOString().slice(0,10),
      }]);
      audit('Follow-up automático generado',data.clientName,'Follow-up');
    }
  };
  const deleteCall = id => { setCallHistory(cur=>cur.filter(c=>c.id!==id)); audit('Contacto eliminado',id,'Llamada',true); };

  // ── Render guard ──────────────────────────────────────────────────────────
  if (!currentUser) return <LoginScreen onLogin={handleLogin}/>;

  // ── Content router ────────────────────────────────────────────────────────
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':     return <ExecutiveDashboard stats={dashboardStats} followUps={followUps} config={appConfig} onRefresh={()=>notify('info','Dashboard actualizado.')} onExport={()=>{audit('Dashboard exportado','PDF','Sistema');notify('success','Exportación preparada.');}}/>;
      case 'crm':           return <CRMView clients={clients} onSaveClient={saveClient} onDeleteClient={deleteClient} onNotify={notify}/>;
      case 'products':      return <ProductManager products={products} onSave={saveProduct} onDelete={deleteProduct} onNotify={notify}/>;
      case 'campaigns':     return <CampaignManager campaigns={campaigns} products={products} onSaveCampaign={saveCampaign} onToggleCampaign={toggleCampaign} onDeleteCampaign={deleteCampaign}/>;
      case 'calls':         return <CallCenter callHistory={callHistory} clients={clients} onSaveCall={saveCall} onDeleteCall={deleteCall} onNotify={notify} onNavigate={navigate} currentUser={currentUser} config={appConfig}/>;
      case 'followups':     return <FollowUpManager followUps={followUps} clients={clients} onSave={saveFollowUp} onDelete={deleteFollowUp} onComplete={completeFollowUp}/>;
      case 'opportunities': return <OpportunityPipeline opportunities={opportunities} onSaveOpportunity={saveOpportunity} onDeleteOpportunity={deleteOpportunity} onAdvanceStage={advanceStage} clients={clients} products={products} onNotify={notify}/>;
      case 'quotes':        return <QuoteGenerator clients={clients} products={products} quotes={quotes} onSaveQuote={saveQuote} onDeleteQuote={deleteQuote} onNotify={notify} onAudit={(ev,obj)=>audit(ev,obj,'Cotizacion')} currentUser={currentUser} config={appConfig}/>;
      case 'closure':       return <SalesClosure quotes={quotes} userRole={currentUser.role} onApprove={id=>updateQuoteStatus(id,'APROBADA')} onReject={id=>updateQuoteStatus(id,'RECHAZADA')} config={appConfig}/>;
      case 'quality':       return <QualityAudit audits={audits} onSaveAudit={saveAudit}/>;
      case 'training':      return <TrainingCenter modules={trainingModules} onSubmitAnswer={submitAnswer}/>;
      case 'channels':      return <MultichannelConfig channels={channels} apiKey={apiKey} onConfigureChannel={configureChannel} onToggleChannel={toggleChannel} onGenerateApiKey={()=>{ const k=`ccbi-${Math.random().toString(36).slice(2,8)}-${Math.random().toString(36).slice(2,8)}`; setApiKey(k); audit('API key generada','ccbi-***','Sistema'); notify('success','API key generada.'); }}/>;
      case 'security':      return <DatabaseSecurity logs={securityLogs}/>;
      case 'config':        return <AppConfig config={appConfig} onSave={cfg=>{setAppConfig(cfg); audit('Configuración actualizada','AppConfig','Sistema');}} onNotify={notify}/>;
      default: return null;
    }
  };

  const roleColor = { Administrador:'text-violet-400', Supervisor:'text-emerald-400', Agente:'text-blue-400' };
  const roleAccent= { Administrador:'#a78bfa', Supervisor:'#34d399', Agente:'#60a5fa' };

  // ── Sidebar content (shared between desktop and mobile drawer) ────────────
  const SidebarContent = () => (
    <>
      {/* ── Brand header — alto impacto ── */}
      <div className="px-4 pt-5 pb-4 flex-shrink-0" style={{ borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
        <div className="flex items-center gap-3 mb-3">
          <div className="relative flex-shrink-0">
            <img src="/app-icon.jpg" alt="CallSysPRO"
              className="w-10 h-10 rounded-xl object-cover"
              style={{ boxShadow:'0 0 0 2px rgba(96,165,250,0.35), 0 4px 16px rgba(0,0,0,0.5)' }}
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2"
              style={{ background:'#10b981', borderColor:'#020817' }}/>
          </div>
          <div className="min-w-0">
            <h1 className="font-black text-white text-base leading-none tracking-tight">
              {(appConfig?.company?.name || 'CallSysPRO').replace(/\s+B2B.*$/,'')}<span style={{ color:'#f59e0b' }}>PRO</span>
            </h1>
            <p className="text-[9px] font-bold uppercase tracking-[0.18em] mt-0.5" style={{ color:'rgba(148,163,184,0.7)' }}>
              {appConfig?.company?.tagline || 'Centro de Contactos B2B'}
            </p>
          </div>
          {/* Close button — mobile only */}
          <button type="button" onClick={()=>setSidebarOpen(false)}
            className="lg:hidden ml-auto p-1.5 rounded-lg text-slate-500 hover:text-white transition-colors">
            <X size={16}/>
          </button>
        </div>
        {/* Divider shimmer */}
        <div className="h-px rounded-full" style={{ background:'linear-gradient(90deg,transparent,rgba(96,165,250,0.4),transparent)' }}/>
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-5">
        {GROUPS.map(group => {
          const items = MENU.filter(m=>m.group===group);
          return (
            <div key={group}>
              <p className="text-[9px] font-black uppercase tracking-[0.25em] mb-2 px-2" style={{ color:'rgba(100,116,139,0.8)' }}>{group}</p>
              <ul className="space-y-0.5">
                {items.map(item => {
                  const Icon   = item.icon;
                  const active = activeTab === item.id;
                  const badge  = item.id==='followups' && overdueFollowUps>0 ? overdueFollowUps : null;
                  return (
                    <li key={item.id}>
                      <button type="button" onClick={()=>navigate(item.id)}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all"
                        style={active
                          ? { background:'linear-gradient(135deg,#2563eb,#1d4ed8)', color:'#fff', boxShadow:'0 4px 12px rgba(37,99,235,0.35)' }
                          : { color:'rgba(148,163,184,0.85)' }
                        }
                        onMouseEnter={e=>{ if(!active) e.currentTarget.style.background='rgba(255,255,255,0.06)'; }}
                        onMouseLeave={e=>{ if(!active) e.currentTarget.style.background=''; }}
                      >
                        <Icon size={15}/>
                        <span className="flex-1 text-left">{item.label}</span>
                        {badge && <span className="w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-black flex items-center justify-center flex-shrink-0">{badge}</span>}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </nav>

      {/* ── User footer ── */}
      <div className="p-3 flex-shrink-0" style={{ borderTop:'1px solid rgba(255,255,255,0.07)' }}>
        <div className="rounded-xl p-3 flex items-center gap-2.5" style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)' }}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0"
            style={{ background:`${roleAccent[currentUser.role]}20`, color:roleAccent[currentUser.role], border:`1px solid ${roleAccent[currentUser.role]}30` }}>
            {currentUser.avatar}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-white truncate">{currentUser.name}</p>
            <p className="text-[10px] font-bold" style={{ color:roleAccent[currentUser.role] }}>{currentUser.role}</p>
          </div>
          <div className="flex gap-1">
            <button type="button" onClick={resetDemo}    title="Reset demo"      className="p-1.5 rounded-lg transition-colors text-slate-600 hover:text-slate-400"><RotateCcw size={11}/></button>
            <button type="button" onClick={handleLogout} title="Cerrar sesión"   className="p-1.5 rounded-lg transition-colors text-slate-600 hover:text-rose-400"><LogOut    size={11}/></button>
          </div>
        </div>
      </div>
    </>
  );

  // ── Layout ────────────────────────────────────────────────────────────────
  return (
    <div className="flex min-h-screen bg-slate-100 font-sans text-slate-900">

      {/* ── Desktop sidebar (always visible ≥lg) ── */}
      <aside className="hidden lg:flex w-64 flex-col sticky top-0 h-screen flex-shrink-0"
        style={{ background:'#040e1e', borderRight:'1px solid rgba(255,255,255,0.06)' }}>
        <SidebarContent/>
      </aside>

      {/* ── Mobile sidebar overlay ── */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* backdrop */}
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={()=>setSidebarOpen(false)}/>
          {/* drawer */}
          <aside className="relative w-72 flex flex-col h-full z-10 flex-shrink-0"
            style={{ background:'#040e1e', borderRight:'1px solid rgba(255,255,255,0.06)', animation:'slideInLeft .22s cubic-bezier(.22,.61,.36,1)' }}>
            <style>{`@keyframes slideInLeft{from{transform:translateX(-100%)}to{transform:translateX(0)}}`}</style>
            <SidebarContent/>
          </aside>
        </div>
      )}

      {/* ── Main content ── */}
      <main className="flex-1 overflow-y-auto min-w-0">
        <header className="sticky top-0 z-30 bg-white/85 backdrop-blur border-b border-slate-200 px-4 md:px-8 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {/* ← Hamburger (mobile only) */}
            <button type="button" onClick={()=>setSidebarOpen(true)}
              className="lg:hidden flex items-center justify-center w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors text-slate-600 flex-shrink-0">
              <Menu size={18}/>
            </button>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest hidden sm:block">
              Sesión: <span className="text-slate-700">{todayLabel()}</span>
            </div>
            {overdueFollowUps>0 && (
              <button type="button" onClick={()=>navigate('followups')}
                className="flex items-center gap-1.5 text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-lg hover:bg-amber-100">
                <Bell size={11}/> {overdueFollowUps} vencido{overdueFollowUps>1?'s':''}
              </button>
            )}
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            {notification && (
              <div className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all hidden sm:block ${notification.type==='success'?'bg-emerald-50 text-emerald-700 border-emerald-200':'bg-blue-50 text-blue-700 border-blue-200'}`}>
                {notification.text}
              </div>
            )}
            <button type="button" onClick={()=>setShowSearch(true)}
              className="flex items-center gap-2 px-3 md:px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold text-slate-500 transition-colors border border-slate-200">
              <Search size={13}/> <span className="hidden md:inline">Buscar</span>
            </button>
            <div className={`px-2.5 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider border hidden sm:block ${
              currentUser.role==='Supervisor'?'bg-emerald-50 text-emerald-700 border-emerald-200':
              currentUser.role==='Administrador'?'bg-violet-50 text-violet-700 border-violet-200':
              'bg-blue-50 text-blue-700 border-blue-200'}`}>
              {currentUser.role}
            </div>
          </div>
        </header>

        <div className="p-4 md:p-8">
          <div className="animate-in fade-in duration-300">{renderContent()}</div>
        </div>
      </main>

      {showSearch && <GlobalSearch clients={clients} quotes={quotes} products={products} onNavigate={navigate} onClose={()=>setShowSearch(false)}/>}
    </div>
  );
}
