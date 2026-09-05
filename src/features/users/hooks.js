import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createUser, listUsers, resetUserPassword, changeOwnPassword } from "./services";

export function useUsers(params = {}) {
  return useQuery({
    queryKey: ["users", params],
    queryFn: () => listUsers(params),
    select: (data) => data ?? [],
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      // responses are a single new user, not the full varying-filter list — invalidate rather than patch
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

export function useResetUserPassword() {
  return useMutation({
    mutationFn: (id) => resetUserPassword(id),
  });
}

export function useChangeOwnPassword() {
  return useMutation({
    mutationFn: changeOwnPassword,
  });
}
