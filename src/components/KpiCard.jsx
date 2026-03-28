function KpiCard({ title, value, color }) {
  return (
    <div className={`p-4 rounded-lg shadow bg-${color}-100`}>
      <h2 className="text-sm font-semibold text-gray-700">{title}</h2>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

export default KpiCard;
