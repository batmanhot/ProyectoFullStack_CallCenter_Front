import Navbar from "../components/Navbar";
import { useUserSettings } from "../context/UserSettingsContext";

function Settings() {
  const { settings, updateSettings } = useUserSettings();

  return (
    <div>
      <Navbar />
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">Configuración de Usuario</h2>

        <div className="space-y-4">
          {/* Idioma */}
          <div>
            <label className="block font-semibold mb-1">Idioma</label>
            <select
              value={settings.language}
              onChange={(e) => updateSettings({ language: e.target.value })}
              className="border p-2 rounded"
            >
              <option value="es">Español</option>
              <option value="en">English</option>
            </select>
          </div>

          {/* Tema */}
          <div>
            <label className="block font-semibold mb-1">Tema</label>
            <select
              value={settings.theme}
              onChange={(e) => updateSettings({ theme: e.target.value })}
              className="border p-2 rounded"
            >
              <option value="light">Claro</option>
              <option value="dark">Oscuro</option>
            </select>
          </div>

          {/* Notificaciones */}
          <div>
            <label className="block font-semibold mb-1">Notificaciones Push</label>
            <input
              type="checkbox"
              checked={settings.notifications}
              onChange={(e) => updateSettings({ notifications: e.target.checked })}
              className="mr-2"
            />
            Activar
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
