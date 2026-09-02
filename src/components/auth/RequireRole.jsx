import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { useMe } from "../../features/auth/hooks";

// AuthBoot already resolved /me — this only reads the outcome, never fetches itself
export default function RequireRole({ roles, children }) {
  const accessToken = useAuthStore((s) => s.accessToken);
  const location = useLocation();
  const { data: user, isLoading, isError } = useMe();

  if (!accessToken) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  if (isLoading) return null;
  if (isError || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  if (!roles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
