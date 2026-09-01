import { BrowserRouter, Route, Routes } from "react-router-dom";
import HeaderShell from "./components/layout/HeaderShell";
import Landing from "./pages/Landing";
import SignIn from "./pages/SignIn";
import Profile from "./pages/Profile";
import VerifierDashboard from "./pages/verifier/VerifierDashboard";
import VerifierHistory from "./pages/verifier/VerifierHistory";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Verifiers from "./pages/admin/Verifiers";
import Reports from "./pages/admin/Reports";
import AuditLog from "./pages/admin/AuditLog";
import SuperAdminDashboard from "./pages/superadmin/SuperAdminDashboard";
import Admins from "./pages/superadmin/Admins";
import Checkpoints from "./pages/superadmin/Checkpoints";
import AuditTrail from "./pages/superadmin/AuditTrail";
import Settings from "./pages/superadmin/Settings";
import { ROLES } from "./config/roles";
import { ThemeProvider } from "./context/ThemeContext";

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<SignIn />} />

          <Route element={<HeaderShell role={ROLES.verifier} />}>
            <Route path="/verifier" element={<VerifierDashboard />} />
            <Route path="/verifier/history" element={<VerifierHistory />} />
            <Route path="/verifier/profile" element={<Profile role={ROLES.verifier} />} />
          </Route>

          <Route element={<HeaderShell role={ROLES.admin} />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/verifiers" element={<Verifiers />} />
            <Route path="/admin/reports" element={<Reports />} />
            <Route path="/admin/audit-log" element={<AuditLog />} />
            <Route path="/admin/profile" element={<Profile role={ROLES.admin} />} />
          </Route>

          <Route element={<HeaderShell role={ROLES.superadmin} />}>
            <Route path="/super-admin" element={<SuperAdminDashboard />} />
            <Route path="/super-admin/admins" element={<Admins />} />
            <Route path="/super-admin/checkpoints" element={<Checkpoints />} />
            <Route path="/super-admin/audit-trail" element={<AuditTrail />} />
            <Route path="/super-admin/settings" element={<Settings />} />
            <Route path="/super-admin/profile" element={<Profile role={ROLES.superadmin} />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
