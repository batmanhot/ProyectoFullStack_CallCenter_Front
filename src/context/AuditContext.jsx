import { createContext, useContext, useState } from "react";

const AuditContext = createContext();

export function AuditProvider({ children }) {
  const [logs, setLogs] = useState(() => {
    try {
      const savedLogs = window.localStorage.getItem("auditLogs");
      return savedLogs ? JSON.parse(savedLogs) : [];
    } catch (error) {
      console.error(error);
      return [];
    }
  });

  const addLog = (action, user) => {
    const newLog = {
      id: Date.now(),
      action,
      user: user?.name || "Desconocido",
      role: user?.role || "N/A",
      date: new Date().toLocaleString(),
    };
    setLogs((prev) => {
      const updatedLogs = [...prev, newLog];
      window.localStorage.setItem("auditLogs", JSON.stringify(updatedLogs));
      return updatedLogs;
    });
  };

  return (
    <AuditContext.Provider value={{ logs, addLog }}>
      {children}
    </AuditContext.Provider>
  );
}

export function useAudit() {
  return useContext(AuditContext);
}
