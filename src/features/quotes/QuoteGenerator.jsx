import { useMemo, useRef, useState } from 'react';
import {
  CheckCircle2, Eye, FilePlus2, FileText,
  Mail, MessageSquare, Package, Pencil,
  Plus, Printer, Save, Send, Trash2, X,
} from 'lucide-react';

// ─── Constants ────────────────────────────────────────────────────────────────
const STATUS_META = {
  BORRADOR:             { cls: 'bg-slate-100 text-slate-600 border-slate-200',      label: 'Borrador'              },
  PENDIENTE_APROBACION: { cls: 'bg-amber-100 text-amber-800 border-amber-200',      label: 'Pendiente aprobación'  },
  APROBADA:             { cls: 'bg-emerald-100 text-emerald-800 border-emerald-200', label: 'Aprobada'              },
  RECHAZADA:            { cls: 'bg-red-100 text-red-700 border-red-200',             label: 'Rechazada'             },
};

const EMPTY_ITEM = () => ({ productId: '', quantity: 1, price: 0 });
const EMPTY_FORM = { id: '', clientId: '', items: [EMPTY_ITEM()], discount: 0, notes: '' };

// ─── Quote Form Modal ─────────────────────────────────────────────────────────
function QuoteFormModal({ form, editingId, clients, products, onClose, onSaveDraft, onSendApproval, onChangeForm, onAddItem, onRemoveItem, onUpdateItem }) {

  const subtotal = useMemo(
    () => form.items.reduce((a, it) => a + Number(it.quantity || 0) * Number(it.price || 0), 0),
    [form.items],
  );
  const discountAmt = Math.round(subtotal * Number(form.discount || 0) / 100);
  const total       = subtotal - discountAmt;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop — sin onClick: solo cierra con X o Cancelar */}
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center">
              <FileText size={18} className="text-blue-600" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900">
                {editingId ? `Editar cotización — ${editingId}` : 'Nueva cotización'}
              </h2>
              <p className="text-xs text-slate-400">
                {editingId ? 'Modifica los datos de la propuesta' : 'Registra una nueva propuesta comercial B2B'}
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

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">

          {/* Sección: Cliente */}
          <section>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.18em] mb-3">
              Empresa cliente
            </p>
            <select
              value={form.clientId}
              onChange={e => onChangeForm('clientId', e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Seleccionar empresa...</option>
              {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </section>

          <div className="border-t border-slate-100" />

          {/* Sección: Productos */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.18em] flex items-center gap-1">
                <Package size={11} /> Detalle de productos
              </p>
              <button
                type="button"
                onClick={onAddItem}
                className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800"
              >
                <Plus size={12} /> Agregar ítem
              </button>
            </div>

            {/* Column headers */}
            <div className="grid grid-cols-[1fr,72px,88px,32px] gap-2 px-2 mb-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Producto</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase text-center">Cant.</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase text-right pr-2">Precio unit.</span>
              <span />
            </div>

            <div className="space-y-2">
              {form.items.map((it, idx) => {
                const lineTotal = Number(it.quantity || 0) * Number(it.price || 0);
                return (
                  <div key={idx} className="grid grid-cols-[1fr,72px,88px,32px] gap-2 items-center bg-slate-50 rounded-xl px-2 py-2">
                    <select
                      value={it.productId}
                      onChange={e => onUpdateItem(idx, 'productId', e.target.value)}
                      className="border border-slate-200 rounded-lg px-2 py-1.5 text-xs outline-none focus:ring-1 focus:ring-blue-400 bg-white"
                    >
                      <option value="">Seleccionar...</option>
                      {products.filter(p => p.active !== false).map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                    <input
                      type="number"
                      min="1"
                      value={it.quantity}
                      onChange={e => onUpdateItem(idx, 'quantity', e.target.value)}
                      className="border border-slate-200 rounded-lg px-2 py-1.5 text-xs outline-none focus:ring-1 focus:ring-blue-400 text-center bg-white"
                    />
                    <div className="relative">
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 text-[10px]">$</span>
                      <input
                        type="number"
                        min="0"
                        value={it.price}
                        onChange={e => onUpdateItem(idx, 'price', e.target.value)}
                        className="w-full border border-slate-200 rounded-lg pl-4 pr-2 py-1.5 text-xs outline-none focus:ring-1 focus:ring-blue-400 bg-white text-right"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => onRemoveItem(idx)}
                      className="p-1 text-slate-400 hover:text-rose-500 rounded-lg transition-colors flex items-center justify-center"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                );
              })}

              {/* Line totals reference */}
              {form.items.some(it => it.productId && Number(it.quantity) > 0) && (
                <div className="space-y-0.5 px-2 pt-1">
                  {form.items.map((it, idx) => {
                    const lt = Number(it.quantity || 0) * Number(it.price || 0);
                    const pn = products.find(p => String(p.id) === String(it.productId))?.name;
                    if (!pn || lt === 0) return null;
                    return (
                      <div key={idx} className="flex justify-between text-[10px] text-slate-400">
                        <span className="truncate max-w-[200px]">{pn} × {it.quantity}</span>
                        <span className="font-mono">${lt.toLocaleString()}</span>
                      </div>
                    );
                  })}
                </div>
              )}

              <button
                type="button"
                onClick={onAddItem}
                className="w-full py-2 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 text-xs font-bold hover:bg-slate-50 flex items-center justify-center gap-1 transition-colors"
              >
                <FilePlus2 size={13} /> Añadir producto
              </button>
            </div>
          </section>

          <div className="border-t border-slate-100" />

          {/* Sección: Descuento y notas */}
          <section>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.18em] mb-3">
              Condiciones y notas
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Descuento (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={form.discount}
                  onChange={e => onChangeForm('discount', e.target.value)}
                  placeholder="0"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Notas para el cliente
                </label>
                <input
                  type="text"
                  value={form.notes || ''}
                  onChange={e => onChangeForm('notes', e.target.value)}
                  placeholder="Condiciones especiales, observaciones..."
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </section>
        </div>

        {/* ── Totals + Actions — fixed at bottom of modal ── */}
        <div className="flex-shrink-0 border-t border-slate-200 bg-slate-50 rounded-b-2xl p-5">

          {/* Totals */}
          <div className="flex justify-end mb-4">
            <div className="w-64 space-y-2 text-sm">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal</span>
                <span className="font-mono">${subtotal.toLocaleString()}</span>
              </div>
              {Number(form.discount) > 0 && (
                <div className="flex justify-between text-rose-500">
                  <span>Descuento ({form.discount}%)</span>
                  <span className="font-mono">− ${discountAmt.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between font-black text-base text-slate-900 pt-2 border-t border-slate-300">
                <span>TOTAL</span>
                <span className="text-blue-600 font-mono">${total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 border border-slate-200 rounded-xl text-sm font-bold text-slate-500 hover:bg-white transition-colors"
            >
              Cancelar
            </button>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onSaveDraft}
                className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-300 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-100 transition-all"
              >
                <Save size={15} /> Guardar borrador
              </button>
              <button
                type="button"
                onClick={onSendApproval}
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/20"
              >
                <Send size={15} /> Enviar a aprobación
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── PDF Preview Modal ────────────────────────────────────────────────────────
function QuotePDF({ quote, client, products, config, onClose, onPrint }) {
  const printRef = useRef();
  const co = config?.company || {};
  const qt = config?.quotes  || {};

  const companyName    = co.name     || 'CallCenter B2B';
  const companyTagline = co.tagline  || 'Ecosistema Integral de Ventas Industriales';
  const companyEmail   = co.email    || 'contacto@callcenter.pe';
  const currency       = co.currency || 'USD';
  const validityDays   = qt.validityDays  ?? 30;
  const footerNote     = qt.footerNote    || 'Precios sujetos a variación. Validez según fecha indicada.';

  const items = (quote.items || []).map(it => ({
    ...it,
    productName: products.find(p => String(p.id) === String(it.productId))?.name || `Producto ${it.productId}`,
  }));

  const subtotal    = Number(quote.subtotal || 0);
  const discountAmt = quote.discount > 0 ? Math.round(subtotal * quote.discount / 100) : 0;
  const total       = Number(quote.total || 0);
  const statusLabel = STATUS_META[quote.status]?.label || quote.status;

  // Print styles injected into new window — separate from modal rendering
  const PRINT_CSS = `
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:system-ui,sans-serif;font-size:13px;color:#1e293b;padding:40px;background:#fff}
    .doc{max-width:800px;margin:0 auto}
    .hdr{display:flex;justify-content:space-between;align-items:flex-start;padding-bottom:24px;border-bottom:2px solid #e2e8f0;margin-bottom:28px}
    .logo{width:48px;height:48px;background:#2563eb;border-radius:12px;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:900;font-size:16px;flex-shrink:0}
    .co-name{font-size:20px;font-weight:900;color:#0f172a;margin-bottom:2px}
    .co-sub{color:#64748b;font-size:12px}
    .meta-id{font-size:18px;font-weight:900;color:#0f172a;text-align:right}
    .badge{display:inline-block;padding:3px 12px;border-radius:99px;font-size:11px;font-weight:700;background:#dbeafe;color:#1e40af;margin:4px 0}
    .meta-date{font-size:11px;color:#64748b;text-align:right}
    .info-row{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:24px}
    .info-box{background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:14px}
    .info-lbl{font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.06em;color:#94a3b8;margin-bottom:6px}
    .info-val{font-size:15px;font-weight:800;color:#0f172a;margin-bottom:3px}
    .info-sub{font-size:12px;color:#64748b;line-height:1.5}
    .sec-title{font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.08em;color:#94a3b8;margin-bottom:10px}
    table{width:100%;border-collapse:collapse;margin-bottom:0}
    thead tr{background:#f1f5f9}
    th{padding:9px 12px;text-align:left;font-size:10px;font-weight:800;text-transform:uppercase;color:#64748b;letter-spacing:.04em}
    td{padding:10px 12px;border-bottom:1px solid #f1f5f9;font-size:13px}
    tr:last-child td{border-bottom:none}
    .totals{display:flex;justify-content:flex-end;margin-top:16px;padding-top:12px;border-top:1px solid #e2e8f0}
    .totals-inner{width:260px}
    .t-row{display:flex;justify-content:space-between;padding:5px 0;font-size:13px;color:#64748b}
    .t-disc{color:#ef4444}
    .t-final{display:flex;justify-content:space-between;padding:10px 0 0;border-top:2px solid #e2e8f0;font-size:16px;font-weight:900;color:#1e293b;margin-top:4px}
    .notes-box{margin-top:20px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:14px}
    .footer{margin-top:32px;padding-top:14px;border-top:1px solid #e2e8f0;text-align:center;font-size:11px;color:#94a3b8;line-height:1.6}
    @media print{body{padding:20px}}
  `;

  const handlePrint = () => {
    const content = printRef.current?.innerHTML;
    if (!content) return;
    const w = window.open('', '_blank', 'width=900,height=700');
    w.document.write(`<!DOCTYPE html><html><head><title>Cotización ${quote.id}</title><style>${PRINT_CSS}</style></head><body>${content}</body></html>`);
    w.document.close();
    setTimeout(() => { w.print(); }, 400);
    onPrint?.();
  };

  // ── Inline styles (used in modal AND copied to print window) ──
  const S = {
    doc:      { fontFamily: 'system-ui, sans-serif', fontSize: 13, color: '#1e293b' },
    hdr:      { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: 20, borderBottom: '2px solid #e2e8f0', marginBottom: 24 },
    logoWrap: { display: 'flex', alignItems: 'center', gap: 12 },
    logo:     { width: 44, height: 44, background: '#2563eb', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, fontSize: 15, flexShrink: 0 },
    coName:   { fontSize: 18, fontWeight: 900, color: '#0f172a', marginBottom: 2 },
    coSub:    { fontSize: 12, color: '#64748b' },
    metaId:   { fontSize: 17, fontWeight: 900, color: '#0f172a', textAlign: 'right', marginBottom: 4 },
    badge:    { display: 'inline-block', padding: '3px 12px', borderRadius: 99, fontSize: 11, fontWeight: 700, background: '#dbeafe', color: '#1e40af' },
    metaDate: { fontSize: 11, color: '#64748b', textAlign: 'right', marginTop: 4 },
    infoRow:  { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 22 },
    infoBox:  { background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: 14 },
    infoLbl:  { fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.06em', color: '#94a3b8', marginBottom: 6 },
    infoVal:  { fontSize: 14, fontWeight: 800, color: '#0f172a', marginBottom: 3 },
    infoSub:  { fontSize: 12, color: '#64748b', lineHeight: 1.5 },
    secTitle: { fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.08em', color: '#94a3b8', marginBottom: 10 },
    table:    { width: '100%', borderCollapse: 'collapse' },
    thead:    { background: '#f1f5f9' },
    th:       { padding: '9px 12px', textAlign: 'left', fontSize: 10, fontWeight: 800, textTransform: 'uppercase', color: '#64748b', letterSpacing: '.04em' },
    thR:      { padding: '9px 12px', textAlign: 'right', fontSize: 10, fontWeight: 800, textTransform: 'uppercase', color: '#64748b' },
    thC:      { padding: '9px 12px', textAlign: 'center', fontSize: 10, fontWeight: 800, textTransform: 'uppercase', color: '#64748b' },
    td:       { padding: '10px 12px', borderBottom: '1px solid #f1f5f9', fontSize: 13 },
    tdR:      { padding: '10px 12px', borderBottom: '1px solid #f1f5f9', fontSize: 13, textAlign: 'right' },
    tdC:      { padding: '10px 12px', borderBottom: '1px solid #f1f5f9', fontSize: 13, textAlign: 'center' },
    tdLast:   { padding: '10px 12px', fontSize: 13 },
    tdLastR:  { padding: '10px 12px', fontSize: 13, textAlign: 'right' },
    totalsWrap: { display: 'flex', justifyContent: 'flex-end', marginTop: 14, paddingTop: 12, borderTop: '1px solid #e2e8f0' },
    totalsInner:{ width: 260 },
    tRow:     { display: 'flex', justifyContent: 'space-between', padding: '5px 0', fontSize: 13, color: '#64748b' },
    tDisc:    { display: 'flex', justifyContent: 'space-between', padding: '5px 0', fontSize: 13, color: '#ef4444' },
    tFinal:   { display: 'flex', justifyContent: 'space-between', padding: '10px 0 0', borderTop: '2px solid #e2e8f0', fontSize: 16, fontWeight: 900, color: '#1e293b', marginTop: 4 },
    notesBox: { marginTop: 20, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: 14 },
    notesLbl: { fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.06em', color: '#94a3b8', marginBottom: 6 },
    notesVal: { fontSize: 13, color: '#475569', lineHeight: 1.6 },
    footer:   { marginTop: 28, paddingTop: 14, borderTop: '1px solid #e2e8f0', textAlign: 'center', fontSize: 11, color: '#94a3b8', lineHeight: 1.6 },
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">

        {/* Modal header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 flex-shrink-0">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <Eye size={16} className="text-blue-600" /> Vista previa — {quote.id}
          </h3>
          <div className="flex gap-2">
            <button type="button" onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-700 transition-all">
              <Printer size={14} /> Imprimir / Guardar PDF
            </button>
            <button type="button" onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Document preview — all inline styles, renders correctly in modal */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
          <div ref={printRef} style={{ ...S.doc, background: '#fff', borderRadius: 12, padding: 32, boxShadow: '0 1px 4px rgba(0,0,0,.08)' }}>

            {/* Header: logo + meta */}
            <div style={S.hdr}>
              <div style={S.logoWrap}>
                <div style={S.logo}>CC</div>
                <div>
                  <div style={S.coName}>{companyName}</div>
                  <div style={S.coSub}>{companyTagline}</div>
                </div>
              </div>
              <div>
                <div style={S.metaId}>{quote.id}</div>
                <div><span style={S.badge}>{statusLabel}</span></div>
                <div style={S.metaDate}>Fecha: {quote.updatedAt}</div>
              </div>
            </div>

            {/* Info grid: client + conditions */}
            <div style={S.infoRow}>
              <div style={S.infoBox}>
                <div style={S.infoLbl}>Cliente</div>
                <div style={S.infoVal}>{client?.name || quote.client}</div>
                <div style={S.infoSub}>
                  {client?.sector && <div>{client.sector}</div>}
                  {client?.contact && <div>{client.contact}{client?.position ? ` — ${client.position}` : ''}</div>}
                  {client?.phone && <div>{client.phone}</div>}
                  {client?.email && <div>{client.email}</div>}
                </div>
              </div>
              <div style={S.infoBox}>
                <div style={S.infoLbl}>Condiciones comerciales</div>
                <div style={S.infoSub}>
                  <div style={{ marginBottom: 4 }}>Moneda: <strong>{currency}</strong></div>
                  <div style={{ marginBottom: 4 }}>Validez: <strong>{validityDays} días</strong></div>
                  <div>Forma de pago: <strong>Por acordar</strong></div>
                </div>
              </div>
            </div>

            {/* Products table */}
            <div style={{ marginBottom: 24 }}>
              <div style={S.secTitle}>Detalle de productos</div>
              <table style={S.table}>
                <thead>
                  <tr style={{ background: '#f1f5f9' }}>
                    <th style={S.th}>Producto</th>
                    <th style={S.thC}>Cant.</th>
                    <th style={S.thR}>Precio unit.</th>
                    <th style={S.thR}>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((it, i) => {
                    const isLast = i === items.length - 1;
                    const lineT  = Number(it.quantity || 0) * Number(it.price || 0);
                    return (
                      <tr key={i}>
                        <td style={isLast ? S.tdLast  : S.td}  >{it.productName}</td>
                        <td style={isLast ? { ...S.tdLast,  textAlign: 'center' } : S.tdC}>{it.quantity}</td>
                        <td style={isLast ? { ...S.tdLastR } : S.tdR}>${Number(it.price).toLocaleString()}</td>
                        <td style={{ ...(isLast ? S.tdLastR : S.tdR), fontWeight: 700 }}>${lineT.toLocaleString()}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Totals block */}
              <div style={S.totalsWrap}>
                <div style={S.totalsInner}>
                  <div style={S.tRow}>
                    <span>Subtotal</span>
                    <span>${subtotal.toLocaleString()}</span>
                  </div>
                  {quote.discount > 0 && (
                    <div style={S.tDisc}>
                      <span>Descuento ({quote.discount}%)</span>
                      <span>− ${discountAmt.toLocaleString()}</span>
                    </div>
                  )}
                  <div style={S.tFinal}>
                    <span>TOTAL</span>
                    <span>${total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes */}
            {(quote.notes || footerNote) && (
              <div style={S.notesBox}>
                {quote.notes && (
                  <>
                    <div style={S.notesLbl}>Notas adicionales</div>
                    <div style={S.notesVal}>{quote.notes}</div>
                  </>
                )}
                {footerNote && (
                  <div style={{ ...S.notesVal, marginTop: quote.notes ? 8 : 0, color: '#94a3b8', fontSize: 11 }}>
                    {footerNote}
                  </div>
                )}
              </div>
            )}

            {/* Footer */}
            <div style={S.footer}>
              <div>Este documento es una propuesta comercial generada por {companyName} · {companyTagline}</div>
              <div>Para consultas: {companyEmail} · Generado: {new Date().toLocaleString(co.locale || 'es-PE')}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Send Modal ───────────────────────────────────────────────────────────────
function SendModal({ quote, client, config, onSend, onClose }) {
  const co = config?.company   || {};
  const wa = config?.whatsapp  || {};
  const companyName  = co.name  || 'CallCenter B2B';
  const greeting     = wa.defaultGreeting || 'Estimado/a cliente, le contactamos de ';
  const signoff      = wa.defaultSignoff  || 'Quedamos atentos. Gracias.';
  const bizPhone     = wa.businessPhone   || '';

  const [channel, setChannel] = useState('email');
  const [email,   setEmail]   = useState(client?.email || co.email || '');
  const [phone,   setPhone]   = useState(client?.phone || bizPhone);
  const [message, setMessage] = useState(
    `${greeting}${companyName}.\n\nAdjunto encontrará la cotización ${quote.id} por un total de $${Number(quote.total).toLocaleString()} ${co.currency||'USD'}.\n\n${signoff}\n\nSaludos,\nEquipo ${companyName}`
  );

  const handleSend = () => {
    if (channel === 'email' && !email) return;
    if (channel === 'whatsapp' && !phone) return;
    onSend({ channel, email, phone, message });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <Send size={16} className="text-blue-600" /> Enviar cotización
          </h3>
          <button type="button" onClick={onClose}><X size={18} className="text-slate-400" /></button>
        </div>
        <div className="p-5 space-y-4">
          <div className="bg-slate-50 rounded-xl p-3 text-sm">
            <span className="font-bold text-slate-700">{quote.id}</span>
            <span className="mx-2 text-slate-400">·</span>
            <span className="text-slate-600">{client?.name}</span>
            <span className="mx-2 text-slate-400">·</span>
            <span className="font-bold text-blue-600">${Number(quote.total).toLocaleString()}</span>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Canal de envío</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id:'email',    icon:<Mail size={15}/>,          label:'Correo electrónico' },
                { id:'whatsapp', icon:<MessageSquare size={15}/>, label:'WhatsApp'           },
              ].map(ch => (
                <button key={ch.id} type="button" onClick={() => setChannel(ch.id)}
                  className={`flex items-center gap-2 p-3 rounded-xl border text-sm font-bold transition-all ${
                    channel === ch.id ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}>
                  {ch.icon} {ch.label}
                </button>
              ))}
            </div>
          </div>
          {channel === 'email' && (
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Correo del destinatario</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="cliente@empresa.com"
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          )}
          {channel === 'whatsapp' && (
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Número de WhatsApp</label>
              <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+51 999 000 000"
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          )}
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Mensaje</label>
            <textarea rows={5} value={message} onChange={e => setMessage(e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
          </div>
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-xs text-blue-700 flex items-start gap-2">
            <CheckCircle2 size={14} className="text-blue-500 flex-shrink-0 mt-0.5" />
            <span>El envío quedará registrado en el log de auditoría con fecha, usuario y canal utilizado.</span>
          </div>
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={handleSend}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all">
              <Send size={15} /> Confirmar envío
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

// ─── Main component ───────────────────────────────────────────────────────────
export default function QuoteGenerator({ clients, products, quotes, onSaveQuote, onDeleteQuote, onNotify, onAudit, config }) {
  const defaultDiscount = config?.quotes?.defaultDiscount ?? 0;
  const EMPTY_FORM_CFG  = { id: '', clientId: '', items: [EMPTY_ITEM()], discount: defaultDiscount, notes: '' };

  const [form,      setForm]      = useState(EMPTY_FORM_CFG);
  const [editingId, setEditingId] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [previewQ,  setPreviewQ]  = useState(null);
  const [sendQ,     setSendQ]     = useState(null);

  // ── Item helpers ──
  const addItem    = ()        => setForm(c => ({ ...c, items: [...c.items, EMPTY_ITEM()] }));
  const removeItem = idx       => setForm(c => ({ ...c, items: c.items.length === 1 ? c.items : c.items.filter((_, i) => i !== idx) }));
  const updateItem = (idx, f, v) => setForm(c => ({
    ...c,
    items: c.items.map((it, i) => {
      if (i !== idx) return it;
      if (f === 'productId') { const p = products.find(x => String(x.id) === v); return { ...it, productId: v, price: p?.price || 0 }; }
      return { ...it, [f]: v };
    }),
  }));

  // ── Computed totals for persist ──
  const subtotal  = form.items.reduce((a, it) => a + Number(it.quantity || 0) * Number(it.price || 0), 0);
  const total     = subtotal * (1 - Number(form.discount || 0) / 100);

  // ── Modal open/close ──
  const openNew = () => {
    setForm({ ...EMPTY_FORM_CFG, discount: defaultDiscount });
    setEditingId('');
    setShowModal(true);
  };

  const openEdit = q => {
    setEditingId(q.id);
    setForm({
      id:       q.id,
      clientId: String(q.clientId),
      items:    q.items.map(it => ({ productId: String(it.productId), quantity: it.quantity, price: it.price })),
      discount: q.discount,
      notes:    q.notes || '',
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setForm(EMPTY_FORM);
    setEditingId('');
  };

  // ── Persist ──
  const persist = submit => {
    if (!form.clientId || form.items.some(it => !it.productId || Number(it.quantity) <= 0)) {
      onNotify('info', 'Selecciona cliente y al menos un producto con cantidad válida.');
      return;
    }
    const payload = {
      id:       editingId,
      clientId: Number(form.clientId),
      items:    form.items.map(it => ({ productId: Number(it.productId), quantity: Number(it.quantity), price: Number(it.price) })),
      subtotal,
      discount: Number(form.discount || 0),
      total,
      notes:    form.notes || '',
    };
    onSaveQuote(payload, submit);
    onAudit?.(`${submit ? 'Cotización enviada a aprobación' : 'Cotización guardada como borrador'}: ${editingId || 'nueva'}`, editingId || 'nueva');
    closeModal();
  };

  // ── Send / Print ──
  const handleSend = (q, sendData) => {
    setSendQ(null);
    onNotify('success', `Cotización enviada por ${sendData.channel === 'email' ? 'correo a ' + sendData.email : 'WhatsApp a ' + sendData.phone}`);
    onAudit?.(`Cotización enviada por ${sendData.channel}`, q.id);
  };

  const handlePrint = q => {
    onAudit?.(`PDF generado para cotización ${q.id}`, q.id);
  };

  const clientOf = q => clients.find(c => c.id === q.clientId);

  // ── KPIs ──
  const kpis = useMemo(() => {
    const approved = quotes.filter(q => q.status === 'APROBADA');
    const pending  = quotes.filter(q => q.status === 'PENDIENTE_APROBACION');
    const draft    = quotes.filter(q => q.status === 'BORRADOR');
    return {
      draft:         draft.length,
      pending:       pending.length,
      approved:      approved.length,
      approvedValue: approved.reduce((s, q) => s + q.total, 0),
    };
  }, [quotes]);

  // ──────────────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Cotizaciones B2B</h2>
          <p className="text-slate-500 text-sm">Crea, envía y da seguimiento a propuestas comerciales.</p>
        </div>
        <button
          type="button"
          onClick={openNew}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/20"
        >
          <Plus size={16} /> Nueva cotización
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Borradores',         value: kpis.draft,                              cls: 'text-slate-600'   },
          { label: 'Pend. aprobación',   value: kpis.pending,                            cls: 'text-amber-600'   },
          { label: 'Aprobadas',          value: kpis.approved,                           cls: 'text-emerald-600' },
          { label: 'Valor aprobado',     value: `$${kpis.approvedValue.toLocaleString()}`, cls: 'text-blue-700'  },
        ].map(k => (
          <div key={k.label} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
            <p className={`text-2xl font-black ${k.cls}`}>{k.value}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mt-0.5">{k.label}</p>
          </div>
        ))}
      </div>

      {/* Table — Registro de cotizaciones (standalone, sin form al lado) */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-700 text-sm uppercase tracking-wider">
            Registro de cotizaciones
          </h3>
          <span className="text-xs text-slate-400">{quotes.length} total</span>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-white border-b border-slate-100">
            <tr>
              <th className="px-5 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-wider">Código</th>
              <th className="px-5 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-wider">Cliente</th>
              <th className="px-5 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-wider hidden md:table-cell">Fecha</th>
              <th className="px-5 py-3 text-right text-[10px] font-black text-slate-400 uppercase tracking-wider">Total</th>
              <th className="px-5 py-3 text-center text-[10px] font-black text-slate-400 uppercase tracking-wider">Estado</th>
              <th className="px-5 py-3 text-right text-[10px] font-black text-slate-400 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {quotes.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <FileText size={32} className="text-slate-300" />
                    <p className="text-slate-400 font-medium text-sm">Sin cotizaciones registradas.</p>
                    <button
                      type="button"
                      onClick={openNew}
                      className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800"
                    >
                      <Plus size={13} /> Crear primera cotización
                    </button>
                  </div>
                </td>
              </tr>
            )}
            {quotes.map(q => {
              const sm = STATUS_META[q.status] || STATUS_META.BORRADOR;
              return (
                <tr key={q.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-4 font-mono text-xs text-slate-500">{q.id}</td>
                  <td className="px-5 py-4">
                    <p className="font-medium text-slate-700">{q.client}</p>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell text-xs text-slate-400">{q.updatedAt}</td>
                  <td className="px-5 py-4 text-right font-bold text-slate-800">${q.total.toLocaleString()}</td>
                  <td className="px-5 py-4 text-center">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${sm.cls}`}>
                      {sm.label}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1">
                      {/* Vista previa PDF */}
                      <button
                        type="button"
                        title="Vista previa PDF"
                        onClick={() => setPreviewQ(q)}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Eye size={14} />
                      </button>
                      {/* Enviar */}
                      <button
                        type="button"
                        title="Enviar"
                        onClick={() => setSendQ(q)}
                        className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                      >
                        <Send size={14} />
                      </button>
                      {/* Editar — solo borradores */}
                      {q.status === 'BORRADOR' && (
                        <button
                          type="button"
                          title="Editar"
                          onClick={() => openEdit(q)}
                          className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                        >
                          <Pencil size={14} />
                        </button>
                      )}
                      {/* Eliminar */}
                      <button
                        type="button"
                        title="Eliminar"
                        onClick={() => { onDeleteQuote(q.id); onAudit?.(`Cotización eliminada: ${q.id}`, q.id); }}
                        className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
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

      {/* ── Modals ── */}
      {showModal && (
        <QuoteFormModal
          form={form}
          editingId={editingId}
          clients={clients}
          products={products}
          onClose={closeModal}
          onSaveDraft={() => persist(false)}
          onSendApproval={() => persist(true)}
          onChangeForm={(f, v) => setForm(c => ({ ...c, [f]: v }))}
          onAddItem={addItem}
          onRemoveItem={removeItem}
          onUpdateItem={updateItem}
        />
      )}

      {previewQ && (
        <QuotePDF
          quote={previewQ}
          client={clientOf(previewQ)}
          products={products}
          config={config}
          onClose={() => setPreviewQ(null)}
          onPrint={() => handlePrint(previewQ)}
        />
      )}

      {sendQ && (
        <SendModal
          quote={sendQ}
          client={clientOf(sendQ)}
          config={config}
          onSend={data => handleSend(sendQ, data)}
          onClose={() => setSendQ(null)}
        />
      )}
    </div>
  );
}
