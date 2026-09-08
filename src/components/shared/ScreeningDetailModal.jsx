import { AnimatePresence, motion } from "framer-motion";
import { Check, ShieldAlert, TriangleAlert, User, UserCheck, UserX, X } from "lucide-react";
import Badge from "../ui/Badge";
import RiskGauge from "../ui/RiskGauge";
import { useScreening, useScreeningImage, useScreeningSelfie } from "../../features/screenings/hooks";
import { timeAgo, fieldLabel } from "../../lib/format";

const evidenceDot = { good: "bg-good", warn: "bg-warn", bad: "bg-bad" };
const BAND_TONE = { GENUINE: "good", SUSPICIOUS: "warn", FAKE: "bad" };
const DECISION_ICON = { accept: Check, escalate: TriangleAlert, reject: X };
const DECISION_STYLE = {
  accept: "border-good/30 bg-good-soft text-good-ink",
  escalate: "border-warn/30 bg-warn-soft text-warn-ink",
  reject: "border-bad/30 bg-bad-soft text-bad-ink",
};

// Takes the id of an existing screening and fetches its full detail — callers
// that already hold the full ScreeningView (e.g. right after submitting one)
// can still pass just its `id`, since the record is already seeded into the
// query cache by useSubmitScreening/useDecideScreening.
export default function ScreeningDetailModal({ screeningId, onClose }) {
  const { data: item } = useScreening(screeningId);
  const imageUrl = useScreeningImage(screeningId);
  const selfieUrl = useScreeningSelfie(item?.selfie_url ? screeningId : null);
  const decision = item?.officer_decision;
  const DecisionIcon = decision ? DECISION_ICON[decision.decision] : null;
  const tone = item ? BAND_TONE[item.verdict_band] ?? "warn" : "warn";

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 340, damping: 32 }}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[90vh] w-full max-w-[900px] overflow-y-auto rounded-2xl dark:rounded-lg border border-line bg-surface p-7 shadow-[var(--shadow-panel)]"
          >
            <div className="mb-5 flex items-center justify-between">
              <div>
                <div className="font-mono text-[14px] font-semibold text-ink">{item.reference_no}</div>
                <div className="text-[11.5px] text-ink-faint">
                  {item.doc_type} · {timeAgo(item.created_at)}
                  {item.checkpoint_id ? ` · ${item.checkpoint_id}` : ""}
                </div>
              </div>
              <button
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-ink-faint hover:bg-surface-sunken"
              >
                <X size={15} strokeWidth={1.75} />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_1fr]">
              {/* left column */}
              <div className="flex flex-col gap-5">
                <div className="overflow-hidden rounded-2xl dark:rounded-lg border border-line bg-surface-sunken">
                  {imageUrl ? (
                    <img src={imageUrl} alt="Scanned document" className="max-h-[220px] w-full object-cover" />
                  ) : (
                    <div className="flex h-[140px] items-center justify-center text-ink-faint">
                      <User size={32} strokeWidth={1.4} />
                    </div>
                  )}
                </div>

                <div className="rounded-2xl dark:rounded-lg border border-line p-5">
                  <span className="mb-3 block text-[13px] font-semibold">Extracted Fields</span>
                  <div className="flex flex-col">
                    {(item.engine?.extracted_fields ?? []).map((f, i, arr) => (
                      <div
                        key={f.label}
                        className={`grid grid-cols-[110px_1fr] items-center gap-2 py-2 ${
                          i !== arr.length - 1 ? "border-b border-line-soft" : ""
                        }`}
                      >
                        <span className="min-w-0 break-words text-[11.5px] text-ink-dim">{fieldLabel(f.label)}</span>
                        <span className="min-w-0 break-all font-mono text-[12.5px]">{f.value}</span>
                      </div>
                    ))}
                    {(item.engine?.extracted_fields ?? []).length === 0 && (
                      <div className="py-3 text-[12px] text-ink-faint">No extracted fields available.</div>
                    )}
                  </div>
                </div>
              </div>

              {/* right column */}
              <div className="flex flex-col gap-5">
                <div className="rounded-2xl dark:rounded-lg border border-line bg-surface-sunken/50 p-5">
                  <span className="mb-3.5 block text-[13px] font-semibold">Risk Assessment</span>
                  <div className="flex items-center gap-5">
                    <RiskGauge score={item.risk_score} tone={tone} size={90} />
                    <div className="flex flex-col gap-2">
                      <Badge variant={tone} className="w-fit">
                        {item.verdict}
                      </Badge>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-col gap-2.5 border-t border-line-soft pt-4">
                    {(item.engine?.evidence ?? []).map((e, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${evidenceDot[e.tone]}`} />
                        <span className="text-[12px] leading-relaxed text-ink">{e.text}</span>
                      </div>
                    ))}
                    {(item.engine?.evidence ?? []).length === 0 && (
                      <div className="text-[12px] text-ink-faint">No explainability data available.</div>
                    )}
                  </div>
                </div>

                {item.selfie_url && (
                  <div className="rounded-2xl dark:rounded-lg border border-line p-5">
                    <span className="mb-3 block text-[13px] font-semibold">Live Capture</span>
                    <div className="flex items-center gap-4">
                      <div className="h-28 w-28 shrink-0 overflow-hidden rounded-2xl border border-line bg-surface-sunken">
                        {selfieUrl && <img src={selfieUrl} alt="Live capture" className="h-full w-full object-cover" />}
                      </div>
                      {item.face_match && (
                        <span className="text-[11.5px] text-ink-dim">
                          {Math.round(item.face_match.similarity_score * 100)}% similarity to document photo
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {item.flags?.includes("blacklist_hit") && (
                  <div className="flex items-start gap-2.5 rounded-2xl dark:rounded-lg border border-bad/30 bg-bad-soft p-5">
                    <ShieldAlert size={16} strokeWidth={2} className="mt-0.5 shrink-0 text-bad-ink" />
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[13px] font-semibold text-bad-ink">Blacklist match</span>
                      {(item.blacklist_matches ?? []).map((m, i) => (
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
                )}

                {item.face_match && (
                  <div
                    className={`flex items-start gap-2.5 rounded-2xl dark:rounded-lg border p-5 ${
                      item.face_match.is_match ? "border-good/30 bg-good-soft" : "border-bad/30 bg-bad-soft"
                    }`}
                  >
                    {item.face_match.is_match ? (
                      <UserCheck size={16} strokeWidth={2} className="mt-0.5 shrink-0 text-good-ink" />
                    ) : (
                      <UserX size={16} strokeWidth={2} className="mt-0.5 shrink-0 text-bad-ink" />
                    )}
                    <div className="flex flex-col gap-1">
                      <span className={`text-[13px] font-semibold ${item.face_match.is_match ? "text-good-ink" : "text-bad-ink"}`}>
                        Face match — {Math.round(item.face_match.similarity_score * 100)}% similarity
                      </span>
                      <span className={`text-[11.5px] leading-relaxed ${item.face_match.is_match ? "text-good-ink" : "text-bad-ink"}`}>
                        {item.face_match.message}
                      </span>
                    </div>
                  </div>
                )}

                {decision ? (
                  <div className={`flex items-center gap-2.5 rounded-lg border px-3.5 py-3 ${DECISION_STYLE[decision.decision]}`}>
                    {DecisionIcon && <DecisionIcon size={16} strokeWidth={2.5} className="shrink-0" />}
                    <span className="text-[12.5px] font-medium">
                      Decision recorded — {decision.decision.toUpperCase()} · {timeAgo(decision.decided_at)}
                    </span>
                  </div>
                ) : (
                  <div className="rounded-lg border border-line bg-surface-sunken/50 px-3.5 py-3 text-[12.5px] text-ink-faint">
                    No decision recorded yet.
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
