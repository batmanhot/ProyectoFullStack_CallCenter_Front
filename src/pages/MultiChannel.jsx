import Navbar from "../components/Navbar";
import { useLocalStorage } from "../hooks/useLocalStorage";

function MultiChannel() {
  const [interactions, setInteractions] = useLocalStorage("interactions", []);

  const addInteraction = (channel) => {
    const newInteraction = {
      id: Date.now(),
      agent: "Agente Demo",
      client: "Cliente Demo",
      channel,
      message: `Mensaje simulado vía ${channel}`,
      date: new Date().toLocaleString(),
    };
    setInteractions([...interactions, newInteraction]);
  };

  return (
    <div>
      <Navbar />
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">Integración Multicanal</h2>
        <div className="flex space-x-2 mb-4">
          <button
            onClick={() => addInteraction("Teléfono")}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            + Llamada
          </button>
          <button
            onClick={() => addInteraction("Email")}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            + Email
          </button>
          <button
            onClick={() => addInteraction("Chat")}
            className="bg-purple-500 text-white px-4 py-2 rounded"
          >
            + Chat
          </button>
          <button
            onClick={() => addInteraction("WhatsApp")}
            className="bg-yellow-500 text-white px-4 py-2 rounded"
          >
            + WhatsApp
          </button>
        </div>
        <table className="w-full bg-white shadow rounded">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2">Agente</th>
              <th className="p-2">Cliente</th>
              <th className="p-2">Canal</th>
              <th className="p-2">Mensaje</th>
              <th className="p-2">Fecha</th>
            </tr>
          </thead>
          <tbody>
            {interactions.map((i) => (
              <tr key={i.id} className="border-b">
                <td className="p-2">{i.agent}</td>
                <td className="p-2">{i.client}</td>
                <td className="p-2">{i.channel}</td>
                <td className="p-2">{i.message}</td>
                <td className="p-2">{i.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default MultiChannel;
