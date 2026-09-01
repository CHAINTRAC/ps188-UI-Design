export const ocrFields = [
  { label: "Name", value: "GURPREET SINGH", confidence: 99 },
  { label: "Passport No.", value: "Z1234567", confidence: 99 },
  { label: "Nationality", value: "IND", confidence: 100 },
  { label: "Date of Birth", value: "01 Jan 1985", confidence: 74 },
  { label: "Date of Expiry", value: "01 Mar 2030", confidence: 97 },
  { label: "Gender", value: "M", confidence: 100 },
];

export const evidence = [
  { tone: "bad", text: "Photo replacement suspected — ELA variance 412 (threshold 350)" },
  { tone: "warn", text: "MRZ checksum mismatch on Date of Birth field" },
  { tone: "warn", text: "Entry stamp texture inconsistent with issuing authority" },
];

export const recentScreenings = [
  { doc: "Aadhaar", verdict: "GENUINE", tone: "good", time: "2m ago" },
  { doc: "Passport", verdict: "FAKE", tone: "bad", time: "14m ago" },
  { doc: "Visa", verdict: "GENUINE", tone: "good", time: "41m ago" },
  { doc: "Passport", verdict: "SUSPICIOUS", tone: "warn", time: "1h ago" },
  { doc: "Aadhaar", verdict: "GENUINE", tone: "good", time: "1h ago" },
];

export const adminStats = [
  { label: "Verifications Today", value: 1284, trend: "up", trendLabel: "8.2%" },
  { label: "Team Accuracy", value: 96.2, decimals: 1, suffix: "%", trend: "up", trendLabel: "1.1%" },
  { label: "Avg Decision Time", value: 38, suffix: "s", trend: "down", trendLabel: "4.5s" },
  { label: "Escalated Cases", value: 12, tone: "warn", accent: true },
];

export const weeklyVolume = [
  { day: "Mon", genuine: 210, suspicious: 38, fake: 16 },
  { day: "Tue", genuine: 246, suspicious: 34, fake: 11 },
  { day: "Wed", genuine: 188, suspicious: 51, fake: 21 },
  { day: "Thu", genuine: 268, suspicious: 33, fake: 14 },
  { day: "Fri", genuine: 274, suspicious: 42, fake: 19 },
  { day: "Sat", genuine: 152, suspicious: 18, fake: 9 },
  { day: "Sun", genuine: 119, suspicious: 12, fake: 6 },
];

export const verifiers = [
  { name: "R. Sharma", checkpoint: "CP-04", online: true, today: 96, accuracy: 97.1 },
  { name: "K. Nair", checkpoint: "CP-01", online: true, today: 112, accuracy: 95.4 },
  { name: "P. Verma", checkpoint: "CP-02", online: false, today: 84, accuracy: 94.8 },
  { name: "S. Iyer", checkpoint: "CP-04", online: true, today: 101, accuracy: 98.0 },
];

export const flaggedCases = [
  { doc: "Passport", ref: "SC-88291", officer: "R. Sharma", checkpoint: "CP-04", time: "3m ago", tone: "bad", verdict: "FAKE" },
  { doc: "Aadhaar", ref: "SC-88276", officer: "K. Nair", checkpoint: "CP-01", time: "22m ago", tone: "warn", verdict: "SUSPICIOUS" },
  { doc: "Passport", ref: "SC-88254", officer: "S. Iyer", checkpoint: "CP-04", time: "48m ago", tone: "warn", verdict: "SUSPICIOUS" },
  { doc: "Visa", ref: "SC-88198", officer: "K. Nair", checkpoint: "CP-01", time: "1h ago", tone: "bad", verdict: "FAKE" },
];

export const orgStats = [
  { label: "Checkpoints", value: 24 },
  { label: "Admins", value: 18 },
  { label: "Verifiers", value: 142 },
  { label: "Screenings Today", value: 8431 },
  { label: "System Accuracy", value: 97.4, decimals: 1, suffix: "%", tone: "good", accent: true },
];

export const checkpoints = [
  { id: "CP-04", region: "North Zone", admin: "A. Mehta", online: "6/6", today: 412, status: "good" },
  { id: "CP-11", region: "East Zone", admin: "V. Rao", online: "4/5", today: 298, status: "good" },
  { id: "CP-07", region: "West Zone", admin: "S. Bhatt", online: "2/4", today: 176, status: "warn" },
  { id: "CP-19", region: "South Zone", admin: "N. Pillai", online: "5/5", today: 351, status: "good" },
  { id: "CP-01", region: "North Zone", admin: "A. Mehta", online: "3/3", today: 264, status: "good" },
];

export const admins = [
  { name: "A. Mehta", region: "North Zone", team: 14, accuracy: 96.2 },
  { name: "V. Rao", region: "East Zone", team: 9, accuracy: 95.7 },
  { name: "S. Bhatt", region: "West Zone", team: 11, accuracy: 93.4 },
  { name: "N. Pillai", region: "South Zone", team: 12, accuracy: 97.0 },
];

export const auditTrail = [
  { actor: "R. Sharma", action: "decided", ref: "SC-88289", detail: "screening.decided · ACCEPT", time: "2m ago", tone: "good" },
  { actor: "D. Kulkarni", action: "created verifier S. Iyer", ref: null, detail: "user.created · CP-04", time: "26m ago", tone: "brand" },
  { actor: "K. Nair", action: "rejected", ref: "SC-88276", detail: "screening.decided · REJECT", time: "41m ago", tone: "bad" },
  { actor: "D. Kulkarni", action: "updated role for V. Rao", ref: null, detail: "user.role_changed · admin", time: "1h ago", tone: "warn" },
  { actor: "A. Mehta", action: "logged in", ref: null, detail: "auth.login · North Zone", time: "2h ago", tone: "brand" },
];
