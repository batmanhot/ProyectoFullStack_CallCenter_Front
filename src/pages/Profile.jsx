import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";
import { useAudit } from "../context/AuditContext";

function Profile() {
  const { user } = useAuth();
  const { logs } = useAudit();

  if (!user) {
    return (
      <Layout>
        <p className="text-red-600">Debes iniciar sesión para ver tu perfil.</p>
      </Layout>
    );
  }

  return (
    <Layout>
      <h2 className="text-xl font-bold mb-4">Perfil de Usuario</h2>
      <div className="bg-white dark:bg-gray-800 shadow rounded p-6 flex items-center space-x-6 mb-6">
        {/* Foto de perfil simulada */}
        <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center text-2xl font-bold">
          {user.name.charAt(0)}
        </div>
        <div>
          <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{user.name}</p>
          <p className="text-sm text-gray-600 dark:text-gray-300">Rol: {user.role}</p>
          <p className="text-sm text-gray-600 dark:text-gray-300">Email: {user.name.toLowerCase()}@empresa.com</p>
        </div>
      </div>

      <h3 className="text-lg font-bold mb-2">Historial de Actividad</h3>
      <table className="w-full bg-white dark:bg-gray-800 shadow rounded">
        <thead>
          <tr className="bg-gray-200 dark:bg-gray-700">
            <th className="p-2">Acción</th>
            <th className="p-2">Fecha</th>
          </tr>
        </thead>
        <tbody>
          {logs
            .filter((log) => log.user === user.name)
            .map((log) => (
              <tr key={log.id} className="border-b dark:border-gray-600">
                <td className="p-2 text-gray-800 dark:text-gray-200">{log.action}</td>
                <td className="p-2 text-gray-600 dark:text-gray-400">{log.date}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </Layout>
  );
}

export default Profile;
