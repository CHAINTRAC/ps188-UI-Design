// Illustrative-only placeholder — there is no audit-log listing endpoint on
// ps188-backend yet, so the zone audit log on admin/AuditLog.jsx stays mocked
// until one exists.
export const adminAuditLog = [
  { actor: "R. Sharma", action: "decided", ref: "SC-88301", detail: "screening.decided · ACCEPT", time: "12m ago", tone: "good", type: "decision" },
  { actor: "R. Sharma", action: "escalated", ref: "SC-88291", detail: "screening.decided · ESCALATE", time: "3m ago", tone: "warn", type: "decision" },
  { actor: "K. Nair", action: "rejected", ref: "SC-88198", detail: "screening.decided · REJECT", time: "1h ago", tone: "bad", type: "decision" },
  { actor: "A. Mehta", action: "created verifier M. Joshi", ref: null, detail: "user.created · CP-06", time: "2d ago", tone: "brand", type: "user" },
  { actor: "A. Mehta", action: "logged in", ref: null, detail: "auth.login · North Zone", time: "5h ago", tone: "brand", type: "login" },
  { actor: "S. Iyer", action: "escalated", ref: "SC-88254", detail: "screening.decided · ESCALATE", time: "48m ago", tone: "warn", type: "decision" },
  { actor: "P. Verma", action: "logged in", ref: null, detail: "auth.login · CP-02", time: "6h ago", tone: "brand", type: "login" },
  { actor: "M. Joshi", action: "rejected", ref: "SC-88279", detail: "screening.decided · REJECT", time: "3h ago", tone: "bad", type: "decision" },
  { actor: "A. Mehta", action: "updated checkpoint assignment for T. Reddy", ref: null, detail: "user.updated · CP-02", time: "1d ago", tone: "brand", type: "user" },
  { actor: "K. Nair", action: "escalated", ref: "SC-88276", detail: "screening.decided · ESCALATE", time: "22m ago", tone: "warn", type: "decision" },
  { actor: "T. Reddy", action: "logged in", ref: null, detail: "auth.login · CP-02", time: "1d ago", tone: "brand", type: "login" },
  { actor: "A. Mehta", action: "reset password for P. Verma", ref: null, detail: "user.password_reset · CP-02", time: "2d ago", tone: "brand", type: "user" },
];
