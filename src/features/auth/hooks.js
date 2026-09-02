import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { loginRequest, fetchMe } from "./services";
import { useAuthStore } from "../../store/authStore";

export function useLogin() {
  const setTokens = useAuthStore((s) => s.setTokens);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: loginRequest,
    onSuccess: (data) => {
      setTokens(data.access_token, data.refresh_token);
      queryClient.setQueryData(["me"], data.user);
    },
  });
}

export function useMe(options = {}) {
  const accessToken = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: ["me"],
    queryFn: fetchMe,
    enabled: !!accessToken,
    retry: false,
    ...options,
  });
}

export function useLogout() {
  const clearTokens = useAuthStore((s) => s.clearTokens);
  const queryClient = useQueryClient();

  return () => {
    clearTokens();
    queryClient.clear();
  };
}
