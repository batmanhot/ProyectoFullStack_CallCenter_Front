import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { agent: "Juan", llamadas: 40 },
  { agent: "María", llamadas: 55 },
  { agent: "Carlos", llamadas: 30 },
  { agent: "Lucía", llamadas: 20 },
];

function CallsChart() {
  return (
    <div className="bg-white shadow rounded p-4">
      <h2 className="text-lg font-bold mb-4">Llamadas por Agente</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="agent" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="llamadas" fill="#F59E0B" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default CallsChart;
