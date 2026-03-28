import { Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Clients";
import Campaigns from "./pages/Campaigns";
import Calls from "./pages/Calls";
import Quotes from "./pages/Quotes";
import Reports from "./pages/Reports";
import Login from "./pages/Login";
import { AuditProvider } from "./context/AuditContext";
import Audit from "./pages/Audit";
import Support from "./pages/Support";
import Training from "./pages/Training";
import Documents from "./pages/Documents";
import MultiChannel from "./pages/MultiChannel";
import { ThemeProvider } from "./context/ThemeContext";
import { NotificationProvider } from "./context/NotificationContext";
import Settings from "./pages/Settings";
import { UserSettingsProvider } from "./context/UserSettingsContext";
import Profile from "./pages/Profile";

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user) {
    return <Login />;
  }
  return children;
}

function App() {
  return (
    <AuditProvider>
      <AuthProvider>
       <ThemeProvider>
         <NotificationProvider>
          <UserSettingsProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/clients"
            element={
              <ProtectedRoute>
                <Clients />
              </ProtectedRoute>
            }
          />
          <Route
            path="/campaigns"
            element={
              <ProtectedRoute>
                <Campaigns />
              </ProtectedRoute>
            }
          />
          <Route
            path="/calls"
            element={
              <ProtectedRoute>
                <Calls />
              </ProtectedRoute>
            }
          />
          <Route
            path="/quotes"
            element={
              <ProtectedRoute>
                <Quotes />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <ProtectedRoute>
                <Reports />
              </ProtectedRoute>
            }
          />
          <Route
            path="/audit"
            element={
              <ProtectedRoute>
                <Audit />
              </ProtectedRoute>
            }
          />
          <Route
            path="/support"
            element={
              <ProtectedRoute>
                <Support />
              </ProtectedRoute>
            }
          />
          <Route
            path="/training"
            element={
              <ProtectedRoute>
                <Training />
              </ProtectedRoute>
            }
          />
          <Route path="/documents" element={<Documents />} />
           <Route path="/multichannel" element={<MultiChannel />} />
           <Route path="/settings" element={<Settings />} />
            <Route path="/profile" element={<Profile />} />
        </Routes>
        </UserSettingsProvider>
        </NotificationProvider>
        </ThemeProvider>
      </AuthProvider>
    </AuditProvider>
  );
}

export default App;
