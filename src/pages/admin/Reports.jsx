import { useState } from "react";
import { motion } from "framer-motion";
import { Download } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import Topbar from "../../components/layout/Topbar";
import Card from "../../components/ui/Card";
import StatCard from "../../components/ui/StatCard";
import { useMe } from "../../features/auth/hooks";
import { useUsers } from "../../features/users/hooks";
import { useReports } from "../../features/reports/hooks";
import { BAD, BRAND, GOOD, WARN } from "../../lib/chartColors";

const DOC_LABEL = {
  passport: "Passport",
  visa: "Visa",
  national_id: "National ID",
  driving_license: "Driving License",
  permit: "Permit",
};

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

export default function Reports() {
  const { data: me } = useMe();
  const { data: users = [] } = useUsers();
  const { data: report } = useReports();

  const r = report ?? {};
  const verifiers = users.filter((u) => u.role === "verifier" && (!me?.region || u.region === me.region));
  const verifiersByCheckpoint = verifiers.reduce((acc, v) => {
    if (v.checkpoint_id) acc[v.checkpoint_id] = (acc[v.checkpoint_id] || 0) + 1;
    return acc;
  }, {});

  const weeklyVolume = r.weekly_volume ?? [];
  const docTypeBreakdown = (r.doc_type_breakdown ?? []).map((d) => ({
    doc: DOC_LABEL[d.doc_type] || d.doc_type,
    count: d.count,
  }));
  const maxDocCount = Math.max(1, ...docTypeBreakdown.map((d) => d.count));

  // The backend reports screenings-today per checkpoint; verifier headcount is
  // org-structure data and comes from the users list.
  const checkpointIds = new Set([
    ...(r.checkpoint_breakdown ?? []).map((c) => c.id),
    ...Object.keys(verifiersByCheckpoint),
  ]);
  const cpById = Object.fromEntries((r.checkpoint_breakdown ?? []).map((c) => [c.id, c]));
  const checkpointBreakdown = [...checkpointIds]
    .map((id) => ({
      checkpoint: id,
      verifiers: verifiersByCheckpoint[id] || 0,
      today: cpById[id]?.today || 0,
      total: cpById[id]?.total || 0,
    }))
    .sort((a, b) => b.today - a.today);

  const [downloading, setDownloading] = useState(false);
  const handleDownload = async () => {
    setDownloading(true);
    try {
      // jsPDF is heavy — only pull it in when the user actually exports.
      const { downloadReportsPdf } = await import("../../features/reports/pdf");
      downloadReportsPdf({
        region: me?.region || r.region || "",
        generatedBy: me?.full_name || me?.username || "",
        kpis: {
          total: r.total_screenings ?? 0,
          fakeRate: r.fake_rate ?? 0,
          escalated: r.escalated ?? 0,
          avgSeconds: r.avg_decision_seconds ?? 0,
        },
        weeklyVolume,
        docTypeBreakdown,
        checkpointBreakdown,
      });
    } finally {
      setDownloading(false);
    }
  };

  return (
    <>
      <Topbar
        title="Reports"
        subtitle={`${me?.region || "—"} · trends & breakdowns`}
        actions={
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="flex items-center gap-2 rounded-lg border border-line bg-surface px-3.5 py-2 text-[12.5px] font-medium text-ink-dim transition-colors hover:bg-surface-sunken hover:text-ink disabled:opacity-60"
          >
            <Download size={14} strokeWidth={1.9} />
            {downloading ? "Preparing…" : "Download PDF"}
          </button>
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total Screenings" value={r.total_screenings ?? 0} delay={0} />
        <StatCard label="Fake Detection Rate" value={r.fake_rate ?? 0} decimals={1} suffix="%" tone="bad" accent delay={0.03} />
        <StatCard label="Avg Decision Time" value={r.avg_decision_seconds ?? 0} suffix="s" delay={0.06} />
        <StatCard label="Escalated Cases" value={r.escalated ?? 0} tone="warn" accent delay={0.09} />
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
            {docTypeBreakdown.length === 0 && <div className="text-[12px] text-ink-faint">No screenings yet.</div>}
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
            {checkpointBreakdown.length === 0 && <div className="py-4 text-[12px] text-ink-faint">No checkpoints in this region yet.</div>}
          </div>
        </div>
      </Card>
    </>
  );
}
