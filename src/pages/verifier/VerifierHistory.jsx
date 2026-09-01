import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, FileText, TriangleAlert, User, X } from "lucide-react";
import Topbar from "../../components/layout/Topbar";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import RiskGauge from "../../components/ui/RiskGauge";
import { HISTORY, SCENARIOS } from "../../data/verifierScenarios";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "GENUINE", label: "Genuine" },
  { key: "SUSPICIOUS", label: "Suspicious" },
  { key: "FAKE", label: "Fake" },
];

const evidenceDot = { good: "bg-good", warn: "bg-warn", bad: "bg-bad" };
const confBadge = (c) => (c >= 90 ? "good" : c >= 75 ? "warn" : "bad");

const TONE_SCENARIO = { good: "genuine", warn: "suspicious", bad: "fake" };
const TONE_DECISION = { good: "accept", warn: "escalate", bad: "reject" };
const DECISION_ICON = { accept: Check, escalate: TriangleAlert, reject: X };
const DECISION_STYLE = {
  accept: "border-good/30 bg-good-soft text-good-ink",
  escalate: "border-warn/30 bg-warn-soft text-warn-ink",
  reject: "border-bad/30 bg-bad-soft text-bad-ink",
};

export default function VerifierHistory() {
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState(null);
  const rows = filter === "all" ? HISTORY : HISTORY.filter((h) => h.verdict === filter);

  const detail = selected ? SCENARIOS[TONE_SCENARIO[selected.tone]] : null;
  const decision = selected ? TONE_DECISION[selected.tone] : null;
  const DecisionIcon = decision ? DECISION_ICON[decision] : null;

  return (
    <>
      <Topbar title="My History" subtitle="Every screening you've run at CP-04" />

      <div className="flex items-center gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`rounded-full border px-3.5 py-1.5 text-[12.5px] font-medium transition-colors ${
              filter === f.key
                ? "border-navy bg-navy text-white"
                : "border-line bg-surface text-ink-dim hover:bg-surface-sunken"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <Card noPad delay={0.05}>
        <div className="grid grid-cols-[1fr_1fr_1fr_1fr] gap-2 border-b border-line-soft px-5 py-3 text-[10.5px] tracking-wide text-ink-faint">
          <span>CASE</span>
          <span>DOCUMENT</span>
          <span>RISK</span>
          <span>VERDICT</span>
        </div>
        {rows.map((h, i) => (
          <motion.button
            key={h.ref}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03, duration: 0.35 }}
            onClick={() => setSelected(h)}
            className={`grid w-full grid-cols-[1fr_1fr_1fr_1fr] items-center gap-2 px-5 py-3.5 text-left transition-colors hover:bg-surface-sunken/60 ${
              i !== rows.length - 1 ? "border-b border-line-soft" : ""
            }`}
          >
            <div className="flex items-center gap-2.5">
              <FileText size={14} strokeWidth={1.75} className="shrink-0 text-ink-faint" />
              <div>
                <div className="font-mono text-[12px] font-medium text-ink">{h.ref}</div>
                <div className="text-[10.5px] text-ink-faint">{h.time}</div>
              </div>
            </div>
            <span className="text-[12.5px] text-ink-dim">{h.doc}</span>
            <span className="font-mono text-[12.5px] text-ink">{h.riskScore} / 100</span>
            <Badge variant={h.tone} className="w-fit">
              {h.verdict}
            </Badge>
          </motion.button>
        ))}
        {rows.length === 0 && (
          <div className="px-5 py-10 text-center text-[12.5px] text-ink-faint">No screenings match this filter.</div>
        )}
      </Card>

      <AnimatePresence>
        {selected && detail && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelected(null)}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6 backdrop-blur-sm"
            >
              <motion.div
                initial={{ opacity: 0, y: 12, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 12, scale: 0.97 }}
                transition={{ type: "spring", stiffness: 340, damping: 32 }}
                onClick={(e) => e.stopPropagation()}
                className="max-h-[90vh] w-full max-w-[900px] overflow-y-auto rounded-2xl border border-line bg-surface p-7 shadow-[var(--shadow-panel)]"
              >
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <div className="font-mono text-[14px] font-semibold text-ink">{selected.ref}</div>
                    <div className="text-[11.5px] text-ink-faint">
                      {selected.doc} · {selected.time}
                    </div>
                  </div>
                  <button
                    onClick={() => setSelected(null)}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-ink-faint hover:bg-surface-sunken"
                  >
                    <X size={15} strokeWidth={1.75} />
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_1fr]">
                  {/* left column */}
                  <div className="flex flex-col gap-5">
                    <div className="overflow-hidden rounded-2xl border border-line">
                      <div className="flex gap-4 bg-[#f2eee2] p-4">
                        <div className="flex h-[100px] w-[80px] shrink-0 items-center justify-center rounded-md bg-[#ddd6bd]">
                          <User size={32} strokeWidth={1.4} className="text-[#a89f7f]" />
                        </div>
                        <div className="flex flex-1 flex-col justify-center gap-2">
                          <span className="text-[9px] tracking-widest text-[#93896a]">
                            {selected.doc.toUpperCase()} · SCANNED DOCUMENT
                          </span>
                          {[70, 50, 60, 40].map((w, i) => (
                            <span key={i} className="h-[9px] rounded-sm bg-[#d9d2b8]" style={{ width: `${w}%` }} />
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-line p-5">
                      <span className="mb-3 block text-[13px] font-semibold">Extracted Fields</span>
                      <div className="flex flex-col">
                        {detail.ocrFields.map((f, i) => (
                          <div
                            key={f.label}
                            className={`grid grid-cols-[110px_1fr_46px] items-center gap-2 py-2 ${
                              i !== detail.ocrFields.length - 1 ? "border-b border-line-soft" : ""
                            }`}
                          >
                            <span className="text-[11.5px] text-ink-dim">{f.label}</span>
                            <span className="font-mono text-[12.5px]">{f.value}</span>
                            <Badge variant={confBadge(f.confidence)} className="justify-center">
                              {f.confidence}%
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* right column */}
                  <div className="flex flex-col gap-5">
                    <div className="rounded-2xl border border-line bg-surface-sunken/50 p-5">
                      <span className="mb-3.5 block text-[13px] font-semibold">Risk Assessment</span>
                      <div className="flex items-center gap-5">
                        <RiskGauge score={selected.riskScore} tone={selected.tone} size={90} />
                        <div className="flex flex-col gap-2">
                          <Badge variant={selected.tone} className="w-fit">
                            {selected.verdict}
                          </Badge>
                          <span className="text-[11.5px] leading-relaxed text-ink-dim">{detail.summary}</span>
                        </div>
                      </div>
                      <div className="mt-4 flex flex-col gap-2.5 border-t border-line-soft pt-4">
                        {detail.evidence.map((e, i) => (
                          <div key={i} className="flex items-start gap-2.5">
                            <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${evidenceDot[e.tone]}`} />
                            <span className="text-[12px] leading-relaxed text-ink">{e.text}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 rounded-2xl border border-line p-5">
                      <div className="flex flex-col items-center gap-1">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-line bg-surface-sunken">
                          <User size={20} strokeWidth={1.5} className="text-ink-faint" />
                        </div>
                        <span className="text-[9px] text-ink-faint">Document</span>
                      </div>
                      <div className="flex-1">
                        <div className="text-[13px] font-semibold text-ink">Face Verification</div>
                        <div className="text-[11.5px] text-ink-faint">{detail.faceMatch}% match confidence</div>
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-line bg-surface-sunken">
                          <User size={20} strokeWidth={1.5} className="text-ink-faint" />
                        </div>
                        <span className="text-[9px] text-ink-faint">Live</span>
                      </div>
                    </div>

                    <div className={`flex items-center gap-2.5 rounded-lg border px-3.5 py-3 ${DECISION_STYLE[decision]}`}>
                      {DecisionIcon && <DecisionIcon size={16} strokeWidth={2.5} className="shrink-0" />}
                      <span className="text-[12.5px] font-medium">
                        Decision recorded — {decision.toUpperCase()} by you · {selected.time}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
