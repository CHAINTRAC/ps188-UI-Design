export const SCENARIOS = {
  genuine: {
    label: "Genuine Passport",
    docType: "PASSPORT",
    verdict: "GENUINE",
    tone: "good",
    riskScore: 8,
    summary: "No evidence flags raised across validation, tampering, or face match. Safe to accept.",
    ocrFields: [
      { label: "Name", value: "GURPREET SINGH", confidence: 99 },
      { label: "Passport No.", value: "Z1234567", confidence: 99 },
      { label: "Nationality", value: "IND", confidence: 100 },
      { label: "Date of Birth", value: "01 Jan 1985", confidence: 98 },
      { label: "Date of Expiry", value: "01 Mar 2030", confidence: 99 },
      { label: "Gender", value: "M", confidence: 100 },
    ],
    validation: {
      status: "pass",
      checks: [
        { label: "MRZ checksum (ICAO 9303, 7-3-1)", status: "pass", detail: "Composite check digit matches" },
        { label: "Document number format", status: "pass", detail: "Matches [A-Z][0-9]{7} pattern" },
        { label: "Visual ↔ MRZ cross-match", status: "pass", detail: "All fields consistent" },
      ],
    },
    tampering: {
      status: "pass",
      cnnScore: 0.91,
      elaVariance: 118,
      elaThreshold: 350,
      detail: "No forensic anomaly — compression pattern uniform across the image",
    },
    faceMatch: { score: 96, threshold: 85, match: true },
    blacklist: { flagged: false, reason: null },
  },

  suspicious: {
    label: "Suspicious — Field Tamper",
    docType: "PASSPORT",
    verdict: "SUSPICIOUS",
    tone: "warn",
    riskScore: 70,
    summary: "Checksum mismatch and a soft tampering signal. Manual review required before accepting.",
    ocrFields: [
      { label: "Name", value: "GURPREET SINGH", confidence: 99 },
      { label: "Passport No.", value: "Z1234567", confidence: 99 },
      { label: "Nationality", value: "IND", confidence: 100 },
      { label: "Date of Birth", value: "01 Jan 1985", confidence: 74 },
      { label: "Date of Expiry", value: "01 Mar 2030", confidence: 97 },
      { label: "Gender", value: "M", confidence: 100 },
    ],
    validation: {
      status: "warn",
      checks: [
        { label: "MRZ checksum (ICAO 9303, 7-3-1)", status: "warn", detail: "Mismatch on Date of Birth check digit" },
        { label: "Document number format", status: "pass", detail: "Matches [A-Z][0-9]{7} pattern" },
        { label: "Visual ↔ MRZ cross-match", status: "warn", detail: "Entry stamp texture inconsistent with issuer" },
      ],
    },
    tampering: {
      status: "warn",
      cnnScore: 0.54,
      elaVariance: 412,
      elaThreshold: 350,
      detail: "Photo replacement suspected — ELA variance above threshold",
    },
    faceMatch: { score: 61, threshold: 85, match: false },
    blacklist: { flagged: false, reason: null },
  },

  fake: {
    label: "Fake — Forged Document",
    docType: "PASSPORT",
    verdict: "FAKE",
    tone: "bad",
    riskScore: 91,
    summary: "Checksum failure, confirmed tampering, and a face mismatch. Reject recommended.",
    ocrFields: [
      { label: "Name", value: "GURPREET SINGH", confidence: 88 },
      { label: "Passport No.", value: "Z1234567", confidence: 62 },
      { label: "Nationality", value: "IND", confidence: 95 },
      { label: "Date of Birth", value: "01 Jan 1985", confidence: 51 },
      { label: "Date of Expiry", value: "01 Mar 2030", confidence: 58 },
      { label: "Gender", value: "M", confidence: 90 },
    ],
    validation: {
      status: "fail",
      checks: [
        { label: "MRZ checksum (ICAO 9303, 7-3-1)", status: "fail", detail: "Composite check digit failed — expected 6, got 0" },
        { label: "Document number format", status: "fail", detail: "Fails [A-Z][0-9]{7} checkdigit validation" },
        { label: "Visual ↔ MRZ cross-match", status: "fail", detail: "3 of 6 fields inconsistent with MRZ" },
      ],
    },
    tampering: {
      status: "fail",
      cnnScore: 0.12,
      elaVariance: 611,
      elaThreshold: 350,
      detail: "Photo replacement confirmed — ELA variance far above threshold",
    },
    faceMatch: { score: 34, threshold: 85, match: false },
    blacklist: { flagged: false, reason: null },
  },

  blacklisted: {
    label: "Blacklisted — Reported Stolen",
    docType: "AADHAAR",
    verdict: "FAKE",
    tone: "bad",
    riskScore: 88,
    summary: "Document reads as genuine, but the number matches an active blacklist entry. Reject and detain per protocol.",
    ocrFields: [
      { label: "Name", value: "ARJUN MEHTA", confidence: 97 },
      { label: "Aadhaar No.", value: "2345 6789 0123", confidence: 98 },
      { label: "Date of Birth", value: "14 Jun 1990", confidence: 96 },
      { label: "Gender", value: "M", confidence: 99 },
    ],
    validation: {
      status: "pass",
      checks: [
        { label: "Verhoeff checksum (D5 group)", status: "pass", detail: "12-digit number passes checksum" },
        { label: "ID-1 card geometry (ISO/IEC 7810)", status: "pass", detail: "Aspect ratio 1.58 — within 1.50–1.70" },
        { label: "QR code cross-match", status: "pass", detail: "Decoded QR matches printed fields" },
      ],
    },
    tampering: {
      status: "pass",
      cnnScore: 0.88,
      elaVariance: 96,
      elaThreshold: 350,
      detail: "No forensic anomaly detected",
    },
    faceMatch: { score: 93, threshold: 85, match: true },
    blacklist: { flagged: true, reason: "Reported stolen — FIR 2026/0417, filed 14 Aug 2026" },
  },
};

export const STAGES = [
  { key: "ocr", label: "Extracting fields (OCR)" },
  { key: "checksum", label: "Validating checksums (ICAO 9303 / Verhoeff)" },
  { key: "tamper", label: "Running tamper detection (CNN + ELA)" },
  { key: "face", label: "Matching live capture to document photo" },
  { key: "blacklist", label: "Checking blacklist registry" },
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
