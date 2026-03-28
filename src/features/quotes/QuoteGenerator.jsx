import { useMemo, useState } from 'react';
import { Calculator, FilePlus2, Package, Pencil, Save, Send, Trash2 } from 'lucide-react';

const createEmptyItem = () => ({ productId: '', quantity: 1, price: 0 });
const EMPTY_FORM = { id: '', clientId: '', items: [createEmptyItem()], discount: 0 };

export default function QuoteGenerator({ clients, products, quotes, onSaveQuote, onDeleteQuote }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState('');

  const subtotal = useMemo(
    () => form.items.reduce((acc, item) => acc + Number(item.quantity || 0) * Number(item.price || 0), 0),
    [form.items],
  );
  const total = subtotal * (1 - Number(form.discount || 0) / 100);

  const addItem = () => setForm((current) => ({ ...current, items: [...current.items, createEmptyItem()] }));

  const removeItem = (index) => {
    setForm((current) => ({
      ...current,
      items: current.items.length === 1 ? current.items : current.items.filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  const updateItem = (index, field, value) => {
    setForm((current) => {
      const items = current.items.map((item, itemIndex) => {
        if (itemIndex !== index) return item;
        if (field === 'productId') {
          const product = products.find((entry) => String(entry.id) === value);
          return { ...item, productId: value, price: product?.price || 0 };
        }
        return { ...item, [field]: value };
      });
      return { ...current, items };
    });
  };

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditingId('');
  };

  const handlePersist = (submit) => {
    if (!form.clientId || !form.items.length || form.items.some((item) => !item.productId || Number(item.quantity) <= 0)) {
      return;
    }
    const payload = {
      id: editingId,
      clientId: Number(form.clientId),
      items: form.items.map((item) => ({ productId: Number(item.productId), quantity: Number(item.quantity), price: Number(item.price) })),
      subtotal,
      discount: Number(form.discount || 0),
      total,
    };
    onSaveQuote(payload, submit);
    resetForm();
  };

  const handleEdit = (quote) => {
    setEditingId(quote.id);
    setForm({
      id: quote.id,
      clientId: String(quote.clientId),
      items: quote.items.map((item) => ({ productId: String(item.productId), quantity: item.quantity, price: item.price })),
      discount: quote.discount,
    });
  };

  const draftQuotes = quotes.filter((quote) => quote.status === 'BORRADOR');
  const pendingQuotes = quotes.filter((quote) => quote.status === 'PENDIENTE_APROBACION');

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Propuesta Comercial B2B</h2>
          <p className="text-slate-500 text-sm">Crea borradores, editalos y envialos al flujo de aprobacion.</p>
        </div>
        <div className="text-right">
          <p className="text-xs font-bold text-slate-400 uppercase">Total Cotizado</p>
          <p className="text-3xl font-black text-blue-600">${total.toLocaleString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.2fr,0.8fr] gap-6 items-start">
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
            <div className="mb-6 flex items-center justify-between gap-3 flex-wrap">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Seleccionar Empresa</label>
                <select className="input min-w-[280px]" value={form.clientId} onChange={(event) => setForm((current) => ({ ...current, clientId: event.target.value }))}>
                  <option value="">Buscar en cartera de clientes...</option>
                  {clients.map((client) => <option key={client.id} value={client.id}>{client.name}</option>)}
                </select>
              </div>
              <button type="button" onClick={resetForm} className="px-4 py-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50">Nuevo borrador</button>
            </div>

            <h3 className="font-bold text-slate-700 text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
              <Package size={16} /> Detalle de productos
            </h3>

            <div className="space-y-3">
              {form.items.map((item, index) => (
                <div key={`${index}-${item.productId}`} className="grid grid-cols-[1fr,100px,100px,48px] gap-3 items-end">
                  <div>
                    <select className="input" value={item.productId} onChange={(event) => updateItem(index, 'productId', event.target.value)}>
                      <option value="">Seleccionar producto...</option>
                      {products.map((product) => <option key={product.id} value={product.id}>{product.name} ({product.unit})</option>)}
                    </select>
                  </div>
                  <div>
                    <input type="number" min="1" className="input" value={item.quantity} onChange={(event) => updateItem(index, 'quantity', event.target.value)} placeholder="Cant." />
                  </div>
                  <div>
                    <input type="number" className="input" value={item.price} onChange={(event) => updateItem(index, 'price', event.target.value)} placeholder="Precio" />
                  </div>
                  <button type="button" onClick={() => removeItem(index)} className="p-3 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors">
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}

              <button type="button" onClick={addItem} className="w-full py-2 border-2 border-dashed border-slate-200 rounded-lg text-slate-400 text-xs font-bold hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center gap-2">
                <FilePlus2 size={14} /> Anadir item tecnico
              </button>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
              <h3 className="font-bold text-slate-800">Borradores y enviadas</h3>
              <span className="text-xs font-bold uppercase text-slate-400">{quotes.length} cotizaciones</span>
            </div>
            <div className="space-y-3">
              {[...draftQuotes, ...pendingQuotes].map((quote) => (
                <div key={quote.id} className="border border-slate-200 rounded-xl p-4 flex items-center justify-between gap-4 flex-wrap">
                  <div>
                    <p className="font-bold text-slate-800">{quote.id} - {quote.client}</p>
                    <p className="text-xs text-slate-500">{quote.status} | Actualizada: {quote.updatedAt}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-blue-600">${quote.total.toLocaleString()}</span>
                    {quote.status === 'BORRADOR' ? <button type="button" onClick={() => handleEdit(quote)} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500"><Pencil size={16} /></button> : null}
                    <button type="button" onClick={() => onDeleteQuote(quote.id)} className="p-2 rounded-lg hover:bg-rose-50 text-rose-500"><Trash2 size={16} /></button>
                  </div>
                </div>
              ))}
              {!quotes.length ? <p className="text-sm text-slate-400">Todavia no hay cotizaciones registradas.</p> : null}
            </div>
          </div>
        </div>

        <div className="space-y-4 sticky top-6">
          <div className="bg-slate-900 text-white rounded-xl shadow-lg p-6">
            <h3 className="font-bold mb-4 flex items-center gap-2"><Calculator size={18} className="text-blue-400" /> Resumen de oferta</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-slate-400"><span>Subtotal</span><span>${subtotal.toLocaleString()}</span></div>
              <div className="flex justify-between items-center text-slate-400">
                <span>Descuento (%)</span>
                <input type="number" min="0" max="100" className="w-16 bg-slate-800 border border-slate-700 rounded p-1 text-right text-white" value={form.discount} onChange={(event) => setForm((current) => ({ ...current, discount: event.target.value }))} />
              </div>
              <div className="pt-3 border-t border-slate-700 flex justify-between font-bold text-lg"><span>Total Final</span><span className="text-blue-400">${total.toLocaleString()}</span></div>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-6">
              <button type="button" onClick={() => handlePersist(false)} className="py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2"><Save size={18} /> Guardar</button>
              <button type="button" onClick={() => handlePersist(true)} className="py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2"><Send size={18} /> Enviar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
