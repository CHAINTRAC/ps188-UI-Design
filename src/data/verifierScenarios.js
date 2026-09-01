export const SCENARIOS = {
  genuine: {
    label: "Genuine Passport",
    verdict: "GENUINE",
    tone: "good",
    riskScore: 8,
    faceMatch: 96,
    ocrFields: [
      { label: "Name", value: "GURPREET SINGH", confidence: 99 },
      { label: "Passport No.", value: "Z1234567", confidence: 99 },
      { label: "Nationality", value: "IND", confidence: 100 },
      { label: "Date of Birth", value: "01 Jan 1985", confidence: 98 },
      { label: "Date of Expiry", value: "01 Mar 2030", confidence: 99 },
      { label: "Gender", value: "M", confidence: 100 },
    ],
    evidence: [
      { tone: "good", text: "MRZ checksum valid — ICAO 9303 (7-3-1 weighted)" },
      { tone: "good", text: "No tampering signal — ELA variance within threshold" },
      { tone: "good", text: "Visual ↔ MRZ cross-match consistent" },
    ],
    summary: "No evidence flags raised. Safe to accept.",
  },
  suspicious: {
    label: "Suspicious — Field Tamper",
    verdict: "SUSPICIOUS",
    tone: "warn",
    riskScore: 70,
    faceMatch: 61,
    ocrFields: [
      { label: "Name", value: "GURPREET SINGH", confidence: 99 },
      { label: "Passport No.", value: "Z1234567", confidence: 99 },
      { label: "Nationality", value: "IND", confidence: 100 },
      { label: "Date of Birth", value: "01 Jan 1985", confidence: 74 },
      { label: "Date of Expiry", value: "01 Mar 2030", confidence: 97 },
      { label: "Gender", value: "M", confidence: 100 },
    ],
    evidence: [
      { tone: "bad", text: "Photo replacement suspected — ELA variance 412 (threshold 350)" },
      { tone: "warn", text: "MRZ checksum mismatch on Date of Birth field" },
      { tone: "warn", text: "Entry stamp texture inconsistent with issuing authority" },
    ],
    summary: "3 evidence flags raised. Manual review required.",
  },
  fake: {
    label: "Fake — Forged Document",
    verdict: "FAKE",
    tone: "bad",
    riskScore: 91,
    faceMatch: 34,
    ocrFields: [
      { label: "Name", value: "GURPREET SINGH", confidence: 88 },
      { label: "Passport No.", value: "Z1234567", confidence: 62 },
      { label: "Nationality", value: "IND", confidence: 95 },
      { label: "Date of Birth", value: "01 Jan 1985", confidence: 51 },
      { label: "Date of Expiry", value: "01 Mar 2030", confidence: 58 },
      { label: "Gender", value: "M", confidence: 90 },
    ],
    evidence: [
      { tone: "bad", text: "MRZ composite checksum failed — expected 6, got 0" },
      { tone: "bad", text: "Photo replacement confirmed — ELA variance 611 (threshold 350)" },
      { tone: "bad", text: "Face match below acceptance threshold (34% vs 85%)" },
      { tone: "bad", text: "Passport number fails ICAO 9303 checkdigit validation" },
    ],
    summary: "4 evidence flags raised, including failed checksums. Reject recommended.",
  },
};

export const STAGES = [
  { key: "ocr", label: "Extracting OCR fields" },
  { key: "checksum", label: "Validating checksums (ICAO 9303 / Verhoeff)" },
  { key: "tamper", label: "Running tamper detection (ELA + CNN)" },
  { key: "face", label: "Matching face" },
];

export const HISTORY = [
  { ref: "SC-88301", doc: "Passport", verdict: "GENUINE", tone: "good", riskScore: 8, time: "12m ago" },
  { ref: "SC-88296", doc: "Aadhaar", verdict: "GENUINE", tone: "good", riskScore: 4, time: "38m ago" },
  { ref: "SC-88291", doc: "Passport", verdict: "SUSPICIOUS", tone: "warn", riskScore: 70, time: "1h ago" },
  { ref: "SC-88284", doc: "Visa", verdict: "GENUINE", tone: "good", riskScore: 11, time: "2h ago" },
  { ref: "SC-88279", doc: "Passport", verdict: "FAKE", tone: "bad", riskScore: 91, time: "3h ago" },
  { ref: "SC-88271", doc: "Aadhaar", verdict: "GENUINE", tone: "good", riskScore: 6, time: "4h ago" },
  { ref: "SC-88266", doc: "Permit", verdict: "SUSPICIOUS", tone: "warn", riskScore: 58, time: "5h ago" },
  { ref: "SC-88254", doc: "Passport", verdict: "GENUINE", tone: "good", riskScore: 14, time: "6h ago" },
];
