import { api } from "../../lib/api";

// GET /api/dashboard/summary — role-aware. The backend scopes every number to
// the caller (verifier = self, admin = region, super admin = org) and omits the
// fields that don't apply to the role.
export async function getDashboardSummary() {
  const res = await api.get("/dashboard/summary");
  return res.data.data;
}
