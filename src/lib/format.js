// Known field names the OCR service (passport-model/ocr_extractor.py) can
// return in parsed_fields. Anything else falls back to snake_case -> Title
// Case, so a field the model adds later still reads reasonably.
const EXTRACTED_FIELD_LABELS = {
  dob: "Date of Birth",
  document_number: "Document Number",
  document_number_type: "Document Type",
  document_number_valid: "Number Valid",
  expiry_date: "Expiry Date",
  gender: "Gender",
  given_name: "Given Name",
  surname: "Surname",
};

export function fieldLabel(key) {
  if (EXTRACTED_FIELD_LABELS[key]) return EXTRACTED_FIELD_LABELS[key];
  return key
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function initialsFor(name) {
  if (!name) return "";
  return name
    .split(" ")
    .map((p) => p.replace(".", "")[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// Renders a backend ISO timestamp as "12m ago" / "3h ago" / "5d ago", falling
// back to a plain date once it's more than a week old.
export function timeAgo(isoString) {
  if (!isoString) return "";
  const diffMs = Date.now() - new Date(isoString).getTime();
  const minutes = Math.floor(diffMs / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(isoString).toLocaleDateString();
}
