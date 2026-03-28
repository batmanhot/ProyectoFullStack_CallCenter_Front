import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-primary text-white px-6 py-3 flex justify-between">
      <h1 className="font-bold text-lg">CallCenter B2B</h1>
      <div className="space-x-4">
        <Link to="/" className="hover:text-secondary">Dashboard</Link>
        <Link to="/clients" className="hover:text-secondary">Clientes</Link>
        <Link to="/campaigns" className="hover:text-secondary">Campañas</Link>
        <Link to="/calls" className="hover:text-secondary">Llamadas</Link>
        <Link to="/quotes" className="hover:text-secondary">Cotizaciones</Link>
        <Link to="/reports" className="hover:text-secondary">Reportes</Link>
        <Link to="/audit" className="hover:text-secondary">Auditoría</Link>
        <Link to="/support" className="hover:text-secondary">Soporte</Link>
        <Link to="/training" className="hover:text-secondary">Capacitación</Link>
        <Link to="/documents" className="hover:text-secondary">Documentos</Link>
        <Link to="/multichannel" className="hover:text-secondary">Multicanal</Link>

      </div>
    </nav>
  );
}

export default Navbar;
