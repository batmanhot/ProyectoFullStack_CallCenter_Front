import { History, Key, ShieldAlert } from 'lucide-react';

export default function DatabaseSecurity({ encryptionActive, logs, onToggleEncryption, onRunAudit }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Seguridad y Proteccion de Datos</h2>
        <p className="text-slate-500 text-sm">Control institucional de accesos, cifrado y trazabilidad operativa.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400"><ShieldAlert size={24} /></div>
              <h3 className="font-bold">Estado del Sistema</h3>
            </div>
            <div className="space-y-4">
              <button type="button" onClick={onToggleEncryption} className="w-full flex justify-between items-center p-3 bg-slate-800 rounded-xl text-left">
                <span className="text-xs font-medium">Cifrado de Datos (AES-256)</span>
                <div className={`w-10 h-5 rounded-full relative transition-colors ${encryptionActive ? 'bg-emerald-500' : 'bg-slate-600'}`}>
                  <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${encryptionActive ? 'left-6' : 'left-1'}`}></div>
                </div>
              </button>
              <div className="flex justify-between items-center p-3 bg-slate-800 rounded-xl">
                <span className="text-xs font-medium">Anonimizacion de Contactos</span>
                <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-1 rounded font-bold">ACTIVO</span>
              </div>
            </div>
            <button type="button" onClick={onRunAudit} className="w-full mt-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl text-xs font-black uppercase tracking-widest transition-all">
              Ejecutar Auditoria de Seguridad
            </button>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2 text-sm"><Key size={16} className="text-amber-500" /> Control de Roles</h4>
            <div className="space-y-3">
              <RoleStatus role="Administrador" users={2} access="Total" />
              <RoleStatus role="Supervisor" users={5} access="Aprobaciones" />
              <RoleStatus role="Agente" users={24} access="Solo Lectura" />
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden h-full">
            <div className="p-4 border-b border-slate-100 bg-slate-50">
              <h3 className="font-bold text-slate-700 text-xs uppercase tracking-widest flex items-center gap-2"><History size={16} /> Registro de Trazabilidad</h3>
            </div>
            <table className="w-full text-left text-sm">
              <thead className="text-[10px] text-slate-400 uppercase bg-slate-50">
                <tr>
                  <th className="px-6 py-3 font-black">Evento</th>
                  <th className="px-6 py-3 font-black">Usuario</th>
                  <th className="px-6 py-3 font-black">Fecha/Hora</th>
                  <th className="px-6 py-3 font-black text-right">ID Objeto</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {logs.map((log) => <AuditRow key={log.id} event={log.event} user={log.user} date={log.date} obj={log.obj} alert={log.alert} />)}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function RoleStatus({ role, users, access }) {
  return (
    <div className="flex justify-between items-center p-2 hover:bg-slate-50 rounded-lg transition-colors">
      <div>
        <p className="text-xs font-bold text-slate-700">{role}</p>
        <p className="text-[10px] text-slate-400">{users} usuarios asignados</p>
      </div>
      <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">{access}</span>
    </div>
  );
}

function AuditRow({ event, user, date, obj, alert }) {
  return (
    <tr className="hover:bg-slate-50">
      <td className="px-6 py-4 flex items-center gap-2">
        {alert ? <ShieldAlert size={14} className="text-rose-500" /> : null}
        <span className={alert ? 'font-bold text-rose-600' : 'font-medium'}>{event}</span>
      </td>
      <td className="px-6 py-4 text-slate-500 font-mono text-xs">{user}</td>
      <td className="px-6 py-4 text-slate-500 text-xs">{date}</td>
      <td className="px-6 py-4 text-right text-slate-400 font-mono text-xs">{obj}</td>
    </tr>
  );
}