import { useMemo, useState } from 'react';
import {
  CheckSquare,
  FileText,
  GraduationCap,
  LayoutDashboard,
  MessageSquare,
  Settings,
  ShieldCheck,
  Target,
  Users,
} from 'lucide-react';

import { DATA } from './data';
import ExecutiveDashboard from './features/analytics/ExecutiveDashboard';
import DatabaseSecurity from './features/admin/DatabaseSecurity';
import CampaignManager from './features/campaigns/CampaignManager';
import MultichannelConfig from './features/channels/MultichannelConfig';
import CRMView from './features/clients/CRMView';
import QualityAudit from './features/quality/QualityAudit';
import QuoteGenerator from './features/quotes/QuoteGenerator';
import SalesClosure from './features/sales/SalesClosure';
import TrainingCenter from './features/training/TrainingCenter';

const INITIAL_CAMPAIGNS = [
  {
    id: 'CMP-001',
    name: 'Campana Mineria Norte - Planchas A4',
    product: 'Planchas de Metal A4',
    status: 'Activa',
    progress: 65,
    goal: 100000,
    currentVentas: 65000,
    agents: 4,
    startDate: '2024-03-01',
  },
  {
    id: 'CMP-002',
    name: 'Reactivacion Motores Industriales',
    product: 'Carbon para Motores',
    status: 'Pausada',
    progress: 30,
    goal: 50000,
    currentVentas: 15000,
    agents: 2,
    startDate: '2024-03-10',
  },
];

const INITIAL_QUOTES = [
  {
    id: 'COT-001',
    clientId: 1,
    client: 'Minera del Norte S.A.',
    items: [{ productId: 1, quantity: 3, price: 1200 }],
    subtotal: 3600,
    discount: 5,
    total: 3420,
    status: 'BORRADOR',
    updatedAt: '2026-03-28 09:00',
  },
  {
    id: 'COT-002',
    clientId: 2,
    client: 'Aceros Industriales',
    items: [{ productId: 3, quantity: 6, price: 850 }],
    subtotal: 5100,
    discount: 0,
    total: 5100,
    status: 'PENDIENTE_APROBACION',
    updatedAt: '2026-03-28 09:15',
  },
];

const INITIAL_AUDITS = [
  {
    id: 'REC-992',
    agent: 'Ana Garcia',
    client: 'Minera del Norte',
    date: '2026-03-27',
    duration: '05:24',
    score: null,
    comments: '',
    criteria: {},
  },
  {
    id: 'REC-881',
    agent: 'Carlos Ruiz',
    client: 'Aceros Latam',
    date: '2026-03-26',
    duration: '03:15',
    score: 85,
    comments: 'Buen manejo comercial y cierre claro.',
    criteria: {
      opening: 8,
      needs: 9,
      objections: 8,
      followup: 9,
      privacy: 8,
    },
  },
];

const INITIAL_TRAINING_MODULES = [
  {
    id: 1,
    title: 'Conocimiento de Producto: Planchas de Metal A4',
    category: 'Tecnico',
    duration: '45 min',
    status: 'Completado',
    description: 'Especificaciones tecnicas, resistencia y aplicaciones en mineria.',
    question: 'Cual es el principal beneficio de las Planchas A4 en entornos de alta corrosion minera?',
    options: ['Resistencia al impacto termico', 'Tratamiento anticorrosivo grado 4', 'Bajo costo de mantenimiento'],
    correctAnswer: 'Tratamiento anticorrosivo grado 4',
    selectedAnswer: 'Tratamiento anticorrosivo grado 4',
    feedback: 'Modulo aprobado.',
  },
  {
    id: 2,
    title: 'Guiones de Ventas Outbound B2B',
    category: 'Comercial',
    duration: '30 min',
    status: 'En curso',
    description: 'Tecnicas de prospeccion y manejo de objeciones para clientes industriales.',
    question: 'Que tecnica ayuda mas a descubrir necesidades antes de ofrecer una cotizacion?',
    options: ['Hablar primero del precio', 'Usar preguntas abiertas sobre operacion y volumen', 'Enviar un catalogo sin contexto'],
    correctAnswer: 'Usar preguntas abiertas sobre operacion y volumen',
    selectedAnswer: '',
    feedback: '',
  },
  {
    id: 3,
    title: 'Proteccion de Datos y Cumplimiento Normativo',
    category: 'Legal',
    duration: '20 min',
    status: 'Pendiente',
    description: 'Protocolos de seguridad de la informacion y auditoria integrada.',
    question: 'Antes de exportar datos de clientes, que validacion es obligatoria?',
    options: ['Confirmar permiso y registrar trazabilidad', 'Solo avisar por chat al supervisor', 'Cambiar el nombre del archivo'],
    correctAnswer: 'Confirmar permiso y registrar trazabilidad',
    selectedAnswer: '',
    feedback: '',
  },
];

const INITIAL_SECURITY_LOGS = [
  { id: 'LOG-001', event: 'Descarga de Base', user: 'Admin_01', date: '2026-03-28 10:15', obj: 'DB-MINERIA', alert: true },
  { id: 'LOG-002', event: 'Aprobacion Cotizacion', user: 'Sup_Marta', date: '2026-03-28 09:45', obj: 'COT-002', alert: false },
  { id: 'LOG-003', event: 'Acceso a Contacto', user: 'Agente_Juan', date: '2026-03-28 09:12', obj: 'CLI-902', alert: false },
];

const INITIAL_CHANNELS = [
  { id: 'wa', name: 'WhatsApp Business API', type: 'Webhook', status: 'Conectado', latency: '12ms', endpoint: 'https://api.callcenter.local/whatsapp', enabled: true },
  { id: 'sip', name: 'Telefonia IP (SIP Trunk)', type: 'SIP', status: 'Conectado', latency: '45ms', endpoint: 'sip:trunk@callcenter.local', enabled: true },
  { id: 'smtp', name: 'Servidor Correo Industrial', type: 'SMTP', status: 'Error de Auth', latency: '--', endpoint: 'smtp://mail.callcenter.local', enabled: false },
];

const formatTimestamp = () => {
  const now = new Date();
  const date = now.toISOString().slice(0, 10);
  const time = now.toTimeString().slice(0, 5);
  return `${date} ${time}`;
};

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [clients, setClients] = useState(() =>
    DATA.clients.map((client) => ({
      ...client,
      sector:
        client.sector === 'MinerÃ­a'
          ? 'Mineria'
          : client.sector === 'FÃ¡brica'
            ? 'Fabrica'
            : client.sector,
      contact: client.contact === 'Marta GÃ³mez' ? 'Marta Gomez' : client.contact,
      status:
        client.status === 'ProspecciÃ³n'
          ? 'Prospeccion'
          : client.status === 'CotizaciÃ³n'
            ? 'Cotizacion'
            : client.status,
    })),
  );
  const [campaigns, setCampaigns] = useState(INITIAL_CAMPAIGNS);
  const [quotes, setQuotes] = useState(INITIAL_QUOTES);
  const [audits, setAudits] = useState(INITIAL_AUDITS);
  const [trainingModules, setTrainingModules] = useState(INITIAL_TRAINING_MODULES);
  const [encryptionActive, setEncryptionActive] = useState(true);
  const [securityLogs, setSecurityLogs] = useState(INITIAL_SECURITY_LOGS);
  const [channels, setChannels] = useState(INITIAL_CHANNELS);
  const [apiKey, setApiKey] = useState('');
  const [notification, setNotification] = useState(null);

  const notify = (type, text) => {
    setNotification({ type, text });
    window.clearTimeout(window.__ccNotifyTimer);
    window.__ccNotifyTimer = window.setTimeout(() => setNotification(null), 3200);
  };

  const dashboardStats = useMemo(() => {
    const approvedQuotes = quotes.filter((quote) => quote.status === 'APROBADA');
    const pendingQuotes = quotes.filter((quote) => quote.status === 'PENDIENTE_APROBACION');
    const totalSales = approvedQuotes.reduce((sum, quote) => sum + quote.total, 0);
    const conversionRate = quotes.length ? `${Math.round((approvedQuotes.length / quotes.length) * 100)}%` : '0%';
    const activeCampaigns = campaigns.filter((campaign) => campaign.status === 'Activa').length;

    return {
      conversionRate,
      effectiveCalls: `${Math.min(95, 45 + clients.length * 5)}%`,
      closingTime: `${Math.max(7, 18 - approvedQuotes.length)} dias`,
      totalSales,
      pendingQuotes: pendingQuotes.length,
      activeCampaigns,
      approvedQuotes: approvedQuotes.length,
      productLines: DATA.products.map((product) => {
        const amount = approvedQuotes.reduce((sum, quote) => {
          const matchingItems = quote.items.filter((item) => item.productId === product.id);
          return sum + matchingItems.reduce((sub, item) => sub + item.quantity * item.price, 0);
        }, 0);
        return {
          label: product.name,
          amount,
        };
      }),
    };
  }, [campaigns, clients.length, quotes]);

  const saveClient = (client) => {
    setClients((current) => {
      if (client.id) {
        return current.map((item) => (item.id === client.id ? client : item));
      }
      const nextId = current.length ? Math.max(...current.map((item) => item.id)) + 1 : 1;
      return [...current, { ...client, id: nextId }];
    });
    notify('success', client.id ? 'Cliente actualizado correctamente.' : 'Cliente creado correctamente.');
  };

  const deleteClient = (id) => {
    setClients((current) => current.filter((client) => client.id !== id));
    setQuotes((current) => current.filter((quote) => quote.clientId !== id));
    notify('success', 'Cliente eliminado y cotizaciones asociadas removidas.');
  };

  const saveCampaign = (campaign) => {
    setCampaigns((current) => {
      if (campaign.id) {
        return current.map((item) => (item.id === campaign.id ? campaign : item));
      }
      const nextCode = `CMP-${String(current.length + 1).padStart(3, '0')}`;
      return [...current, { ...campaign, id: nextCode }];
    });
    notify('success', campaign.id ? 'Campana actualizada.' : 'Campana creada.');
  };

  const toggleCampaignStatus = (id) => {
    setCampaigns((current) =>
      current.map((campaign) =>
        campaign.id === id
          ? { ...campaign, status: campaign.status === 'Activa' ? 'Pausada' : 'Activa' }
          : campaign,
      ),
    );
    notify('info', 'Estado de campana actualizado.');
  };

  const deleteCampaign = (id) => {
    setCampaigns((current) => current.filter((campaign) => campaign.id !== id));
    notify('success', 'Campana eliminada.');
  };

  const saveQuote = (quote, submit = false) => {
    setQuotes((current) => {
      const client = clients.find((item) => item.id === quote.clientId);
      const payload = {
        ...quote,
        client: client?.name || 'Cliente sin asignar',
        status: submit ? 'PENDIENTE_APROBACION' : 'BORRADOR',
        updatedAt: formatTimestamp(),
      };

      if (quote.id) {
        return current.map((item) => (item.id === quote.id ? payload : item));
      }

      const nextId = `COT-${String(current.length + 1).padStart(3, '0')}`;
      return [...current, { ...payload, id: nextId }];
    });
    notify('success', submit ? 'Cotizacion enviada a aprobacion.' : 'Cotizacion guardada como borrador.');
  };

  const deleteQuote = (id) => {
    setQuotes((current) => current.filter((quote) => quote.id !== id));
    notify('success', 'Cotizacion eliminada.');
  };

  const updateQuoteStatus = (id, status) => {
    setQuotes((current) => current.map((quote) => (quote.id === id ? { ...quote, status, updatedAt: formatTimestamp() } : quote)));
    notify('success', status === 'APROBADA' ? 'Cotizacion aprobada.' : 'Cotizacion rechazada.');
    setSecurityLogs((current) => [
      {
        id: `LOG-${String(current.length + 1).padStart(3, '0')}`,
        event: status === 'APROBADA' ? 'Aprobacion Cotizacion' : 'Rechazo Cotizacion',
        user: 'Supervisor',
        date: formatTimestamp(),
        obj: id,
        alert: status !== 'APROBADA',
      },
      ...current,
    ]);
  };

  const saveAudit = (audit) => {
    setAudits((current) => current.map((item) => (item.id === audit.id ? audit : item)));
    notify('success', `Auditoria ${audit.id} guardada con puntaje ${audit.score}.`);
  };

  const submitTrainingAnswer = (moduleId, answer) => {
    setTrainingModules((current) =>
      current.map((module) => {
        if (module.id !== moduleId) return module;
        const approved = answer === module.correctAnswer;
        return {
          ...module,
          selectedAnswer: answer,
          status: approved ? 'Completado' : 'En curso',
          feedback: approved ? 'Respuesta correcta. Modulo aprobado.' : 'Respuesta incorrecta. Revisa el contenido y vuelve a intentar.',
        };
      }),
    );
    notify('info', 'Evaluacion de capacitacion procesada.');
  };

  const runSecurityAudit = () => {
    const newLog = {
      id: `LOG-${String(securityLogs.length + 1).padStart(3, '0')}`,
      event: 'Auditoria de Seguridad',
      user: 'Admin_Industrial',
      date: formatTimestamp(),
      obj: encryptionActive ? 'AES-256' : 'REVISION_MANUAL',
      alert: !encryptionActive,
    };
    setSecurityLogs((current) => [newLog, ...current]);
    notify('success', 'Auditoria de seguridad ejecutada.');
  };

  const handleToggleEncryption = () => {
    setEncryptionActive((current) => !current);
    notify('info', 'Estado de cifrado actualizado.');
  };

  const updateChannel = (channelId, updates) => {
    setChannels((current) => current.map((channel) => (channel.id === channelId ? { ...channel, ...updates } : channel)));
  };

  const configureChannel = (channelId, endpoint) => {
    updateChannel(channelId, { endpoint, status: 'Conectado', enabled: true, latency: '18ms' });
    notify('success', 'Configuracion del canal guardada.');
  };

  const toggleChannel = (channelId) => {
    setChannels((current) =>
      current.map((channel) => {
        if (channel.id !== channelId) return channel;
        const enabled = !channel.enabled;
        return {
          ...channel,
          enabled,
          status: enabled ? 'Conectado' : 'Desconectado',
          latency: enabled ? channel.latency === '--' ? '22ms' : channel.latency : '--',
        };
      }),
    );
    notify('info', 'Estado del canal actualizado.');
  };

  const generateApiKey = () => {
    const generated = `ccbi-${Math.random().toString(36).slice(2, 8)}-${Math.random().toString(36).slice(2, 8)}`;
    setApiKey(generated);
    notify('success', 'API key generada correctamente.');
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard Gerencial', icon: <LayoutDashboard size={20} />, group: 'Transversales' },
    { id: 'crm', label: 'Gestion Clientes Clave', icon: <Users size={20} />, group: 'Estrategicos' },
    { id: 'campaigns', label: 'Planificacion Campanas', icon: <Target size={20} />, group: 'Estrategicos' },
    { id: 'quotes', label: 'Cotizaciones B2B', icon: <FileText size={20} />, group: 'Operativos' },
    { id: 'closure', label: 'Cierre de Ventas', icon: <CheckSquare size={20} />, group: 'Operativos' },
    { id: 'quality', label: 'Auditoria de Calidad', icon: <ShieldCheck size={20} />, group: 'Soporte' },
    { id: 'training', label: 'Capacitacion Agentes', icon: <GraduationCap size={20} />, group: 'Soporte' },
    { id: 'channels', label: 'Canales Multicanal', icon: <MessageSquare size={20} />, group: 'Soporte' },
    { id: 'security', label: 'Seguridad y Datos', icon: <Settings size={20} />, group: 'Soporte' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <ExecutiveDashboard stats={dashboardStats} onRefresh={() => notify('info', 'Dashboard actualizado con los datos mas recientes.')} onExport={() => notify('success', 'Exportacion preparada en memoria.')} />;
      case 'crm':
        return <CRMView clients={clients} onSaveClient={saveClient} onDeleteClient={deleteClient} onNotify={notify} />;
      case 'campaigns':
        return <CampaignManager campaigns={campaigns} products={DATA.products} onSaveCampaign={saveCampaign} onToggleCampaign={toggleCampaignStatus} onDeleteCampaign={deleteCampaign} />;
      case 'quotes':
        return <QuoteGenerator clients={clients} products={DATA.products} quotes={quotes} onSaveQuote={saveQuote} onDeleteQuote={deleteQuote} />;
      case 'closure':
        return <SalesClosure quotes={quotes} onApprove={(id) => updateQuoteStatus(id, 'APROBADA')} onReject={(id) => updateQuoteStatus(id, 'RECHAZADA')} />;
      case 'quality':
        return <QualityAudit audits={audits} onSaveAudit={saveAudit} />;
      case 'training':
        return <TrainingCenter modules={trainingModules} onSubmitAnswer={submitTrainingAnswer} />;
      case 'channels':
        return <MultichannelConfig channels={channels} apiKey={apiKey} onConfigureChannel={configureChannel} onToggleChannel={toggleChannel} onGenerateApiKey={generateApiKey} />;
      case 'security':
        return <DatabaseSecurity encryptionActive={encryptionActive} logs={securityLogs} onToggleEncryption={handleToggleEncryption} onRunAudit={runSecurityAudit} />;
      default:
        return <ExecutiveDashboard stats={dashboardStats} onRefresh={() => notify('info', 'Dashboard actualizado con los datos mas recientes.')} onExport={() => notify('success', 'Exportacion preparada en memoria.')} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
      <aside className="w-72 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 sticky top-0 h-screen">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black">CC</div>
            <h1 className="font-black text-white tracking-tighter text-xl uppercase">CallCenter B2B</h1>
          </div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Ecosistema Integral</p>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-8">
          {['Estrategicos', 'Operativos', 'Soporte', 'Transversales'].map((group) => (
            <div key={group}>
              <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mb-4 px-2">{group}</p>
              <ul className="space-y-1">
                {menuItems
                  .filter((item) => item.group === group || (group === 'Transversales' && item.id === 'dashboard'))
                  .map((item) => (
                    <li key={item.id}>
                      <button
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${
                          activeTab === item.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' : 'hover:bg-slate-800 hover:text-white'
                        }`}
                      >
                        {item.icon}
                        {item.label}
                      </button>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="bg-slate-800/50 rounded-xl p-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500">
              <span className="text-xs font-bold">S</span>
            </div>
            <div>
              <p className="text-xs font-bold text-white">Admin Industrial</p>
              <p className="text-[10px] text-slate-500">Supervisor</p>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <header className="mb-8 flex justify-between items-center gap-4">
          <div className="bg-white px-4 py-2 rounded-lg border border-slate-200 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
            Sesion activa: <span className="text-slate-800">28 Mar 2026</span>
          </div>
          <div className="flex gap-4 items-center">
            {notification && (
              <div className={`px-4 py-2 rounded-lg text-xs font-bold border ${notification.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>
                {notification.text}
              </div>
            )}
            <button className="bg-white border border-slate-200 px-4 py-2 rounded-lg text-xs font-bold hover:bg-slate-50 transition-colors" onClick={() => notify('info', 'Centro de soporte disponible para este modulo.')}>Ayuda Soporte</button>
          </div>
        </header>

        <div className="animate-in fade-in duration-500">{renderContent()}</div>
      </main>
    </div>
  );
}
