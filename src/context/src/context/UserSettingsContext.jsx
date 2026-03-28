import { createContext, useContext, useState } from "react";

const UserSettingsContext = createContext();

export function UserSettingsProvider({ children }) {
  const [settings, setSettings] = useState(() => {
    const saved = window.localStorage.getItem("userSettings");
    return saved ? JSON.parse(saved) : {
      language: "es",
      theme: "light",
      notifications: true,
    };
  });

  const updateSettings = (newSettings) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    window.localStorage.setItem("userSettings", JSON.stringify(updated));
  };

  return (
    <UserSettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </UserSettingsContext.Provider>
  );
}

export function useUserSettings() {
  return useContext(UserSettingsContext);
}
