import { useAuthStore } from "../../store/authStore";
import { useNetworkStore } from "../../store/networkStore";
import { useMe } from "../../features/auth/hooks";
import ServiceDown from "../../pages/ServiceDown";

// validates a token that survived from a previous session before rendering any route
export default function AuthBoot({ children }) {
  const accessToken = useAuthStore((s) => s.accessToken);
  const serverDown = useNetworkStore((s) => s.serverDown);
  const { isLoading } = useMe();

  if (serverDown) {
    return <ServiceDown />;
  }

  if (accessToken && isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-canvas">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-line border-t-brand" />
      </div>
    );
  }

  return children;
}
