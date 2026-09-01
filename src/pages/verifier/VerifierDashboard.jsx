import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, FileCheck2, RotateCcw, ScanFace, ScanLine, ScanSearch, TriangleAlert, Upload, User, X } from "lucide-react";
import Topbar from "../../components/layout/Topbar";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import RiskGauge from "../../components/ui/RiskGauge";
import { SCENARIOS, STAGES } from "../../data/verifierScenarios";

const STAGE_ICONS = { ocr: ScanLine, checksum: FileCheck2, tamper: ScanSearch, face: ScanFace };
const evidenceDot = { good: "bg-good", warn: "bg-warn", bad: "bg-bad" };
const confBadge = (c) => (c >= 90 ? "good" : c >= 75 ? "warn" : "bad");

const QUICK_TESTS = [
  { key: "genuine", label: "Genuine Passport", tone: "good" },
  { key: "suspicious", label: "Suspicious — Field Tamper", tone: "warn" },
  { key: "fake", label: "Fake — Forged Document", tone: "bad" },
];

export default function VerifierDashboard() {
  const fileInputRef = useRef(null);

  const [previewUrl, setPreviewUrl] = useState(null);
  const [scenarioKey, setScenarioKey] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | ready | processing | done
  const [stageIndex, setStageIndex] = useState(-1);
  const [decision, setDecision] = useState(null);
  const [remark, setRemark] = useState("");

  const scenario = scenarioKey ? SCENARIOS[scenarioKey] : null;

  const reset = () => {
    setPreviewUrl(null);
    setScenarioKey(null);
    setStatus("idle");
    setStageIndex(-1);
    setDecision(null);
    setRemark("");
  };

  const pickScenario = (key) => {
    setPreviewUrl(null);
    setScenarioKey(key);
    setStatus("ready");
    setStageIndex(-1);
    setDecision(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreviewUrl(URL.createObjectURL(file));
    const keys = Object.keys(SCENARIOS);
    setScenarioKey(keys[Math.floor(Math.random() * keys.length)]);
    setStatus("ready");
    setStageIndex(-1);
    setDecision(null);
  };

  const runScreening = () => {
    setStatus("processing");
    setStageIndex(0);
    let i = 0;
    const step = () => {
      i += 1;
      if (i >= STAGES.length) {
        setStageIndex(STAGES.length);
        setTimeout(() => setStatus("done"), 350);
        return;
      }
      setStageIndex(i);
      setTimeout(step, 750);
    };
    setTimeout(step, 750);
  };

  return (
    <>
      <Topbar title="Screen Document" subtitle="Checkpoint CP-04 · Terminal 2" liveLabel="Shift 06:42:11" />

      <div className="grid grid-cols-[1.35fr_1fr] items-start gap-6">
        {/* LEFT */}
        <div className="flex flex-col gap-5">
          <Card delay={0.02}>
            <div className="mb-3.5 flex items-center justify-between">
              <span className="text-[13.5px] font-semibold">Document</span>
              {scenario && <Badge variant="brand">PASSPORT</Badge>}
            </div>

            {status === "idle" && (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex w-full flex-col items-center justify-center gap-2.5 rounded-xl border-2 border-dashed border-line py-14 text-center transition-colors hover:border-brand hover:bg-surface-sunken/50"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-surface-sunken">
                  <Upload size={18} strokeWidth={1.75} className="text-ink-faint" />
                </div>
                <span className="text-[13px] font-medium text-ink">Click to upload a document</span>
                <span className="text-[11.5px] text-ink-faint">JPG or PNG · passport, visa, Aadhaar, or permit</span>
              </button>
            )}

            {status !== "idle" && (
              <div className="relative overflow-hidden rounded-xl border border-line">
                {previewUrl ? (
                  <img src={previewUrl} alt="Uploaded document" className="max-h-[280px] w-full object-cover" />
                ) : (
                  <div className="flex gap-4 bg-[#f2eee2] p-4">
                    <div className="flex h-[110px] w-[88px] shrink-0 items-center justify-center rounded-md bg-[#ddd6bd]">
                      <User size={36} strokeWidth={1.4} className="text-[#a89f7f]" />
                    </div>
                    <div className="flex flex-1 flex-col justify-center gap-2">
                      <span className="text-[9px] tracking-widest text-[#93896a]">REPUBLIC OF INDIA · PASSPORT</span>
                      {[70, 50, 60, 40].map((w, i) => (
                        <span key={i} className="h-[9px] rounded-sm bg-[#d9d2b8]" style={{ width: `${w}%` }} />
                      ))}
                    </div>
                  </div>
                )}
                {status === "processing" && (
                  <span className="scan-beam pointer-events-none absolute inset-x-0 top-0 h-14 bg-gradient-to-b from-brand/35 via-brand/12 to-transparent" />
                )}
              </div>
            )}

            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />

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

            {status === "idle" && (
              <div className="mt-5 border-t border-line-soft pt-4">
                <div className="mb-2.5 text-[10.5px] font-semibold uppercase tracking-wider text-ink-faint">
                  Instant test cases
                </div>
                <div className="flex flex-wrap gap-2">
                  {QUICK_TESTS.map((t) => (
                    <button
                      key={t.key}
                      onClick={() => pickScenario(t.key)}
                      className="flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1.5 text-[11.5px] font-medium text-ink-dim transition-colors hover:border-brand hover:text-ink"
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${evidenceDot[t.tone]}`} />
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
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

          {status === "done" && scenario && (
            <Card delay={0.1}>
              <div className="mb-3 flex items-center justify-between">
                <span className="text-[13.5px] font-semibold">Extracted Fields</span>
                <span className="text-[11px] text-ink-faint">OCR · predict_pipeline</span>
              </div>
              <div className="flex flex-col">
                {scenario.ocrFields.map((f, i) => (
                  <div
                    key={f.label}
                    className={`grid grid-cols-[130px_1fr_54px] items-center gap-2.5 py-2.5 ${
                      i !== scenario.ocrFields.length - 1 ? "border-b border-line-soft" : ""
                    }`}
                  >
                    <span className="text-[12px] text-ink-dim">{f.label}</span>
                    <span className="font-mono text-[13px]">{f.value}</span>
                    <Badge variant={confBadge(f.confidence)} className="justify-center">
                      {f.confidence}%
                    </Badge>
                  </div>
                ))}
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
                    : "Upload a document or run an instant test case to see the risk assessment."}
                </p>
              </div>
            </Card>
          )}

          {status === "done" && scenario && (
            <>
              <Card delay={0.04}>
                <span className="mb-3.5 block text-[13.5px] font-semibold">Risk Assessment</span>
                <div className="flex items-center gap-5">
                  <RiskGauge score={scenario.riskScore} tone={scenario.tone} />
                  <div className="flex flex-col gap-2">
                    <Badge variant={scenario.tone} className="w-fit">
                      {scenario.verdict}
                    </Badge>
                    <span className="text-[11.5px] leading-relaxed text-ink-dim">{scenario.summary}</span>
                  </div>
                </div>
                <div className="mt-4 flex flex-col gap-2.5 border-t border-line-soft pt-4">
                  {scenario.evidence.map((e, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${evidenceDot[e.tone]}`} />
                      <span className="text-[12px] leading-relaxed text-ink">{e.text}</span>
                    </div>
                  ))}
                </div>
              </Card>

              <Card delay={0.1}>
                <span className="mb-3.5 block text-[13.5px] font-semibold">Face Verification</span>
                <div className="flex items-center justify-center gap-4">
                  <div className="flex flex-col items-center gap-1.5">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-line bg-surface-sunken">
                      <User size={26} strokeWidth={1.5} className="text-ink-faint" />
                    </div>
                    <span className="text-[10px] text-ink-faint">Document photo</span>
                  </div>
                  <div className="flex flex-col items-center gap-0.5">
                    <span
                      className={`font-display text-[19px] font-bold ${
                        scenario.tone === "bad" ? "text-bad" : scenario.tone === "warn" ? "text-warn-ink" : "text-good-ink"
                      }`}
                    >
                      {scenario.faceMatch}%
                    </span>
                    <span className="text-[9px] text-ink-faint">MATCH</span>
                  </div>
                  <div className="flex flex-col items-center gap-1.5">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-line bg-surface-sunken">
                      <User size={26} strokeWidth={1.5} className="text-ink-faint" />
                    </div>
                    <span className="text-[10px] text-ink-faint">Live capture</span>
                  </div>
                </div>
                <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-surface-sunken">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${scenario.faceMatch}%` }}
                    transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    className={`h-full rounded-full ${
                      scenario.tone === "bad" ? "bg-bad" : scenario.tone === "warn" ? "bg-warn" : "bg-good"
                    }`}
                  />
                </div>
                <div className="mt-2 text-center text-[11px] text-ink-faint">
                  {scenario.faceMatch >= 85 ? "Above 85% confidence threshold" : "Below 85% confidence threshold"}
                </div>
              </Card>

              <Card delay={0.16}>
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
                        Decision recorded — {decision.toUpperCase()} · logged to audit trail
                      </span>
                    </motion.div>
                  ) : (
                    <motion.div key="form" initial={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <textarea
                        value={remark}
                        onChange={(e) => setRemark(e.target.value)}
                        placeholder="Add remark (optional)"
                        className="mb-3 h-14 w-full resize-none rounded-lg border border-line bg-surface-sunken/60 p-2.5 font-sans text-[12px] text-ink outline-none placeholder:text-ink-faint focus:border-brand"
                      />
                      <motion.button
                        whileHover={{ y: -1 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setDecision("accept")}
                        className="mb-2 flex w-full items-center justify-center gap-2 rounded-lg bg-good py-2.5 text-[13px] font-semibold text-white shadow-sm"
                      >
                        <Check size={16} strokeWidth={2} />
                        Accept Document
                      </motion.button>
                      <div className="flex gap-2">
                        <motion.button
                          whileHover={{ y: -1 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setDecision("escalate")}
                          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-warn bg-warn-soft py-2.5 text-[12.5px] font-semibold text-warn-ink"
                        >
                          <TriangleAlert size={14} strokeWidth={2} />
                          Escalate
                        </motion.button>
                        <motion.button
                          whileHover={{ y: -1 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setDecision("reject")}
                          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-bad bg-bad-soft py-2.5 text-[12.5px] font-semibold text-bad-ink"
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
    </>
  );
}
