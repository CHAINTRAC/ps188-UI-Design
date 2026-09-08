import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  submitScreening,
  listScreenings,
  getScreening,
  decideScreening,
  fetchScreeningImageBlobUrl,
  fetchScreeningSelfieBlobUrl,
} from "./services";

export function useScreenings(filter = {}) {
  return useQuery({
    queryKey: ["screenings", filter],
    queryFn: async () => (await listScreenings(filter)) ?? [],
  });
}

export function useScreening(id) {
  return useQuery({
    queryKey: ["screenings", id],
    queryFn: () => getScreening(id),
    enabled: !!id,
  });
}

// Object URLs must be revoked once nothing references them — this owns that
// lifecycle so callers don't have to think about it.
export function useScreeningImage(id) {
  const [url, setUrl] = useState(null);

  useEffect(() => {
    if (!id) {
      setUrl(null);
      return;
    }
    let cancelled = false;
    let objectUrl = null;
    fetchScreeningImageBlobUrl(id).then((u) => {
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

export function useScreeningSelfie(id) {
  const [url, setUrl] = useState(null);

  useEffect(() => {
    if (!id) {
      setUrl(null);
      return;
    }
    let cancelled = false;
    let objectUrl = null;
    fetchScreeningSelfieBlobUrl(id).then((u) => {
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

export function useSubmitScreening() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: submitScreening,
    onSuccess: (screening) => {
      queryClient.setQueryData(["screenings", screening.id], screening);
      queryClient.invalidateQueries({ queryKey: ["screenings"], exact: false });
      queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
      queryClient.invalidateQueries({ queryKey: ["reports"] });
    },
  });
}

export function useDecideScreening() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, decision, reason }) => decideScreening(id, { decision, reason }),
    onSuccess: (screening) => {
      queryClient.setQueryData(["screenings", screening.id], screening);
      queryClient.invalidateQueries({ queryKey: ["screenings"], exact: false });
      queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
      queryClient.invalidateQueries({ queryKey: ["reports"] });
    },
  });
}
