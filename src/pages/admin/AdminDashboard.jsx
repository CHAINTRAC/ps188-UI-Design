import { motion } from "framer-motion";
import { FileText } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import Topbar from "../../components/layout/Topbar";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import StatCard from "../../components/ui/StatCard";
import { adminStats, flaggedCases, verifiers, weeklyVolume } from "../../data/mockData";
import { BAD, GOOD, WARN } from "../../lib/chartColors";

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-line bg-surface px-3 py-2 text-[11px] shadow-[var(--shadow-card-hover)]">
      <div className="mb-1 font-semibold text-ink">{label}</div>
      {payload.map((p) => (
        <div key={p.dataKey} className="flex items-center gap-1.5 text-ink-dim">
          <span className="h-2 w-2 rounded-[2px]" style={{ background: p.fill }} />
          {p.name}: <span className="font-mono text-ink">{p.value}</span>
        </div>
      ))}
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <>
      <Topbar title="Team Overview" subtitle="North Zone · 6 checkpoints · 14 verifiers" />

      <div className="grid grid-cols-4 gap-4">
        {adminStats.map((s, i) => (
          <StatCard key={s.label} delay={0.02 * i} {...s} />
        ))}
      </div>

      <div className="grid grid-cols-[1.5fr_1fr] items-start gap-5">
        <div className="flex flex-col gap-5">
          <Card delay={0.08}>
            <div className="mb-4 flex items-center justify-between">
              <span className="text-[13.5px] font-semibold">Screenings This Week</span>
              <div className="flex gap-3.5 text-[10.5px] text-ink-dim">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-[2px]" style={{ background: GOOD }} />
                  Genuine
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-[2px]" style={{ background: WARN }} />
                  Suspicious
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-[2px]" style={{ background: BAD }} />
                  Fake
                </span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={190}>
              <BarChart data={weeklyVolume} barCategoryGap="28%">
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "#8b978f", fontFamily: "IBM Plex Sans" }}
                />
                <Tooltip cursor={{ fill: "rgba(0,0,0,0.03)" }} content={<ChartTooltip />} />
                <Bar dataKey="genuine" name="Genuine" stackId="a" fill={GOOD} />
                <Bar dataKey="suspicious" name="Suspicious" stackId="a" fill={WARN} />
                <Bar dataKey="fake" name="Fake" stackId="a" fill={BAD} radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card delay={0.12}>
            <span className="mb-3.5 block text-[13.5px] font-semibold">Verifiers</span>
            <div className="grid grid-cols-[1.4fr_1fr_0.8fr_1fr_1fr] gap-2 border-b border-line pb-2.5 text-[10.5px] tracking-wide text-ink-faint">
              <span>NAME</span>
              <span>CHECKPOINT</span>
              <span>STATUS</span>
              <span>TODAY</span>
              <span>ACCURACY</span>
            </div>
            {verifiers.map((v, i) => (
              <div
                key={v.name}
                className={`grid grid-cols-[1.4fr_1fr_0.8fr_1fr_1fr] items-center gap-2 py-2.5 transition-colors hover:bg-surface-sunken/60 ${
                  i !== verifiers.length - 1 ? "border-b border-line-soft" : ""
                }`}
              >
                <span className="text-[12.5px] font-medium">{v.name}</span>
                <span className="font-mono text-[11.5px] text-ink-dim">{v.checkpoint}</span>
                <span className={`flex items-center gap-1.5 text-[11px] ${v.online ? "text-good-ink" : "text-ink-faint"}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${v.online ? "bg-good" : "bg-line"}`} />
                  {v.online ? "Online" : "Offline"}
                </span>
                <span className="font-mono text-[12px]">{v.today}</span>
                <span className="font-mono text-[12px]">{v.accuracy.toFixed(1)}%</span>
              </div>
            ))}
          </Card>
        </div>

        <Card delay={0.1}>
          <div className="mb-3.5 flex items-center justify-between">
            <span className="text-[13.5px] font-semibold">Flagged for Review</span>
            <Badge variant="bad">5 new</Badge>
          </div>
          <div className="flex flex-col">
            {flaggedCases.map((c, i) => (
              <motion.div
                key={c.ref}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.06 }}
                className="flex cursor-pointer items-center gap-3 rounded-lg px-1.5 py-2.5 transition-colors hover:bg-surface-sunken/60"
              >
                <FileText size={16} strokeWidth={1.75} className={c.tone === "bad" ? "text-bad shrink-0" : "text-warn-ink shrink-0"} />
                <div className="min-w-0 flex-1">
                  <div className="text-[12px] font-medium">
                    {c.doc} · <span className="font-mono">{c.ref}</span>
                  </div>
                  <div className="text-[10.5px] text-ink-faint">
                    {c.officer} · {c.checkpoint} · {c.time}
                  </div>
                </div>
                <Badge variant={c.tone}>{c.verdict}</Badge>
              </motion.div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}
