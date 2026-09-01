import { BrowserRouter, Route, Routes } from "react-router-dom";
import { FileBarChart2, MapPinned, ScrollText, Settings2, Users } from "lucide-react";
import HeaderShell from "./components/layout/HeaderShell";
import EmptyState from "./components/ui/EmptyState";
import Landing from "./pages/Landing";
import SignIn from "./pages/SignIn";
import Profile from "./pages/Profile";
import VerifierDashboard from "./pages/verifier/VerifierDashboard";
import VerifierHistory from "./pages/verifier/VerifierHistory";
import AdminDashboard from "./pages/admin/AdminDashboard";
import SuperAdminDashboard from "./pages/superadmin/SuperAdminDashboard";
import { ROLES } from "./config/roles";
import { ThemeProvider } from "./context/ThemeContext";

function Placeholder({ role, title, Icon }) {
  return (
    <EmptyState
      role={role}
      title={title}
      subtitle={role.tagline}
      description="This section is scoped for a future build pass — not part of the current design sprint."
      Icon={Icon}
    />
  );
}

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
            <Route
              path="/admin/verifiers"
              element={<Placeholder role={ROLES.admin} title="Verifiers" Icon={Users} />}
            />
            <Route
              path="/admin/reports"
              element={<Placeholder role={ROLES.admin} title="Reports" Icon={FileBarChart2} />}
            />
            <Route
              path="/admin/audit-log"
              element={<Placeholder role={ROLES.admin} title="Audit Log" Icon={ScrollText} />}
            />
            <Route path="/admin/profile" element={<Profile role={ROLES.admin} />} />
          </Route>

          <Route element={<HeaderShell role={ROLES.superadmin} />}>
            <Route path="/super-admin" element={<SuperAdminDashboard />} />
            <Route
              path="/super-admin/admins"
              element={<Placeholder role={ROLES.superadmin} title="Admins" Icon={Users} />}
            />
            <Route
              path="/super-admin/checkpoints"
              element={<Placeholder role={ROLES.superadmin} title="Checkpoints" Icon={MapPinned} />}
            />
            <Route
              path="/super-admin/audit-trail"
              element={<Placeholder role={ROLES.superadmin} title="Audit Trail" Icon={ScrollText} />}
            />
            <Route
              path="/super-admin/settings"
              element={<Placeholder role={ROLES.superadmin} title="Settings" Icon={Settings2} />}
            />
            <Route path="/super-admin/profile" element={<Profile role={ROLES.superadmin} />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
