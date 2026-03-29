import { useMemo, useState } from 'react';
import { Package, Pencil, Plus, Save, Search, Tag, Trash2, X } from 'lucide-react';

const CATEGORIES = ['Metales', 'Combustibles', 'Hidráulica', 'Eléctrico', 'Herramientas', 'Otro'];
const UNITS      = ['Tonelada', 'Saco 50kg', 'Unidad', 'Metro', 'Litro', 'Kg', 'Caja', 'Par'];

const EMPTY = { id: null, name: '', category: 'Metales', price: '', unit: 'Unidad', sku: '', description: '', active: true };

export default function ProductManager({ products, onSave, onDelete, onNotify }) {
  const [form,    setForm]    = useState(EMPTY);
  const [editing, setEditing] = useState(false);
  const [search,  setSearch]  = useState('');
  const [cat,     setCat]     = useState('ALL');

  const filtered = useMemo(() => products.filter(p => {
    const q = search.toLowerCase();
    const ms = p.name.toLowerCase().includes(q) || (p.sku||'').toLowerCase().includes(q) || (p.category||'').toLowerCase().includes(q);
    return ms && (cat === 'ALL' || p.category === cat);
  }), [products, search, cat]);

  const fc    = (f,v) => setForm(c => ({ ...c, [f]: v }));
  const reset = ()   => { setForm(EMPTY); setEditing(false); };

  const submit = e => {
    e.preventDefault();
    if (!form.name || !form.price || !form.unit) { onNotify('info','Completa nombre, precio y unidad.'); return; }
    onSave({ ...form, price: Number(form.price) });
    reset();
  };

  const stats = useMemo(() => ({
    total:  products.length,
    active: products.filter(p => p.active !== false).length,
    cats:   [...new Set(products.map(p => p.category).filter(Boolean))].length,
    avgPrice: products.length ? Math.round(products.reduce((s,p) => s + Number(p.price||0), 0) / products.length) : 0,
  }), [products]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Catálogo de Productos</h2>
          <p className="text-slate-500 text-sm">Registro de productos disponibles para cotizaciones B2B.</p>
        </div>
        <button type="button" onClick={reset}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/20">
          <Plus size={16}/> Nuevo producto
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label:'Total productos',   value:stats.total,            cls:'text-slate-800' },
          { label:'Activos',           value:stats.active,           cls:'text-emerald-600' },
          { label:'Categorías',        value:stats.cats,             cls:'text-blue-600' },
          { label:'Precio promedio',   value:`$${stats.avgPrice.toLocaleString()}`, cls:'text-amber-600' },
        ].map(k => (
          <div key={k.label} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
            <p className={`text-2xl font-black ${k.cls}`}>{k.value}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mt-0.5">{k.label}</p>
          </div>
        ))}
      </div>

      {/* Form */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <Package size={16} className="text-blue-600"/> {editing ? 'Editar producto' : 'Nuevo producto'}
          </h3>
          {editing && <button type="button" onClick={reset} className="text-xs font-bold text-slate-400 hover:text-slate-600 flex items-center gap-1"><X size={13}/> Cancelar</button>}
        </div>
        <form onSubmit={submit}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Nombre del producto *</label>
              <input value={form.name} onChange={e=>fc('name',e.target.value)} placeholder="Ej: Planchas de Metal A4 — Grado Industrial"
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"/>
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">SKU / Código</label>
              <input value={form.sku||''} onChange={e=>fc('sku',e.target.value)} placeholder="PROD-001"
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"/>
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Categoría</label>
              <select value={form.category} onChange={e=>fc('category',e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500">
                {CATEGORIES.map(c=><option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Precio unitario ($) *</label>
              <input type="number" min="0" step="0.01" value={form.price} onChange={e=>fc('price',e.target.value)} placeholder="0.00"
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"/>
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Unidad de medida *</label>
              <select value={form.unit} onChange={e=>fc('unit',e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500">
                {UNITS.map(u=><option key={u}>{u}</option>)}
              </select>
            </div>
            <div className="lg:col-span-3">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Descripción</label>
              <textarea rows={2} value={form.description||''} onChange={e=>fc('description',e.target.value)}
                placeholder="Especificaciones técnicas, aplicaciones, características relevantes..."
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none"/>
            </div>
          </div>
          <div className="flex items-center gap-4 mt-5">
            <button type="submit" className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all">
              <Save size={15}/> {editing ? 'Actualizar producto' : 'Guardar producto'}
            </button>
            {editing && <button type="button" onClick={reset} className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-50">Cancelar</button>}
            <label className="flex items-center gap-2 ml-auto cursor-pointer">
              <input type="checkbox" checked={form.active !== false} onChange={e=>fc('active',e.target.checked)} className="w-4 h-4 rounded accent-blue-600"/>
              <span className="text-xs font-bold text-slate-500">Producto activo</span>
            </label>
          </div>
        </form>
      </div>

      {/* Filters + table */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
            <input placeholder="Buscar producto, SKU, categoría..." value={search} onChange={e=>setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white"/>
          </div>
          <select value={cat} onChange={e=>setCat(e.target.value)} className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none bg-white focus:ring-2 focus:ring-blue-500">
            <option value="ALL">Todas las categorías</option>
            {CATEGORIES.map(c=><option key={c}>{c}</option>)}
          </select>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-5 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-wider">Producto</th>
                <th className="px-5 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-wider hidden md:table-cell">Categoría</th>
                <th className="px-5 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-wider hidden lg:table-cell">SKU</th>
                <th className="px-5 py-3 text-right text-[10px] font-black text-slate-400 uppercase tracking-wider">Precio</th>
                <th className="px-5 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-wider hidden md:table-cell">Unidad</th>
                <th className="px-5 py-3 text-center text-[10px] font-black text-slate-400 uppercase tracking-wider">Estado</th>
                <th className="px-5 py-3 text-right text-[10px] font-black text-slate-400 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="px-5 py-10 text-center text-slate-400 text-sm">No se encontraron productos.</td></tr>
              )}
              {filtered.map(p => (
                <tr key={p.id} className={`hover:bg-slate-50 transition-colors ${p.active===false ? 'opacity-50' : ''}`}>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
                        <Package size={14} className="text-amber-600"/>
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">{p.name}</p>
                        {p.description && <p className="text-[11px] text-slate-400 truncate max-w-xs">{p.description}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell">
                    <span className="flex items-center gap-1 text-xs text-slate-600"><Tag size={11}/> {p.category||'—'}</span>
                  </td>
                  <td className="px-5 py-4 hidden lg:table-cell font-mono text-xs text-slate-400">{p.sku||'—'}</td>
                  <td className="px-5 py-4 text-right font-black text-slate-800">${Number(p.price).toLocaleString()}</td>
                  <td className="px-5 py-4 hidden md:table-cell text-xs text-slate-500">{p.unit}</td>
                  <td className="px-5 py-4 text-center">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${p.active!==false?'bg-emerald-100 text-emerald-700':'bg-slate-100 text-slate-500'}`}>
                      {p.active!==false?'Activo':'Inactivo'}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <button type="button" onClick={()=>{ setForm({...EMPTY,...p,price:String(p.price)}); setEditing(true); window.scrollTo({top:0,behavior:'smooth'}); }}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Pencil size={14}/>
                      </button>
                      <button type="button" onClick={()=>onDelete(p.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors">
                        <Trash2 size={14}/>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
