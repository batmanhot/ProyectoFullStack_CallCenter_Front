import Navbar from "../components/Navbar";
import { useLocalStorage } from "../hooks/useLocalStorage";

function Support() {
  const [tickets, setTickets] = useLocalStorage("supportTickets", []);

  const addTicket = () => {
    const newTicket = {
      id: Date.now(),
      subject: "Problema con llamadas multicanal",
      status: "Abierto",
      agent: "Juan Ramírez",
      date: new Date().toLocaleString(),
    };
    setTickets([...tickets, newTicket]);
  };

  const closeTicket = (id) => {
    setTickets(
      tickets.map((t) =>
        t.id === id ? { ...t, status: "Cerrado" } : t
      )
    );
  };

  return (
    <div>
      <Navbar />
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">Soporte Técnico</h2>
        <button
          onClick={addTicket}
          className="bg-primary text-white px-4 py-2 rounded mb-4"
        >
          + Nuevo Ticket
        </button>
        <table className="w-full bg-white shadow rounded">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2">Asunto</th>
              <th className="p-2">Agente</th>
              <th className="p-2">Estado</th>
              <th className="p-2">Fecha</th>
              <th className="p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket.id} className="border-b">
                <td className="p-2">{ticket.subject}</td>
                <td className="p-2">{ticket.agent}</td>
                <td className="p-2">{ticket.status}</td>
                <td className="p-2">{ticket.date}</td>
                <td className="p-2">
                  {ticket.status === "Abierto" && (
                    <button
                      onClick={() => closeTicket(ticket.id)}
                      className="bg-green-500 text-white px-2 py-1 rounded"
                    >
                      Cerrar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Support;
