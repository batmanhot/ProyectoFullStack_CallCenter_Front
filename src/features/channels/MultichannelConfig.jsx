import { useState } from 'react';
import { ExternalLink, Key, Link, Mail, MessageSquare, Pencil, Phone, Plus, Power, Save, X } from 'lucide-react';

// ─── Constants ────────────────────────────────────────────────────────────────
const CHANNEL_ICONS = {
  wa:   <MessageSquare size={18} className="text-emerald-500" />,
  sip:  <Phone         size={18} className="text-blue-500"    />,
  smtp: <Mail          size={18} className="text-rose-500"    />,
};

const STATUS_META = {
  'Conectado':     { cls: 'bg-emerald-100 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
  'Desconectado':  { cls: 'bg-slate-100 text-slate-600 border-slate-200',       dot: 'bg-slate-400'   },
  'Error de Auth': { cls: 'bg-rose-100 text-rose-700 border-rose-200',          dot: 'bg-rose-500'    },
};

// ─── Channel Config Modal ─────────────────────────────────────────────────────
function ChannelModal({ channel, onClose, onSave }) {
  const [endpoint, setEndpoint] = useState(channel.endpoint || '');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop — no onClick, solo cierra con X o Cancelar */}
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md">

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-slate-50 rounded-xl flex items-center justify-center">
              {CHANNEL_ICONS[channel.id]}
            </div>
            <div>
              <h2 className="font-bold text-slate-900">Configurar canal</h2>
              <p className="text-xs text-slate-400">{channel.name}</p>
            </div>
          </div>
          <button type="button" onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">

          {/* Current status */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Estado actual</span>
            <span className={`flex items-center gap-1.5 text-xs font-bold px-2 py-1 rounded-full border ${(STATUS_META[channel.status] || STATUS_META['Desconectado']).cls}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${(STATUS_META[channel.status] || STATUS_META['Desconectado']).dot}`} />
              {channel.status}
            </span>
          </div>

          {/* Endpoint */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              Endpoint / Credencial *
            </label>
            <input
              type="text"
              value={endpoint}
              onChange={e => setEndpoint(e.target.value)}
              placeholder={
                channel.id === 'wa'   ? 'https://api.empresa.com/whatsapp' :
                channel.id === 'sip'  ? 'sip:trunk@empresa.local'          :
                                         'smtp://mail.empresa.com'
              }
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 font-mono"
            />
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-xs text-blue-700 leading-relaxed">
            Al guardar, el canal se marcará como <strong>Conectado</strong> y la latencia se actualizará automáticamente.
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-5 border-t border-slate-100">
          <button type="button" onClick={onClose}
            className="px-5 py-2.5 border border-slate-200 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-50 transition-colors">
            Cancelar
          </button>
          <button type="button" onClick={() => { onSave(channel.id, endpoint); onClose(); }}
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/20">
            <Save size={15} /> Guardar configuración
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function MultichannelConfig({ channels, apiKey, onConfigureChannel, onToggleChannel, onGenerateApiKey }) {
  const [modalChannel, setModalChannel] = useState(null);

  const connected = channels.filter(c => c.enabled).length;

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Canales de Comunicación</h2>
          <p className="text-slate-500 text-sm">Configura endpoints, activa o desactiva canales y gestiona integraciones.</p>
        </div>
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-xl">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-sm font-bold text-emerald-700">{connected} canal{connected !== 1 ? 'es' : ''} activo{connected !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total canales',  value: channels.length,                               cls: 'text-slate-800'   },
          { label: 'Conectados',     value: channels.filter(c => c.status === 'Conectado').length, cls: 'text-emerald-600' },
          { label: 'Con error',      value: channels.filter(c => c.status !== 'Conectado' && c.status !== 'Desconectado').length, cls: 'text-rose-600' },
        ].map(k => (
          <div key={k.label} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
            <p className={`text-2xl font-black ${k.cls}`}>{k.value}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mt-0.5">{k.label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-5 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-wider">Canal</th>
              <th className="px-5 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-wider hidden md:table-cell">Tipo</th>
              <th className="px-5 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-wider hidden lg:table-cell">Endpoint</th>
              <th className="px-5 py-3 text-center text-[10px] font-black text-slate-400 uppercase tracking-wider hidden md:table-cell">Latencia</th>
              <th className="px-5 py-3 text-center text-[10px] font-black text-slate-400 uppercase tracking-wider">Estado</th>
              <th className="px-5 py-3 text-right text-[10px] font-black text-slate-400 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {channels.map(ch => {
              const sm = STATUS_META[ch.status] || STATUS_META['Desconectado'];
              return (
                <tr key={ch.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center flex-shrink-0">
                        {CHANNEL_ICONS[ch.id]}
                      </div>
                      <p className="font-bold text-slate-800">{ch.name}</p>
                    </div>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell">
                    <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">{ch.type}</span>
                  </td>
                  <td className="px-5 py-4 hidden lg:table-cell font-mono text-xs text-slate-400 truncate max-w-[200px]">
                    {ch.endpoint}
                  </td>
                  <td className="px-5 py-4 text-center hidden md:table-cell font-mono text-xs text-slate-500">
                    {ch.latency}
                  </td>
                  <td className="px-5 py-4 text-center">
                    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full border ${sm.cls}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${sm.dot}`} />
                      {ch.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1">
                      {/* Configure — opens modal */}
                      <button type="button" onClick={() => setModalChannel(ch)}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Configurar endpoint">
                        <Pencil size={14} />
                      </button>
                      {/* Toggle on/off */}
                      <button type="button" onClick={() => onToggleChannel(ch.id)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          ch.enabled
                            ? 'text-slate-400 hover:text-rose-500 hover:bg-rose-50'
                            : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50'
                        }`}
                        title={ch.enabled ? 'Desactivar canal' : 'Activar canal'}>
                        <Power size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* API Key section */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
            <Key size={18} className="text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-slate-800 mb-1">Integración con ERP / BI</h3>
            <p className="text-sm text-slate-500 mb-4">
              Genera una API key para conectar sistemas externos sin salir del módulo.
            </p>
            <div className="flex items-center gap-3 flex-wrap">
              <button type="button" onClick={onGenerateApiKey}
                className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/20">
                <Link size={15} /> Generar API Key
              </button>
              {apiKey && (
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <code className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono text-slate-700 truncate">
                    {apiKey}
                  </code>
                  <a href="#" className="text-blue-600 hover:text-blue-800 flex-shrink-0">
                    <ExternalLink size={14} />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {modalChannel && (
        <ChannelModal
          channel={modalChannel}
          onClose={() => setModalChannel(null)}
          onSave={(chId, ep) => { onConfigureChannel(chId, ep); setModalChannel(null); }}
        />
      )}
    </div>
  );
}
