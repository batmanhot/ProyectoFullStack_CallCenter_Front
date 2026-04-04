import { useMemo, useState } from 'react';
import {
  Building2, Mail, Pencil, Phone, Plus,
  Save, Search, Trash2, UserCircle2, Users, X,
} from 'lucide-react';

// ─── Constants ───────────────────────────────────────────────────────────────
const STATUS_META = {
  Prospeccion: { cls: 'bg-blue-100 text-blue-800 border-blue-200',    dot: 'bg-blue-500'    },
  Contacto:    { cls: 'bg-purple-100 text-purple-800 border-purple-200', dot: 'bg-purple-500' },
  Cotizacion:  { cls: 'bg-amber-100 text-amber-800 border-amber-200',  dot: 'bg-amber-500'   },
  Negociacion: { cls: 'bg-teal-100 text-teal-800 border-teal-200',    dot: 'bg-teal-500'    },
  Cliente:     { cls: 'bg-green-100 text-green-800 border-green-200',  dot: 'bg-green-500'   },
  Inactivo:    { cls: 'bg-slate-100 text-slate-500 border-slate-200',  dot: 'bg-slate-400'   },
};
const SECTORS  = ['Mineria', 'Fabrica', 'Metalurgica', 'Industrial', 'Logistica', 'Otro'];
const STATUSES = ['Prospeccion', 'Contacto', 'Cotizacion', 'Negociacion', 'Cliente', 'Inactivo'];
const EMPTY_C  = { id: null, name: '', sector: '', contact: '', phone: '', email: '', position: '', status: 'Prospeccion', contacts: [] };
const EMPTY_CT = { id: null, name: '', position: '', phone: '', email: '' };

// ─── Client Form Modal ────────────────────────────────────────────────────────
function ClientFormModal({ form, editing, onClose, onSubmit, onChange }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop — sin onClick intencional: el modal solo se cierra con Cancelar o la X */}
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center">
              <Building2 size={18} className="text-blue-600" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900">
                {editing ? 'Editar empresa' : 'Nueva empresa B2B'}
              </h2>
              <p className="text-xs text-slate-400">
                {editing ? 'Modifica los datos del cliente' : 'Registra una nueva empresa en tu cartera'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form body */}
        <form onSubmit={onSubmit} className="p-6 space-y-6">

          {/* Sección: Datos de la empresa */}
          <section>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.18em] mb-4">
              Datos de la empresa
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <Field label="Razón social / Nombre de la empresa *">
                  <input
                    value={form.name}
                    onChange={e => onChange('name', e.target.value)}
                    placeholder="Ej: Minera del Norte S.A."
                    className="inp"
                  />
                </Field>
              </div>
              <Field label="Sector industrial *">
                <select
                  value={form.sector}
                  onChange={e => onChange('sector', e.target.value)}
                  className="inp"
                >
                  <option value="">Seleccionar sector...</option>
                  {SECTORS.map(s => <option key={s}>{s}</option>)}
                </select>
              </Field>
              <Field label="Etapa comercial">
                <select
                  value={form.status}
                  onChange={e => onChange('status', e.target.value)}
                  className="inp"
                >
                  {STATUSES.map(s => <option key={s}>{s}</option>)}
                </select>
              </Field>
            </div>
          </section>

          <div className="border-t border-slate-100" />

          {/* Sección: Contacto principal */}
          <section>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.18em] mb-4">
              Contacto principal
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Nombre completo *">
                <input
                  value={form.contact}
                  onChange={e => onChange('contact', e.target.value)}
                  placeholder="Ej: Juan Pérez"
                  className="inp"
                />
              </Field>
              <Field label="Cargo / Posición">
                <input
                  value={form.position || ''}
                  onChange={e => onChange('position', e.target.value)}
                  placeholder="Ej: Gerente de Compras"
                  className="inp"
                />
              </Field>
              <Field label="Teléfono *">
                <input
                  type="tel"
                  value={form.phone}
                  onChange={e => onChange('phone', e.target.value)}
                  placeholder="Ej: +51 999 000 000"
                  className="inp"
                />
              </Field>
              <Field label="Correo electrónico">
                <input
                  type="email"
                  value={form.email || ''}
                  onChange={e => onChange('email', e.target.value)}
                  placeholder="Ej: juan@empresa.com"
                  className="inp"
                />
              </Field>
            </div>
          </section>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 border border-slate-200 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/20"
            >
              <Save size={15} />
              {editing ? 'Guardar cambios' : 'Registrar empresa'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Contacts Drawer ─────────────────────────────────────────────────────────
function ContactsDrawer({ drawer, showCtForm, ctForm, onClose, onAddContact, onRemoveContact, onToggleCtForm, onChangeCtForm }) {
  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full max-w-md shadow-2xl flex flex-col"
           style={{ animation: 'slideInRight .2s ease' }}>
        <style>{`@keyframes slideInRight{from{transform:translateX(20px);opacity:0}to{transform:translateX(0);opacity:1}}`}</style>

        {/* Header */}
        <div className="p-5 border-b border-slate-100 bg-slate-50">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700 font-black text-sm">
                {drawer.name.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h3 className="font-bold text-slate-800">{drawer.name}</h3>
                <p className="text-xs text-slate-400">{drawer.sector} · {drawer.status}</p>
              </div>
            </div>
            <button type="button" onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700">
              <X size={18} />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs text-slate-500">
            <span className="flex items-center gap-1.5"><Phone size={11} className="text-slate-400" /> {drawer.phone || '—'}</span>
            <span className="flex items-center gap-1.5"><Mail size={11} className="text-slate-400" /> {drawer.email || '—'}</span>
            <span className="flex items-center gap-1.5"><UserCircle2 size={11} className="text-slate-400" /> {drawer.contact || '—'}</span>
            <span className="flex items-center gap-1.5"><Building2 size={11} className="text-slate-400" /> {drawer.position || '—'}</span>
          </div>
        </div>

        {/* Contacts list */}
        <div className="flex-1 overflow-y-auto p-5">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
              Contactos de la empresa
            </h4>
            <button
              type="button"
              onClick={onToggleCtForm}
              className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800"
            >
              <Plus size={12} /> Agregar contacto
            </button>
          </div>

          {showCtForm && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-4 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                {[
                  ['name',     'Nombre *'],
                  ['position', 'Cargo'],
                  ['phone',    'Teléfono *'],
                  ['email',    'Email'],
                ].map(([f, ph]) => (
                  <input
                    key={f}
                    placeholder={ph}
                    value={ctForm[f]}
                    onChange={e => onChangeCtForm(f, e.target.value)}
                    className="border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:ring-1 focus:ring-blue-400 bg-white"
                  />
                ))}
              </div>
              <div className="flex gap-2 pt-1">
                <button type="button" onClick={onAddContact}
                  className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700">
                  Guardar
                </button>
                <button type="button" onClick={() => onToggleCtForm(false)}
                  className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-500">
                  Cancelar
                </button>
              </div>
            </div>
          )}

          <div className="space-y-2">
            {(drawer.contacts || []).length === 0 && (
              <p className="text-center text-slate-400 text-xs py-8">Sin contactos registrados.</p>
            )}
            {(drawer.contacts || []).map(ct => (
              <div key={ct.id}
                className="bg-white border border-slate-200 rounded-xl p-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 text-xs font-bold flex-shrink-0">
                    {ct.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">{ct.name}</p>
                    {ct.position && <p className="text-[10px] text-slate-400">{ct.position}</p>}
                    <div className="flex gap-3 mt-0.5">
                      {ct.phone && (
                        <span className="text-[10px] text-slate-500 flex items-center gap-1">
                          <Phone size={9} /> {ct.phone}
                        </span>
                      )}
                      {ct.email && (
                        <span className="text-[10px] text-slate-500 flex items-center gap-1">
                          <Mail size={9} /> {ct.email}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm(`¿Eliminar el contacto "${ct.name}"?`))
                      onRemoveContact(drawer.id, ct.id);
                  }}
                  className="text-slate-300 hover:text-rose-400 transition-colors flex-shrink-0"
                  title="Eliminar contacto"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function CRMView({ clients, onSaveClient, onDeleteClient, onNotify }) {
  const [search,      setSearch]      = useState('');
  const [sector,      setSector]      = useState('ALL');
  const [status,      setStatus]      = useState('ALL');
  const [form,        setForm]        = useState(EMPTY_C);
  const [editing,     setEditing]     = useState(false);
  const [showModal,   setShowModal]   = useState(false);   // ← controls the form modal
  const [drawer,      setDrawer]      = useState(null);
  const [ctForm,      setCtForm]      = useState(EMPTY_CT);
  const [showCtForm,  setShowCtForm]  = useState(false);

  // ── Filtered list ──
  const filtered = useMemo(() => clients.filter(c => {
    const q = search.toLowerCase();
    const ms =
      c.name.toLowerCase().includes(q) ||
      (c.contact || '').toLowerCase().includes(q) ||
      (c.email || '').toLowerCase().includes(q) ||
      c.sector.toLowerCase().includes(q);
    return ms && (sector === 'ALL' || c.sector === sector) && (status === 'ALL' || c.status === status);
  }), [clients, search, sector, status]);

  const sectors = useMemo(() => [...new Set(clients.map(c => c.sector).filter(Boolean))], [clients]);

  // ── KPIs ──
  const kpis = useMemo(() => ({
    total:   clients.length,
    active:  clients.filter(c => c.status !== 'Inactivo').length,
    clients: clients.filter(c => c.status === 'Cliente').length,
    prosp:   clients.filter(c => c.status === 'Prospeccion').length,
  }), [clients]);

  // ── Form handlers ──
  const onChange = (f, v) => setForm(c => ({ ...c, [f]: v }));

  const openNew = () => {
    setForm(EMPTY_C);
    setEditing(false);
    setShowModal(true);
  };

  const openEdit = client => {
    setForm({ ...EMPTY_C, ...client, contacts: client.contacts || [] });
    setEditing(true);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setForm(EMPTY_C);
    setEditing(false);
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!form.name || !form.sector || !form.contact || !form.phone) {
      onNotify('info', 'Completa nombre, sector, contacto y teléfono.');
      return;
    }
    const primary = {
      id: 101,
      name: form.contact,
      position: form.position || '',
      phone: form.phone,
      email: form.email || '',
    };
    const others = (form.contacts || []).filter(c => c.name !== form.contact);
    onSaveClient({ ...form, contacts: [primary, ...others] });
    closeModal();
  };

  // ── Contacts drawer handlers ──
  const openDrawer  = client => { setDrawer(client); setShowCtForm(false); setCtForm(EMPTY_CT); };
  const closeDrawer = ()     => { setDrawer(null); setShowCtForm(false); };

  const addContact = () => {
    if (!drawer || !ctForm.name || !ctForm.phone) { onNotify('info', 'Completa nombre y teléfono.'); return; }
    const updated = { ...drawer, contacts: [...(drawer.contacts || []), { ...ctForm, id: Date.now() }] };
    onSaveClient(updated);
    setDrawer(updated);
    setCtForm(EMPTY_CT);
    setShowCtForm(false);
    onNotify('success', 'Contacto agregado.');
  };

  const removeContact = (clientId, contactId) => {
    const c = clients.find(x => x.id === clientId);
    if (!c) return;
    const upd = { ...c, contacts: (c.contacts || []).filter(x => x.id !== contactId) };
    onSaveClient(upd);
    setDrawer(upd);
    onNotify('success', 'Contacto eliminado.');
  };

  // ──────────────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">

      {/* Page header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Gestión de Clientes B2B</h2>
          <p className="text-slate-500 text-sm">Cartera de empresas, contactos clave y etapa comercial.</p>
        </div>
        <button
          type="button"
          onClick={openNew}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/20"
        >
          <Plus size={16} /> Nueva empresa
        </button>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total empresas',   value: kpis.total,   cls: 'text-slate-800'   },
          { label: 'Activas',          value: kpis.active,  cls: 'text-blue-600'    },
          { label: 'Clientes activos', value: kpis.clients, cls: 'text-emerald-600' },
          { label: 'En prospección',   value: kpis.prosp,   cls: 'text-amber-600'   },
        ].map(k => (
          <div key={k.label} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
            <p className={`text-2xl font-black ${k.cls}`}>{k.value}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mt-0.5">{k.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            placeholder="Buscar empresa, contacto, email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
        </div>
        <select value={sector} onChange={e => setSector(e.target.value)}
          className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none bg-white focus:ring-2 focus:ring-blue-500">
          <option value="ALL">Todos los sectores</option>
          {sectors.map(s => <option key={s}>{s}</option>)}
        </select>
        <select value={status} onChange={e => setStatus(e.target.value)}
          className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none bg-white focus:ring-2 focus:ring-blue-500">
          <option value="ALL">Todas las etapas</option>
          {STATUSES.map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      {/* Table — no form here */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-5 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-wider">Empresa</th>
              <th className="px-5 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-wider hidden md:table-cell">Contacto principal</th>
              <th className="px-5 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-wider hidden lg:table-cell">Teléfono / Email</th>
              <th className="px-5 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-wider">Etapa</th>
              <th className="px-5 py-3 text-right text-[10px] font-black text-slate-400 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-12 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <Building2 size={32} className="text-slate-300" />
                    <p className="text-slate-400 font-medium text-sm">No se encontraron empresas.</p>
                    <button type="button" onClick={openNew}
                      className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800">
                      <Plus size={13} /> Registrar primera empresa
                    </button>
                  </div>
                </td>
              </tr>
            )}
            {filtered.map(client => {
              const sm       = STATUS_META[client.status] || STATUS_META.Inactivo;
              const ctCount  = (client.contacts || []).length;
              return (
                <tr key={client.id} className="hover:bg-slate-50 transition-colors">

                  {/* Company */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-700 font-black text-xs flex-shrink-0">
                        {client.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">{client.name}</p>
                        <p className="text-[11px] text-slate-400">{client.sector}</p>
                      </div>
                    </div>
                  </td>

                  {/* Contact */}
                  <td className="px-5 py-4 hidden md:table-cell">
                    <p className="font-medium text-slate-700">{client.contact}</p>
                    {client.position && <p className="text-[11px] text-slate-400">{client.position}</p>}
                  </td>

                  {/* Phone / Email */}
                  <td className="px-5 py-4 hidden lg:table-cell">
                    <p className="text-slate-600 text-xs flex items-center gap-1">
                      <Phone size={11} /> {client.phone}
                    </p>
                    {client.email && (
                      <p className="text-slate-400 text-[11px] flex items-center gap-1 mt-0.5">
                        <Mail size={10} /> {client.email}
                      </p>
                    )}
                  </td>

                  {/* Stage badge */}
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold border ${sm.cls}`}>
                      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${sm.dot}`} />
                      {client.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1">
                      {/* Contacts drawer */}
                      <button
                        type="button"
                        onClick={() => openDrawer(client)}
                        className="flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                        title="Ver / gestionar contactos"
                      >
                        <Users size={11} /> {ctCount}
                      </button>
                      {/* Edit — opens modal */}
                      <button
                        type="button"
                        onClick={() => openEdit(client)}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Editar empresa"
                      >
                        <Pencil size={14} />
                      </button>
                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(`¿Eliminar la empresa "${client.name}"?\nSe eliminarán también sus cotizaciones asociadas. Esta acción no se puede deshacer.`))
                            onDeleteClient(client.id);
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Eliminar empresa"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ── Modal: New / Edit company form ── */}
      {showModal && (
        <ClientFormModal
          form={form}
          editing={editing}
          onClose={closeModal}
          onSubmit={handleSubmit}
          onChange={onChange}
        />
      )}

      {/* ── Drawer: Contacts ── */}
      {drawer && (
        <ContactsDrawer
          drawer={drawer}
          showCtForm={showCtForm}
          ctForm={ctForm}
          onClose={closeDrawer}
          onAddContact={addContact}
          onRemoveContact={removeContact}
          onToggleCtForm={v => setShowCtForm(typeof v === 'boolean' ? v : prev => !prev)}
          onChangeCtForm={(f, v) => setCtForm(c => ({ ...c, [f]: v }))}
        />
      )}
    </div>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function Field({ label, children }) {
  return (
    <label className="block">
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
        {label}
      </span>
      {children}
    </label>
  );
}
