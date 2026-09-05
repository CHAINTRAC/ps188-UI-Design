import { api } from "../../lib/api";

export async function createCheckpoint({ code, region, admin_id }) {
  const res = await api.post("/checkpoints", { code, region, admin_id });
  return res.data.data;
}

export async function listCheckpoints({ region, adminId, cursor, limit = 100 } = {}) {
  const res = await api.get("/checkpoints", { params: { region, admin_id: adminId, cursor, limit } });
  return res.data.data;
}

export async function getCheckpoint(code) {
  const res = await api.get(`/checkpoints/${code}`);
  return res.data.data;
}

export async function updateCheckpoint(code, payload) {
  const res = await api.patch(`/checkpoints/${code}`, payload);
  return res.data.data;
}
