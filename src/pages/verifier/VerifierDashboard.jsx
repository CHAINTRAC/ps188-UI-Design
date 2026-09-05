import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Camera,
  Check,
  FileCheck2,
  RotateCcw,
  ScanFace,
  ScanLine,
  ScanSearch,
  ShieldAlert,
  ShieldCheck,
  TriangleAlert,
  Upload,
  X,
} from "lucide-react";
import Topbar from "../../components/layout/Topbar";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import RiskGauge from "../../components/ui/RiskGauge";
import CameraCaptureModal from "../../components/verifier/CameraCaptureModal";
import { STAGES } from "../../data/verifierScenarios";
import { useSubmitScreening, useDecideScreening } from "../../features/screenings/hooks";
import { useMe } from "../../features/auth/hooks";

const STAGE_ICONS = { ocr: ScanLine, checksum: FileCheck2, tamper: ScanSearch, face: ScanFace, blacklist: ShieldAlert };
const evidenceDot = { good: "bg-good", warn: "bg-warn", bad: "bg-bad" };
const confBadge = (c) => (c >= 0.9 ? "good" : c >= 0.75 ? "warn" : "bad");
const BAND_TONE = { GENUINE: "good", SUSPICIOUS: "warn", FAKE: "bad" };

const DOC_TYPES = [
  { value: "passport", label: "Passport" },
  { value: "visa", label: "Visa" },
  { value: "national_id", label: "National ID" },
  { value: "driving_license", label: "Driving License" },
  { value: "permit", label: "Permit" },
];

async function dataUrlToFile(dataUrl, filename) {
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  return new File([blob], filename, { type: blob.type || "image/jpeg" });
}

export default function VerifierDashboard() {
  const fileInputRef = useRef(null);
  const { data: me } = useMe();
  const submitMutation = useSubmitScreening();
  const decideMutation = useDecideScreening();

  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | ready | processing | done
  const [stageIndex, setStageIndex] = useState(-1);
  const [result, setResult] = useState(null);
  const [reason, setReason] = useState("");
  const [showDocCapture, setShowDocCapture] = useState(false);

  const [docType, setDocType] = useState("passport");
  const [docNumber, setDocNumber] = useState("");
  const [holderName, setHolderName] = useState("");
  const [dob, setDob] = useState("");
  const [nationality, setNationality] = useState("");
  const [expiryDate, setExpiryDate] = useState("");

  useEffect(() => {
    if (!submitMutation.isPending) return;
    setStageIndex(0);
    const id = setInterval(() => {
      setStageIndex((i) => (i < STAGES.length - 1 ? i + 1 : i));
    }, 500);
    return () => clearInterval(id);
  }, [submitMutation.isPending]);

  const reset = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(null);
    setPreviewUrl(null);
    setStatus("idle");
    setStageIndex(-1);
    setResult(null);
    setReason("");
    setDocType("passport");
    setDocNumber("");
    setHolderName("");
    setDob("");
    setNationality("");
    setExpiryDate("");
    submitMutation.reset();
    decideMutation.reset();
  };

  const beginDocument = (nextFile, url) => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(nextFile);
    setPreviewUrl(url);
    setStatus("ready");
    setStageIndex(-1);
    setResult(null);
  };

  const handleFileChange = (e) => {
    const picked = e.target.files?.[0];
    if (!picked) return;
    beginDocument(picked, URL.createObjectURL(picked));
  };

  const handleDocCapture = async (dataUrl) => {
    const captured = await dataUrlToFile(dataUrl, "document.jpg");
    beginDocument(captured, dataUrl);
    setShowDocCapture(false);
  };

  const runScreening = () => {
    if (!file) return;
    setStatus("processing");
    const formData = new FormData();
    formData.append("document", file);
    formData.append("doc_type", docType);
    if (docNumber) formData.append("doc_number", docNumber);
    if (holderName) formData.append("holder_name", holderName);
    if (dob) formData.append("dob", dob);
    if (nationality) formData.append("nationality", nationality);
    if (expiryDate) formData.append("expiry_date", expiryDate);

    submitMutation.mutate(formData, {
      onSuccess: (view) => {
        setStageIndex(STAGES.length);
        setResult(view);
        setStatus("done");
      },
      onError: () => setStatus("ready"),
    });
  };

  const recordDecision = (decision) => {
    if (!result || !reason.trim()) return;
    decideMutation.mutate(
      { id: result.id, decision, reason: reason.trim() },
      { onSuccess: (updated) => setResult(updated) }
    );
  };

  const tone = result ? BAND_TONE[result.verdict_band] ?? "warn" : "good";
  const evidence = result?.engine?.evidence ?? [];
  const extractedFields = result?.engine?.extracted_fields ?? [];
  const decision = result?.officer_decision;

  return (
    <>
      <Topbar
        title="Screen Document"
        subtitle={me?.checkpoint_id ? `Checkpoint ${me.checkpoint_id}` : "Screen a document"}
      />

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[1.35fr_1fr]">
        {/* LEFT */}
        <div className="flex flex-col gap-5">
          <Card delay={0.02}>
            <div className="mb-3.5 flex items-center justify-between">
              <span className="text-[13.5px] font-semibold">Document</span>
              {status !== "idle" && <Badge variant="brand">{DOC_TYPES.find((d) => d.value === docType)?.label}</Badge>}
            </div>

            {status === "idle" && (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex flex-col items-center justify-center gap-2.5 rounded-xl border-2 border-dashed border-line py-11 text-center transition-colors hover:border-brand hover:bg-surface-sunken/50"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-surface-sunken">
                    <Upload size={18} strokeWidth={1.75} className="text-ink-faint" />
                  </div>
                  <span className="text-[13px] font-medium text-ink">Upload a document</span>
                  <span className="px-4 text-[11.5px] text-ink-faint">JPG or PNG · passport, visa, national ID, or permit</span>
                </button>
                <button
                  onClick={() => setShowDocCapture(true)}
                  className="flex flex-col items-center justify-center gap-2.5 rounded-xl border-2 border-dashed border-line py-11 text-center transition-colors hover:border-brand hover:bg-surface-sunken/50"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-surface-sunken">
                    <Camera size={18} strokeWidth={1.75} className="text-ink-faint" />
                  </div>
                  <span className="text-[13px] font-medium text-ink">Capture with camera</span>
                  <span className="px-4 text-[11.5px] text-ink-faint">Scan directly at the checkpoint counter</span>
                </button>
              </div>
            )}

            {status !== "idle" && previewUrl && (
              <div className="relative overflow-hidden rounded-xl border border-line">
                <img src={previewUrl} alt="Document" className="max-h-[280px] w-full object-cover" />
                {status === "processing" && (
                  <span className="scan-beam pointer-events-none absolute inset-x-0 top-0 h-14 bg-gradient-to-b from-brand/35 via-brand/12 to-transparent" />
                )}
              </div>
            )}

            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />

            {status === "ready" && (
              <div className="mt-3.5 grid grid-cols-2 gap-2.5">
                <label className="col-span-2 flex flex-col gap-1">
                  <span className="text-[11px] font-medium text-ink-dim">Document type</span>
                  <select
                    value={docType}
                    onChange={(e) => setDocType(e.target.value)}
                    className="rounded-lg border border-line bg-surface-sunken/50 px-2.5 py-2 text-[12.5px] text-ink outline-none focus:border-brand"
                  >
                    {DOC_TYPES.map((d) => (
                      <option key={d.value} value={d.value}>
                        {d.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-[11px] font-medium text-ink-dim">Document no. (optional)</span>
                  <input
                    value={docNumber}
                    onChange={(e) => setDocNumber(e.target.value)}
                    className="rounded-lg border border-line bg-surface-sunken/50 px-2.5 py-2 text-[12.5px] text-ink outline-none focus:border-brand"
                  />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-[11px] font-medium text-ink-dim">Holder name (optional)</span>
                  <input
                    value={holderName}
                    onChange={(e) => setHolderName(e.target.value)}
                    className="rounded-lg border border-line bg-surface-sunken/50 px-2.5 py-2 text-[12.5px] text-ink outline-none focus:border-brand"
                  />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-[11px] font-medium text-ink-dim">Date of birth (optional)</span>
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="rounded-lg border border-line bg-surface-sunken/50 px-2.5 py-2 text-[12.5px] text-ink outline-none focus:border-brand"
                  />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-[11px] font-medium text-ink-dim">Nationality (optional)</span>
                  <input
                    value={nationality}
                    onChange={(e) => setNationality(e.target.value.toUpperCase())}
                    placeholder="ISO-3, e.g. IND"
                    maxLength={3}
                    className="rounded-lg border border-line bg-surface-sunken/50 px-2.5 py-2 text-[12.5px] text-ink outline-none focus:border-brand"
                  />
                </label>
                <label className="col-span-2 flex flex-col gap-1">
                  <span className="text-[11px] font-medium text-ink-dim">Expiry date (optional)</span>
                  <input
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="rounded-lg border border-line bg-surface-sunken/50 px-2.5 py-2 text-[12.5px] text-ink outline-none focus:border-brand"
                  />
                </label>
              </div>
            )}

            {submitMutation.isError && (
              <div className="mt-3 rounded-lg border border-bad/30 bg-bad-soft px-3.5 py-2.5 text-[12px] font-medium text-bad-ink">
                {submitMutation.error?.response?.data?.error?.message || "Screening failed. Try again."}
              </div>
            )}

            {status === "ready" && (
              <motion.button
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
                onClick={runScreening}
                className="mt-3.5 flex w-full items-center justify-center gap-2 rounded-lg bg-navy py-3 text-[13px] font-semibold text-white shadow-sm"
              >
                <ScanSearch size={15} strokeWidth={2} />
                Run AI Screening
              </motion.button>
            )}

            {status !== "idle" && status !== "ready" && (
              <button
                onClick={reset}
                className="mt-3.5 flex items-center gap-1.5 text-[12px] font-medium text-ink-faint hover:text-ink-dim"
              >
                <RotateCcw size={13} strokeWidth={1.75} />
                Screen a different document
              </button>
            )}
          </Card>

          {(status === "processing" || status === "done") && (
            <Card delay={0.05}>
              <div className="mb-3 text-[13.5px] font-semibold">Pipeline</div>
              <div className="flex flex-col gap-2.5">
                {STAGES.map((s, i) => {
                  const Icon = STAGE_ICONS[s.key];
                  const isDone = status === "done" || i < stageIndex;
                  const isActive = status === "processing" && i === stageIndex;
                  return (
                    <div key={s.key} className="flex items-center gap-3">
                      <div
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border ${
                          isDone
                            ? "border-good bg-good-soft"
                            : isActive
                              ? "border-brand bg-brand-soft"
                              : "border-line bg-surface-sunken"
                        }`}
                      >
                        {isDone ? (
                          <Check size={13} strokeWidth={2.5} className="text-good-ink" />
                        ) : (
                          <Icon size={13} strokeWidth={1.75} className={isActive ? "animate-pulse text-brand-ink" : "text-ink-faint"} />
                        )}
                      </div>
                      <span className={`text-[12.5px] ${isDone ? "text-ink" : isActive ? "font-medium text-ink" : "text-ink-faint"}`}>
                        {s.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}

          {status === "done" && result && (
            <Card delay={0.1}>
              <div className="mb-3 flex items-center justify-between">
                <span className="text-[13.5px] font-semibold">Extracted Fields</span>
                <span className="text-[11px] text-ink-faint">OCR & Extraction Service</span>
              </div>
              <div className="flex flex-col">
                {extractedFields.map((f, i) => (
                  <div
                    key={f.label}
                    className={`grid grid-cols-[130px_1fr_54px] items-center gap-2.5 py-2.5 ${
                      i !== extractedFields.length - 1 ? "border-b border-line-soft" : ""
                    }`}
                  >
                    <span className="text-[12px] text-ink-dim">{f.label}</span>
                    <span className="font-mono text-[13px]">{f.value}</span>
                    <Badge variant={confBadge(f.confidence)} className="justify-center">
                      {Math.round(f.confidence * 100)}%
                    </Badge>
                  </div>
                ))}
                {extractedFields.length === 0 && (
                  <div className="py-3 text-[12px] text-ink-faint">No extracted fields returned.</div>
                )}
              </div>
            </Card>
          )}
        </div>

        {/* RIGHT */}
        <div className="flex flex-col gap-5">
          {status !== "done" && (
            <Card delay={0.04} noPad className="flex flex-col items-center justify-center gap-3 px-5 py-16 text-center">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-surface-sunken">
                <ScanSearch size={18} strokeWidth={1.75} className="text-ink-faint" />
              </div>
              <div>
                <div className="text-[13px] font-medium text-ink">
                  {status === "processing" ? "Screening in progress…" : "Awaiting a document"}
                </div>
                <p className="mt-1 max-w-[220px] text-[12px] text-ink-faint">
                  {status === "processing"
                    ? "Risk score and evidence will appear here once the pipeline finishes."
                    : "Upload a document or capture one to see the risk assessment."}
                </p>
              </div>
            </Card>
          )}

          {status === "done" && result && (
            <>
              <Card delay={0.04}>
                <span className="mb-3.5 block text-[13.5px] font-semibold">Risk Assessment</span>
                <div className="flex items-center gap-5">
                  <RiskGauge score={result.risk_score} tone={tone} />
                  <div className="flex flex-col gap-2">
                    <Badge variant={tone} className="w-fit">
                      {result.verdict}
                    </Badge>
                    <span className="text-[11.5px] leading-relaxed text-ink-dim">Reference {result.reference_no}</span>
                  </div>
                </div>
              </Card>

              <Card delay={0.08} noPad>
                <span className="mb-1 block px-5 pt-5 text-[13.5px] font-semibold">Evidence Breakdown</span>
                <p className="px-5 pb-1 text-[11px] text-ink-faint">Explainability signals from the screening engine.</p>
                <div className="flex flex-col gap-2.5 px-5 pb-4 pt-2">
                  {evidence.map((e, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${evidenceDot[e.tone]}`} />
                      <span className="text-[12px] leading-relaxed text-ink">{e.text}</span>
                    </div>
                  ))}
                  {evidence.length === 0 && (
                    <div className="text-[12px] text-ink-faint">No explainability data returned.</div>
                  )}

                  <div className="mt-2 flex items-start gap-2.5 border-t border-line-soft pt-3">
                    {result.flags?.includes("blacklist_hit") ? (
                      <ShieldAlert size={14} strokeWidth={1.75} className="mt-0.5 shrink-0 text-bad-ink" />
                    ) : (
                      <ShieldCheck size={14} strokeWidth={1.75} className="mt-0.5 shrink-0 text-good-ink" />
                    )}
                    <span className="text-[12px] leading-relaxed text-ink-dim">
                      {result.flags?.includes("blacklist_hit")
                        ? result.blacklist_matches?.[0]?.reason ?? "Matches an active blacklist entry"
                        : "No match against the active blacklist registry"}
                    </span>
                  </div>
                </div>
              </Card>

              <Card delay={0.12}>
                <span className="mb-3 block text-[13.5px] font-semibold">Decision</span>
                <AnimatePresence mode="wait">
                  {decision ? (
                    <motion.div
                      key="recorded"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2.5 rounded-lg border border-good/30 bg-good-soft px-3.5 py-3"
                    >
                      <Check size={16} strokeWidth={2.5} className="shrink-0 text-good-ink" />
                      <span className="text-[12.5px] font-medium text-good-ink">
                        Decision recorded — {decision.decision.toUpperCase()} · logged to audit trail
                      </span>
                    </motion.div>
                  ) : (
                    <motion.div key="form" initial={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      {decideMutation.isError && (
                        <div className="mb-3 rounded-lg border border-bad/30 bg-bad-soft px-3.5 py-2.5 text-[12px] font-medium text-bad-ink">
                          {decideMutation.error?.response?.data?.error?.message || "Could not record decision."}
                        </div>
                      )}
                      <textarea
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="Reason for this decision (required)"
                        className="mb-3 h-14 w-full resize-none rounded-lg border border-line bg-surface-sunken/60 p-2.5 font-sans text-[12px] text-ink outline-none placeholder:text-ink-faint focus:border-brand"
                      />
                      <motion.button
                        whileHover={reason.trim() ? { y: -1 } : {}}
                        whileTap={reason.trim() ? { scale: 0.98 } : {}}
                        onClick={() => recordDecision("accept")}
                        disabled={!reason.trim() || decideMutation.isPending}
                        className="mb-2 flex w-full items-center justify-center gap-2 rounded-lg bg-good py-2.5 text-[13px] font-semibold text-white shadow-sm disabled:opacity-50"
                      >
                        <Check size={16} strokeWidth={2} />
                        Accept Document
                      </motion.button>
                      <div className="flex gap-2">
                        <motion.button
                          whileHover={reason.trim() ? { y: -1 } : {}}
                          whileTap={reason.trim() ? { scale: 0.98 } : {}}
                          onClick={() => recordDecision("escalate")}
                          disabled={!reason.trim() || decideMutation.isPending}
                          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-warn bg-warn-soft py-2.5 text-[12.5px] font-semibold text-warn-ink disabled:opacity-50"
                        >
                          <TriangleAlert size={14} strokeWidth={2} />
                          Escalate
                        </motion.button>
                        <motion.button
                          whileHover={reason.trim() ? { y: -1 } : {}}
                          whileTap={reason.trim() ? { scale: 0.98 } : {}}
                          onClick={() => recordDecision("reject")}
                          disabled={!reason.trim() || decideMutation.isPending}
                          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-bad bg-bad-soft py-2.5 text-[12.5px] font-semibold text-bad-ink disabled:opacity-50"
                        >
                          <X size={14} strokeWidth={2} />
                          Reject
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showDocCapture && (
          <CameraCaptureModal
            title="Document Capture"
            subtitle="Fit the document fully in frame, flat and well-lit."
            facingMode="environment"
            aspect="aspect-[3/2]"
            mirror={false}
            onClose={() => setShowDocCapture(false)}
            onCapture={handleDocCapture}
          />
        )}
      </AnimatePresence>
    </>
  );
}
