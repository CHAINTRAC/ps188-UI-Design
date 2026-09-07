import { api } from "../../lib/api";

export async function listAuditLogs({ action, region, cursor, limit = 50 } = {}) {
  const res = await api.get("/audit-logs", { params: { action, region, cursor, limit } });
  return res.data.data;
}
