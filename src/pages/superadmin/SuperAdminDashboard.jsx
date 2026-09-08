import { Check, Settings2, TriangleAlert, UserPlus } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Topbar from "../../components/layout/Topbar";
import Card from "../../components/ui/Card";
import StatCard from "../../components/ui/StatCard";
import { useUsers } from "../../features/users/hooks";
import { useCheckpoints } from "../../features/checkpoints/hooks";
import { useDashboardSummary } from "../../features/dashboard/hooks";
import { useAuditLogs } from "../../features/audit/hooks";
import { describeAuditEntry } from "../../features/audit/format";

const ACTION_ICON = {
  good: { Icon: Check, bg: "bg-good-soft", fg: "text-good-ink" },
  brand: { Icon: UserPlus, bg: "bg-brand-soft", fg: "text-brand-ink" },
  bad: { Icon: TriangleAlert, bg: "bg-bad-soft", fg: "text-bad-ink" },
  warn: { Icon: Settings2, bg: "bg-warn-soft", fg: "text-warn-ink" },
};

export default function SuperAdminDashboard() {
  const { data: users = [] } = useUsers();
  const { data: checkpoints = [] } = useCheckpoints();
  const { data: summary } = useDashboardSummary();
  const { data: auditEntries = [] } = useAuditLogs({ limit: 5 });

  const admins = users.filter((u) => u.role === "admin");
  const verifiers = users.filter((u) => u.role === "verifier");
  const adminById = Object.fromEntries(admins.map((a) => [a.id, a]));
  const usersById = Object.fromEntries(users.map((u) => [u.id, u.full_name]));
  const auditTrail = auditEntries.map((e) => describeAuditEntry(e, usersById));

  const s = summary ?? {};
  const totals = s.totals ?? {};
  // checkpoint_activity[].id is the checkpoint *code* (screenings denormalise the
  // code, not the ObjectID), so it keys straight off CheckpointView.code below.
  const todayByCheckpoint = Object.fromEntries((s.checkpoint_activity ?? []).map((a) => [a.id, a.today]));
  const decisionRate = s.screenings_total ? ((s.decided_total ?? 0) / s.screenings_total) * 100 : 0;

  const orgStats = [
    { label: "Checkpoints", value: totals.checkpoints ?? checkpoints.length },
    { label: "Admins", value: totals.admins ?? admins.length },
    { label: "Verifiers", value: totals.verifiers ?? verifiers.length },
    { label: "Screenings Today", value: s.screenings_today ?? 0 },
    { label: "Decision Rate", value: decisionRate, decimals: 1, suffix: "%", tone: "good", accent: true },
  ];

  return (
    <>
      <Topbar title="Organization Overview" subtitle="All regions · Ministry of Home Affairs / SSB" />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {orgStats.map((st, i) => (
          <StatCard key={st.label} delay={0.02 * i} {...st} />
        ))}
      </div>

      <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[1.3fr_1fr]">
        <Card delay={0.08}>
          <span className="mb-3.5 block text-[13.5px] font-semibold">Checkpoints</span>
          <div className="overflow-x-auto">
            <div className="min-w-[460px]">
              <div className="grid grid-cols-[0.7fr_1fr_1fr_0.7fr_0.8fr_0.8fr] gap-2 border-b border-line pb-2.5 text-[10.5px] tracking-wide text-ink-faint">
                <span>ID</span>
                <span>REGION</span>
                <span>ADMIN</span>
                <span>STATUS</span>
                <span>VERIFIERS</span>
                <span>TODAY</span>
              </div>
              {checkpoints.map((c, i) => {
                const verifierCount = verifiers.filter((v) => v.checkpoint_id === c.code).length;
                return (
                  <div
                    key={c.id}
                    className={`grid grid-cols-[0.7fr_1fr_1fr_0.7fr_0.8fr_0.8fr] items-center gap-2 py-2.5 transition-colors hover:bg-surface-sunken/60 ${
                      i !== checkpoints.length - 1 ? "border-b border-line-soft" : ""
                    }`}
                  >
                    <span className="font-mono text-[12px] font-medium">{c.code}</span>
                    <span className="text-[12px] text-ink-dim">{c.region}</span>
                    <span className="text-[12px]">{adminById[c.admin_id]?.full_name || "Unassigned"}</span>
                    <span className={`flex items-center gap-1.5 text-[11px] ${c.status === "active" ? "text-good-ink" : "text-warn-ink"}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${c.status === "active" ? "bg-good" : "bg-warn"}`} />
                      {c.status === "active" ? "Active" : "Attention"}
                    </span>
                    <span className="font-mono text-[12px]">{verifierCount}</span>
                    <span className="font-mono text-[12px]">{todayByCheckpoint[c.code] ?? 0}</span>
                  </div>
                );
              })}
              {checkpoints.length === 0 && <div className="py-4 text-[12px] text-ink-faint">No checkpoints registered yet.</div>}
            </div>
          </div>

          <span className="mb-3.5 mt-6 block border-t border-line pt-5 text-[13.5px] font-semibold">Admins</span>
          <div className="overflow-x-auto">
            <div className="min-w-[400px]">
              <div className="grid grid-cols-[1.2fr_1fr_0.8fr_1fr] gap-2 border-b border-line pb-2.5 text-[10.5px] tracking-wide text-ink-faint">
                <span>NAME</span>
                <span>REGION</span>
                <span>TEAM</span>
                <span>CHECKPOINTS</span>
              </div>
              {admins.map((a, i) => (
                <div
                  key={a.id}
                  className={`grid grid-cols-[1.2fr_1fr_0.8fr_1fr] items-center gap-2 py-2.5 transition-colors hover:bg-surface-sunken/60 ${
                    i !== admins.length - 1 ? "border-b border-line-soft" : ""
                  }`}
                >
                  <span className="text-[12.5px] font-medium">{a.full_name}</span>
                  <span className="text-[12px] text-ink-dim">{a.region}</span>
                  <span className="font-mono text-[12px]">{verifiers.filter((v) => v.region === a.region).length}</span>
                  <span className="font-mono text-[12px] text-good-ink">
                    {checkpoints.filter((c) => c.admin_id === a.id).length}
                  </span>
                </div>
              ))}
              {admins.length === 0 && <div className="py-4 text-[12px] text-ink-faint">No admins yet.</div>}
            </div>
          </div>
        </Card>

        <Card delay={0.1}>
          <div className="mb-4 flex items-center justify-between">
            <span className="text-[13.5px] font-semibold">Audit Trail</span>
            <Link to="/super-admin/audit-trail" className="text-[11.5px] font-medium">
              View all
            </Link>
          </div>
          <div className="flex flex-col">
            {auditTrail.length === 0 && (
              <div className="py-4 text-[12px] text-ink-faint">No activity yet.</div>
            )}
            {auditTrail.map((e, i) => {
              const { Icon, bg, fg } = ACTION_ICON[e.tone] ?? ACTION_ICON.brand;
              const last = i === auditTrail.length - 1;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.06 }}
                  className="flex gap-3"
                >
                  <div className="flex flex-col items-center">
                    <div className={`flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full ${bg}`}>
                      <Icon size={13} strokeWidth={2} className={fg} />
                    </div>
                    {!last && <div className="mt-1 w-px flex-1 bg-line" />}
                  </div>
                  <div className={last ? "" : "pb-4"}>
                    <div className="text-[12px]">
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
          </div>
        </Card>
      </div>
    </>
  );
}
