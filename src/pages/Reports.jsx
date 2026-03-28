import Navbar from "../components/Navbar";
import { exportToCSV, exportToPDF } from "../utils/exportUtils";
import { clients, campaigns } from "../data/masterData";

function Reports() {
  const handleExportCSV = () => {
    const rows = [
      ["Cliente", "Contacto", "Email", "Teléfono", "Estado"],
      ...clients.map((c) => [c.company, c.contact, c.email, c.phone, c.status]),
    ];
    exportToCSV("clientes.csv", rows);
  };

  const handleExportPDF = () => {
    const content = `
      Reporte de Campañas
      -------------------
      ${campaigns.map((c) => `${c.name} - ${c.status}`).join("\n")}
    `;
    exportToPDF("campañas.pdf", content);
  };

  return (
    <div>
      <Navbar />
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">Reportes</h2>
        <div className="space-x-4">
          <button
            onClick={handleExportCSV}
            className="bg-primary text-white px-4 py-2 rounded"
          >
            Exportar Clientes (CSV)
          </button>
          <button
            onClick={handleExportPDF}
            className="bg-secondary text-white px-4 py-2 rounded"
          >
            Exportar Campañas (PDF)
          </button>
        </div>
      </div>
    </div>
  );
}

export default Reports;
