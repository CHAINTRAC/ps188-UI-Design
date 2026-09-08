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
  User,
  UserCheck,
  UserX,
  X,
} from "lucide-react";
import Topbar from "../../components/layout/Topbar";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import RiskGauge from "../../components/ui/RiskGauge";
import CameraCaptureModal from "../../components/verifier/CameraCaptureModal";
import { STAGES } from "../../data/verifierScenarios";
import { useSubmitScreening, useDecideScreening, useScreeningSelfie } from "../../features/screenings/hooks";
import { useMe } from "../../features/auth/hooks";
import { useDashboardSummary } from "../../features/dashboard/hooks";
import { fieldLabel } from "../../lib/format";

const STAGE_ICONS = { ocr: ScanLine, checksum: FileCheck2, tamper: ScanSearch, face: ScanFace, blacklist: ShieldAlert };
const evidenceDot = { good: "bg-good", warn: "bg-warn", bad: "bg-bad" };
const BAND_TONE = { GENUINE: "good", SUSPICIOUS: "warn", FAKE: "bad" };

// The screening model classifies the document type itself — the officer no
// longer picks one. Kept as a label lookup for the detected type.
const DOC_LABEL = {
  passport: "Passport",
  visa: "Visa",
  national_id: "National ID",
  driving_license: "Driving License",
  permit: "Permit",
};

async function dataUrlToFile(dataUrl, filename) {
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  return new File([blob], filename, { type: blob.type || "image/jpeg" });
}

export default function VerifierDashboard() {
  const fileInputRef = useRef(null);
  const selfieInputRef = useRef(null);
  const { data: me } = useMe();
  const { data: summary } = useDashboardSummary();
  const submitMutation = useSubmitScreening();
  const decideMutation = useDecideScreening();

  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [selfieFile, setSelfieFile] = useState(null);
  const [selfiePreviewUrl, setSelfiePreviewUrl] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | ready | processing | done
  const [stageIndex, setStageIndex] = useState(-1);
  const [result, setResult] = useState(null);
  const [reason, setReason] = useState("");
  const [showDocCapture, setShowDocCapture] = useState(false);
  const [showSelfieCapture, setShowSelfieCapture] = useState(false);

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
    if (selfiePreviewUrl) URL.revokeObjectURL(selfiePreviewUrl);
    setFile(null);
    setPreviewUrl(null);
    setSelfieFile(null);
    setSelfiePreviewUrl(null);
    setStatus("idle");
    setStageIndex(-1);
    setResult(null);
    setReason("");
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

  const setSelfie = (nextFile, url) => {
    if (selfiePreviewUrl) URL.revokeObjectURL(selfiePreviewUrl);
    setSelfieFile(nextFile);
    setSelfiePreviewUrl(url);
  };

  const handleFileChange = (e) => {
    const picked = e.target.files?.[0];
    if (!picked) return;
    beginDocument(picked, URL.createObjectURL(picked));
  };

  const handleSelfieFileChange = (e) => {
    const picked = e.target.files?.[0];
    if (!picked) return;
    setSelfie(picked, URL.createObjectURL(picked));
  };

  const handleDocCapture = async (dataUrl) => {
    const captured = await dataUrlToFile(dataUrl, "document.jpg");
    beginDocument(captured, dataUrl);
    setShowDocCapture(false);
  };

  const handleSelfieCapture = async (dataUrl) => {
    const captured = await dataUrlToFile(dataUrl, "selfie.jpg");
    setSelfie(captured, dataUrl);
    setShowSelfieCapture(false);
  };

  const runScreening = () => {
    if (!file) return;
    setStatus("processing");
    const formData = new FormData();
    formData.append("document", file);
    // doc_type is intentionally omitted — the screening model classifies it.
    if (selfieFile) formData.append("selfie", selfieFile);

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
  const persistedSelfieUrl = useScreeningSelfie(result?.selfie_url ? result.id : null);

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
              {result?.doc_type ? (
                <Badge variant="brand">{DOC_LABEL[result.doc_type] || result.doc_type}</Badge>
              ) : (
                status !== "idle" && <Badge variant="neutral">Type auto-detected</Badge>
              )}
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

            {(status === "ready" || (status === "processing" && selfiePreviewUrl)) && (
              <div className="mt-3.5 rounded-xl border border-line p-3.5">
                <div className="mb-2.5 flex items-center justify-between">
                  <span className="text-[12.5px] font-semibold text-ink">Person Photo</span>
                  <span className="text-[10.5px] text-ink-faint">Matched against the document photo</span>
                </div>
                {selfiePreviewUrl ? (
                  <div className="flex items-center gap-4">
                    <div className="h-28 w-28 shrink-0 overflow-hidden rounded-2xl border border-line">
                      <img src={selfiePreviewUrl} alt="Person" className="h-full w-full object-cover" />
                    </div>
                    {status === "ready" && (
                      <button
                        onClick={() => setSelfie(null, null)}
                        className="flex items-center gap-1.5 text-[11.5px] font-medium text-ink-faint hover:text-ink-dim"
                      >
                        <RotateCcw size={12} strokeWidth={1.75} />
                        Retake
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                    <button
                      onClick={() => selfieInputRef.current?.click()}
                      className="flex items-center justify-center gap-2 rounded-lg border border-dashed border-line py-3 text-[12px] font-medium text-ink-dim transition-colors hover:border-brand hover:bg-surface-sunken/50"
                    >
                      <Upload size={14} strokeWidth={1.75} />
                      Upload photo
                    </button>
                    <button
                      onClick={() => setShowSelfieCapture(true)}
                      className="flex items-center justify-center gap-2 rounded-lg border border-dashed border-line py-3 text-[12px] font-medium text-ink-dim transition-colors hover:border-brand hover:bg-surface-sunken/50"
                    >
                      <User size={14} strokeWidth={1.75} />
                      Capture photo
                    </button>
                  </div>
                )}
                <input
                  ref={selfieInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleSelfieFileChange}
                  className="hidden"
                />
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
                    className={`grid grid-cols-[130px_1fr] items-center gap-2.5 py-2.5 ${
                      i !== extractedFields.length - 1 ? "border-b border-line-soft" : ""
                    }`}
                  >
                    <span className="min-w-0 break-words text-[12px] text-ink-dim">{fieldLabel(f.label)}</span>
                    <span className="min-w-0 break-all font-mono text-[13px]">{f.value}</span>
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
          <Card delay={0.02}>
            <span className="mb-3 block text-[13.5px] font-semibold">Today's Shift</span>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Screened", value: summary?.screenings_today ?? 0 },
                { label: "Decided", value: summary?.decided_today ?? 0 },
                { label: "Pending", value: summary?.pending_decisions ?? 0 },
              ].map((m) => (
                <div key={m.label} className="rounded-lg border border-line bg-surface-sunken/40 px-3 py-2.5">
                  <div className="font-display text-[20px] font-bold leading-none tabular-nums text-ink">{m.value}</div>
                  <div className="mt-1 text-[10.5px] text-ink-faint">{m.label}</div>
                </div>
              ))}
            </div>
            <div className="mt-3 flex items-center gap-3 border-t border-line-soft pt-3 text-[11px] text-ink-dim">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-good" />
                {summary?.verdict_split?.genuine ?? 0} genuine
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-warn" />
                {summary?.verdict_split?.suspicious ?? 0} suspicious
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-bad" />
                {summary?.verdict_split?.fake ?? 0} fake
              </span>
            </div>
          </Card>

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

              {result.selfie_url && (
                <Card delay={0.05}>
                  <span className="mb-3 block text-[13.5px] font-semibold">Live Capture</span>
                  <div className="flex items-center gap-4">
                    <div className="h-28 w-28 shrink-0 overflow-hidden rounded-2xl border border-line bg-surface-sunken">
                      {persistedSelfieUrl && (
                        <img src={persistedSelfieUrl} alt="Live capture" className="h-full w-full object-cover" />
                      )}
                    </div>
                    {result.face_match && (
                      <span className="text-[12px] text-ink-dim">
                        {Math.round(result.face_match.similarity_score * 100)}% similarity to document photo
                      </span>
                    )}
                  </div>
                </Card>
              )}

              {result.flags?.includes("blacklist_hit") && (
                <Card delay={0.06} className="!border-bad/30 !bg-bad-soft">
                  <div className="flex items-start gap-2.5">
                    <ShieldAlert size={16} strokeWidth={2} className="mt-0.5 shrink-0 text-bad-ink" />
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[13px] font-semibold text-bad-ink">Blacklist match</span>
                      {(result.blacklist_matches ?? []).map((m, i) => (
                        <div key={i} className="flex flex-col gap-0.5">
                          {(m.doc_number || m.name) && (
                            <span className="font-mono text-[12px] font-semibold text-bad-ink">
                              {m.doc_number || m.name}
                            </span>
                          )}
                          <span className="text-[11.5px] leading-relaxed text-bad-ink">
                            {m.reason}
                            {m.source ? ` · ${m.source}` : ""}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              )}

              {result.face_match && !result.face_match.is_match && (
                <Card delay={0.07} className="!border-bad/30 !bg-bad-soft">
                  <div className="flex items-start gap-2.5">
                    <UserX size={16} strokeWidth={2} className="mt-0.5 shrink-0 text-bad-ink" />
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[13px] font-semibold text-bad-ink">
                        Face match failed — {Math.round(result.face_match.similarity_score * 100)}% similarity
                      </span>
                      <span className="text-[11.5px] leading-relaxed text-bad-ink">{result.face_match.message}</span>
                    </div>
                  </div>
                </Card>
              )}

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

                  {!result.flags?.includes("blacklist_hit") && (
                    <div className="mt-2 flex items-start gap-2.5 border-t border-line-soft pt-3">
                      <ShieldCheck size={14} strokeWidth={1.75} className="mt-0.5 shrink-0 text-good-ink" />
                      <span className="text-[12px] leading-relaxed text-ink-dim">
                        No match against the active blacklist registry
                      </span>
                    </div>
                  )}

                  {result.face_match?.is_match && (
                    <div className="flex items-start gap-2.5 border-t border-line-soft pt-3">
                      <UserCheck size={14} strokeWidth={1.75} className="mt-0.5 shrink-0 text-good-ink" />
                      <span className="text-[12px] leading-relaxed text-ink-dim">
                        Face match — {Math.round(result.face_match.similarity_score * 100)}% similarity ·{" "}
                        {result.face_match.message}
                      </span>
                    </div>
                  )}
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
        {showSelfieCapture && (
          <CameraCaptureModal
            title="Person Photo"
            subtitle="Center the traveler's face in frame."
            facingMode="user"
            aspect="aspect-square"
            mirror
            onClose={() => setShowSelfieCapture(false)}
            onCapture={handleSelfieCapture}
          />
        )}
      </AnimatePresence>
    </>
  );
}
