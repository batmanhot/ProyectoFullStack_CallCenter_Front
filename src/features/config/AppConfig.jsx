import { useState } from 'react';
import { Bell, Building2, Mail, MessageSquare, Phone, Save, Settings2, X } from 'lucide-react';

// ─── Default config structure ─────────────────────────────────────────────────
export const DEFAULT_CONFIG = {
  // Empresa
  company: {
    name:     'CallCenter B2B',
    tagline:  'Ecosistema Integral de Ventas Industriales',
    email:    'contacto@callcenter.pe',
    phone:    '+51 1 234-5678',
    address:  'Lima, Perú',
    currency: 'USD',
    locale:   'es-PE',
  },
  // Cotizaciones
  quotes: {
    validityDays:      30,
    defaultDiscount:   0,
    requireApproval:   true,
    approvalThreshold: 10000,   // monto mínimo que requiere aprobación de supervisor
    footerNote:        'Precios sujetos a variación. Validez según fecha indicada.',
  },
  // Contactos / Call Center
  contacts: {
    defaultChannel:   'telefono',
    autoFollowUp:     true,
    followUpDays:     3,        // días por defecto para follow-up automático
    maxDailyContacts: 40,
  },
  // Notificaciones
  notifications: {
    overdueFollowUpAlert: true,
    pendingQuoteAlert:    true,
    alertThresholdDays:   1,    // alertar follow-ups vencidos desde X días
  },
  // WhatsApp
  whatsapp: {
    defaultGreeting: 'Estimado/a cliente, le contactamos de ',
    defaultSignoff:  'Quedamos atentos. Gracias.',
    businessPhone:   '',
  },
};

// ─── Field component ──────────────────────────────────────────────────────────
function Field({ label, hint, children }) {
  return (
    <label className="block">
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">{label}</span>
      {children}
      {hint && <p className="text-[10px] text-slate-400 mt-1">{hint}</p>}
    </label>
  );
}

// ─── Section header ───────────────────────────────────────────────────────────
function Section({ icon, title, subtitle, children }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      <div className="flex items-center gap-3 px-6 py-4 bg-slate-50 border-b border-slate-100">
        <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
          {icon}
        </div>
        <div>
          <h3 className="font-bold text-slate-800 text-sm">{title}</h3>
          {subtitle && <p className="text-[11px] text-slate-400">{subtitle}</p>}
        </div>
      </div>
      <div className="p-6 space-y-4">{children}</div>
    </div>
  );
}

// ─── Toggle ───────────────────────────────────────────────────────────────────
function Toggle({ value, onChange, label }) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-sm font-medium text-slate-600">{label}</span>
      <button
        type="button"
        onClick={() => onChange(!value)}
        className={`w-10 h-5 rounded-full relative transition-colors ${value ? 'bg-blue-600' : 'bg-slate-300'}`}
      >
        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full shadow transition-all ${value ? 'left-6' : 'left-1'}`}/>
      </button>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function AppConfig({ config, onSave, onNotify }) {
  const [form, setForm] = useState({ ...DEFAULT_CONFIG, ...config });
  const [dirty, setDirty] = useState(false);

  const set = (section, field, value) => {
    setForm(cur => ({ ...cur, [section]: { ...cur[section], [field]: value } }));
    setDirty(true);
  };

  const handleSave = () => {
    onSave(form);
    setDirty(false);
    onNotify('success', 'Configuración guardada correctamente.');
  };

  const handleReset = () => {
    if (!window.confirm('¿Restaurar todos los valores a los predeterminados?')) return;
    setForm(DEFAULT_CONFIG);
    setDirty(true);
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Configuración del sistema</h2>
          <p className="text-slate-500 text-sm">
            Parámetros globales que se aplican en todos los módulos de la aplicación.
          </p>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-50 transition-colors">
            <X size={15}/> Restaurar defaults
          </button>
          <button type="button" onClick={handleSave} disabled={!dirty}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/20 disabled:opacity-40 disabled:cursor-not-allowed">
            <Save size={15}/> Guardar cambios
          </button>
        </div>
      </div>

      {dirty && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 flex items-center gap-2 text-sm text-amber-800">
          <Settings2 size={14} className="text-amber-600"/>
          <span>Tienes cambios sin guardar.</span>
        </div>
      )}

      {/* ── Empresa ── */}
      <Section icon={<Building2 size={16} className="text-blue-600"/>}
        title="Datos de la empresa"
        subtitle="Se usan en cotizaciones PDF, encabezados y comunicaciones">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Nombre de la empresa *">
            <input value={form.company.name} onChange={e=>set('company','name',e.target.value)}
              className="inp" placeholder="Ej: CallCenter B2B"/>
          </Field>
          <Field label="Eslogan / Descripción corta">
            <input value={form.company.tagline} onChange={e=>set('company','tagline',e.target.value)}
              className="inp" placeholder="Ej: Ecosistema Integral de Ventas"/>
          </Field>
          <Field label="Correo electrónico">
            <input type="email" value={form.company.email} onChange={e=>set('company','email',e.target.value)}
              className="inp" placeholder="contacto@empresa.com"/>
          </Field>
          <Field label="Teléfono principal">
            <input value={form.company.phone} onChange={e=>set('company','phone',e.target.value)}
              className="inp" placeholder="+51 1 234-5678"/>
          </Field>
          <Field label="Dirección / Ciudad">
            <input value={form.company.address} onChange={e=>set('company','address',e.target.value)}
              className="inp" placeholder="Lima, Perú"/>
          </Field>
          <Field label="Moneda">
            <select value={form.company.currency} onChange={e=>set('company','currency',e.target.value)} className="inp">
              <option value="USD">USD — Dólar americano</option>
              <option value="PEN">PEN — Sol peruano</option>
              <option value="EUR">EUR — Euro</option>
              <option value="CLP">CLP — Peso chileno</option>
              <option value="COP">COP — Peso colombiano</option>
            </select>
          </Field>
        </div>
      </Section>

      {/* ── Cotizaciones ── */}
      <Section icon={<Settings2 size={16} className="text-violet-600"/>}
        title="Cotizaciones B2B"
        subtitle="Parámetros aplicados al crear y gestionar propuestas comerciales">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Validez por defecto (días)"
            hint="Cuántos días es válida una cotización desde su emisión">
            <input type="number" min="1" max="365" value={form.quotes.validityDays}
              onChange={e=>set('quotes','validityDays',Number(e.target.value))} className="inp"/>
          </Field>
          <Field label="Descuento por defecto (%)"
            hint="Descuento pre-aplicado al crear una nueva cotización">
            <input type="number" min="0" max="100" value={form.quotes.defaultDiscount}
              onChange={e=>set('quotes','defaultDiscount',Number(e.target.value))} className="inp"/>
          </Field>
          <Field label="Monto mínimo para aprobación ($)"
            hint="Cotizaciones por encima de este monto requieren aprobación de supervisor">
            <input type="number" min="0" value={form.quotes.approvalThreshold}
              onChange={e=>set('quotes','approvalThreshold',Number(e.target.value))} className="inp"/>
          </Field>
          <div className="sm:col-span-2 space-y-2 pt-2">
            <Toggle value={form.quotes.requireApproval}
              onChange={v=>set('quotes','requireApproval',v)}
              label="Requerir aprobación de supervisor para cotizaciones"/>
          </div>
          <div className="sm:col-span-2">
            <Field label="Nota al pie en cotizaciones PDF"
              hint="Aparece al final de todas las cotizaciones generadas">
              <textarea rows={2} value={form.quotes.footerNote}
                onChange={e=>set('quotes','footerNote',e.target.value)}
                className="inp resize-none"/>
            </Field>
          </div>
        </div>
      </Section>

      {/* ── Contactos ── */}
      <Section icon={<Phone size={16} className="text-emerald-600"/>}
        title="Centro de Contactos"
        subtitle="Valores predeterminados para el registro de interacciones">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Canal por defecto">
            <select value={form.contacts.defaultChannel}
              onChange={e=>set('contacts','defaultChannel',e.target.value)} className="inp">
              <option value="telefono">Teléfono fijo</option>
              <option value="celular">Celular</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="facebook">Facebook/Messenger</option>
              <option value="email">Correo electrónico</option>
              <option value="presencial">Presencial/Visita</option>
            </select>
          </Field>
          <Field label="Días para follow-up automático"
            hint="Cuando el estado lo requiere, se crea un follow-up con este plazo">
            <input type="number" min="1" max="30" value={form.contacts.followUpDays}
              onChange={e=>set('contacts','followUpDays',Number(e.target.value))} className="inp"/>
          </Field>
          <Field label="Máximo contactos diarios por agente"
            hint="Referencia para el dashboard de productividad">
            <input type="number" min="1" max="200" value={form.contacts.maxDailyContacts}
              onChange={e=>set('contacts','maxDailyContacts',Number(e.target.value))} className="inp"/>
          </Field>
          <div className="sm:col-span-2 space-y-2 pt-2">
            <Toggle value={form.contacts.autoFollowUp}
              onChange={v=>set('contacts','autoFollowUp',v)}
              label="Generar follow-up automático cuando el estado lo requiera"/>
          </div>
        </div>
      </Section>

      {/* ── Notificaciones ── */}
      <Section icon={<Bell size={16} className="text-amber-600"/>}
        title="Notificaciones y alertas"
        subtitle="Controla cuándo y cómo se generan alertas en el sistema">
        <div className="space-y-3">
          <Toggle value={form.notifications.overdueFollowUpAlert}
            onChange={v=>set('notifications','overdueFollowUpAlert',v)}
            label="Mostrar alerta de follow-ups vencidos en el header"/>
          <Toggle value={form.notifications.pendingQuoteAlert}
            onChange={v=>set('notifications','pendingQuoteAlert',v)}
            label="Notificar cotizaciones pendientes de aprobación"/>
          <div className="pt-2">
            <Field label="Alertar follow-ups vencidos desde (días)"
              hint="0 = alertar el mismo día del vencimiento, 1 = un día después, etc.">
              <input type="number" min="0" max="7" value={form.notifications.alertThresholdDays}
                onChange={e=>set('notifications','alertThresholdDays',Number(e.target.value))}
                className="inp" style={{maxWidth:120}}/>
            </Field>
          </div>
        </div>
      </Section>

      {/* ── WhatsApp ── */}
      <Section icon={<MessageSquare size={16} className="text-green-600"/>}
        title="Mensajes de WhatsApp"
        subtitle="Plantillas para el envío automático de resúmenes y cotizaciones">
        <div className="grid grid-cols-1 gap-4">
          <Field label="Saludo inicial"
            hint="Se usa antes del contenido en mensajes automáticos de WhatsApp">
            <input value={form.whatsapp.defaultGreeting}
              onChange={e=>set('whatsapp','defaultGreeting',e.target.value)} className="inp"/>
          </Field>
          <Field label="Firma / Cierre">
            <input value={form.whatsapp.defaultSignoff}
              onChange={e=>set('whatsapp','defaultSignoff',e.target.value)} className="inp"/>
          </Field>
          <Field label="Número de WhatsApp Business"
            hint="Número completo con código de país. Ej: +51999000000">
            <input type="tel" value={form.whatsapp.businessPhone}
              onChange={e=>set('whatsapp','businessPhone',e.target.value)}
              className="inp" placeholder="+51 999 000 000"/>
          </Field>
        </div>
      </Section>

      {/* ── Correo ── */}
      <Section icon={<Mail size={16} className="text-violet-600"/>}
        title="Correo electrónico"
        subtitle="Información que aparece en los correos enviados desde cotizaciones">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Remitente (nombre visible)">
            <input value={form.company.name}
              onChange={e=>set('company','name',e.target.value)} className="inp"/>
          </Field>
          <Field label="Correo de respuesta">
            <input type="email" value={form.company.email}
              onChange={e=>set('company','email',e.target.value)} className="inp"/>
          </Field>
        </div>
      </Section>

      {/* Save bottom */}
      <div className="flex justify-end gap-3 pb-4">
        <button type="button" onClick={handleReset}
          className="px-5 py-2.5 border border-slate-200 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-50 transition-colors">
          Restaurar defaults
        </button>
        <button type="button" onClick={handleSave} disabled={!dirty}
          className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/20 disabled:opacity-40 disabled:cursor-not-allowed">
          <Save size={15}/> Guardar configuración
        </button>
      </div>
    </div>
  );
}
