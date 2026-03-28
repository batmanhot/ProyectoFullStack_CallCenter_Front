import Layout from "../components/Layout";
import KpiCard from "../components/KpiCard";
import SalesChart from "../components/Charts/SalesChart";
import CallsChart from "../components/Charts/CallsChart";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { getConversionRate, getEffectiveCalls, getTotalSales, getAverageClosingTime } from "../utils/kpiUtils";

function Dashboard() {
  const [quotes] = useLocalStorage("quotes", []);
  const [calls] = useLocalStorage("calls", []);

  const conversionRate = getConversionRate(quotes);
  const effectiveCalls = getEffectiveCalls(calls);
  const totalSales = "$" + getTotalSales(quotes).toLocaleString();
  const avgClosingTime = getAverageClosingTime(quotes);

  return (
    <Layout>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <KpiCard title="Tasa de Conversión" value={conversionRate} color="green" />
        <KpiCard title="Llamadas Efectivas" value={effectiveCalls} color="blue" />
        <KpiCard title="Valor Total Ventas" value={totalSales} color="yellow" />
        <KpiCard title="Tiempo Promedio de Cierre" value={avgClosingTime} color="purple" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SalesChart />
        <CallsChart />
      </div>
    </Layout>
  );
}

export default Dashboard;
