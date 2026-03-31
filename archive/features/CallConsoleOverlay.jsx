// src/features/callConsole/CallConsoleOverlay.jsx
import React, { useState, useEffect } from 'react';
import { PhoneOff, Save, WhatsApp } from 'lucide-react';

const tipificaciones = [
  'Interesado', 
  'Enviar Cotización', 
  'Datos Incorrectos', 
  'No Contesta', 
  'Llamar más tarde'
];

export const CallConsoleOverlay = ({ currentCall, onClose }) => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="fixed bottom-6 right-6 w-96 bg-slate-900 text-white rounded-2xl shadow-2xl p-6 border-2 border-slate-700 z-50">
      <div className="flex items-center justify-between mb-4 border-b border-slate-700 pb-4">
        <div>
          <h4 className="font-bold text-lg">{currentCall.contactName}</h4>
          <p className="text-slate-400 text-xs font-mono">{currentCall.phoneNumber}</p>
        </div>
        <div className="bg-red-600 px-3 py-1 rounded-full text-xl font-bold font-mono text-center">
          {formatTime(seconds)}
        </div>
      </div>

      <p className="text-slate-300 text-sm mb-4">Empresa: <span className='text-white font-medium'>{currentCall.companyName}</span></p>

      <label className="text-xs text-slate-400 font-medium mb-1.5 block">Tipificar Llamada</label>
      <select className="w-full p-2.5 rounded-lg bg-slate-800 text-white text-sm border border-slate-700 mb-4 focus:ring-1 focus:ring-blue-500 outline-none">
        <option value="">Seleccione tipificación...</option>
        {tipificaciones.map(t => <option key={t} value={t}>{t}</option>)}
      </select>

      <textarea 
        placeholder="Notas de la llamada B2B..." 
        rows={3}
        className="w-full p-2.5 rounded-lg bg-slate-800 text-white text-sm border border-slate-700 mb-4 focus:ring-1 focus:ring-blue-500 outline-none resize-none"
      />

      <div className="grid grid-cols-2 gap-3">
        <button 
          onClick={onClose}
          className="flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2.5 rounded-lg font-semibold transition">
          <PhoneOff className="h-4 w-4" /> Colgar
        </button>
        <button className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-lg font-semibold transition">
          <Save className="h-4 w-4" /> Guardar Nota
        </button>
        <button className="col-span-2 flex items-center justify-center gap-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 px-4 py-2.5 rounded-lg font-semibold transition border border-green-500/30">
          <WhatsApp className="h-4 w-4" /> Enviar Mensaje (WhatsApp)
        </button>
      </div>
    </div>
  );
};