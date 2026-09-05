import { useState } from "react";
import { motion } from "framer-motion";
import { FileText } from "lucide-react";
import Topbar from "../../components/layout/Topbar";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import ScreeningDetailModal from "../../components/shared/ScreeningDetailModal";
import { useScreenings } from "../../features/screenings/hooks";
import { timeAgo } from "../../lib/format";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "GENUINE", label: "Genuine" },
  { key: "SUSPICIOUS", label: "Suspicious" },
  { key: "FAKE", label: "Fake" },
];

const BAND_TONE = { GENUINE: "good", SUSPICIOUS: "warn", FAKE: "bad" };

export default function VerifierHistory() {
  const [filter, setFilter] = useState("all");
  const [selectedId, setSelectedId] = useState(null);
  const { data: screenings = [], isLoading } = useScreenings();

  const rows = (filter === "all" ? screenings : screenings.filter((s) => s.verdict_band === filter)).map((s) => ({
    id: s.id,
    ref: s.reference_no,
    doc: s.doc_type,
    verdict: s.verdict_band,
    tone: BAND_TONE[s.verdict_band] ?? "warn",
    riskScore: s.risk_score,
    time: timeAgo(s.created_at),
  }));

  return (
    <>
      <Topbar title="My History" subtitle="Every screening you've run at this checkpoint" />

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
        <div className="overflow-x-auto">
          <div className="min-w-[480px]">
            <div className="grid grid-cols-[1fr_1fr_1fr_1fr] gap-2 border-b border-line-soft px-5 py-3 text-[10.5px] tracking-wide text-ink-faint">
              <span>CASE</span>
              <span>DOCUMENT</span>
              <span>RISK</span>
              <span>VERDICT</span>
            </div>
            {isLoading && <div className="px-5 py-10 text-center text-[12.5px] text-ink-faint">Loading…</div>}
            {!isLoading &&
              rows.map((h, i) => (
                <motion.button
                  key={h.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03, duration: 0.35 }}
                  onClick={() => setSelectedId(h.id)}
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
                  <span className="text-[12.5px] capitalize text-ink-dim">{h.doc.replace("_", " ")}</span>
                  <span className="font-mono text-[12.5px] text-ink">{h.riskScore} / 100</span>
                  <Badge variant={h.tone} className="w-fit">
                    {h.verdict}
                  </Badge>
                </motion.button>
              ))}
            {!isLoading && rows.length === 0 && (
              <div className="px-5 py-10 text-center text-[12.5px] text-ink-faint">No screenings match this filter.</div>
            )}
          </div>
        </div>
      </Card>

      <ScreeningDetailModal screeningId={selectedId} onClose={() => setSelectedId(null)} />
    </>
  );
}
