// Illustrative-only placeholder — there is no audit-log listing endpoint on
// ps188-backend yet, so the org-wide audit feed on SuperAdminDashboard stays
// mocked until one exists.
export const auditTrail = [
  { actor: "R. Sharma", action: "decided", ref: "SC-88289", detail: "screening.decided · ACCEPT", time: "2m ago", tone: "good" },
  { actor: "D. Kulkarni", action: "created verifier S. Iyer", ref: null, detail: "user.created · CP-04", time: "26m ago", tone: "brand" },
  { actor: "K. Nair", action: "rejected", ref: "SC-88276", detail: "screening.decided · REJECT", time: "41m ago", tone: "bad" },
  { actor: "D. Kulkarni", action: "updated role for V. Rao", ref: null, detail: "user.role_changed · admin", time: "1h ago", tone: "warn" },
  { actor: "A. Mehta", action: "logged in", ref: null, detail: "auth.login · North Zone", time: "2h ago", tone: "brand" },
];
