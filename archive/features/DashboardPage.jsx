import React from 'react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Clock3, DollarSign, Percent, Phone, Target } from 'lucide-react';

const salesData = [
  { month: 'Ene', ventas: 15000 },
  { month: 'Feb', ventas: 22000 },
  { month: 'Mar', ventas: 18000 },
  { month: 'Abr', ventas: 35000 },
];

const KpiCard = ({ icon, title, value, change }) => {
  const IconComponent = icon;

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <span className="text-slate-500 text-sm font-medium">{title}</span>
        <IconComponent className="h-6 w-6 text-blue-600" />
      </div>
      <div className="text-3xl font-bold text-slate-900">{value}</div>
      {change && <div className={`text-sm ${change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>{change} vs. mes anterior</div>}
    </div>
  );
};

const DashboardPage = () => {
  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Visibilidad Estrategica Industrial</h1>
        <button className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition">Generar Reporte Mensual</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6 mb-8">
        <KpiCard icon={DollarSign} title="Valor Total de Ventas" value="$81,600" change="+12.5%" />
        <KpiCard icon={Percent} title="Tasa de Conversion" value="28.4%" change="+3.1%" />
        <KpiCard icon={Phone} title="Contactos Efectivos" value="615" change="-0.8%" />
        <KpiCard icon={Target} title="Ventas por Campana" value="5" />
        <KpiCard icon={Clock3} title="Tiempo Promedio de Cierre" value="18 dias" />
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm mb-8">
        <h2 className="text-xl font-semibold mb-6 text-slate-800">Tendencia de Ingresos B2B</h2>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <AreaChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip />
              <Area type="monotone" dataKey="ventas" stroke="#2563eb" fill="#dbeafe" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;