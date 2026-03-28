// Funciones para exportar datos a CSV y PDF

export function exportToCSV(filename, rows) {
  const processRow = (row) =>
    row
      .map((val) => `"${val}"`)
      .join(",");

  const csvContent =
    rows.map((row) => processRow(row)).join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}

export async function exportToPDF(filename, content) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF();
  doc.text(content, 10, 10);
  doc.save(filename);
}
