import Navbar from "../components/Navbar";
import { useLocalStorage } from "../hooks/useLocalStorage";

function Calls() {
  const [calls, setCalls] = useLocalStorage("calls", []);

  const addCall = () => {
    const newCall = {
      id: Date.now(),
      agent: "Juan Ramírez",
      client: "Minera Andina S.A.",
      channel: "Teléfono",
      result: "Contacto exitoso",
      date: new Date().toLocaleString(),
    };
    setCalls([...calls, newCall]);
  };

  return (
    <div>
      <Navbar />
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">Gestión de Llamadas</h2>
        <button
          onClick={addCall}
          className="bg-primary text-white px-4 py-2 rounded mb-4"
        >
          + Registrar Llamada
        </button>
        <table className="w-full bg-white shadow rounded">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2">Agente</th>
              <th className="p-2">Cliente</th>
              <th className="p-2">Canal</th>
              <th className="p-2">Resultado</th>
              <th className="p-2">Fecha</th>
            </tr>
          </thead>
          <tbody>
            {calls.map((call) => (
              <tr key={call.id} className="border-b">
                <td className="p-2">{call.agent}</td>
                <td className="p-2">{call.client}</td>
                <td className="p-2">{call.channel}</td>
                <td className="p-2">{call.result}</td>
                <td className="p-2">{call.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Calls;
