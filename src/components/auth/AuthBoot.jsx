import { useAuthStore } from "../../store/authStore";
import { useMe } from "../../features/auth/hooks";

// validates a token that survived from a previous session before rendering any route
export default function AuthBoot({ children }) {
  const accessToken = useAuthStore((s) => s.accessToken);
  const { isLoading } = useMe();

  if (accessToken && isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-canvas">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-line border-t-brand" />
      </div>
    );
  }

  return children;
}
