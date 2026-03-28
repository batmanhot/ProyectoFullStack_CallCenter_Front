import { createContext, useContext, useState } from "react";
import { useAudit } from "./AuditContext";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const { addLog } = useAudit();

  const login = (username, password) => {
    if (username === "supervisor" && password === "1234") {
      const userData = { name: "Supervisor", role: "Supervisor" };
      setUser(userData);
      addLog("Login exitoso", userData);
      return true;
    }

    if (username === "agente" && password === "1234") {
      const userData = { name: "Agente", role: "Agente" };
      setUser(userData);
      addLog("Login exitoso", userData);
      return true;
    }

    return false;
  };

  const logout = () => {
    addLog("Logout", user);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
