import { useState } from "react";
import { motion } from "framer-motion";
import { FileText } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import Topbar from "../../components/layout/Topbar";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import StatCard from "../../components/ui/StatCard";
import ScreeningDetailModal from "../../components/shared/ScreeningDetailModal";
import { useMe } from "../../features/auth/hooks";
import { useUsers } from "../../features/users/hooks";
import { useCheckpoints } from "../../features/checkpoints/hooks";
import { useDashboardSummary } from "../../features/dashboard/hooks";
import { timeAgo } from "../../lib/format";
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
  const { data: me } = useMe();
  const { data: users = [] } = useUsers();
  const { data: checkpoints = [] } = useCheckpoints();
  const { data: summary, isLoading } = useDashboardSummary();
  const [selectedId, setSelectedId] = useState(null);

  const verifiers = users.filter((u) => u.role === "verifier" && (!me?.region || u.region === me.region));
  const officerNameById = Object.fromEntries(users.map((u) => [u.id, u.full_name]));

  const s = summary ?? {};
  const screeningsToday = s.screenings_today ?? 0;
  const decidedToday = s.decided_today ?? 0;
  const decisionRate = screeningsToday ? (decidedToday / screeningsToday) * 100 : 0;

  const todayByVerifier = Object.fromEntries((s.verifier_activity ?? []).map((a) => [a.id, a.today]));

  const stats = [
    { label: "Verifications Today", value: screeningsToday },
    { label: "Decision Rate", value: decisionRate, decimals: 1, suffix: "%" },
    { label: "Avg Decision Time", value: s.avg_decision_seconds ?? 0, suffix: "s" },
    { label: "Escalated Cases", value: s.escalated ?? 0, tone: "warn", accent: true },
  ];

  const weeklyVolume = s.weekly_volume ?? [];
  const flaggedCases = (s.flagged_cases ?? []).slice(0, 6);

  return (
    <>
      <Topbar
        title="Team Overview"
        subtitle={`${me?.region || "—"} · ${checkpoints.length} checkpoints · ${verifiers.length} verifiers`}
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((st, i) => (
          <StatCard key={st.label} delay={0.02 * i} {...st} />
        ))}
      </div>

      <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[1.5fr_1fr]">
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
            <div className="overflow-x-auto">
              <div className="min-w-[420px]">
                <div className="grid grid-cols-[1.4fr_1fr_0.8fr_0.8fr] gap-2 border-b border-line pb-2.5 text-[10.5px] tracking-wide text-ink-faint">
                  <span>NAME</span>
                  <span>CHECKPOINT</span>
                  <span>STATUS</span>
                  <span>TODAY</span>
                </div>
                {verifiers.map((v, i) => (
                  <div
                    key={v.id}
                    className={`grid grid-cols-[1.4fr_1fr_0.8fr_0.8fr] items-center gap-2 py-2.5 transition-colors hover:bg-surface-sunken/60 ${
                      i !== verifiers.length - 1 ? "border-b border-line-soft" : ""
                    }`}
                  >
                    <span className="text-[12.5px] font-medium">{v.full_name}</span>
                    <span className="font-mono text-[11.5px] text-ink-dim">{v.checkpoint_id}</span>
                    <span className={`flex items-center gap-1.5 text-[11px] ${v.status === "active" ? "text-good-ink" : "text-ink-faint"}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${v.status === "active" ? "bg-good" : "bg-line"}`} />
                      {v.status === "active" ? "Active" : "Disabled"}
                    </span>
                    <span className="font-mono text-[12px]">{todayByVerifier[v.id] ?? 0}</span>
                  </div>
                ))}
                {verifiers.length === 0 && <div className="py-4 text-[12px] text-ink-faint">No verifiers in this region yet.</div>}
              </div>
            </div>
          </Card>
        </div>

        <Card delay={0.1}>
          <div className="mb-3.5 flex items-center justify-between">
            <span className="text-[13.5px] font-semibold">Flagged for Review</span>
            <Badge variant="bad">{flaggedCases.length} new</Badge>
          </div>
          <div className="flex flex-col">
            {isLoading && <div className="py-4 text-[12px] text-ink-faint">Loading…</div>}
            {flaggedCases.map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.06 }}
                onClick={() => setSelectedId(c.id)}
                className="flex cursor-pointer items-center gap-3 rounded-lg px-1.5 py-2.5 transition-colors hover:bg-surface-sunken/60"
              >
                <FileText
                  size={16}
                  strokeWidth={1.75}
                  className={c.verdict_band === "FAKE" ? "text-bad shrink-0" : "text-warn-ink shrink-0"}
                />
                <div className="min-w-0 flex-1">
                  <div className="text-[12px] font-medium">
                    {c.doc_type} · <span className="font-mono">{c.reference_no}</span>
                  </div>
                  <div className="text-[10.5px] text-ink-faint">
                    {officerNameById[c.officer_id] || c.officer_id} · {c.checkpoint_id} · {timeAgo(c.created_at)}
                  </div>
                </div>
                <Badge variant={c.verdict_band === "FAKE" ? "bad" : "warn"}>{c.verdict}</Badge>
              </motion.div>
            ))}
            {!isLoading && flaggedCases.length === 0 && (
              <div className="py-4 text-[12px] text-ink-faint">Nothing flagged right now.</div>
            )}
          </div>
        </Card>
      </div>

      <ScreeningDetailModal screeningId={selectedId} onClose={() => setSelectedId(null)} />
    </>
  );
}
