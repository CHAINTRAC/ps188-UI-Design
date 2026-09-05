// Cosmetic-only stepper labels shown while a screening submission is in
// flight — the backend has no incremental progress events, POST /screenings
// returns the final result in one call, so this is purely a loading sequence.
export const STAGES = [
  { key: "ocr", label: "Extracting fields (OCR)" },
  { key: "checksum", label: "Validating checksums (ICAO 9303 / Verhoeff)" },
  { key: "tamper", label: "Running tamper detection (CNN + ELA)" },
  { key: "face", label: "Matching live capture to document photo" },
  { key: "blacklist", label: "Checking blacklist registry" },
];
