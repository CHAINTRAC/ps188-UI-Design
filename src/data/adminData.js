export const verifiersFull = [
  { name: "R. Sharma", initials: "RS", checkpoint: "CP-04", online: true, today: 96, accuracy: 97.1, joined: "14 Feb 2024" },
  { name: "K. Nair", initials: "KN", checkpoint: "CP-01", online: true, today: 112, accuracy: 95.4, joined: "02 May 2024" },
  { name: "P. Verma", initials: "PV", checkpoint: "CP-02", online: false, today: 84, accuracy: 94.8, joined: "19 Nov 2023" },
  { name: "S. Iyer", initials: "SI", checkpoint: "CP-04", online: true, today: 101, accuracy: 98.0, joined: "07 Jan 2025" },
  { name: "M. Joshi", initials: "MJ", checkpoint: "CP-06", online: true, today: 58, accuracy: 96.6, joined: "22 Aug 2024" },
  { name: "T. Reddy", initials: "TR", checkpoint: "CP-02", online: false, today: 0, accuracy: 93.9, joined: "30 Mar 2024" },
];

export const verifierHistory = [
  { verifierName: "R. Sharma", ref: "SC-88301", doc: "Passport", verdict: "GENUINE", tone: "good", riskScore: 8, time: "12m ago", checkpoint: "CP-04" },
  { verifierName: "R. Sharma", ref: "SC-88254", doc: "Passport", verdict: "GENUINE", tone: "good", riskScore: 14, time: "6h ago", checkpoint: "CP-04" },
  { verifierName: "R. Sharma", ref: "SC-88291", doc: "Passport", verdict: "SUSPICIOUS", tone: "warn", riskScore: 70, time: "3m ago", checkpoint: "CP-04" },
  { verifierName: "K. Nair", ref: "SC-88296", doc: "Aadhaar", verdict: "GENUINE", tone: "good", riskScore: 4, time: "38m ago", checkpoint: "CP-01" },
  { verifierName: "K. Nair", ref: "SC-88276", doc: "Aadhaar", verdict: "SUSPICIOUS", tone: "warn", riskScore: 58, time: "22m ago", checkpoint: "CP-01" },
  { verifierName: "K. Nair", ref: "SC-88198", doc: "Visa", verdict: "FAKE", tone: "bad", riskScore: 91, time: "1h ago", checkpoint: "CP-01" },
  { verifierName: "P. Verma", ref: "SC-88284", doc: "Visa", verdict: "GENUINE", tone: "good", riskScore: 11, time: "2h ago", checkpoint: "CP-02" },
  { verifierName: "P. Verma", ref: "SC-88240", doc: "Aadhaar", verdict: "GENUINE", tone: "good", riskScore: 6, time: "5h ago", checkpoint: "CP-02" },
  { verifierName: "S. Iyer", ref: "SC-88254", doc: "Passport", verdict: "SUSPICIOUS", tone: "warn", riskScore: 58, time: "48m ago", checkpoint: "CP-04" },
  { verifierName: "S. Iyer", ref: "SC-88271", doc: "Aadhaar", verdict: "GENUINE", tone: "good", riskScore: 6, time: "4h ago", checkpoint: "CP-04" },
  { verifierName: "M. Joshi", ref: "SC-88279", doc: "Passport", verdict: "FAKE", tone: "bad", riskScore: 91, time: "3h ago", checkpoint: "CP-06" },
  { verifierName: "M. Joshi", ref: "SC-88266", doc: "Permit", verdict: "SUSPICIOUS", tone: "warn", riskScore: 58, time: "5h ago", checkpoint: "CP-06" },
];

export const docTypeBreakdown = [
  { doc: "Passport", count: 612 },
  { doc: "Aadhaar", count: 398 },
  { doc: "Visa", count: 201 },
  { doc: "Permit", count: 73 },
];

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
