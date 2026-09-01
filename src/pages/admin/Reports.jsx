import { motion } from "framer-motion";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import Topbar from "../../components/layout/Topbar";
import Card from "../../components/ui/Card";
import StatCard from "../../components/ui/StatCard";
import { weeklyVolume } from "../../data/mockData";
import { docTypeBreakdown, verifiersFull } from "../../data/adminData";
import { BAD, BRAND, GOOD, WARN } from "../../lib/chartColors";

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

const totals = weeklyVolume.reduce(
  (acc, d) => ({ genuine: acc.genuine + d.genuine, suspicious: acc.suspicious + d.suspicious, fake: acc.fake + d.fake }),
  { genuine: 0, suspicious: 0, fake: 0 }
);
const totalScreenings = totals.genuine + totals.suspicious + totals.fake;
const fakeRate = ((totals.fake / totalScreenings) * 100).toFixed(1);

const checkpointBreakdown = Object.values(
  verifiersFull.reduce((acc, v) => {
    acc[v.checkpoint] ??= { checkpoint: v.checkpoint, verifiers: 0, today: 0 };
    acc[v.checkpoint].verifiers += 1;
    acc[v.checkpoint].today += v.today;
    return acc;
  }, {})
).sort((a, b) => b.today - a.today);

const maxDocCount = Math.max(...docTypeBreakdown.map((d) => d.count));

export default function Reports() {
  return (
    <>
      <Topbar title="Reports" subtitle="North Zone · trends & breakdowns" />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Screenings This Week" value={totalScreenings} delay={0} />
        <StatCard label="Fake Detection Rate" value={fakeRate} decimals={1} suffix="%" tone="bad" accent delay={0.03} />
        <StatCard label="Avg Decision Time" value={38} suffix="s" trend="down" trendLabel="4.5s" delay={0.06} />
        <StatCard label="Escalated Cases" value={12} tone="warn" accent delay={0.09} />
      </div>

      <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[1.4fr_1fr]">
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
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={weeklyVolume} barCategoryGap="28%">
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#8b978f", fontFamily: "IBM Plex Sans" }} />
              <Tooltip cursor={{ fill: "rgba(0,0,0,0.03)" }} content={<ChartTooltip />} />
              <Bar dataKey="genuine" name="Genuine" stackId="a" fill={GOOD} />
              <Bar dataKey="suspicious" name="Suspicious" stackId="a" fill={WARN} />
              <Bar dataKey="fake" name="Fake" stackId="a" fill={BAD} radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card delay={0.1}>
          <span className="mb-4 block text-[13.5px] font-semibold">By Document Type</span>
          <div className="flex flex-col gap-4">
            {docTypeBreakdown.map((d, i) => (
              <motion.div
                key={d.doc}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + i * 0.06 }}
              >
                <div className="mb-1.5 flex items-center justify-between text-[12px]">
                  <span className="text-ink-dim">{d.doc}</span>
                  <span className="font-mono font-medium text-ink">{d.count}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-surface-sunken">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(d.count / maxDocCount) * 100}%` }}
                    transition={{ duration: 0.7, delay: 0.2 + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                    className="h-full rounded-full"
                    style={{ background: BRAND }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </div>

      <Card delay={0.14}>
        <span className="mb-3.5 block text-[13.5px] font-semibold">By Checkpoint</span>
        <div className="overflow-x-auto">
          <div className="min-w-[360px]">
            <div className="grid grid-cols-[1fr_1fr_1fr] gap-2 border-b border-line-soft pb-2.5 text-[10.5px] tracking-wide text-ink-faint">
              <span>CHECKPOINT</span>
              <span>VERIFIERS</span>
              <span>SCREENED TODAY</span>
            </div>
            {checkpointBreakdown.map((c, i) => (
              <div
                key={c.checkpoint}
                className={`grid grid-cols-[1fr_1fr_1fr] items-center gap-2 py-2.5 ${
                  i !== checkpointBreakdown.length - 1 ? "border-b border-line-soft" : ""
                }`}
              >
                <span className="font-mono text-[12.5px] font-medium">{c.checkpoint}</span>
                <span className="text-[12px] text-ink-dim">{c.verifiers}</span>
                <span className="font-mono text-[12px]">{c.today}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </>
  );
}
