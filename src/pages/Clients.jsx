import Navbar from "../components/Navbar";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { clients as initialClients } from "../data/masterData";

function Clients() {
  const [clients, setClients] = useLocalStorage("clients", initialClients);

  const addClient = () => {
    const newClient = {
      id: Date.now(),
      company: "Nueva Empresa",
      contact: "Nuevo Contacto",
      email: "nuevo@empresa.com",
      phone: "+51 900 000 000",
      status: "Prospecto",
    };
    setClients([...clients, newClient]);
  };

  const deleteClient = (id) => {
    setClients(clients.filter((c) => c.id !== id));
  };

  return (
    <div>
      <Navbar />
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">Clientes</h2>
        <button
          onClick={addClient}
          className="bg-primary text-white px-4 py-2 rounded mb-4"
        >
          + Agregar Cliente
        </button>
        <table className="w-full bg-white shadow rounded">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2">Empresa</th>
              <th className="p-2">Contacto</th>
              <th className="p-2">Email</th>
              <th className="p-2">Teléfono</th>
              <th className="p-2">Estado</th>
              <th className="p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client.id} className="border-b">
                <td className="p-2">{client.company}</td>
                <td className="p-2">{client.contact}</td>
                <td className="p-2">{client.email}</td>
                <td className="p-2">{client.phone}</td>
                <td className="p-2">{client.status}</td>
                <td className="p-2">
                  <button
                    onClick={() => deleteClient(client.id)}
                    className="text-red-600 hover:underline"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Clients;
