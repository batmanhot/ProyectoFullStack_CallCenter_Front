import Navbar from "../components/Navbar";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { campaigns as initialCampaigns } from "../data/masterData";

function Campaigns() {
  const [campaigns, setCampaigns] = useLocalStorage("campaigns", initialCampaigns);

  const addCampaign = () => {
    const newCampaign = {
      id: Date.now(),
      name: "Nueva Campaña",
      status: "Planificada",
    };
    setCampaigns([...campaigns, newCampaign]);
  };

  return (
    <div>
      <Navbar />
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">Campañas</h2>
        <button
          onClick={addCampaign}
          className="bg-primary text-white px-4 py-2 rounded mb-4"
        >
          + Agregar Campaña
        </button>
        <ul className="bg-white shadow rounded divide-y">
          {campaigns.map((c) => (
            <li key={c.id} className="p-3 flex justify-between">
              <span>{c.name}</span>
              <span className="text-sm text-gray-600">{c.status}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Campaigns;
