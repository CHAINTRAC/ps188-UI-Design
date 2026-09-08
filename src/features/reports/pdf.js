import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

// Brand-ish, print-safe palette (RGB).
const NAVY = [23, 32, 46];
const WHITE = [255, 255, 255];
const INK = [28, 32, 40];
const FAINT = [122, 130, 142];
const LINE = [226, 229, 234];
const ZEBRA = [248, 249, 250];
const WARN = [176, 124, 36];
const BAD = [176, 58, 46];

const stampFmt = new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" });

/**
 * Build and download a formatted A4 PDF of the regional screening report.
 * The caller passes the already-merged view models (labels resolved, verifier
 * head-counts joined) so this module stays presentation-only.
 */
export function downloadReportsPdf({
  region,
  generatedBy,
  kpis, // { total, fakeRate, escalated, avgSeconds }
  weeklyVolume, // [{ day, genuine, suspicious, fake }]
  docTypeBreakdown, // [{ doc, count }]
  checkpointBreakdown, // [{ checkpoint, verifiers, today, total? }]
}) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const W = doc.internal.pageSize.getWidth();
  const M = 40;
  const now = new Date();

  // ---------- header band ----------
  doc.setFillColor(...NAVY);
  doc.rect(0, 0, W, 82, "F");
  doc.setTextColor(...WHITE);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(17);
  doc.text("SENTINEL", M, 34);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10.5);
  doc.setTextColor(188, 197, 208);
  doc.text("Regional Screening Report", M, 52);
  doc.setFontSize(8.5);
  doc.text(
    [region || "All regions", `Generated ${stampFmt.format(now)}`, generatedBy && `by ${generatedBy}`]
      .filter(Boolean)
      .join("   ·   "),
    M,
    68,
  );

  let y = 108;

  // ---------- KPI cards ----------
  const cards = [
    { label: "Total Screenings", value: String(kpis.total ?? 0), color: INK },
    { label: "Fake Detection Rate", value: `${Number(kpis.fakeRate ?? 0).toFixed(1)}%`, color: BAD },
    { label: "Escalated Cases", value: String(kpis.escalated ?? 0), color: WARN },
    { label: "Avg Decision Time", value: `${kpis.avgSeconds ?? 0}s`, color: INK },
  ];
  const gap = 12;
  const cw = (W - M * 2 - gap * 3) / 4;
  cards.forEach((c, i) => {
    const x = M + i * (cw + gap);
    doc.setDrawColor(...LINE);
    doc.setLineWidth(0.8);
    doc.roundedRect(x, y, cw, 52, 4, 4, "S");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(...FAINT);
    doc.text(c.label.toUpperCase(), x + 10, y + 16);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(15);
    doc.setTextColor(...c.color);
    doc.text(c.value, x + 10, y + 39);
  });
  y += 52 + 28;

  const base = {
    margin: { left: M, right: M },
    styles: { font: "helvetica", fontSize: 9, cellPadding: 6, textColor: INK, lineColor: LINE, lineWidth: 0.5 },
    headStyles: { fillColor: NAVY, textColor: WHITE, fontStyle: "bold", fontSize: 8 },
    alternateRowStyles: { fillColor: ZEBRA },
  };

  const section = (title, opts) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...INK);
    doc.text(title, M, y);
    autoTable(doc, { ...base, startY: y + 8, ...opts });
    y = doc.lastAutoTable.finalY + 26;
  };

  section("Screenings This Week", {
    head: [["Day", "Genuine", "Suspicious", "Fake", "Total"]],
    body: (weeklyVolume ?? []).map((d) => [
      d.day,
      d.genuine,
      d.suspicious,
      d.fake,
      d.genuine + d.suspicious + d.fake,
    ]),
    columnStyles: {
      1: { halign: "right" },
      2: { halign: "right" },
      3: { halign: "right" },
      4: { halign: "right", fontStyle: "bold" },
    },
  });

  const docTotal = (docTypeBreakdown ?? []).reduce((s, d) => s + d.count, 0) || 1;
  section("By Document Type", {
    head: [["Document Type", "Count", "Share"]],
    body: (docTypeBreakdown ?? []).map((d) => [d.doc, d.count, `${((d.count / docTotal) * 100).toFixed(1)}%`]),
    columnStyles: { 1: { halign: "right" }, 2: { halign: "right" } },
  });

  section("By Checkpoint", {
    head: [["Checkpoint", "Verifiers", "Screened Today", "Total"]],
    body: (checkpointBreakdown ?? []).map((c) => [
      c.checkpoint,
      c.verifiers,
      c.today,
      c.total ?? "—",
    ]),
    columnStyles: { 1: { halign: "right" }, 2: { halign: "right" }, 3: { halign: "right" } },
  });

  // ---------- footer on every page ----------
  const pages = doc.internal.getNumberOfPages();
  const H = doc.internal.pageSize.getHeight();
  for (let p = 1; p <= pages; p++) {
    doc.setPage(p);
    doc.setDrawColor(...LINE);
    doc.setLineWidth(0.5);
    doc.line(M, H - 32, W - M, H - 32);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(...FAINT);
    doc.text("Confidential · Sentinel — SSB, Police II Division", M, H - 18);
    doc.text(`Page ${p} of ${pages}`, W - M, H - 18, { align: "right" });
  }

  const slug = (region || "all-regions").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  doc.save(`sentinel-report-${slug}-${now.toISOString().slice(0, 10)}.pdf`);
}
