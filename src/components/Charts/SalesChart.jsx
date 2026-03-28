import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const data = [
  { month: "Ene", ventas: 40000 },
  { month: "Feb", ventas: 30000 },
  { month: "Mar", ventas: 50000 },
  { month: "Abr", ventas: 20000 },
  { month: "May", ventas: 60000 },
];

function SalesChart() {
  return (
    <div className="bg-white shadow rounded p-4">
      <h2 className="text-lg font-bold mb-4">Ventas por Mes</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="ventas" stroke="#1E40AF" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default SalesChart;
