import { api } from "../../lib/api";

export async function createBlacklistEntry({ photo, ...fields }) {
  const form = new FormData();
  for (const [key, value] of Object.entries(fields)) {
    if (value !== undefined && value !== null && value !== "") form.append(key, value);
  }
  if (photo) form.append("photo", photo);
  const res = await api.post("/blacklist", form, { headers: { "Content-Type": "multipart/form-data" } });
  return res.data.data;
}

export async function listBlacklistEntries({ kind, docType, active, q, cursor, limit = 100 } = {}) {
  const res = await api.get("/blacklist", { params: { kind, doc_type: docType, active, q, cursor, limit } });
  return res.data.data;
}

export async function getBlacklistEntry(id) {
  const res = await api.get(`/blacklist/${id}`);
  return res.data.data;
}

export async function fetchBlacklistPhotoBlobUrl(id) {
  const res = await api.get(`/blacklist/${id}/photo`, { responseType: "blob" });
  return URL.createObjectURL(res.data);
}

export async function deactivateBlacklistEntry(id) {
  const res = await api.post(`/blacklist/${id}/deactivate`);
  return res.data.data;
}
