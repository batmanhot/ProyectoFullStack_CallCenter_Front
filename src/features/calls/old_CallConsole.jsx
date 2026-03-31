import { useEffect, useMemo, useState } from 'react';
import { Bell, CheckCircle2, Clock, MessageSquare, Phone, PhoneOff, Save, TrendingUp } from 'lucide-react';

const DISPOSITIONS = [
  { value: 'CONTACTO_EFECTIVO',  label: 'Contacto Efectivo — Interesado',      followUp: false },
  { value: 'SOLICITA_COTIZACION', label: 'Solicita Cotización Técnica',         followUp: false },
  { value: 'VOLVER_A_LLAMAR',    label: 'Volver a Llamar (Follow-up)',          followUp: true  },
  { value: 'DATOS_ERRONEOS',     label: 'Datos Erróneos / Empresa Inexistente', followUp: false },
  { value: 'NO_CONTESTA',        label: 'No Contesta / Buzón',                 followUp: true  },
];

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}

export default function CallConsole({ activeCall, onHangUp, onSave, callHistory = [] }) {
  const [timer, setTimer]             = useState(0);
  const [disposition, setDisposition] = useState('');
  const [notes, setNotes]             = useState('');
  const [scheduleFollowUp, setScheduleFollowUp] = useState(false);
  const [followUpDate, setFollowUpDate]         = useState('');

  useEffect(() => {
    const interval = setInterval(() => setTimer(t => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const clientHistory = useMemo(
    () => callHistory.filter(c => c.companyName === activeCall.companyName).slice(0, 5),
    [callHistory, activeCall.companyName]
  );

  const handleSave = () => {
    if (!disposition) return;
    onSave({
      duration:          timer,
      disposition,
      notes,
      companyName:       activeCall.companyName,
      contactName:       activeCall.contactName,
      phoneNumber:       activeCall.phoneNumber,
      timestamp:         new Date().toISOString(),
      scheduleFollowUp:  scheduleFollowUp && followUpDate ? { date: followUpDate, clientName: activeCall.companyName } : null,
    });
  };

  return (
    <div className="fixed bottom-6 right-6 w-[420px] bg-slate-900 text-white rounded-2xl shadow-2xl border border-slate-700 overflow-hidden z-50"
         style={{ animation: 'slideUp .25s ease' }}>
      <style>{`@keyframes slideUp{from{transform:translateY(20px);opacity:0}to{transform:translateY(0);opacity:1}}`}</style>

      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-slate-800 to-slate-900 flex items-center justify-between border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center animate-pulse">
            <Phone size={18} />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Llamada en curso</p>
            <p className="font-bold text-blue-100 leading-tight">{activeCall.contactName}</p>
            <p className="text-[11px] text-slate-400">{activeCall.companyName}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-mono font-bold text-emerald-400">{formatTime(timer)}</div>
          <p className="text-[10px] text-slate-500">{activeCall.phoneNumber}</p>
        </div>
      </div>

      <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">

        {/* Historial de llamadas del cliente */}
        {clientHistory.length > 0 && (
          <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/50">
            <p className="text-[10px] text-slate-400 uppercase font-bold mb-2 flex items-center gap-1">
              <Clock size={10} /> Historial — {activeCall.companyName}
            </p>
            <div className="space-y-1.5">
              {clientHistory.map((c, i) => (
                <div key={i} className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">{c.timestamp?.slice(0, 10)}</span>
                  <span className={`px-2 py-0.5 rounded font-bold ${
                    c.disposition === 'CONTACTO_EFECTIVO' ? 'bg-emerald-900/50 text-emerald-400' :
                    c.disposition === 'NO_CONTESTA' ? 'bg-slate-700 text-slate-400' :
                    'bg-blue-900/50 text-blue-400'
                  }`}>{c.disposition?.replace(/_/g,' ')}</span>
                  <span className="text-slate-500 font-mono">{formatTime(c.duration || 0)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tipificación */}
        <div>
          <label className="text-[10px] text-slate-400 font-bold mb-2 block uppercase">Tipificación de llamada</label>
          <div className="space-y-1.5">
            {DISPOSITIONS.map(d => (
              <button key={d.value} type="button" onClick={() => {
                setDisposition(d.value);
                setScheduleFollowUp(d.followUp);
              }}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-all border ${
                  disposition === d.value
                    ? 'bg-blue-600 border-blue-500 text-white'
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                }`}>
                {d.label}
                {d.followUp && <span className="ml-2 text-[10px] bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded font-bold">+ Follow-up</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Follow-up automático */}
        {scheduleFollowUp && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3">
            <p className="text-[10px] text-amber-400 font-bold uppercase mb-2 flex items-center gap-1">
              <Bell size={10} /> Programar follow-up automático
            </p>
            <input type="date" value={followUpDate} onChange={e => setFollowUpDate(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:ring-1 focus:ring-amber-500" />
          </div>
        )}

        {/* Notas */}
        <div>
          <label className="text-[10px] text-slate-400 font-bold mb-2 block uppercase">Notas y seguimiento</label>
          <textarea rows={3} value={notes} onChange={e => setNotes(e.target.value)}
            placeholder="Detalles sobre productos industriales requeridos, volumen, plazos..."
            className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
        </div>

        {/* Acciones */}
        <div className="grid grid-cols-2 gap-3">
          <button type="button" onClick={onHangUp}
            className="flex items-center justify-center gap-2 py-3 bg-rose-600/10 text-rose-400 hover:bg-rose-600 hover:text-white rounded-xl font-bold text-sm transition-all border border-rose-600/20">
            <PhoneOff size={16} /> Finalizar
          </button>
          <button type="button" onClick={handleSave} disabled={!disposition}
            className="flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-xl font-bold text-sm transition-all">
            <Save size={16} /> Guardar
          </button>
        </div>

        {disposition === 'SOLICITA_COTIZACION' && (
          <button type="button" onClick={() => { handleSave(); }}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-emerald-600/15 text-emerald-400 hover:bg-emerald-600/25 rounded-xl font-bold text-xs transition-all border border-emerald-600/20 uppercase tracking-wide">
            <TrendingUp size={13} /> Crear oportunidad desde esta llamada
          </button>
        )}

        <button type="button"
          className="w-full flex items-center justify-center gap-2 py-2 bg-slate-800/60 text-slate-400 hover:bg-slate-700 rounded-xl font-bold text-xs transition-all border border-slate-700/50 uppercase tracking-wide">
          <MessageSquare size={13} /> Enviar resumen por WhatsApp
        </button>
      </div>
    </div>
  );
}
