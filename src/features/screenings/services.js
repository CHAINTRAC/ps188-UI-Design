import { api } from "../../lib/api";

export async function submitScreening(formData) {
  const res = await api.post("/screenings", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.data;
}

export async function listScreenings({ verdict, docType, status, checkpointId, decision, decided, cursor, limit = 100 } = {}) {
  const res = await api.get("/screenings", {
    params: {
      verdict,
      doc_type: docType,
      status,
      checkpoint_id: checkpointId,
      decision,
      decided,
      cursor,
      limit,
    },
  });
  return res.data.data;
}

export async function getScreening(id) {
  const res = await api.get(`/screenings/${id}`);
  return res.data.data;
}

export async function decideScreening(id, { decision, reason }) {
  const res = await api.post(`/screenings/${id}/decision`, { decision, reason });
  return res.data.data;
}

export async function fetchScreeningImageBlobUrl(id) {
  const res = await api.get(`/screenings/${id}/image`, { responseType: "blob" });
  return URL.createObjectURL(res.data);
}
