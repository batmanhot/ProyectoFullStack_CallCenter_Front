import Navbar from "../components/Navbar";
import { useAudit } from "../context/AuditContext";

function Audit() {
  const { logs } = useAudit();

  return (
    <div>
      <Navbar />
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">Auditoría y Control de Calidad</h2>
        <table className="w-full bg-white shadow rounded">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2">Acción</th>
              <th className="p-2">Usuario</th>
              <th className="p-2">Rol</th>
              <th className="p-2">Fecha</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} className="border-b">
                <td className="p-2">{log.action}</td>
                <td className="p-2">{log.user}</td>
                <td className="p-2">{log.role}</td>
                <td className="p-2">{log.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Audit;
