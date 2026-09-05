import { api } from "../../lib/api";

export async function createBlacklistEntry(payload) {
  const res = await api.post("/blacklist", payload);
  return res.data.data;
}

export async function listBlacklistEntries({ kind, active, cursor, limit = 100 } = {}) {
  const res = await api.get("/blacklist", { params: { kind, active, cursor, limit } });
  return res.data.data;
}

export async function getBlacklistEntry(id) {
  const res = await api.get(`/blacklist/${id}`);
  return res.data.data;
}

export async function deactivateBlacklistEntry(id) {
  const res = await api.post(`/blacklist/${id}/deactivate`);
  return res.data.data;
}
