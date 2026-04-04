import { useMemo, useState } from 'react';
import { Package, Pencil, Plus, Save, Search, Tag, Trash2, X } from 'lucide-react';

// ─── Constants ────────────────────────────────────────────────────────────────
const CATEGORIES = ['Metales', 'Combustibles', 'Hidráulica', 'Eléctrico', 'Herramientas', 'Otro'];
const UNITS      = ['Tonelada', 'Saco 50kg', 'Unidad', 'Metro', 'Litro', 'Kg', 'Caja', 'Par'];
const EMPTY      = { id: null, name: '', category: 'Metales', price: '', unit: 'Unidad', sku: '', description: '', active: true };

// ─── Form Modal ───────────────────────────────────────────────────────────────
function ProductFormModal({ form, editing, onClose, onSubmit, onChange }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop — sin onClick: el modal solo cierra con X o Cancelar */}
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-amber-50 rounded-xl flex items-center justify-center">
              <Package size={18} className="text-amber-600" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900">
                {editing ? 'Editar producto' : 'Nuevo producto'}
              </h2>
              <p className="text-xs text-slate-400">
                {editing ? 'Modifica los datos del producto' : 'Registra un nuevo producto en el catálogo'}
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

        {/* Body */}
        <form onSubmit={onSubmit} className="p-6 space-y-6">

          {/* Sección: Identificación */}
          <section>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.18em] mb-4">
              Identificación del producto
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <Field label="Nombre del producto *">
                  <input
                    value={form.name}
                    onChange={e => onChange('name', e.target.value)}
                    placeholder="Ej: Planchas de Metal A4 — Grado Industrial"
                    className="inp"
                  />
                </Field>
              </div>
              <Field label="SKU / Código">
                <input
                  value={form.sku || ''}
                  onChange={e => onChange('sku', e.target.value)}
                  placeholder="Ej: PROD-001"
                  className="inp"
                />
              </Field>
              <Field label="Categoría">
                <select
                  value={form.category}
                  onChange={e => onChange('category', e.target.value)}
                  className="inp"
                >
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </Field>
            </div>
          </section>

          <div className="border-t border-slate-100" />

          {/* Sección: Precio y unidad */}
          <section>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.18em] mb-4">
              Precio y unidad de medida
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Precio unitario ($) *">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={e => onChange('price', e.target.value)}
                  placeholder="0.00"
                  className="inp"
                />
              </Field>
              <Field label="Unidad de medida *">
                <select
                  value={form.unit}
                  onChange={e => onChange('unit', e.target.value)}
                  className="inp"
                >
                  {UNITS.map(u => <option key={u}>{u}</option>)}
                </select>
              </Field>
              <div className="sm:col-span-2">
                <Field label="Descripción / Especificaciones técnicas">
                  <textarea
                    rows={3}
                    value={form.description || ''}
                    onChange={e => onChange('description', e.target.value)}
                    placeholder="Especificaciones técnicas, aplicaciones, características relevantes para el cliente industrial..."
                    className="inp resize-none"
                  />
                </Field>
              </div>
            </div>
          </section>

          <div className="border-t border-slate-100" />

          {/* Estado + Footer */}
          <div className="flex items-center justify-between gap-4">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={form.active !== false}
                onChange={e => onChange('active', e.target.checked)}
                className="w-4 h-4 rounded accent-blue-600"
              />
              <span className="text-sm font-bold text-slate-600">Producto activo</span>
              <span className="text-xs text-slate-400">(visible en cotizaciones)</span>
            </label>
            <div className="flex gap-3">
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
                {editing ? 'Guardar cambios' : 'Registrar producto'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function ProductManager({ products, onSave, onDelete, onNotify }) {
  const [search,     setSearch]     = useState('');
  const [catFilter,  setCatFilter]  = useState('ALL');
  const [form,       setForm]       = useState(EMPTY);
  const [editing,    setEditing]    = useState(false);
  const [showModal,  setShowModal]  = useState(false);

  // ── Filtered list ──
  const filtered = useMemo(() => products.filter(p => {
    const q = search.toLowerCase();
    const ms =
      p.name.toLowerCase().includes(q) ||
      (p.sku || '').toLowerCase().includes(q) ||
      (p.category || '').toLowerCase().includes(q) ||
      (p.description || '').toLowerCase().includes(q);
    return ms && (catFilter === 'ALL' || p.category === catFilter);
  }), [products, search, catFilter]);

  // ── KPIs ──
  const stats = useMemo(() => ({
    total:    products.length,
    active:   products.filter(p => p.active !== false).length,
    cats:     [...new Set(products.map(p => p.category).filter(Boolean))].length,
    avgPrice: products.length
      ? Math.round(products.reduce((s, p) => s + Number(p.price || 0), 0) / products.length)
      : 0,
  }), [products]);

  // ── Handlers ──
  const onChange = (f, v) => setForm(c => ({ ...c, [f]: v }));

  const openNew = () => {
    setForm(EMPTY);
    setEditing(false);
    setShowModal(true);
  };

  const openEdit = p => {
    setForm({ ...EMPTY, ...p, price: String(p.price) });
    setEditing(true);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setForm(EMPTY);
    setEditing(false);
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!form.name || !form.price || !form.unit) {
      onNotify('info', 'Completa nombre, precio y unidad.');
      return;
    }
    onSave({ ...form, price: Number(form.price) });
    closeModal();
  };

  // ──────────────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Catálogo de Productos</h2>
          <p className="text-slate-500 text-sm">Registro de productos disponibles para cotizaciones B2B.</p>
        </div>
        <button
          type="button"
          onClick={openNew}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/20"
        >
          <Plus size={16} /> Nuevo producto
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total productos',  value: stats.total,                         cls: 'text-slate-800'   },
          { label: 'Activos',          value: stats.active,                        cls: 'text-emerald-600' },
          { label: 'Categorías',       value: stats.cats,                          cls: 'text-blue-600'    },
          { label: 'Precio promedio',  value: `$${stats.avgPrice.toLocaleString()}`, cls: 'text-amber-600' },
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
            placeholder="Buscar producto, SKU, categoría..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
        </div>
        <select
          value={catFilter}
          onChange={e => setCatFilter(e.target.value)}
          className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none bg-white focus:ring-2 focus:ring-blue-500"
        >
          <option value="ALL">Todas las categorías</option>
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>

      {/* Table — no form here */}
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
              <tr>
                <td colSpan={7} className="px-5 py-12 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <Package size={32} className="text-slate-300" />
                    <p className="text-slate-400 font-medium text-sm">No se encontraron productos.</p>
                    <button
                      type="button"
                      onClick={openNew}
                      className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800"
                    >
                      <Plus size={13} /> Registrar primer producto
                    </button>
                  </div>
                </td>
              </tr>
            )}
            {filtered.map(p => (
              <tr
                key={p.id}
                className={`hover:bg-slate-50 transition-colors ${p.active === false ? 'opacity-50' : ''}`}
              >
                {/* Product */}
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
                      <Package size={14} className="text-amber-600" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">{p.name}</p>
                      {p.description && (
                        <p className="text-[11px] text-slate-400 truncate max-w-xs">{p.description}</p>
                      )}
                    </div>
                  </div>
                </td>

                {/* Category */}
                <td className="px-5 py-4 hidden md:table-cell">
                  <span className="flex items-center gap-1 text-xs text-slate-600">
                    <Tag size={11} className="text-slate-400" /> {p.category || '—'}
                  </span>
                </td>

                {/* SKU */}
                <td className="px-5 py-4 hidden lg:table-cell font-mono text-xs text-slate-400">
                  {p.sku || '—'}
                </td>

                {/* Price */}
                <td className="px-5 py-4 text-right font-black text-slate-800">
                  ${Number(p.price).toLocaleString()}
                </td>

                {/* Unit */}
                <td className="px-5 py-4 hidden md:table-cell text-xs text-slate-500">
                  {p.unit}
                </td>

                {/* Status */}
                <td className="px-5 py-4 text-center">
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${
                    p.active !== false
                      ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                      : 'bg-slate-100 text-slate-500 border-slate-200'
                  }`}>
                    {p.active !== false ? 'Activo' : 'Inactivo'}
                  </span>
                </td>

                {/* Actions */}
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      type="button"
                      onClick={() => openEdit(p)}
                      className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Editar producto"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm(`¿Eliminar el producto "${p.name}"?\nEsta acción no se puede deshacer.`))
                          onDelete(p.id);
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Eliminar producto"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <ProductFormModal
          form={form}
          editing={editing}
          onClose={closeModal}
          onSubmit={handleSubmit}
          onChange={onChange}
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
