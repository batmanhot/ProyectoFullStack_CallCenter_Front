import Navbar from "../components/Navbar";
import { useAudit } from "../context/AuditContext";
import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../context/NotificationContext";
import { useLocalStorage } from "../hooks/useLocalStorage";

function Quotes() {
  const { addLog } = useAudit();
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [quotes, setQuotes] = useLocalStorage("quotes", [
    {
      id: 1,
      client: "Minera Andina S.A.",
      product: "Planchas de metal",
      amount: 1200,
      status: "Pendiente",
      date: new Date().toLocaleDateString(),
    },
    {
      id: 2,
      client: "Metalurgica del Sur",
      product: "Carbon para motores",
      amount: 800,
      status: "Pendiente",
      date: new Date().toLocaleDateString(),
    },
  ]);

  const addQuote = () => {
    const newQuote = {
      id: Date.now(),
      client: "Nuevo cliente B2B",
      product: "Servicio consultivo",
      amount: 1500,
      status: "Pendiente",
      date: new Date().toLocaleDateString(),
    };

    setQuotes([...quotes, newQuote]);
    addLog("Cotizacion creada", user);
    addNotification("Cotizacion creada con exito", "success");
  };

  const approveQuote = (id) => {
    setQuotes(
      quotes.map((quote) =>
        quote.id === id ? { ...quote, status: "Aprobada" } : quote
      )
    );
    addLog("Cotizacion aprobada", user);
    addNotification("Cotizacion aprobada con exito", "success");
  };

  const rejectQuote = (id) => {
    setQuotes(
      quotes.map((quote) =>
        quote.id === id ? { ...quote, status: "Rechazada" } : quote
      )
    );
    addLog("Cotizacion rechazada", user);
    addNotification("Cotizacion rechazada", "error");
  };

  return (
    <div>
      <Navbar />
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">Cotizaciones</h2>
        <button
          onClick={addQuote}
          className="bg-primary text-white px-4 py-2 rounded mb-4"
        >
          + Nueva Cotizacion
        </button>
        <table className="w-full bg-white shadow rounded">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2">Cliente</th>
              <th className="p-2">Producto</th>
              <th className="p-2">Monto</th>
              <th className="p-2">Estado</th>
              <th className="p-2">Fecha</th>
              <th className="p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {quotes.map((quote) => (
              <tr key={quote.id} className="border-b">
                <td className="p-2">{quote.client}</td>
                <td className="p-2">{quote.product}</td>
                <td className="p-2">${quote.amount.toLocaleString()}</td>
                <td className="p-2">{quote.status}</td>
                <td className="p-2">{quote.date}</td>
                <td className="p-2 space-x-2">
                  {quote.status === "Pendiente" && (
                    <>
                      <button
                        onClick={() => approveQuote(quote.id)}
                        className="bg-green-500 text-white px-2 py-1 rounded"
                      >
                        Aprobar
                      </button>
                      <button
                        onClick={() => rejectQuote(quote.id)}
                        className="bg-red-500 text-white px-2 py-1 rounded"
                      >
                        Rechazar
                      </button>
                    </>
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

export default Quotes;
