// Funciones para calcular KPIs dinámicos desde localStorage

export function getConversionRate(quotes) {
  const total = quotes.length;
  const approved = quotes.filter((q) => q.status === "Aprobada").length;
  return total > 0 ? ((approved / total) * 100).toFixed(1) + "%" : "0%";
}

export function getEffectiveCalls(calls) {
  return calls.filter((c) => c.result === "Contacto exitoso").length;
}

export function getTotalSales(quotes) {
  return quotes
    .filter((q) => q.status === "Aprobada")
    .reduce((sum, q) => sum + q.amount, 0);
}

export function getAverageClosingTime(quotes) {
  const closedQuotes = quotes.filter((q) => q.status === "Aprobada");
  if (closedQuotes.length === 0) return "N/A";

  const totalDays = closedQuotes.reduce((sum, q) => {
    const start = new Date(q.date);
    const end = new Date();
    const diff = (end - start) / (1000 * 60 * 60 * 24);
    return sum + diff;
  }, 0);

  return (totalDays / closedQuotes.length).toFixed(1) + " días";
}
