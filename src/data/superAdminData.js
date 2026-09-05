// Illustrative-only placeholder — there is no audit-log listing endpoint on
// ps188-backend yet, so the org-wide audit trail on superadmin/AuditTrail.jsx
// stays mocked until one exists.
export const orgAuditLog = [
  { actor: "R. Sharma", action: "decided", ref: "SC-88289", detail: "screening.decided · ACCEPT · CP-04", time: "2m ago", tone: "good", type: "decision" },
  { actor: "D. Kulkarni", action: "created verifier S. Iyer", ref: null, detail: "user.created · CP-04", time: "26m ago", tone: "brand", type: "user" },
  { actor: "K. Nair", action: "rejected", ref: "SC-88276", detail: "screening.decided · REJECT · CP-01", time: "41m ago", tone: "bad", type: "decision" },
  { actor: "D. Kulkarni", action: "updated role for V. Rao", ref: null, detail: "user.role_changed · admin", time: "1h ago", tone: "warn", type: "user" },
  { actor: "A. Mehta", action: "logged in", ref: null, detail: "auth.login · North Zone", time: "2h ago", tone: "brand", type: "login" },
  { actor: "S. Bhatt", action: "escalated", ref: "SC-88240", detail: "screening.decided · ESCALATE · CP-07", time: "3h ago", tone: "warn", type: "decision" },
  { actor: "N. Pillai", action: "logged in", ref: null, detail: "auth.login · South Zone", time: "4h ago", tone: "brand", type: "login" },
  { actor: "D. Kulkarni", action: "created admin S. Bhatt", ref: null, detail: "user.created · West Zone", time: "1d ago", tone: "brand", type: "user" },
  { actor: "V. Rao", action: "created verifier at CP-11", ref: null, detail: "user.created · East Zone", time: "1d ago", tone: "brand", type: "user" },
  { actor: "K. Nair", action: "escalated", ref: "SC-88198", detail: "screening.decided · ESCALATE · CP-01", time: "1d ago", tone: "warn", type: "decision" },
  { actor: "D. Kulkarni", action: "registered checkpoint CP-19", ref: null, detail: "checkpoint.created · South Zone", time: "2d ago", tone: "brand", type: "user" },
  { actor: "S. Bhatt", action: "logged in", ref: null, detail: "auth.login · West Zone", time: "2d ago", tone: "brand", type: "login" },
  { actor: "N. Pillai", action: "rejected", ref: "SC-88112", detail: "screening.decided · REJECT · CP-19", time: "2d ago", tone: "bad", type: "decision" },
  { actor: "D. Kulkarni", action: "updated org settings", ref: null, detail: "org.settings_updated · security policy", time: "3d ago", tone: "brand", type: "user" },
];
