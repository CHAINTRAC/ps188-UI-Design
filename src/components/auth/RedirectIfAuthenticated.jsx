import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { useMe } from "../../features/auth/hooks";
import { dashboardPathFor } from "../../config/roles";

// The inverse of RequireRole: keeps an already-authenticated visitor off the
// public landing/login pages, sending them straight to their dashboard.
export default function RedirectIfAuthenticated({ children }) {
  const accessToken = useAuthStore((s) => s.accessToken);
  const { data: user } = useMe();

  if (accessToken && user) {
    return <Navigate to={dashboardPathFor(user.role)} replace />;
  }
  return children;
}
