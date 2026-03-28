import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import NotificationBar from "./NotificationBar";

function Layout({ children }) {
  const { user, logout } = useAuth();
  const { darkMode, setDarkMode } = useTheme();

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 bg-primary text-white flex-col">
        <div className="p-4 font-bold text-lg border-b border-blue-700">
          CallCenter B2B
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link to="/" className="block hover:text-secondary">Dashboard</Link>
          <Link to="/clients" className="block hover:text-secondary">Clientes</Link>
          <Link to="/campaigns" className="block hover:text-secondary">Campañas</Link>
          <Link to="/calls" className="block hover:text-secondary">Llamadas</Link>
          <Link to="/quotes" className="block hover:text-secondary">Cotizaciones</Link>
          <Link to="/reports" className="block hover:text-secondary">Reportes</Link>
          <Link to="/audit" className="block hover:text-secondary">Auditoría</Link>
          <Link to="/documents" className="block hover:text-secondary">Documentos</Link>
          <Link to="/support" className="block hover:text-secondary">Soporte</Link>
          <Link to="/training" className="block hover:text-secondary">Capacitación</Link>
          <Link to="/multichannel" className="block hover:text-secondary">Multicanal</Link>
          <Link to="/settings" className="block hover:text-secondary">Configuración</Link>
          <Link to="/profile" className="block hover:text-secondary">Perfil</Link>
        </nav>
        <div className="p-4 border-t border-blue-700">
          {user ? (
            <div>
              <p className="text-sm mb-2">Usuario: {user.name} ({user.role})</p>
              <button
                onClick={logout}
                className="bg-red-500 text-white px-3 py-1 rounded w-full"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="bg-green-500 text-white px-3 py-1 rounded block text-center">
              Login
            </Link>
          )}
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar superior */}
        <header className="bg-white dark:bg-gray-800 shadow p-4 flex justify-between items-center">
          <h1 className="font-bold text-lg text-gray-900 dark:text-gray-100">Panel de Control</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
            </span>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="bg-secondary text-white px-3 py-1 rounded"
            >
              {darkMode ? "☀️ Claro" : "🌙 Oscuro"}
            </button>
          </div>
        </header>

        {/* Contenido dinámico */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}

export default Layout;
