import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MapPinned, Plus, User, X } from "lucide-react";
import Topbar from "../../components/layout/Topbar";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import { adminsFull, checkpointsFull } from "../../data/superAdminData";

const STATUS_FILTERS = [
  { key: "all", label: "All" },
  { key: "good", label: "Healthy" },
  { key: "warn", label: "Needs Attention" },
];

function RegisterCheckpointModal({ onClose, onCreate }) {
  const [id, setId] = useState("");
  const [region, setRegion] = useState("");
  const [admin, setAdmin] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate({ id, region, admin, online: "0/0", today: 0, status: "warn" });
  };

  return (
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
        className="w-full max-w-[420px] rounded-2xl border border-line bg-surface p-7 shadow-[var(--shadow-panel)]"
      >
        <div className="mb-6 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-soft">
              <MapPinned size={20} strokeWidth={1.75} className="text-brand-ink" />
            </div>
            <div>
              <div className="text-[15px] font-semibold text-ink">Register Checkpoint</div>
              <p className="text-[11.5px] text-ink-faint">Adds a new checkpoint to the org registry.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line text-ink-faint hover:bg-surface-sunken"
          >
            <X size={15} strokeWidth={1.75} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          <label className="flex flex-col gap-1.5">
            <span className="text-[11.5px] font-medium text-ink-dim">Checkpoint ID</span>
            <div className="flex items-center gap-2.5 rounded-lg border border-line bg-surface-sunken/60 px-3.5 py-2.5 focus-within:border-brand">
              <MapPinned size={14} strokeWidth={1.75} className="shrink-0 text-ink-faint" />
              <input
                required
                autoFocus
                value={id}
                onChange={(e) => setId(e.target.value)}
                placeholder="e.g. CP-23"
                className="w-full bg-transparent text-[13px] text-ink outline-none placeholder:text-ink-faint"
              />
            </div>
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-[11.5px] font-medium text-ink-dim">Region</span>
            <input
              required
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              placeholder="e.g. North Zone"
              className="rounded-lg border border-line bg-surface-sunken/60 px-3.5 py-2.5 text-[13px] text-ink outline-none placeholder:text-ink-faint focus:border-brand"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-[11.5px] font-medium text-ink-dim">Assign Admin</span>
            <div className="flex items-center gap-2.5 rounded-lg border border-line bg-surface-sunken/60 px-3.5 py-2.5 focus-within:border-brand">
              <User size={14} strokeWidth={1.75} className="shrink-0 text-ink-faint" />
              <input
                required
                list="known-admins"
                value={admin}
                onChange={(e) => setAdmin(e.target.value)}
                placeholder="e.g. A. Mehta"
                className="w-full bg-transparent text-[13px] text-ink outline-none placeholder:text-ink-faint"
              />
              <datalist id="known-admins">
                {adminsFull.map((a) => (
                  <option key={a.name} value={a.name} />
                ))}
              </datalist>
            </div>
          </label>

          <motion.button
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="mt-2 flex items-center justify-center gap-2 rounded-lg bg-navy py-3 text-[13px] font-semibold text-white shadow-sm"
          >
            <Plus size={15} strokeWidth={2.25} />
            Register Checkpoint
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  );
}

export default function Checkpoints() {
  const [checkpoints, setCheckpoints] = useState(checkpointsFull);
  const [status, setStatus] = useState("all");
  const [showAdd, setShowAdd] = useState(false);

  const rows = status === "all" ? checkpoints : checkpoints.filter((c) => c.status === status);

  return (
    <>
      <Topbar title="Checkpoints" subtitle={`${checkpoints.length} checkpoints across all regions`} />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setStatus(f.key)}
              className={`rounded-full border px-3.5 py-1.5 text-[12.5px] font-medium transition-colors ${
                status === f.key
                  ? "border-navy bg-navy text-white"
                  : "border-line bg-surface text-ink-dim hover:bg-surface-sunken"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <motion.button
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-1.5 rounded-full bg-navy px-4 py-2 text-[12.5px] font-semibold text-white shadow-sm"
        >
          <Plus size={14} strokeWidth={2.25} />
          Register Checkpoint
        </motion.button>
      </div>

      <Card noPad delay={0.05}>
        <div className="overflow-x-auto">
          <div className="min-w-[520px]">
            <div className="grid grid-cols-[0.8fr_1fr_1fr_0.8fr_0.8fr_1fr] gap-2 border-b border-line-soft px-5 py-3 text-[10.5px] tracking-wide text-ink-faint">
              <span>ID</span>
              <span>REGION</span>
              <span>ADMIN</span>
              <span>ONLINE</span>
              <span>TODAY</span>
              <span>STATUS</span>
            </div>
            {rows.map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03, duration: 0.35 }}
                className={`grid grid-cols-[0.8fr_1fr_1fr_0.8fr_0.8fr_1fr] items-center gap-2 px-5 py-3.5 transition-colors hover:bg-surface-sunken/60 ${
                  i !== rows.length - 1 ? "border-b border-line-soft" : ""
                }`}
              >
                <span className="font-mono text-[12.5px] font-medium">{c.id}</span>
                <span className="text-[12px] text-ink-dim">{c.region}</span>
                <span className="text-[12px]">{c.admin}</span>
                <span className="font-mono text-[12px]">{c.online}</span>
                <span className="font-mono text-[12px]">{c.today}</span>
                <Badge variant={c.status === "good" ? "good" : "warn"} className="w-fit">
                  {c.status === "good" ? "Healthy" : "Attention"}
                </Badge>
              </motion.div>
            ))}
            {rows.length === 0 && (
              <div className="px-5 py-10 text-center text-[12.5px] text-ink-faint">No checkpoints match this filter.</div>
            )}
          </div>
        </div>
      </Card>

      <AnimatePresence>
        {showAdd && (
          <RegisterCheckpointModal
            onClose={() => setShowAdd(false)}
            onCreate={(c) => {
              setCheckpoints((prev) => [...prev, c]);
              setShowAdd(false);
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}
