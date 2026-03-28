import { DATA } from '../../data';

export default function DashboardView() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Visibilidad Estrategica</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {DATA.kpis.map((kpi, i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <p className="text-slate-500 text-sm mb-1">{kpi.label}</p>
            <p className="text-3xl font-bold text-blue-600">{kpi.value}</p>
            <p className="text-[10px] text-slate-400 mt-2 uppercase tracking-wider">{kpi.formula}</p>
          </div>
        ))}
      </div>

      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
        <h3 className="font-bold mb-4">Rendimiento de Campanas Outbound</h3>
        <div className="flex items-end gap-4 h-48">
          {[40, 70, 45, 90, 65].map((h, i) => (
            <div key={i} className="flex-1 bg-blue-100 rounded-t-lg hover:bg-blue-600 transition-colors" style={{ height: `${h}%` }}></div>
          ))}
        </div>
        <div className="flex justify-between mt-4 text-xs text-slate-500">
          <span>Minera A</span><span>Fabrica B</span><span>Motores C</span><span>Planchas D</span><span>Valvulas E</span>
        </div>
      </div>
    </div>
  );
}