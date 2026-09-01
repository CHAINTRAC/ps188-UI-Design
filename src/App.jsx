import { BrowserRouter, Route, Routes } from "react-router-dom";
import { FileBarChart2, History, MapPinned, ScrollText, Settings2, UserCircle2, Users } from "lucide-react";
import AppShell from "./components/layout/AppShell";
import EmptyState from "./components/ui/EmptyState";
import Landing from "./pages/Landing";
import SignIn from "./pages/SignIn";
import VerifierDashboard from "./pages/verifier/VerifierDashboard";
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

          <Route element={<AppShell role={ROLES.verifier} />}>
            <Route path="/verifier" element={<VerifierDashboard />} />
            <Route
              path="/verifier/history"
              element={<Placeholder role={ROLES.verifier} title="My History" Icon={History} />}
            />
            <Route
              path="/verifier/profile"
              element={<Placeholder role={ROLES.verifier} title="Profile" Icon={UserCircle2} />}
            />
          </Route>

          <Route element={<AppShell role={ROLES.admin} />}>
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
          </Route>

          <Route element={<AppShell role={ROLES.superadmin} />}>
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
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
