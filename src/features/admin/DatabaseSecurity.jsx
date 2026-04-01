import { useMemo, useState } from 'react';
import {
  AlertTriangle, Download, History, Key, RefreshCw,
  ShieldCheck, UserPlus, Users, Edit2, Trash2,
  Lock, Unlock, Eye, EyeOff, Save, X, Plus,
  CheckCircle2, Clock, Activity,
} from 'lucide-react';

// ─── Constantes ───────────────────────────────────────────────────────────────
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
  'Oportunidad':  'bg-pink-100 text-pink-700',
};

const ALL_MODULES = [
  { id:'dashboard',     label:'Dashboard',           group:'Transversales' },
  { id:'crm',           label:'Clientes / CRM',      group:'Estratégicos'  },
  { id:'products',      label:'Productos',           group:'Estratégicos'  },
  { id:'campaigns',     label:'Campañas',            group:'Estratégicos'  },
  { id:'calls',         label:'Centro Contactos',    group:'Operativos'    },
  { id:'followups',     label:'Follow-ups',          group:'Operativos'    },
  { id:'opportunities', label:'Oportunidades',       group:'Operativos'    },
  { id:'quotes',        label:'Cotizaciones B2B',    group:'Operativos'    },
  { id:'closure',       label:'Cierre & Aprobación', group:'Operativos'    },
  { id:'quality',       label:'Auditoría Calidad',   group:'Soporte'       },
  { id:'training',      label:'Capacitación',        group:'Soporte'       },
  { id:'channels',      label:'Canales',             group:'Soporte'       },
  { id:'security',      label:'Seguridad',           group:'Soporte'       },
];

const PERMISSION_LEVELS = [
  { id:'none',  label:'Sin acceso',    color:'text-slate-400',   bg:'bg-slate-100'   },
  { id:'read',  label:'Solo ver',      color:'text-blue-600',    bg:'bg-blue-50'     },
  { id:'write', label:'Ver y editar',  color:'text-amber-600',   bg:'bg-amber-50'    },
  { id:'full',  label:'Control total', color:'text-emerald-600', bg:'bg-emerald-50'  },
];

const INIT_ROLES = [
  {
    id:'admin', name:'Administrador', color:'#a78bfa',
    description:'Acceso total al sistema incluida configuración y auditoría.',
    permissions: Object.fromEntries(ALL_MODULES.map(m => [m.id, 'full'])),
  },
  {
    id:'supervisor', name:'Supervisor', color:'#34d399',
    description:'Aprobaciones, reportes y supervisión de agentes.',
    permissions: {
      dashboard:'full', crm:'write', products:'read', campaigns:'write',
      calls:'write', followups:'full', opportunities:'full', quotes:'full',
      closure:'full', quality:'full', training:'read', channels:'read', security:'read',
    },
  },
  {
    id:'agente', name:'Agente', color:'#60a5fa',
    description:'Operación diaria: llamadas, CRM básico, cotizaciones en borrador.',
    permissions: {
      dashboard:'read', crm:'write', products:'read', campaigns:'read',
      calls:'full', followups:'full', opportunities:'write', quotes:'write',
      closure:'read', quality:'none', training:'read', channels:'none', security:'none',
    },
  },
  {
    id:'soporte', name:'Soporte Técnico', color:'#fb923c',
    description:'Acceso a canales, capacitación y configuración técnica.',
    permissions: {
      dashboard:'read', crm:'none', products:'none', campaigns:'none',
      calls:'none', followups:'none', opportunities:'none', quotes:'none',
      closure:'none', quality:'none', training:'full', channels:'full', security:'write',
    },
  },
];

const INIT_USERS = [
  { id:'u1', name:'Carlos Mendoza', email:'c.mendoza@callcenter.pe', roleId:'admin',      active:true,  avatar:'CM', lastLogin:'2026-03-30 09:15' },
  { id:'u2', name:'Marta Salinas',  email:'m.salinas@callcenter.pe', roleId:'supervisor', active:true,  avatar:'MS', lastLogin:'2026-03-30 08:45' },
  { id:'u3', name:'Ana García',     email:'a.garcia@callcenter.pe',  roleId:'agente',     active:true,  avatar:'AG', lastLogin:'2026-03-30 08:00' },
  { id:'u4', name:'Carlos Ruiz',    email:'c.ruiz@callcenter.pe',    roleId:'agente',     active:true,  avatar:'CR', lastLogin:'2026-03-29 17:30' },
  { id:'u5', name:'Pedro Lamas',    email:'p.lamas@callcenter.pe',   roleId:'soporte',    active:false, avatar:'PL', lastLogin:'2026-03-20 11:00' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const ts = () => {
  const n = new Date();
  return `${n.toISOString().slice(0,10)} ${n.toTimeString().slice(0,5)}`;
};

const initials = name =>
  name.split(' ').slice(0,2).map(w => w[0]).join('').toUpperCase();

function exportCSV(logs) {
  const header = 'ID,Módulo,Evento,Usuario,Rol,Fecha/Hora,Objeto,Alerta';
  const rows   = logs.map(l =>
    [l.id, l.module||'—', l.event, l.user, l.role||'—', l.date, l.obj, l.alert?'SÍ':'NO'].join(',')
  );
  const blob = new Blob([[header,...rows].join('\n')], { type:'text/csv' });
  const a    = Object.assign(document.createElement('a'), {
    href: URL.createObjectURL(blob),
    download: `auditoria_${new Date().toISOString().slice(0,10)}.csv`,
  });
  a.click(); URL.revokeObjectURL(a.href);
}

// ─── Componentes base ─────────────────────────────────────────────────────────

function PermSelect({ value, onChange }) {
  const cur = PERMISSION_LEVELS.find(p => p.id === value) || PERMISSION_LEVELS[0];
  return (
    <select value={value} onChange={e => onChange(e.target.value)}
      className={`text-[11px] font-bold px-2 py-1 rounded-lg border-0 outline-none cursor-pointer ${cur.bg} ${cur.color}`}>
      {PERMISSION_LEVELS.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
    </select>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background:'rgba(0,0,0,.55)', backdropFilter:'blur(4px)' }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="font-black text-slate-800 text-base">{title}</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
            <X size={16} className="text-slate-500"/>
          </button>
        </div>
        <div className="overflow-y-auto flex-1 p-6">{children}</div>
      </div>
    </div>
  );
}

// ─── Pestaña: Auditoría ───────────────────────────────────────────────────────
// Solo muestra el log — la auditoría es automática desde App.jsx (no hay
// toggles ni botones de activación aquí).
function TabAuditoria({ logs }) {
  const [moduleFilter, setModuleFilter] = useState('ALL');
  const [alertFilter,  setAlertFilter]  = useState('ALL');
  const [search,       setSearch]       = useState('');

  const modules = useMemo(
    () => ['ALL', ...new Set(logs.map(l => l.module || 'Sistema').filter(Boolean))],
    [logs]
  );

  const filtered = useMemo(() => logs.filter(l => {
    const q = search.toLowerCase();
    const matchQ = !q ||
      l.event.toLowerCase().includes(q) ||
      l.user.toLowerCase().includes(q) ||
      (l.obj||'').toLowerCase().includes(q) ||
      (l.module||'').toLowerCase().includes(q);
    const matchM = moduleFilter === 'ALL' || (l.module||'Sistema') === moduleFilter;
    const matchA = alertFilter  === 'ALL' || (alertFilter==='alert' ? l.alert : !l.alert);
    return matchQ && matchM && matchA;
  }), [logs, moduleFilter, alertFilter, search]);

  const stats = useMemo(() => ({
    total:   logs.length,
    alerts:  logs.filter(l => l.alert).length,
    today:   logs.filter(l => l.date?.startsWith(new Date().toISOString().slice(0,10))).length,
    modules: new Set(logs.map(l => l.module||'Sistema')).size,
  }), [logs]);

  return (
    <div className="space-y-5">

      {/* ── Banner: auditoría siempre activa ── */}
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl border"
        style={{ background:'#f0fdf4', borderColor:'#bbf7d0' }}>
        <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0"/>
        <div>
          <span className="text-sm font-bold text-emerald-800">
            Auditoría automática activa — todas las operaciones quedan registradas en tiempo real.
          </span>
          <span className="text-xs text-emerald-600 block mt-0.5">
            Cifrado AES-256 · Anonimización · Trazabilidad completa por usuario y rol
          </span>
        </div>
        <div className="ml-auto flex items-center gap-1.5 flex-shrink-0">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"/>
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">En línea</span>
        </div>
      </div>

      {/* ── KPIs ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label:'Eventos totales',   value:stats.total,   cls:'text-slate-800',   icon:<History size={15}/>,        bg:'bg-slate-50'  },
          { label:'Alertas críticas',  value:stats.alerts,  cls:'text-red-600',     icon:<AlertTriangle size={15}/>,  bg:'bg-red-50'    },
          { label:'Eventos hoy',       value:stats.today,   cls:'text-blue-600',    icon:<Clock size={15}/>,          bg:'bg-blue-50'   },
          { label:'Módulos cubiertos', value:stats.modules, cls:'text-violet-600',  icon:<Activity size={15}/>,       bg:'bg-violet-50' },
        ].map(k => (
          <div key={k.label} className={`${k.bg} border border-slate-200 rounded-xl p-4`}>
            <div className="flex items-center gap-1.5 text-slate-400 mb-2">
              {k.icon}
              <p className="text-[10px] font-bold uppercase tracking-wide">{k.label}</p>
            </div>
            <p className={`text-3xl font-black ${k.cls}`}>{k.value}</p>
          </div>
        ))}
      </div>

      {/* ── Log de trazabilidad ── */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <h3 className="font-bold text-slate-700 text-xs uppercase tracking-widest flex items-center gap-2 flex-shrink-0">
            <History size={14}/> Log de trazabilidad
          </h3>
          <div className="flex flex-wrap gap-2 ml-auto">
            <input
              placeholder="Buscar evento, usuario, objeto..."
              value={search} onChange={e => setSearch(e.target.value)}
              className="border border-slate-200 rounded-lg px-3 py-1.5 text-xs outline-none focus:ring-1 focus:ring-blue-400 bg-white w-48"
            />
            <select value={moduleFilter} onChange={e => setModuleFilter(e.target.value)}
              className="border border-slate-200 rounded-lg px-2 py-1.5 text-xs outline-none bg-white focus:ring-1 focus:ring-blue-400">
              {modules.map(m => <option key={m} value={m}>{m==='ALL' ? 'Todos los módulos' : m}</option>)}
            </select>
            <select value={alertFilter} onChange={e => setAlertFilter(e.target.value)}
              className="border border-slate-200 rounded-lg px-2 py-1.5 text-xs outline-none bg-white focus:ring-1 focus:ring-blue-400">
              <option value="ALL">Todos</option>
              <option value="alert">Solo alertas</option>
              <option value="normal">Sin alertas</option>
            </select>
            <button onClick={() => exportCSV(filtered)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors">
              <Download size={12}/> CSV
            </button>
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
                <tr><td colSpan={8} className="px-4 py-8 text-center text-slate-400 text-xs">Sin registros para esta búsqueda.</td></tr>
              )}
              {filtered.map(log => {
                const modCls = MODULE_COLORS[log.module||'Sistema'] || MODULE_COLORS['Sistema'];
                return (
                  <tr key={log.id} className={`hover:bg-slate-50 transition-colors ${log.alert ? 'bg-red-50/40' : ''}`}>
                    <td className="px-4 py-3 font-mono text-[11px] text-slate-400">{log.id}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${modCls}`}>{log.module||'Sistema'}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-sm font-medium ${log.alert ? 'text-red-700' : 'text-slate-700'}`}>{log.event}</span>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-600 font-medium">{log.user}</td>
                    <td className="px-4 py-3 text-xs text-slate-400">{log.role||'—'}</td>
                    <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">{log.date}</td>
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

        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 text-[10px] text-slate-400 flex items-center justify-between">
          <span>{filtered.length} de {logs.length} registros</span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"/>
            Registro automático · Inmutable · Tiempo real
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Pestaña: Roles & Permisos ────────────────────────────────────────────────
function TabRoles({ roles, setRoles, onAudit }) {
  const [editingRole, setEditingRole] = useState(null);
  const [showNew,     setShowNew]     = useState(false);
  const emptyRole = { name:'', description:'', color:'#6366f1', permissions: Object.fromEntries(ALL_MODULES.map(m => [m.id, 'none'])) };
  const [newRole, setNewRole] = useState(emptyRole);

  const groupedModules = useMemo(() => {
    const g = {};
    ALL_MODULES.forEach(m => { if (!g[m.group]) g[m.group] = []; g[m.group].push(m); });
    return g;
  }, []);

  const handleSaveEdit = () => {
    setRoles(r => r.map(x => x.id === editingRole.id ? editingRole : x));
    onAudit(`Rol modificado: ${editingRole.name}`, editingRole.id);
    setEditingRole(null);
  };

  const handleCreateRole = () => {
    if (!newRole.name.trim()) return;
    const created = { ...newRole, id:'role_'+Date.now() };
    setRoles(r => [...r, created]);
    onAudit(`Rol creado: ${created.name}`, created.id);
    setShowNew(false);
    setNewRole(emptyRole);
  };

  const handleDeleteRole = (role) => {
    if (role.id === 'admin') return;
    setRoles(r => r.filter(x => x.id !== role.id));
    onAudit(`Rol eliminado: ${role.name}`, role.id, true);
  };

  const RolePermEditor = ({ role, setRole }) => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1">Nombre del rol *</label>
          <input value={role.name} onChange={e => setRole({...role, name:e.target.value})}
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400"/>
        </div>
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1">Color identificador</label>
          <div className="flex gap-2 items-center">
            <input type="color" value={role.color} onChange={e => setRole({...role, color:e.target.value})}
              className="w-10 h-9 rounded-lg border border-slate-200 cursor-pointer p-0.5"/>
            <span className="text-sm font-mono text-slate-400">{role.color}</span>
          </div>
        </div>
      </div>
      <div>
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1">Descripción</label>
        <input value={role.description} onChange={e => setRole({...role, description:e.target.value})}
          className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400"/>
      </div>
      <div>
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-2">Permisos por módulo</label>
        <div className="space-y-3">
          {Object.entries(groupedModules).map(([group, mods]) => (
            <div key={group}>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">{group}</p>
              <div className="grid grid-cols-1 gap-1">
                {mods.map(mod => (
                  <div key={mod.id} className="flex items-center justify-between bg-slate-50 rounded-lg px-3 py-2">
                    <span className="text-sm text-slate-700 font-medium">{mod.label}</span>
                    <PermSelect
                      value={role.permissions[mod.id] || 'none'}
                      onChange={v => setRole({...role, permissions:{...role.permissions, [mod.id]:v}})}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-slate-500">Configura los roles del sistema y sus permisos por módulo. Cada cambio queda auditado automáticamente.</p>
        <button onClick={() => { setNewRole(emptyRole); setShowNew(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 shadow">
          <Plus size={13}/> Nuevo rol
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {roles.map(role => (
          <div key={role.id} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ background:role.color }}/>
                <span className="font-black text-slate-800">{role.name}</span>
                {role.id === 'admin' && (
                  <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-violet-100 text-violet-700 uppercase">Protegido</span>
                )}
              </div>
              <div className="flex gap-1">
                <button onClick={() => setEditingRole({...role, permissions:{...role.permissions}})}
                  className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors" title="Editar">
                  <Edit2 size={13} className="text-slate-500"/>
                </button>
                {role.id !== 'admin' && (
                  <button onClick={() => handleDeleteRole(role)}
                    className="p-1.5 rounded-lg hover:bg-red-50 transition-colors" title="Eliminar">
                    <Trash2 size={13} className="text-red-400"/>
                  </button>
                )}
              </div>
            </div>
            <p className="text-xs text-slate-400 mb-3">{role.description}</p>
            <div className="flex flex-wrap gap-1">
              {ALL_MODULES
                .filter(m => role.permissions[m.id] && role.permissions[m.id] !== 'none')
                .map(m => {
                  const lv = PERMISSION_LEVELS.find(p => p.id === role.permissions[m.id]);
                  return (
                    <span key={m.id} className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${lv?.bg} ${lv?.color}`}>
                      {m.label}
                    </span>
                  );
                })
              }
            </div>
          </div>
        ))}
      </div>

      {editingRole && (
        <Modal title={`Editar rol: ${editingRole.name}`} onClose={() => setEditingRole(null)}>
          <RolePermEditor role={editingRole} setRole={setEditingRole}/>
          <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-slate-100">
            <button onClick={() => setEditingRole(null)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50">Cancelar</button>
            <button onClick={handleSaveEdit}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 shadow">
              <Save size={14}/> Guardar cambios
            </button>
          </div>
        </Modal>
      )}

      {showNew && (
        <Modal title="Crear nuevo rol" onClose={() => setShowNew(false)}>
          <RolePermEditor role={newRole} setRole={setNewRole}/>
          <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-slate-100">
            <button onClick={() => setShowNew(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50">Cancelar</button>
            <button onClick={handleCreateRole}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 shadow">
              <Plus size={14}/> Crear rol
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── Pestaña: Usuarios ────────────────────────────────────────────────────────
function TabUsuarios({ users, setUsers, roles, onAudit }) {
  const [showNew,     setShowNew]     = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showPwd,     setShowPwd]     = useState(false);

  const emptyForm = { name:'', email:'', roleId:roles[0]?.id||'agente', active:true, password:'' };
  const [form, setForm] = useState(emptyForm);

  const getRoleById = id => roles.find(r => r.id === id);

  const handleSave = () => {
    if (!form.name.trim() || !form.email.trim()) return;
    if (editingUser) {
      setUsers(u => u.map(x => x.id === editingUser.id ? {...x, ...form, lastLogin:x.lastLogin} : x));
      onAudit(`Usuario modificado: ${form.name}`, editingUser.id);
      setEditingUser(null);
    } else {
      const created = { ...form, id:'u'+Date.now(), avatar:initials(form.name), lastLogin:'Nunca' };
      setUsers(u => [...u, created]);
      onAudit(`Usuario creado: ${created.name} — Rol: ${getRoleById(created.roleId)?.name||created.roleId}`, created.id);
      setShowNew(false);
    }
    setForm(emptyForm);
  };

  const toggleActive = user => {
    const next = !user.active;
    setUsers(u => u.map(x => x.id === user.id ? {...x, active:next} : x));
    onAudit(`Usuario ${next?'activado':'desactivado'}: ${user.name}`, user.id, !next);
  };

  const handleDelete = user => {
    setUsers(u => u.filter(x => x.id !== user.id));
    onAudit(`Usuario eliminado: ${user.name}`, user.id, true);
  };

  const openEdit = user => {
    setForm({ name:user.name, email:user.email, roleId:user.roleId, active:user.active, password:'' });
    setEditingUser(user);
  };

  const UserForm = () => {
    const selectedRole = getRoleById(form.roleId);
    const withAccess   = ALL_MODULES.filter(m => selectedRole?.permissions[m.id] && selectedRole.permissions[m.id] !== 'none');
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1">Nombre completo *</label>
            <input value={form.name} onChange={e => setForm({...form, name:e.target.value})}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400" placeholder="Ej: Juan Pérez"/>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1">Correo electrónico *</label>
            <input type="email" value={form.email} onChange={e => setForm({...form, email:e.target.value})}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400" placeholder="usuario@empresa.pe"/>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1">Rol asignado</label>
            <select value={form.roleId} onChange={e => setForm({...form, roleId:e.target.value})}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400 bg-white">
              {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1">
              {editingUser ? 'Nueva contraseña (dejar vacío = sin cambio)' : 'Contraseña *'}
            </label>
            <div className="relative">
              <input type={showPwd?'text':'password'} value={form.password} onChange={e => setForm({...form, password:e.target.value})}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 pr-9 text-sm outline-none focus:ring-2 focus:ring-blue-400" placeholder="••••••••"/>
              <button type="button" onClick={() => setShowPwd(p=>!p)}
                className="absolute right-2 top-2 text-slate-400 hover:text-slate-600">
                {showPwd ? <EyeOff size={15}/> : <Eye size={15}/>}
              </button>
            </div>
          </div>
        </div>

        {/* Preview de accesos del rol seleccionado */}
        {selectedRole && (
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
              Accesos del rol <span style={{color:selectedRole.color}}>{selectedRole.name}</span>
            </p>
            <div className="flex flex-wrap gap-1">
              {withAccess.length === 0
                ? <span className="text-xs text-slate-400">Sin acceso a ningún módulo</span>
                : withAccess.map(m => {
                    const lv = PERMISSION_LEVELS.find(p => p.id === selectedRole.permissions[m.id]);
                    return (
                      <span key={m.id} className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${lv?.bg} ${lv?.color}`}>
                        {m.label}
                      </span>
                    );
                  })
              }
            </div>
          </div>
        )}

        <div className="flex items-center gap-2">
          <button type="button" onClick={() => setForm({...form, active:!form.active})}
            className={`w-10 h-5 rounded-full relative transition-colors ${form.active?'bg-emerald-500':'bg-slate-300'}`}>
            <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${form.active?'left-6':'left-1'}`}/>
          </button>
          <span className="text-sm text-slate-600 font-medium">
            Usuario {form.active ? 'activo' : 'inactivo'}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-slate-500">Gestiona los usuarios del sistema. Cada alta, baja y modificación queda auditada automáticamente.</p>
        <button onClick={() => { setForm(emptyForm); setEditingUser(null); setShowNew(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 shadow">
          <UserPlus size={13}/> Nuevo usuario
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              {['Usuario','Email','Rol','Estado','Último acceso','Acciones'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map(u => {
              const role = getRoleById(u.roleId);
              return (
                <tr key={u.id} className={`hover:bg-slate-50 transition-colors ${!u.active ? 'opacity-50' : ''}`}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black flex-shrink-0"
                        style={{ background:`${role?.color||'#94a3b8'}22`, color:role?.color||'#94a3b8' }}>
                        {u.avatar}
                      </div>
                      <span className="font-semibold text-slate-800">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500 font-mono">{u.email}</td>
                  <td className="px-4 py-3">
                    {role && (
                      <span className="text-[11px] font-bold px-2.5 py-1 rounded-full"
                        style={{ background:`${role.color}18`, color:role.color }}>
                        {role.name}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${u.active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                      {u.active ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-400">{u.lastLogin}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button onClick={() => openEdit(u)} title="Editar"
                        className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
                        <Edit2 size={13} className="text-slate-500"/>
                      </button>
                      <button onClick={() => toggleActive(u)} title={u.active?'Desactivar':'Activar'}
                        className={`p-1.5 rounded-lg transition-colors ${u.active?'hover:bg-amber-50':'hover:bg-emerald-50'}`}>
                        {u.active
                          ? <Lock   size={13} className="text-amber-500"/>
                          : <Unlock size={13} className="text-emerald-500"/>}
                      </button>
                      <button onClick={() => handleDelete(u)} title="Eliminar"
                        className="p-1.5 rounded-lg hover:bg-red-50 transition-colors">
                        <Trash2 size={13} className="text-red-400"/>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 text-[10px] text-slate-400">
          {users.filter(u=>u.active).length} activos · {users.filter(u=>!u.active).length} inactivos · {users.length} total
        </div>
      </div>

      {(showNew || editingUser) && (
        <Modal
          title={editingUser ? `Editar usuario: ${editingUser.name}` : 'Crear nuevo usuario'}
          onClose={() => { setShowNew(false); setEditingUser(null); }}
        >
          <UserForm/>
          <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-slate-100">
            <button onClick={() => { setShowNew(false); setEditingUser(null); }}
              className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50">Cancelar</button>
            <button onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 shadow">
              <Save size={14}/> {editingUser ? 'Guardar cambios' : 'Crear usuario'}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── COMPONENTE PRINCIPAL ─────────────────────────────────────────────────────
const SEC_TABS = [
  { id:'auditoria', label:'Auditoría & Trazabilidad', icon:<ShieldCheck size={14}/> },
  { id:'roles',     label:'Roles & Permisos',         icon:<Key size={14}/>         },
  { id:'usuarios',  label:'Usuarios',                 icon:<Users size={14}/>       },
];

export default function DatabaseSecurity({ logs, onAudit }) {
  const [tab,   setTab]   = useState('auditoria');
  const [roles, setRoles] = useState(INIT_ROLES);
  const [users, setUsers] = useState(INIT_USERS);

  // onAudit(event, objId, isAlert?) — viene de App.jsx y escribe al log global
  const audit = (event, obj, alert=false) =>
    onAudit && onAudit(event, obj, 'Seguridad', alert);

  return (
    <div className="space-y-5">

      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Seguridad del Sistema</h2>
        <p className="text-slate-500 text-sm">Gestión de usuarios, roles, permisos y trazabilidad automática de todas las operaciones.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 rounded-xl p-1 w-fit flex-wrap">
        {SEC_TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap
              ${tab===t.id ? 'bg-white text-slate-800 shadow' : 'text-slate-500 hover:text-slate-700'}`}>
            {t.icon}{t.label}
          </button>
        ))}
      </div>

      {/* Contenido */}
      {tab === 'auditoria' && <TabAuditoria logs={logs}/>}
      {tab === 'roles'     && <TabRoles     roles={roles} setRoles={setRoles} onAudit={audit}/>}
      {tab === 'usuarios'  && <TabUsuarios  users={users} setUsers={setUsers} roles={roles} onAudit={audit}/>}
    </div>
  );
}
