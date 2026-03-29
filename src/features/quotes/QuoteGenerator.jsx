import { useMemo, useRef, useState } from 'react';
import {
  Calculator, CheckCircle2, ChevronRight, Eye, FilePlus2, FileText,
  Mail, MessageSquare, Package, Pencil, Plus, Printer, Save, Send, Trash2, X,
} from 'lucide-react';

const STATUS_META = {
  BORRADOR:              { cls: 'bg-slate-100 text-slate-600 border-slate-200',   label: 'Borrador' },
  PENDIENTE_APROBACION:  { cls: 'bg-amber-100 text-amber-800 border-amber-200',   label: 'Pendiente aprobación' },
  APROBADA:              { cls: 'bg-emerald-100 text-emerald-800 border-emerald-200', label: 'Aprobada' },
  RECHAZADA:             { cls: 'bg-red-100 text-red-700 border-red-200',          label: 'Rechazada' },
};

const EMPTY_ITEM = () => ({ productId: '', quantity: 1, price: 0 });
const EMPTY_FORM = { id: '', clientId: '', items: [EMPTY_ITEM()], discount: 0, notes: '' };

/* ─────────── Quote PDF Preview ─────────── */
function QuotePDF({ quote, client, products, onClose, onPrint }) {
  const printRef = useRef();
  const items = (quote.items || []).map(it => ({
    ...it,
    productName: products.find(p => String(p.id) === String(it.productId))?.name || `Producto ${it.productId}`,
  }));

  const handlePrint = () => {
    const content = printRef.current?.innerHTML;
    if (!content) return;
    const w = window.open('', '_blank', 'width=900,height=700');
    w.document.write(`<!DOCTYPE html><html><head><title>Cotización ${quote.id}</title>
    <style>
      *{box-sizing:border-box;margin:0;padding:0} body{font-family:system-ui,sans-serif;font-size:13px;color:#1e293b;padding:40px}
      .header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:32px;padding-bottom:24px;border-bottom:2px solid #e2e8f0}
      .logo{width:48px;height:48px;background:#2563eb;border-radius:12px;display:flex;align-items:center;justify-content:center;color:white;font-weight:900;font-size:16px}
      h1{font-size:22px;font-weight:900;color:#0f172a;margin-bottom:4px} .subtitle{color:#64748b;font-size:12px}
      .meta{text-align:right} .badge{display:inline-block;padding:4px 12px;border-radius:9999px;font-size:11px;font-weight:700;background:#dbeafe;color:#1e40af}
      .section{margin-bottom:24px} .section-title{font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.08em;color:#94a3b8;margin-bottom:12px}
      .info-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}
      .info-box{background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:12px}
      .info-label{font-size:10px;text-transform:uppercase;color:#94a3b8;font-weight:700;margin-bottom:4px}
      .info-value{font-weight:600;color:#1e293b}
      table{width:100%;border-collapse:collapse} thead tr{background:#f1f5f9}
      th{padding:10px 12px;text-align:left;font-size:10px;font-weight:800;text-transform:uppercase;color:#64748b}
      td{padding:10px 12px;border-bottom:1px solid #f1f5f9} tr:last-child td{border-bottom:none}
      .totals{margin-top:16px;display:flex;justify-content:flex-end}
      .totals-box{width:260px} .total-row{display:flex;justify-content:space-between;padding:6px 0;font-size:13px;color:#64748b}
      .total-final{display:flex;justify-content:space-between;padding:10px 0;border-top:2px solid #e2e8f0;font-size:16px;font-weight:900;color:#1e293b}
      .footer{margin-top:32px;padding-top:16px;border-top:1px solid #e2e8f0;text-align:center;font-size:11px;color:#94a3b8}
      @media print{body{padding:20px}}
    </style></head><body>${content}</body></html>`);
    w.document.close();
    setTimeout(() => { w.print(); }, 400);
    onPrint?.();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        {/* Modal header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <h3 className="font-bold text-slate-800 flex items-center gap-2"><Eye size={16} className="text-blue-600"/> Vista previa — {quote.id}</h3>
          <div className="flex gap-2">
            <button type="button" onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-700 transition-all">
              <Printer size={14}/> Imprimir / Guardar PDF
            </button>
            <button type="button" onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600"><X size={18}/></button>
          </div>
        </div>

        {/* PDF content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div ref={printRef}>
            <div className="header">
              <div>
                <div style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:'8px'}}>
                  <div className="logo">CC</div>
                  <div>
                    <h1>CallCenter B2B</h1>
                    <p className="subtitle">Ecosistema Integral de Ventas Industriales</p>
                  </div>
                </div>
              </div>
              <div className="meta">
                <p style={{fontWeight:900,fontSize:'18px',marginBottom:'4px'}}>{quote.id}</p>
                <span className="badge">{STATUS_META[quote.status]?.label || quote.status}</span>
                <p style={{marginTop:'8px',color:'#64748b',fontSize:'12px'}}>Fecha: {quote.updatedAt}</p>
              </div>
            </div>

            <div className="info-grid section">
              <div className="info-box">
                <p className="info-label">Cliente</p>
                <p className="info-value" style={{fontSize:'15px',fontWeight:800,marginBottom:'4px'}}>{client?.name || quote.client}</p>
                <p style={{color:'#64748b',fontSize:'12px'}}>{client?.sector}</p>
                <p style={{color:'#64748b',fontSize:'12px'}}>{client?.contact} · {client?.phone}</p>
              </div>
              <div className="info-box">
                <p className="info-label">Condiciones comerciales</p>
                <p style={{color:'#1e293b',fontSize:'12px',marginBottom:'4px'}}>Moneda: USD</p>
                <p style={{color:'#1e293b',fontSize:'12px',marginBottom:'4px'}}>Validez: 30 días</p>
                <p style={{color:'#1e293b',fontSize:'12px'}}>Forma de pago: Por acordar</p>
              </div>
            </div>

            <div className="section">
              <p className="section-title">Detalle de productos</p>
              <table>
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th style={{textAlign:'center'}}>Cant.</th>
                    <th style={{textAlign:'right'}}>P. Unitario</th>
                    <th style={{textAlign:'right'}}>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((it, i) => (
                    <tr key={i}>
                      <td style={{fontWeight:600}}>{it.productName}</td>
                      <td style={{textAlign:'center'}}>{it.quantity}</td>
                      <td style={{textAlign:'right'}}>${Number(it.price).toLocaleString()}</td>
                      <td style={{textAlign:'right',fontWeight:700}}>${(it.quantity * it.price).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="totals">
                <div className="totals-box">
                  <div className="total-row"><span>Subtotal</span><span>${Number(quote.subtotal).toLocaleString()}</span></div>
                  {quote.discount > 0 && <div className="total-row" style={{color:'#ef4444'}}><span>Descuento ({quote.discount}%)</span><span>-${Math.round(quote.subtotal * quote.discount / 100).toLocaleString()}</span></div>}
                  <div className="total-final"><span>TOTAL</span><span>${Number(quote.total).toLocaleString()}</span></div>
                </div>
              </div>
            </div>

            {quote.notes && (
              <div className="section" style={{background:'#f8fafc',border:'1px solid #e2e8f0',borderRadius:'8px',padding:'16px'}}>
                <p className="section-label" style={{fontSize:'10px',fontWeight:800,textTransform:'uppercase',color:'#94a3b8',marginBottom:'8px'}}>Notas adicionales</p>
                <p style={{color:'#475569',fontSize:'13px'}}>{quote.notes}</p>
              </div>
            )}

            <div className="footer">
              <p>Este documento es una propuesta comercial generada por el sistema CallCenter B2B · Ecosistema Integral de Ventas Industriales</p>
              <p style={{marginTop:'4px'}}>Para consultas: contacto@callcenter.pe · Generado: {new Date().toLocaleString('es-PE')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────── Send Modal ─────────── */
function SendModal({ quote, client, onSend, onClose }) {
  const [channel, setChannel] = useState('email');
  const [email,   setEmail]   = useState(client?.email || '');
  const [phone,   setPhone]   = useState(client?.phone || '');
  const [message, setMessage] = useState(`Estimado/a ${client?.contact || 'cliente'},\n\nAdjunto encontrará la cotización ${quote.id} por un total de $${Number(quote.total).toLocaleString()} USD.\n\nQuedamos atentos a sus consultas.\n\nSaludos,\nEquipo CallCenter B2B`);

  const handleSend = () => {
    if (channel === 'email' && !email) return;
    if (channel === 'whatsapp' && !phone) return;
    onSend({ channel, email, phone, message });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <h3 className="font-bold text-slate-800 flex items-center gap-2"><Send size={16} className="text-blue-600"/> Enviar cotización</h3>
          <button type="button" onClick={onClose}><X size={18} className="text-slate-400"/></button>
        </div>
        <div className="p-5 space-y-4">
          <div className="bg-slate-50 rounded-xl p-3 text-sm">
            <span className="font-bold text-slate-700">{quote.id}</span>
            <span className="mx-2 text-slate-400">·</span>
            <span className="text-slate-600">{client?.name}</span>
            <span className="mx-2 text-slate-400">·</span>
            <span className="font-bold text-blue-600">${Number(quote.total).toLocaleString()}</span>
          </div>

          {/* Channel selector */}
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Canal de envío</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id:'email',    icon:<Mail size={15}/>,        label:'Correo electrónico' },
                { id:'whatsapp', icon:<MessageSquare size={15}/>, label:'WhatsApp'           },
              ].map(ch => (
                <button key={ch.id} type="button" onClick={() => setChannel(ch.id)}
                  className={`flex items-center gap-2 p-3 rounded-xl border text-sm font-bold transition-all ${channel===ch.id?'bg-blue-600 text-white border-blue-600':'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}>
                  {ch.icon} {ch.label}
                </button>
              ))}
            </div>
          </div>

          {channel === 'email' && (
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Correo del destinatario</label>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="cliente@empresa.com"
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"/>
            </div>
          )}
          {channel === 'whatsapp' && (
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Número de WhatsApp</label>
              <input type="tel" value={phone} onChange={e=>setPhone(e.target.value)} placeholder="+51 999 000 000"
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"/>
            </div>
          )}

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Mensaje</label>
            <textarea rows={5} value={message} onChange={e=>setMessage(e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none"/>
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-xs text-blue-700 flex items-start gap-2">
            <CheckCircle2 size={14} className="text-blue-500 flex-shrink-0 mt-0.5"/>
            <span>El envío quedará registrado en el log de auditoría con fecha, usuario y canal utilizado.</span>
          </div>

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={handleSend}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all">
              <Send size={15}/> Confirmar envío
            </button>
            <button type="button" onClick={onClose}
              className="px-4 py-3 border border-slate-200 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-50">
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────── Main component ─────────── */
export default function QuoteGenerator({ clients, products, quotes, onSaveQuote, onDeleteQuote, onNotify, onAudit, currentUser }) {
  const [form,       setForm]      = useState(EMPTY_FORM);
  const [editingId,  setEditingId] = useState('');
  const [previewQ,   setPreviewQ]  = useState(null);   // quote to preview
  const [sendQ,      setSendQ]     = useState(null);   // quote to send

  const subtotal = useMemo(() => form.items.reduce((a,it) => a + Number(it.quantity||0)*Number(it.price||0), 0), [form.items]);
  const total    = subtotal * (1 - Number(form.discount||0)/100);

  const addItem    = ()       => setForm(c => ({ ...c, items: [...c.items, EMPTY_ITEM()] }));
  const removeItem = idx      => setForm(c => ({ ...c, items: c.items.length===1?c.items:c.items.filter((_,i)=>i!==idx) }));
  const updateItem = (idx,f,v) => setForm(c => ({
    ...c,
    items: c.items.map((it,i) => {
      if (i!==idx) return it;
      if (f==='productId') { const p=products.find(x=>String(x.id)===v); return {...it,productId:v,price:p?.price||0}; }
      return {...it,[f]:v};
    }),
  }));

  const reset = () => { setForm(EMPTY_FORM); setEditingId(''); };

  const persist = (submit) => {
    if (!form.clientId || form.items.some(it=>!it.productId||Number(it.quantity)<=0)) {
      onNotify('info','Selecciona cliente y al menos un producto con cantidad válida.'); return;
    }
    const payload = {
      id: editingId,
      clientId: Number(form.clientId),
      items: form.items.map(it=>({productId:Number(it.productId),quantity:Number(it.quantity),price:Number(it.price)})),
      subtotal, discount: Number(form.discount||0), total, notes: form.notes||'',
    };
    onSaveQuote(payload, submit);
    onAudit?.(`${submit?'Cotización enviada a aprobación':'Cotización guardada como borrador'}: ${editingId||'nueva'}`, editingId||'nueva');
    reset();
  };

  const handleEdit = q => {
    setEditingId(q.id);
    setForm({ id:q.id, clientId:String(q.clientId), items:q.items.map(it=>({productId:String(it.productId),quantity:it.quantity,price:it.price})), discount:q.discount, notes:q.notes||'' });
  };

  const handleSend = (q, sendData) => {
    setSendQ(null);
    onNotify('success', `Cotización enviada por ${sendData.channel==='email'?'correo a '+sendData.email:'WhatsApp a '+sendData.phone}`);
    onAudit?.(`Cotización enviada por ${sendData.channel} (${sendData.channel==='email'?sendData.email:sendData.phone})`, q.id);
  };

  const handlePrint = (q) => {
    onAudit?.(`PDF generado para cotización ${q.id}`, q.id);
  };

  const allStatuses = ['BORRADOR','PENDIENTE_APROBACION','APROBADA','RECHAZADA'];
  const grouped = Object.fromEntries(allStatuses.map(s => [s, quotes.filter(q=>q.status===s)]));

  const clientOf = q => clients.find(c => c.id === q.clientId);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Cotizaciones B2B</h2>
          <p className="text-slate-500 text-sm">Crea, envía y da seguimiento a propuestas comerciales.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-[10px] font-bold text-slate-400 uppercase">Pipeline total</p>
            <p className="text-2xl font-black text-blue-600">${quotes.filter(q=>q.status!=='RECHAZADA').reduce((s,q)=>s+q.total,0).toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label:'Borradores',           value:grouped.BORRADOR?.length||0,             cls:'text-slate-600' },
          { label:'Pend. aprobación',     value:grouped.PENDIENTE_APROBACION?.length||0, cls:'text-amber-600' },
          { label:'Aprobadas',            value:grouped.APROBADA?.length||0,             cls:'text-emerald-600' },
          { label:'Valor aprobado',       value:`$${(grouped.APROBADA||[]).reduce((s,q)=>s+q.total,0).toLocaleString()}`, cls:'text-blue-700' },
        ].map(k => (
          <div key={k.label} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
            <p className={`text-xl font-black ${k.cls}`}>{k.value}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mt-0.5">{k.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr,340px] gap-6 items-start">
        {/* Left: form + list */}
        <div className="space-y-5">
          {/* Form */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <FileText size={16} className="text-blue-600"/>
                {editingId ? `Editando ${editingId}` : 'Nueva cotización'}
              </h3>
              {editingId && <button type="button" onClick={reset} className="text-xs font-bold text-slate-400 flex items-center gap-1"><X size={13}/> Cancelar</button>}
            </div>

            <div className="mb-4">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Empresa cliente *</label>
              <select value={form.clientId} onChange={e=>setForm(c=>({...c,clientId:e.target.value}))}
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Seleccionar empresa...</option>
                {clients.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1"><Package size={12}/> Productos</h4>
                <button type="button" onClick={addItem} className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800">
                  <Plus size={12}/> Agregar ítem
                </button>
              </div>
              <div className="space-y-2">
                {form.items.map((it, idx) => (
                  <div key={idx} className="grid grid-cols-[1fr,80px,90px,36px] gap-2 items-center bg-slate-50 rounded-xl p-2">
                    <select value={it.productId} onChange={e=>updateItem(idx,'productId',e.target.value)}
                      className="border border-slate-200 rounded-lg px-2 py-1.5 text-xs outline-none focus:ring-1 focus:ring-blue-400 bg-white">
                      <option value="">Producto...</option>
                      {products.filter(p=>p.active!==false).map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                    <input type="number" min="1" value={it.quantity} onChange={e=>updateItem(idx,'quantity',e.target.value)}
                      placeholder="Cant." className="border border-slate-200 rounded-lg px-2 py-1.5 text-xs outline-none focus:ring-1 focus:ring-blue-400 text-center bg-white"/>
                    <div className="relative">
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 text-xs">$</span>
                      <input type="number" value={it.price} onChange={e=>updateItem(idx,'price',e.target.value)}
                        className="w-full border border-slate-200 rounded-lg pl-5 pr-2 py-1.5 text-xs outline-none focus:ring-1 focus:ring-blue-400 bg-white"/>
                    </div>
                    <button type="button" onClick={()=>removeItem(idx)} className="p-1 text-slate-400 hover:text-rose-500 rounded-lg transition-colors"><Trash2 size={13}/></button>
                  </div>
                ))}
                <button type="button" onClick={addItem}
                  className="w-full py-2 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 text-xs font-bold hover:bg-slate-50 flex items-center justify-center gap-1">
                  <FilePlus2 size={13}/> Añadir producto
                </button>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Notas para el cliente</label>
              <textarea rows={2} value={form.notes||''} onChange={e=>setForm(c=>({...c,notes:e.target.value}))}
                placeholder="Condiciones especiales, observaciones técnicas..."
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none"/>
            </div>
          </div>

          {/* Quote list */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-700 text-sm uppercase tracking-wider">Registro de cotizaciones</h3>
              <span className="text-xs text-slate-400">{quotes.length} total</span>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-white">
                <tr>
                  <th className="px-4 py-3 text-left text-[10px] font-black text-slate-400 uppercase">Código</th>
                  <th className="px-4 py-3 text-left text-[10px] font-black text-slate-400 uppercase">Cliente</th>
                  <th className="px-4 py-3 text-right text-[10px] font-black text-slate-400 uppercase">Total</th>
                  <th className="px-4 py-3 text-center text-[10px] font-black text-slate-400 uppercase">Estado</th>
                  <th className="px-4 py-3 text-right text-[10px] font-black text-slate-400 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {quotes.length === 0 && (
                  <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-400 text-sm">Sin cotizaciones registradas.</td></tr>
                )}
                {quotes.map(q => {
                  const sm = STATUS_META[q.status]||STATUS_META.BORRADOR;
                  return (
                    <tr key={q.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs text-slate-500">{q.id}</td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-slate-700">{q.client}</p>
                        <p className="text-[11px] text-slate-400">{q.updatedAt}</p>
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-slate-800">${q.total.toLocaleString()}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${sm.cls}`}>{sm.label}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button type="button" title="Vista previa PDF" onClick={()=>setPreviewQ(q)}
                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Eye size={14}/></button>
                          <button type="button" title="Enviar" onClick={()=>setSendQ(q)}
                            className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"><Send size={14}/></button>
                          {q.status==='BORRADOR' && (
                            <button type="button" title="Editar" onClick={()=>handleEdit(q)}
                              className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"><Pencil size={14}/></button>
                          )}
                          <button type="button" title="Eliminar" onClick={()=>{ onDeleteQuote(q.id); onAudit?.(`Cotización eliminada: ${q.id}`,q.id); }}
                            className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"><Trash2 size={14}/></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: summary + actions */}
        <div className="space-y-4 sticky top-6">
          <div className="bg-slate-900 text-white rounded-2xl shadow-xl p-6">
            <h3 className="font-bold mb-5 flex items-center gap-2 text-slate-200"><Calculator size={17} className="text-blue-400"/> Resumen de oferta</h3>
            <div className="space-y-3 text-sm mb-5">
              <div className="flex justify-between text-slate-400"><span>Subtotal</span><span>${subtotal.toLocaleString()}</span></div>
              <div className="flex justify-between items-center text-slate-400">
                <span>Descuento (%)</span>
                <input type="number" min="0" max="100" value={form.discount}
                  onChange={e=>setForm(c=>({...c,discount:e.target.value}))}
                  className="w-16 bg-slate-800 border border-slate-700 rounded-lg p-1.5 text-right text-white text-xs outline-none focus:ring-1 focus:ring-blue-500"/>
              </div>
              <div className="pt-3 border-t border-slate-700 flex justify-between font-black text-xl">
                <span>Total</span>
                <span className="text-blue-400">${total.toLocaleString()}</span>
              </div>
            </div>

            <div className="space-y-2">
              <button type="button" onClick={()=>persist(false)}
                className="w-full flex items-center justify-center gap-2 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold text-sm transition-all">
                <Save size={16}/> Guardar borrador
              </button>
              <button type="button" onClick={()=>persist(true)}
                className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-900/30">
                <ChevronRight size={16}/> Enviar a aprobación
              </button>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
            <h4 className="font-bold text-slate-700 text-xs uppercase tracking-wider mb-3 flex items-center gap-2"><Send size={13} className="text-blue-500"/> Envío rápido</h4>
            <p className="text-xs text-slate-500 mb-3">Selecciona una cotización aprobada o pendiente para enviar.</p>
            {[...grouped.PENDIENTE_APROBACION||[], ...grouped.APROBADA||[]].slice(0,3).map(q => (
              <div key={q.id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                <div>
                  <p className="text-xs font-bold text-slate-700">{q.id}</p>
                  <p className="text-[10px] text-slate-400">{q.client}</p>
                </div>
                <div className="flex gap-1">
                  <button type="button" onClick={()=>setPreviewQ(q)} className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg"><Eye size={12}/></button>
                  <button type="button" onClick={()=>setSendQ(q)} className="p-1.5 text-slate-400 hover:text-emerald-600 rounded-lg"><Send size={12}/></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modals */}
      {previewQ && (
        <QuotePDF
          quote={previewQ}
          client={clientOf(previewQ)}
          products={products}
          onClose={()=>setPreviewQ(null)}
          onPrint={()=>handlePrint(previewQ)}
        />
      )}
      {sendQ && (
        <SendModal
          quote={sendQ}
          client={clientOf(sendQ)}
          onSend={data=>handleSend(sendQ,data)}
          onClose={()=>setSendQ(null)}
        />
      )}
    </div>
  );
}
