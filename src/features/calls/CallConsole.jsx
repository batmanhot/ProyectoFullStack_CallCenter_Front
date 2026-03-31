import { useState } from 'react';
import {
  Bell, Building2, CheckCircle2, Mail,
  MessageSquare, Phone, Save, Users2, X,
} from 'lucide-react';

// ─── Canales ──────────────────────────────────────────────────────────────────
const CHANNELS = [
  { id: 'telefono',   label: 'Teléfono',  icon: <Phone       size={13} className="text-blue-400"    /> },
  { id: 'celular',    label: 'Celular',   icon: <Phone       size={13} className="text-emerald-400" /> },
  { id: 'whatsapp',   label: 'WhatsApp',  icon: <MessageSquare size={13} className="text-green-400" /> },
  { id: 'facebook',   label: 'Facebook',  icon: <Users2      size={13} className="text-blue-400"    /> },
  { id: 'email',      label: 'Email',     icon: <Mail        size={13} className="text-violet-400"  /> },
  { id: 'presencial', label: 'Visita',    icon: <Building2   size={13} className="text-amber-400"   /> },
];

// ─── Tipificación rápida ──────────────────────────────────────────────────────
const QUICK_TYPES = [
  { id: 'interesado',     label: 'Contacto Efectivo — Interesado',      followUp: false, accent: '#10b981' },
  { id: 'solicita_cot',   label: 'Solicita Cotización Técnica',          followUp: false, accent: '#3b82f6' },
  { id: 'volver_llamar',  label: 'Volver a Llamar (Follow-up)',          followUp: true,  accent: '#f59e0b' },
  { id: 'en_evaluacion',  label: 'En Evaluación Interna',               followUp: true,  accent: '#8b5cf6' },
  { id: 'datos_erroneos', label: 'Datos Erróneos / Empresa Inexistente', followUp: false, accent: '#6b7280' },
  { id: 'no_contesta',    label: 'No Contesta / Buzón',                 followUp: true,  accent: '#6b7280' },
  { id: 'no_interesa',    label: 'No Le Interesa',                      followUp: false, accent: '#ef4444' },
  { id: 'cerrado',        label: 'Venta Cerrada ✓',                     followUp: false, accent: '#059669' },
];

// ─── Component ────────────────────────────────────────────────────────────────
export default function CallConsole({ activeCall, callHistory = [], onHangUp, onSave }) {
  // Pre-fill from activeCall context (launched from a row or fresh)
  const [clientName,   setClientName]   = useState(activeCall?.companyName  || '');
  const [contactName,  setContactName]  = useState(activeCall?.contactName  || '');
  const [phone,        setPhone]        = useState(activeCall?.phoneNumber   || '');
  const [channel,      setChannel]      = useState(activeCall?.channel       || 'telefono');
  const [disposition,  setDisposition]  = useState('');
  const [notes,        setNotes]        = useState('');
  const [followUpDate, setFollowUpDate] = useState('');
  const [duration,     setDuration]     = useState('');

  const selectedType  = QUICK_TYPES.find(t => t.id === disposition);
  const needsFollowUp = selectedType?.followUp && !followUpDate;
  const canSave       = clientName.trim() && disposition && !needsFollowUp;

  // Last 3 interactions with this client
  const clientHistory = callHistory
    .filter(c =>
      (clientName && c.clientName?.toLowerCase() === clientName.toLowerCase()) ||
      (activeCall?.clientId && c.clientId === activeCall.clientId)
    )
    .slice(0, 3);

  const handleSave = () => {
    if (!canSave) return;
    onSave({
      clientId:    activeCall?.clientId || '',
      clientName,
      contactName,
      phone,
      channel,
      disposition,
      notes,
      followUpDate,
      duration,
      date:  new Date().toISOString().slice(0, 10),
      time:  new Date().toTimeString().slice(0, 5),
      agent: activeCall?.agentName || '',
    });
    onHangUp(); // cierra inmediatamente tras guardar
  };

  const handleWhatsApp = () => {
    if (!canSave) return;
    const num = phone.replace(/\D/g, '');
    const msg = encodeURIComponent(
      `Estimado/a ${contactName || clientName}, le contactamos de CallCenter B2B.\n` +
      (notes ? `\n${notes}\n` : '') +
      `\nQuedamos atentos. Gracias.`
    );
    window.open(`https://wa.me/${num}?text=${msg}`, '_blank');
    handleSave();
  };

  return (
    // Panel lateral derecho — no ocupa toda la pantalla
    <div
      className="fixed top-0 right-0 bottom-0 z-50 w-[400px] flex flex-col overflow-hidden shadow-2xl"
      style={{ background: '#0f172a', borderLeft: '1px solid rgba(255,255,255,0.08)' }}
    >
      {/* ── Header ── */}
      <div className="flex items-center justify-between px-5 py-4 flex-shrink-0"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div>
          <p className="font-black text-white text-sm">Registrar contacto</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Completa los datos y selecciona el resultado</p>
        </div>
        <button type="button" onClick={onHangUp}
          className="p-2 rounded-xl bg-white/10 text-slate-400 hover:text-white transition-colors">
          <X size={16} />
        </button>
      </div>

      {/* ── Scrollable body ── */}
      <div className="flex-1 overflow-y-auto">

        {/* Datos del contacto */}
        <div className="px-5 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3">
            Datos del contacto
          </p>
          <div className="space-y-2.5">
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Empresa *
              </label>
              <input
                type="text"
                value={clientName}
                onChange={e => setClientName(e.target.value)}
                placeholder="Nombre de la empresa..."
                className="w-full rounded-xl px-3 py-2 text-sm outline-none placeholder:text-slate-600"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#f1f5f9' }}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Contacto / Persona
                </label>
                <input
                  type="text"
                  value={contactName}
                  onChange={e => setContactName(e.target.value)}
                  placeholder="Nombre..."
                  className="w-full rounded-xl px-3 py-2 text-sm outline-none placeholder:text-slate-600"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#f1f5f9' }}
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Teléfono / Cuenta
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+51 999..."
                  className="w-full rounded-xl px-3 py-2 text-sm outline-none placeholder:text-slate-600 font-mono"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#f1f5f9' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Canal */}
        <div className="px-5 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2.5">Canal</p>
          <div className="grid grid-cols-3 gap-1.5">
            {CHANNELS.map(ch => (
              <button key={ch.id} type="button" onClick={() => setChannel(ch.id)}
                className="flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-xs font-semibold transition-all"
                style={{
                  background: channel === ch.id ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.04)',
                  border: channel === ch.id ? '1px solid rgba(255,255,255,0.25)' : '1px solid rgba(255,255,255,0.07)',
                  color: channel === ch.id ? '#f1f5f9' : '#64748b',
                }}>
                {ch.icon} {ch.label}
              </button>
            ))}
          </div>
        </div>

        {/* Historial del cliente */}
        {clientHistory.length > 0 && (
          <div className="px-5 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">
              Historial — {clientName}
            </p>
            <div className="space-y-1.5">
              {clientHistory.map((c, i) => (
                <div key={i} className="flex items-center gap-2 text-[11px]">
                  <span className="text-slate-600 font-mono flex-shrink-0 w-20">{c.date}</span>
                  <span className="flex-1 truncate font-bold px-2 py-0.5 rounded text-[10px] text-center"
                    style={{
                      background: c.disposition === 'solicita_cot' ? '#1d4ed820' :
                                  c.disposition === 'interesado'    ? '#05966920' :
                                  c.disposition === 'cerrado'       ? '#05966930' : '#1e293b',
                      color:      c.disposition === 'solicita_cot' ? '#93c5fd' :
                                  c.disposition === 'interesado'    ? '#6ee7b7' :
                                  c.disposition === 'cerrado'       ? '#6ee7b7' : '#94a3b8',
                    }}>
                    {QUICK_TYPES.find(t => t.id === c.disposition)?.label?.toUpperCase() ||
                     c.disposition?.replace(/_/g, ' ').toUpperCase()}
                  </span>
                  <span className="text-slate-600 font-mono flex-shrink-0">{c.duration ? `${c.duration}m` : ''}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tipificación */}
        <div className="px-5 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2.5">
            Tipificación de llamada
          </p>
          <div className="space-y-1.5">
            {QUICK_TYPES.map(t => {
              const isSelected = disposition === t.id;
              return (
                <button key={t.id} type="button"
                  onClick={() => { setDisposition(t.id); if (!t.followUp) setFollowUpDate(''); }}
                  className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-left transition-all"
                  style={{
                    background: isSelected ? `${t.accent}25` : 'rgba(255,255,255,0.04)',
                    border:     isSelected ? `1px solid ${t.accent}60` : '1px solid rgba(255,255,255,0.07)',
                    color:      isSelected ? '#f1f5f9' : '#94a3b8',
                  }}>
                  <div className="flex items-center gap-2.5">
                    {isSelected
                      ? <CheckCircle2 size={14} style={{ color: t.accent, flexShrink: 0 }} />
                      : <span className="w-3.5 h-3.5 rounded-full border flex-shrink-0"
                          style={{ borderColor: 'rgba(255,255,255,0.15)' }} />
                    }
                    <span className="text-[13px] font-semibold">{t.label}</span>
                  </div>
                  {t.followUp && (
                    <span className="text-[9px] font-black px-1.5 py-0.5 rounded flex-shrink-0"
                      style={{ background: '#f59e0b20', color: '#fbbf24', border: '1px solid #f59e0b30' }}>
                      + Follow-up
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Follow-up date */}
          {selectedType?.followUp && (
            <div className="mt-3 flex items-center gap-2">
              <Bell size={12} className="text-amber-400 flex-shrink-0" />
              <label className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Agendar para</label>
              <input type="date" value={followUpDate} onChange={e => setFollowUpDate(e.target.value)}
                className="flex-1 text-xs rounded-lg px-2 py-1.5 outline-none font-mono"
                style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.15)', color: '#f1f5f9' }} />
            </div>
          )}
        </div>

        {/* Notas + duración */}
        <div className="px-5 py-4">
          <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">
            Notas y seguimiento
          </p>
          <textarea rows={3} value={notes} onChange={e => setNotes(e.target.value)}
            placeholder="Detalles sobre productos industriales requeridos, volumen, plazos..."
            className="w-full text-sm rounded-xl px-3 py-2.5 outline-none resize-none placeholder:text-slate-600 mb-2.5"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#e2e8f0' }} />
          <div className="flex items-center gap-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex-shrink-0">
              Duración (min)
            </label>
            <input type="number" min="0" value={duration} onChange={e => setDuration(e.target.value)}
              placeholder="0"
              className="w-20 text-sm rounded-lg px-2 py-1.5 outline-none font-mono text-center"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#f1f5f9' }} />
          </div>
        </div>
      </div>

      {/* ── Footer actions — fijos al fondo ── */}
      <div className="flex-shrink-0 px-5 py-4 space-y-2"
        style={{ borderTop: '1px solid rgba(255,255,255,0.08)', background: '#0f172a' }}>

        <div className="grid grid-cols-2 gap-2">
          {/* Cancelar — solo cierra */}
          <button type="button" onClick={onHangUp}
            className="flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all"
            style={{ background: '#7f1d1d40', border: '1px solid #ef444440', color: '#fca5a5' }}>
            <X size={15} /> Cancelar
          </button>
          {/* Guardar — graba y cierra */}
          <button type="button" onClick={handleSave} disabled={!canSave}
            className="flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: canSave ? '#1e40af' : '#1e293b', color: 'white' }}>
            <Save size={15} /> Guardar
          </button>
        </div>

        {/* Enviar por WhatsApp */}
        <button type="button" onClick={handleWhatsApp} disabled={!canSave}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8' }}>
          <MessageSquare size={15} /> Enviar resumen por WhatsApp
        </button>
      </div>
    </div>
  );
}
