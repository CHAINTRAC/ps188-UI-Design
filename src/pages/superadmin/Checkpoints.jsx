import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MapPinned, Pencil, Plus, TriangleAlert, User, X } from "lucide-react";
import Topbar from "../../components/layout/Topbar";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Select from "../../components/ui/Select";
import { useCheckpoints, useCreateCheckpoint, useUpdateCheckpoint } from "../../features/checkpoints/hooks";
import { useUsers } from "../../features/users/hooks";

const STATUS_FILTERS = [
  { key: "all", label: "All" },
  { key: "active", label: "Healthy" },
  { key: "attention", label: "Needs Attention" },
];

function RegisterCheckpointModal({ admins, onClose, onCreate, isPending, errorMessage }) {
  const [code, setCode] = useState("");
  const [region, setRegion] = useState("");
  const [adminId, setAdminId] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate({ code, region, admin_id: adminId || undefined });
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
        className="w-full max-w-[420px] rounded-2xl dark:rounded-lg border border-line bg-surface p-7 shadow-[var(--shadow-panel)]"
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
          {errorMessage && (
            <div className="flex items-center gap-2.5 rounded-lg border border-bad/30 bg-bad-soft px-3.5 py-3">
              <TriangleAlert size={15} strokeWidth={1.75} className="shrink-0 text-bad-ink" />
              <span className="text-[12.5px] font-medium text-bad-ink">{errorMessage}</span>
            </div>
          )}

          <label className="flex flex-col gap-1.5">
            <span className="text-[11.5px] font-medium text-ink-dim">Checkpoint ID</span>
            <div className="flex items-center gap-2.5 rounded-lg border border-line bg-surface-sunken/60 px-3.5 py-2.5 focus-within:border-brand">
              <MapPinned size={14} strokeWidth={1.75} className="shrink-0 text-ink-faint" />
              <input
                required
                autoFocus
                value={code}
                onChange={(e) => setCode(e.target.value)}
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
            <Select
              value={adminId}
              onChange={setAdminId}
              icon={User}
              options={[{ value: "", label: "Unassigned" }, ...admins.map((a) => ({ value: a.id, label: a.full_name }))]}
            />
          </label>

          <motion.button
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isPending}
            className="mt-2 flex items-center justify-center gap-2 rounded-lg bg-navy py-3 text-[13px] font-semibold text-white shadow-sm disabled:opacity-70"
          >
            {isPending ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            ) : (
              <>
                <Plus size={15} strokeWidth={2.25} />
                Register Checkpoint
              </>
            )}
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  );
}

const STATUS_OPTIONS = [
  { value: "active", label: "Healthy" },
  { value: "attention", label: "Needs Attention" },
];

function EditCheckpointModal({ checkpoint, admins, onClose, onSave, isPending, errorMessage }) {
  const [adminId, setAdminId] = useState(checkpoint.admin_id || "");
  const [status, setStatus] = useState(checkpoint.status);

  const handleSubmit = (e) => {
    e.preventDefault();
    // admin_id must be "" (not null/omitted) to actually clear it — the
    // backend treats a nil pointer as "leave unchanged", not "unassign".
    onSave({ admin_id: adminId, status });
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
        className="w-full max-w-[420px] rounded-2xl dark:rounded-lg border border-line bg-surface p-7 shadow-[var(--shadow-panel)]"
      >
        <div className="mb-6 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-soft">
              <Pencil size={18} strokeWidth={1.75} className="text-brand-ink" />
            </div>
            <div>
              <div className="text-[15px] font-semibold text-ink">Edit Checkpoint</div>
              <p className="text-[11.5px] text-ink-faint">{checkpoint.code} · {checkpoint.region}</p>
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
          {errorMessage && (
            <div className="flex items-center gap-2.5 rounded-lg border border-bad/30 bg-bad-soft px-3.5 py-3">
              <TriangleAlert size={15} strokeWidth={1.75} className="shrink-0 text-bad-ink" />
              <span className="text-[12.5px] font-medium text-bad-ink">{errorMessage}</span>
            </div>
          )}

          <label className="flex flex-col gap-1.5">
            <span className="text-[11.5px] font-medium text-ink-dim">Assign Admin</span>
            <Select
              value={adminId}
              onChange={setAdminId}
              icon={User}
              options={[{ value: "", label: "Unassigned" }, ...admins.map((a) => ({ value: a.id, label: a.full_name }))]}
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-[11.5px] font-medium text-ink-dim">Status</span>
            <Select value={status} onChange={setStatus} options={STATUS_OPTIONS} />
          </label>

          <motion.button
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isPending}
            className="mt-2 flex items-center justify-center gap-2 rounded-lg bg-navy py-3 text-[13px] font-semibold text-white shadow-sm disabled:opacity-70"
          >
            {isPending ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            ) : (
              "Save Changes"
            )}
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  );
}

export default function Checkpoints() {
  const { data: checkpoints = [], isLoading } = useCheckpoints();
  const { data: users = [] } = useUsers();
  const createCheckpoint = useCreateCheckpoint();
  const updateCheckpoint = useUpdateCheckpoint();
  const [status, setStatus] = useState("all");
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState(null);

  const admins = users.filter((u) => u.role === "admin");
  const adminName = (adminId) => admins.find((a) => a.id === adminId)?.full_name || "Unassigned";
  const verifierCount = (code) => users.filter((u) => u.role === "verifier" && u.checkpoint_id === code).length;

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
            <div className="grid grid-cols-[0.8fr_1fr_1fr_0.8fr_1fr_auto] gap-2 border-b border-line-soft px-5 py-3 text-[10.5px] tracking-wide text-ink-faint">
              <span>CODE</span>
              <span>REGION</span>
              <span>ADMIN</span>
              <span>VERIFIERS</span>
              <span>STATUS</span>
              <span />
            </div>
            {isLoading && (
              <div className="px-5 py-10 text-center text-[12.5px] text-ink-faint">Loading checkpoints…</div>
            )}
            {!isLoading &&
              rows.map((c, i) => (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03, duration: 0.35 }}
                  className={`grid grid-cols-[0.8fr_1fr_1fr_0.8fr_1fr_auto] items-center gap-2 px-5 py-3.5 transition-colors hover:bg-surface-sunken/60 ${
                    i !== rows.length - 1 ? "border-b border-line-soft" : ""
                  }`}
                >
                  <span className="font-mono text-[12.5px] font-medium">{c.code}</span>
                  <span className="text-[12px] text-ink-dim">{c.region}</span>
                  <span className="text-[12px]">{adminName(c.admin_id)}</span>
                  <span className="font-mono text-[12px]">{verifierCount(c.code)}</span>
                  <Badge variant={c.status === "active" ? "good" : "warn"} className="w-fit">
                    {c.status === "active" ? "Healthy" : "Attention"}
                  </Badge>
                  <button
                    onClick={() => setEditing(c)}
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-line text-ink-faint hover:bg-surface-sunken hover:text-ink"
                    title="Edit checkpoint"
                  >
                    <Pencil size={13} strokeWidth={1.75} />
                  </button>
                </motion.div>
              ))}
            {!isLoading && rows.length === 0 && (
              <div className="px-5 py-10 text-center text-[12.5px] text-ink-faint">No checkpoints match this filter.</div>
            )}
          </div>
        </div>
      </Card>

      <AnimatePresence>
        {showAdd && (
          <RegisterCheckpointModal
            admins={admins}
            isPending={createCheckpoint.isPending}
            errorMessage={
              createCheckpoint.isError &&
              (createCheckpoint.error.response?.data?.error?.message || "Something went wrong. Try again.")
            }
            onClose={() => setShowAdd(false)}
            onCreate={(payload) => {
              createCheckpoint.mutate(payload, {
                onSuccess: () => setShowAdd(false),
              });
            }}
          />
        )}
        {editing && (
          <EditCheckpointModal
            checkpoint={editing}
            admins={admins}
            isPending={updateCheckpoint.isPending}
            errorMessage={
              updateCheckpoint.isError &&
              (updateCheckpoint.error.response?.data?.error?.message || "Something went wrong. Try again.")
            }
            onClose={() => setEditing(null)}
            onSave={(payload) => {
              updateCheckpoint.mutate(
                { code: editing.code, ...payload },
                { onSuccess: () => setEditing(null) }
              );
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}
