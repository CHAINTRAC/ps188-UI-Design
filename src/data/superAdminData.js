export const adminsFull = [
  { name: "A. Mehta", initials: "AM", region: "North Zone", team: 14, accuracy: 96.2, email: "a.mehta@ssb.gov.in", joined: "03 Jun 2022" },
  { name: "V. Rao", initials: "VR", region: "East Zone", team: 9, accuracy: 95.7, email: "v.rao@ssb.gov.in", joined: "17 Jan 2023" },
  { name: "S. Bhatt", initials: "SB", region: "West Zone", team: 11, accuracy: 93.4, email: "s.bhatt@ssb.gov.in", joined: "29 Sep 2022" },
  { name: "N. Pillai", initials: "NP", region: "South Zone", team: 12, accuracy: 97.0, email: "n.pillai@ssb.gov.in", joined: "11 Mar 2024" },
];

export const checkpointsFull = [
  { id: "CP-04", region: "North Zone", admin: "A. Mehta", online: "6/6", today: 412, status: "good" },
  { id: "CP-01", region: "North Zone", admin: "A. Mehta", online: "3/3", today: 264, status: "good" },
  { id: "CP-02", region: "North Zone", admin: "A. Mehta", online: "1/2", today: 84, status: "warn" },
  { id: "CP-06", region: "North Zone", admin: "A. Mehta", online: "1/1", today: 58, status: "good" },
  { id: "CP-11", region: "East Zone", admin: "V. Rao", online: "4/5", today: 298, status: "good" },
  { id: "CP-07", region: "West Zone", admin: "S. Bhatt", online: "2/4", today: 176, status: "warn" },
  { id: "CP-19", region: "South Zone", admin: "N. Pillai", online: "5/5", today: 351, status: "good" },
];

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
