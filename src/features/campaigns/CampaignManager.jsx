import { useMemo, useState } from 'react';
import { BarChart, Calendar, Pencil, Play, Plus, Save, Target, Trash2, Users, X, Pause } from 'lucide-react';

const EMPTY_CAMPAIGN = {
  id: '',
  name: '',
  product: '',
  status: 'Activa',
  progress: 0,
  goal: 0,
  currentVentas: 0,
  agents: 1,
  startDate: '',
};

export default function CampaignManager({ campaigns, products, onSaveCampaign, onToggleCampaign, onDeleteCampaign }) {
  const [selectedCampaign, setSelectedCampaign] = useState(campaigns[0] || null);
  const [form, setForm] = useState(EMPTY_CAMPAIGN);
  const [isEditing, setIsEditing] = useState(false);

  const totals = useMemo(() => ({
    active: campaigns.filter((campaign) => campaign.status === 'Activa').length,
    goal: campaigns.reduce((sum, campaign) => sum + Number(campaign.goal || 0), 0),
    sales: campaigns.reduce((sum, campaign) => sum + Number(campaign.currentVentas || 0), 0),
  }), [campaigns]);

  const handleChange = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const resetForm = () => {
    setForm(EMPTY_CAMPAIGN);
    setIsEditing(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!form.name || !form.product || !form.startDate) {
      return;
    }
    onSaveCampaign({
      ...form,
      progress: Number(form.progress),
      goal: Number(form.goal),
      currentVentas: Number(form.currentVentas),
      agents: Number(form.agents),
    });
    resetForm();
  };

  const handleEdit = (campaign) => {
    setForm(campaign);
    setIsEditing(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Planificacion de Campanas</h2>
          <p className="text-slate-500 text-sm">Crea, edita y monitorea campanas con objetivo, avance y asignacion.</p>
        </div>
        <div className="flex gap-3 text-xs font-bold text-slate-500 uppercase tracking-wide flex-wrap">
          <div className="bg-white border border-slate-200 rounded-xl px-4 py-3">Activas: <span className="text-slate-900">{totals.active}</span></div>
          <div className="bg-white border border-slate-200 rounded-xl px-4 py-3">Meta total: <span className="text-slate-900">${totals.goal.toLocaleString()}</span></div>
          <div className="bg-white border border-slate-200 rounded-xl px-4 py-3">Venta actual: <span className="text-slate-900">${totals.sales.toLocaleString()}</span></div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[380px,1fr] gap-6 items-start">
        <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4 sticky top-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-800">{isEditing ? 'Editar campana' : 'Nueva campana'}</h3>
            {isEditing ? <button type="button" onClick={resetForm} className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1"><X size={14} /> Cancelar</button> : null}
          </div>
          <Field label="Nombre"><input className="input" value={form.name} onChange={(event) => handleChange('name', event.target.value)} placeholder="Campana industrial" /></Field>
          <Field label="Producto"><select className="input" value={form.product} onChange={(event) => handleChange('product', event.target.value)}><option value="">Selecciona un producto</option>{products.map((product) => <option key={product.id} value={product.name}>{product.name}</option>)}</select></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Fecha inicio"><input type="date" className="input" value={form.startDate} onChange={(event) => handleChange('startDate', event.target.value)} /></Field>
            <Field label="Estado"><select className="input" value={form.status} onChange={(event) => handleChange('status', event.target.value)}><option value="Activa">Activa</option><option value="Pausada">Pausada</option></select></Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Meta"><input type="number" className="input" value={form.goal} onChange={(event) => handleChange('goal', event.target.value)} /></Field>
            <Field label="Ventas"><input type="number" className="input" value={form.currentVentas} onChange={(event) => handleChange('currentVentas', event.target.value)} /></Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Avance (%)"><input type="number" min="0" max="100" className="input" value={form.progress} onChange={(event) => handleChange('progress', event.target.value)} /></Field>
            <Field label="Agentes"><input type="number" min="1" className="input" value={form.agents} onChange={(event) => handleChange('agents', event.target.value)} /></Field>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold text-sm"><Save size={16} /> {isEditing ? 'Actualizar' : 'Guardar'}</button>
            <button type="button" onClick={resetForm} className="px-4 py-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50"><Plus size={16} /></button>
          </div>
        </form>

        <div className="space-y-4">
          {campaigns.map((camp) => (
            <div key={camp.id} className={`bg-white border rounded-2xl p-6 shadow-sm transition-all ${selectedCampaign?.id === camp.id ? 'border-blue-300' : 'border-slate-200'}`}>
              <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                <div className="flex gap-4">
                  <div className={`p-3 rounded-xl ${camp.status === 'Activa' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                    <Target size={24} />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="font-bold text-lg text-slate-800">{camp.name}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${camp.status === 'Activa' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>{camp.status}</span>
                    </div>
                    <p className="text-sm text-slate-500 flex items-center gap-2 mt-1"><Calendar size={14} /> Inicio: {camp.startDate} <span className="font-semibold text-blue-600">{camp.product}</span></p>
                  </div>
                </div>

                <div className="flex gap-2 flex-wrap">
                  <button type="button" onClick={() => onToggleCampaign(camp.id)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors">{camp.status === 'Activa' ? <Pause size={20} /> : <Play size={20} />}</button>
                  <button type="button" onClick={() => handleEdit(camp)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"><Pencil size={20} /></button>
                  <button type="button" onClick={() => onDeleteCampaign(camp.id)} className="p-2 hover:bg-rose-50 rounded-lg text-rose-500 transition-colors"><Trash2 size={20} /></button>
                  <button type="button" onClick={() => setSelectedCampaign(camp)} className="px-3 py-2 rounded-lg text-xs font-bold border border-slate-200 hover:bg-slate-50">Ver detalle</button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <span>Progreso</span>
                    <span>{camp.progress}%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full ${camp.status === 'Activa' ? 'bg-blue-600' : 'bg-slate-400'}`} style={{ width: `${camp.progress}%` }}></div>
                  </div>
                </div>
                <Metric icon={<BarChart size={20} />} label="Ventas" value={`$${Number(camp.currentVentas).toLocaleString()}`} />
                <Metric icon={<Users size={20} />} label="Agentes" value={`${camp.agents} operadores`} />
                <Metric icon={<Calendar size={20} />} label="Meta" value={`$${Number(camp.goal).toLocaleString()}`} />
              </div>
            </div>
          ))}

          {selectedCampaign ? (
            <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-lg">
              <h4 className="font-bold text-lg mb-2">Detalle operativo</h4>
              <p className="text-slate-300 text-sm mb-4">{selectedCampaign.name}</p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-slate-800 rounded-xl p-4"><p className="text-slate-400 text-xs uppercase mb-1">Producto</p><p className="font-bold">{selectedCampaign.product}</p></div>
                <div className="bg-slate-800 rounded-xl p-4"><p className="text-slate-400 text-xs uppercase mb-1">Estado</p><p className="font-bold">{selectedCampaign.status}</p></div>
                <div className="bg-slate-800 rounded-xl p-4"><p className="text-slate-400 text-xs uppercase mb-1">Meta</p><p className="font-bold">${Number(selectedCampaign.goal).toLocaleString()}</p></div>
                <div className="bg-slate-800 rounded-xl p-4"><p className="text-slate-400 text-xs uppercase mb-1">Avance</p><p className="font-bold">{selectedCampaign.progress}%</p></div>
              </div>
            </div>
          ) : null}
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

function Metric({ icon, label, value }) {
  return (
    <div className="flex items-center gap-3 border-l border-slate-100 pl-6">
      <div className="text-slate-400">{icon}</div>
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase">{label}</p>
        <p className="text-sm font-bold text-slate-800">{value}</p>
      </div>
    </div>
  );
}