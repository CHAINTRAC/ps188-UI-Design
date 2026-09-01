import { useState } from "react";
import { motion } from "framer-motion";
import { Check, LogIn, TriangleAlert, UserCog, X } from "lucide-react";
import Topbar from "../../components/layout/Topbar";
import Card from "../../components/ui/Card";
import { adminAuditLog } from "../../data/adminData";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "decision", label: "Decisions" },
  { key: "user", label: "User Changes" },
  { key: "login", label: "Logins" },
];

const TONE_ICON = { good: Check, warn: TriangleAlert, bad: X };
const TONE_STYLE = {
  good: { bg: "bg-good-soft", fg: "text-good-ink" },
  warn: { bg: "bg-warn-soft", fg: "text-warn-ink" },
  bad: { bg: "bg-bad-soft", fg: "text-bad-ink" },
  brand: { bg: "bg-brand-soft", fg: "text-brand-ink" },
};

function iconFor(entry) {
  if (entry.type === "login") return LogIn;
  if (entry.type === "user") return UserCog;
  return TONE_ICON[entry.tone] ?? Check;
}

export default function AuditLog() {
  const [filter, setFilter] = useState("all");
  const rows = filter === "all" ? adminAuditLog : adminAuditLog.filter((a) => a.type === filter);

  return (
    <>
      <Topbar title="Audit Log" subtitle="North Zone · every action across your team" />

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

      <Card delay={0.05}>
        <div className="flex flex-col">
          {rows.map((e, i) => {
            const Icon = iconFor(e);
            const style = TONE_STYLE[e.type === "decision" ? e.tone : "brand"];
            const last = i === rows.length - 1;
            return (
              <motion.div
                key={`${e.ref ?? e.actor}-${i}`}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className="flex gap-3"
              >
                <div className="flex flex-col items-center">
                  <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${style.bg}`}>
                    <Icon size={13} strokeWidth={2} className={style.fg} />
                  </div>
                  {!last && <div className="mt-1 w-px flex-1 bg-line-soft" />}
                </div>
                <div className={last ? "pb-1" : "pb-4"}>
                  <div className="text-[12.5px]">
                    <span className="font-semibold">{e.actor}</span> {e.action}
                    {e.ref && <span className="font-mono text-ink-dim"> {e.ref}</span>}
                  </div>
                  <div className="mt-0.5 text-[10.5px] text-ink-faint">
                    {e.detail} · {e.time}
                  </div>
                </div>
              </motion.div>
            );
          })}
          {rows.length === 0 && <p className="py-6 text-center text-[12.5px] text-ink-faint">No activity matches this filter.</p>}
        </div>
      </Card>
    </>
  );
}
