import { useMemo, useState } from 'react';
import { Building2, Mail, Pencil, PhoneForwarded, Plus, Save, Search, Trash2, UserCircle2, X } from 'lucide-react';

const EMPTY_CLIENT = {
  id: null,
  name: '',
  sector: '',
  contact: '',
  phone: '',
  status: 'Prospeccion',
};

export default function CRMView({ clients, onSaveClient, onDeleteClient, onNotify }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [form, setForm] = useState(EMPTY_CLIENT);
  const [isEditing, setIsEditing] = useState(false);

  const filteredClients = useMemo(
    () =>
      clients.filter(
        (client) =>
          client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          client.sector.toLowerCase().includes(searchTerm.toLowerCase()) ||
          client.contact.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    [clients, searchTerm],
  );

  const handleChange = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const resetForm = () => {
    setForm(EMPTY_CLIENT);
    setIsEditing(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!form.name || !form.sector || !form.contact || !form.phone) {
      onNotify('info', 'Completa nombre, sector, contacto y telefono antes de guardar.');
      return;
    }
    onSaveClient(form);
    resetForm();
  };

  const handleEdit = (client) => {
    setForm(client);
    setIsEditing(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Gestion de Clientes Clave</h2>
          <p className="text-slate-500 text-sm">Administra clientes, contactos principales y su etapa comercial.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[360px,1fr] gap-6 items-start">
        <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-4 sticky top-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-lg">{isEditing ? 'Editar cliente' : 'Nuevo cliente'}</h3>
            {isEditing ? (
              <button type="button" onClick={resetForm} className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1">
                <X size={14} /> Cancelar
              </button>
            ) : null}
          </div>

          <Field label="Empresa">
            <input className="input" value={form.name} onChange={(event) => handleChange('name', event.target.value)} placeholder="Ej. Minera del Norte" />
          </Field>
          <Field label="Sector">
            <input className="input" value={form.sector} onChange={(event) => handleChange('sector', event.target.value)} placeholder="Mineria, metalurgica, fabrica..." />
          </Field>
          <Field label="Contacto principal">
            <input className="input" value={form.contact} onChange={(event) => handleChange('contact', event.target.value)} placeholder="Nombre del decisor" />
          </Field>
          <Field label="Telefono">
            <input className="input" value={form.phone} onChange={(event) => handleChange('phone', event.target.value)} placeholder="555-0101" />
          </Field>
          <Field label="Estado comercial">
            <select className="input" value={form.status} onChange={(event) => handleChange('status', event.target.value)}>
              <option value="Prospeccion">Prospeccion</option>
              <option value="Cotizacion">Cotizacion</option>
              <option value="Cliente">Cliente</option>
            </select>
          </Field>

          <div className="flex gap-3 pt-2">
            <button type="submit" className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold text-sm">
              <Save size={16} /> {isEditing ? 'Actualizar' : 'Guardar'}
            </button>
            <button type="button" onClick={resetForm} className="px-4 py-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50">
              <Plus size={16} />
            </button>
          </div>
        </form>

        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-4 flex flex-col md:flex-row md:items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                className="pl-10 pr-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-sm w-full"
                placeholder="Buscar empresa, sector o contacto..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">{filteredClients.length} registros</div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {filteredClients.map((client) => (
              <div key={client.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="p-5 border-b border-slate-100 flex items-start justify-between bg-slate-50/50">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                      <Building2 size={22} />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-slate-800">{client.name}</h3>
                      <p className="text-xs font-medium text-slate-500">Sector: {client.sector}</p>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    client.status === 'Prospeccion' ? 'bg-purple-100 text-purple-700' : client.status === 'Cliente' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {client.status}
                  </span>
                </div>

                <div className="p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-slate-700">
                      <UserCircle2 size={20} className="text-slate-400" />
                      <div>
                        <p className="text-sm font-semibold">{client.contact}</p>
                        <p className="text-xs text-slate-500 font-mono">{client.phone}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => onNotify('info', `Llamada iniciada con ${client.contact}.`)} className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors shadow-sm border border-emerald-100">
                        <PhoneForwarded size={18} />
                      </button>
                      <button type="button" onClick={() => onNotify('info', `Correo preparado para ${client.contact}.`)} className="p-2 bg-slate-50 text-slate-600 rounded-lg hover:bg-slate-100 transition-colors border border-slate-200">
                        <Mail size={18} />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100">
                    <button type="button" onClick={() => handleEdit(client)} className="py-2 text-xs font-bold text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center justify-center gap-2">
                      <Pencil size={14} /> Editar
                    </button>
                    <button type="button" onClick={() => onNotify('info', `Historial comercial de ${client.name} abierto.`)} className="py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
                      Historial
                    </button>
                    <button type="button" onClick={() => onDeleteClient(client.id)} className="py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors flex items-center justify-center gap-2">
                      <Trash2 size={14} /> Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="text-xs font-bold text-slate-500 uppercase mb-2 block">{label}</span>
      {children}
    </label>
  );
}