import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createBlacklistEntry, listBlacklistEntries, deactivateBlacklistEntry } from "./services";

export function useBlacklist(params = {}) {
  return useQuery({
    queryKey: ["blacklist", params],
    queryFn: () => listBlacklistEntries(params),
    placeholderData: [],
  });
}

export function useCreateBlacklistEntry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createBlacklistEntry,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["blacklist"] }),
  });
}

export function useDeactivateBlacklistEntry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => deactivateBlacklistEntry(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["blacklist"] }),
  });
}
