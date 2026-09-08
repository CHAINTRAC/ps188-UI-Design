import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createBlacklistEntry,
  listBlacklistEntries,
  deactivateBlacklistEntry,
  fetchBlacklistPhotoBlobUrl,
} from "./services";

export function useBlacklist(params = {}) {
  return useQuery({
    queryKey: ["blacklist", params],
    queryFn: () => listBlacklistEntries(params),
    placeholderData: [],
  });
}

// Same object-URL lifecycle as useScreeningImage — owns revoking the blob URL.
export function useBlacklistPhoto(id) {
  const [url, setUrl] = useState(null);

  useEffect(() => {
    if (!id) {
      setUrl(null);
      return;
    }
    let cancelled = false;
    let objectUrl = null;
    fetchBlacklistPhotoBlobUrl(id).then((u) => {
      if (cancelled) {
        URL.revokeObjectURL(u);
        return;
      }
      objectUrl = u;
      setUrl(u);
    });
    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [id]);

  return url;
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
