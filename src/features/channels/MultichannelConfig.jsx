import { useState } from 'react';
import { ExternalLink, Link, MessageSquare, Phone, Mail, Power, Save, Settings2 } from 'lucide-react';

const ICONS = {
  wa: <MessageSquare className="text-emerald-500" />,
  sip: <Phone className="text-blue-500" />,
  smtp: <Mail className="text-rose-500" />,
};

export default function MultichannelConfig({ channels, apiKey, onConfigureChannel, onToggleChannel, onGenerateApiKey }) {
  const [selectedChannelId, setSelectedChannelId] = useState(channels[0]?.id || '');
  const selectedChannel = channels.find((channel) => channel.id === selectedChannelId) || channels[0];
  const [endpoint, setEndpoint] = useState(selectedChannel?.endpoint || '');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Canales de Comunicacion</h2>
        <p className="text-slate-500 text-sm">Configura endpoints, habilita o deshabilita canales y genera API keys.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr,340px] gap-6 items-start">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {channels.map((channel) => (
            <div key={channel.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-slate-50 rounded-xl">{ICONS[channel.id]}</div>
                <div className={`px-2 py-1 rounded text-[10px] font-bold ${channel.status === 'Conectado' ? 'bg-emerald-100 text-emerald-700' : channel.status === 'Desconectado' ? 'bg-slate-200 text-slate-700' : 'bg-rose-100 text-rose-700'}`}>
                  {channel.status}
                </div>
              </div>
              <h3 className="font-bold text-slate-800 mb-1">{channel.name}</h3>
              <p className="text-xs text-slate-400 mb-6">Latencia: {channel.latency}</p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedChannelId(channel.id);
                    setEndpoint(channel.endpoint || '');
                  }}
                  className="flex-1 py-2 bg-slate-900 text-white rounded-lg text-[10px] font-bold flex items-center justify-center gap-2"
                >
                  <Settings2 size={12} /> CONFIGURAR
                </button>
                <button type="button" onClick={() => onToggleChannel(channel.id)} className="p-2 border border-slate-200 rounded-lg text-slate-400 hover:text-rose-500 transition-colors">
                  <Power size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-6 sticky top-6">
          {selectedChannel ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-800">Configurar canal</h3>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase mb-2">Canal seleccionado</p>
                <p className="text-sm font-semibold text-slate-800">{selectedChannel.name}</p>
              </div>
              <label className="block">
                <span className="text-xs font-bold text-slate-500 uppercase mb-2 block">Endpoint / Credencial</span>
                <input className="input" value={endpoint} onChange={(event) => setEndpoint(event.target.value)} placeholder="https://api.tuempresa.com/webhook" />
              </label>
              <button type="button" onClick={() => onConfigureChannel(selectedChannel.id, endpoint)} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2">
                <Save size={16} /> Guardar configuracion
              </button>
            </div>
          ) : null}

          <div className="bg-slate-50 border border-dashed border-slate-300 rounded-2xl p-6">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm border border-slate-200">
                <Link className="text-blue-600" />
              </div>
              <div className="text-center">
                <h3 className="font-bold text-slate-800 text-lg">Integracion con ERP/BI</h3>
                <p className="text-slate-500 text-sm">Genera una llave para integraciones externas sin salir del modulo.</p>
              </div>
              <button type="button" onClick={onGenerateApiKey} className="w-full inline-flex items-center justify-center gap-2 text-blue-600 font-bold text-sm hover:underline">
                Generar API Key para Integracion <ExternalLink size={14} />
              </button>
              {apiKey ? <div className="bg-white border border-slate-200 rounded-xl p-3 text-xs font-mono text-slate-700 break-all">{apiKey}</div> : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
