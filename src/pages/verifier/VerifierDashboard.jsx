import { motion } from "framer-motion";
import { Check, RotateCw, TriangleAlert, User, X, ZoomIn } from "lucide-react";
import Topbar from "../../components/layout/Topbar";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import RiskGauge from "../../components/ui/RiskGauge";
import { ROLES } from "../../config/roles";
import { evidence, ocrFields, recentScreenings } from "../../data/mockData";

const evidenceDot = { good: "bg-good", warn: "bg-warn", bad: "bg-bad" };
const confBadge = (c) => (c >= 90 ? "good" : c >= 75 ? "warn" : "bad");

export default function VerifierDashboard() {
  const role = ROLES.verifier;

  return (
    <>
      <Topbar title="Screen Document" subtitle="Checkpoint CP-04 · Terminal 2 · Case #SC-88291" role={role} liveLabel="Shift 06:42:11" />

      <div className="grid grid-cols-[1.35fr_1fr] items-start gap-6">
        {/* LEFT */}
        <div className="flex flex-col gap-5">
          <Card delay={0.02}>
            <div className="mb-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="text-[13.5px] font-semibold">Document</span>
                <Badge variant="brand">PASSPORT</Badge>
              </div>
              <div className="flex gap-1.5">
                <button className="flex h-7 w-7 items-center justify-center rounded-md border border-line text-ink-dim hover:bg-surface-sunken">
                  <ZoomIn size={14} strokeWidth={1.75} />
                </button>
                <button className="flex h-7 w-7 items-center justify-center rounded-md border border-line text-ink-dim hover:bg-surface-sunken">
                  <RotateCw size={14} strokeWidth={1.75} />
                </button>
              </div>
            </div>

            <div className="flex gap-4 rounded-xl border border-[#e3ddc9] bg-[#f2eee2] p-4">
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
            <div className="mt-3 rounded-lg border border-[#e3ddc9] bg-[#f2eee2] px-3.5 py-2.5 font-mono text-[11px] leading-[1.9] tracking-[0.12em] text-[#7a7157]">
              P&lt;INDXXXXXX&lt;&lt;XXXXXXXXX&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;
              <br />
              Z1234567&lt;4IND8501011M3001017&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;04
            </div>
          </Card>

          <Card delay={0.08}>
            <div className="mb-3 flex items-center justify-between">
              <span className="text-[13.5px] font-semibold">Extracted Fields</span>
              <span className="text-[11px] text-ink-faint">OCR · predict_pipeline</span>
            </div>
            <div className="flex flex-col">
              {ocrFields.map((f, i) => (
                <div
                  key={f.label}
                  className={`grid grid-cols-[130px_1fr_54px] items-center gap-2.5 py-2.5 ${
                    i !== ocrFields.length - 1 ? "border-b border-line-soft" : ""
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

          <div className="flex flex-col gap-2.5">
            <span className="px-0.5 text-[12px] font-semibold text-ink-dim">Recent Screenings</span>
            <div className="flex gap-2.5 overflow-x-auto pb-1">
              {recentScreenings.map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.05, duration: 0.4 }}
                  whileHover={{ y: -3 }}
                  className="w-[140px] shrink-0 cursor-pointer rounded-xl border border-line bg-surface p-3"
                >
                  <div className="mb-2 h-11 rounded-md bg-surface-sunken" />
                  <Badge variant={s.tone}>{s.verdict}</Badge>
                  <div className="mt-1.5 text-[10px] text-ink-faint">
                    {s.doc} · {s.time}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex flex-col gap-5">
          <Card delay={0.04}>
            <span className="mb-3.5 block text-[13.5px] font-semibold">Risk Assessment</span>
            <div className="flex items-center gap-5">
              <RiskGauge score={70} tone="warn" />
              <div className="flex flex-col gap-2">
                <Badge variant="warn" className="w-fit">
                  SUSPICIOUS
                </Badge>
                <span className="text-[11.5px] leading-relaxed text-ink-dim">
                  3 evidence flags raised.
                  <br />
                  Manual review required.
                </span>
              </div>
            </div>
            <div className="mt-4 flex flex-col gap-2.5 border-t border-line-soft pt-4">
              {evidence.map((e, i) => (
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
                <span className="font-display text-[19px] font-bold text-warn-ink">61%</span>
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
                animate={{ width: "61%" }}
                transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="h-full rounded-full bg-warn"
              />
            </div>
            <div className="mt-2 text-center text-[11px] text-ink-faint">Below 85% confidence threshold</div>
          </Card>

          <Card delay={0.16}>
            <span className="mb-3 block text-[13.5px] font-semibold">Decision</span>
            <textarea
              placeholder="Add remark (optional)"
              className="mb-3 h-14 w-full resize-none rounded-lg border border-line bg-surface-sunken/60 p-2.5 font-sans text-[12px] text-ink outline-none placeholder:text-ink-faint focus:border-brand"
            />
            <motion.button
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
              className="mb-2 flex w-full items-center justify-center gap-2 rounded-lg bg-good py-2.5 text-[13px] font-semibold text-white shadow-sm"
            >
              <Check size={16} strokeWidth={2} />
              Accept Document
            </motion.button>
            <div className="flex gap-2">
              <motion.button
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-warn bg-warn-soft py-2.5 text-[12.5px] font-semibold text-warn-ink"
              >
                <TriangleAlert size={14} strokeWidth={2} />
                Escalate
              </motion.button>
              <motion.button
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-bad bg-bad-soft py-2.5 text-[12.5px] font-semibold text-bad-ink"
              >
                <X size={14} strokeWidth={2} />
                Reject
              </motion.button>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
