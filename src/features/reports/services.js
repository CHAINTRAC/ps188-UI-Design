import { api } from "../../lib/api";

// GET /api/reports — admin sees their own region; a super admin sees the org, or
// one region via ?region=.
export async function getReports({ region } = {}) {
  const res = await api.get("/reports", { params: { region } });
  return res.data.data;
}
