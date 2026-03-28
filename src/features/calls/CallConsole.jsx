import { useEffect, useState } from 'react';
import { MessageSquare, PhoneOff, Save } from 'lucide-react';

export default function CallConsole({ activeCall, onHangUp, onSave }) {
  const [timer, setTimer] = useState(0);
  const [disposition, setDisposition] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    const interval = setInterval(() => setTimer((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleSave = () => {
    if (!disposition) return alert('Debe seleccionar una tipificacion antes de guardar.');
    onSave({ duration: timer, disposition, notes });
  };

  return (
    <div className="fixed bottom-6 right-6 w-96 bg-slate-900 text-white rounded-2xl shadow-2xl border border-slate-700 overflow-hidden z-50 animate-in slide-in-from-bottom-4">
      <div className="p-4 bg-slate-800 flex items-center justify-between border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center animate-pulse">
              <PhoneOff size={20} className="rotate-135" />
            </div>
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase font-bold tracking-widest">Llamada en curso</p>
            <p className="font-bold text-blue-100">{activeCall.contactName}</p>
          </div>
        </div>
        <div className="text-2xl font-mono font-bold text-emerald-400">{formatTime(timer)}</div>
      </div>

      <div className="p-5 space-y-4">
        <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
          <p className="text-[10px] text-slate-500 uppercase font-bold">Empresa Cliente</p>
          <p className="text-sm font-medium text-slate-200">{activeCall.companyName}</p>
        </div>

        <div>
          <label className="text-xs text-slate-400 font-bold mb-2 block uppercase">Tipificacion de Llamada</label>
          <select
            value={disposition}
            onChange={(e) => setDisposition(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Seleccionar resultado...</option>
            <option value="CONTACTO_EFECTIVO">Contacto Efectivo (Interesado)</option>
            <option value="SOLICITA_COTIZACION">Solicita Cotizacion Tecnica</option>
            <option value="VOLVER_A_LLAMAR">Volver a llamar (Follow-up)</option>
            <option value="DATOS_ERRONEOS">Datos Erroneos / Empresa Inexistente</option>
            <option value="NO_CONTESTA">No contesta / Buzon</option>
          </select>
        </div>

        <div>
          <label className="text-xs text-slate-400 font-bold mb-2 block uppercase">Notas y Seguimiento</label>
          <textarea
            rows="3"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Detalles sobre productos industriales requeridos..."
            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          ></textarea>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={onHangUp}
            className="flex items-center justify-center gap-2 py-3 bg-rose-600/10 text-rose-500 hover:bg-rose-600 hover:text-white rounded-xl font-bold text-sm transition-all border border-rose-600/20"
          >
            <PhoneOff size={18} /> Finalizar
          </button>
          <button
            onClick={handleSave}
            className="flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-900/20"
          >
            <Save size={18} /> Guardar Registro
          </button>
        </div>

        <button className="w-full flex items-center justify-center gap-2 py-2 bg-emerald-600/10 text-emerald-500 hover:bg-emerald-600/20 rounded-lg font-bold text-xs transition-all border border-emerald-600/20 uppercase tracking-wide">
          <MessageSquare size={14} /> Enviar Resumen via WhatsApp
        </button>
      </div>
    </div>
  );
}