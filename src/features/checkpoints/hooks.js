import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createCheckpoint, getCheckpoint, listCheckpoints, updateCheckpoint } from "./services";

export function useCheckpoints(params = {}) {
  return useQuery({
    queryKey: ["checkpoints", params],
    queryFn: () => listCheckpoints(params),
    placeholderData: [],
  });
}

export function useCheckpoint(code) {
  return useQuery({
    queryKey: ["checkpoints", code],
    queryFn: () => getCheckpoint(code),
    enabled: !!code,
  });
}

export function useCreateCheckpoint() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCheckpoint,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["checkpoints"] });
    },
  });
}

export function useUpdateCheckpoint() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ code, ...payload }) => updateCheckpoint(code, payload),
    onSuccess: (checkpoint, { code }) => {
      queryClient.setQueryData(["checkpoints", code], checkpoint);
      queryClient.invalidateQueries({ queryKey: ["checkpoints"] });
    },
  });
}
