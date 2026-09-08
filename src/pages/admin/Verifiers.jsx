import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FileText, KeyRound, Mail, MapPin, Plus, User, UserPlus, X } from "lucide-react";
import Topbar from "../../components/layout/Topbar";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Select from "../../components/ui/Select";
import ScreeningDetailModal from "../../components/shared/ScreeningDetailModal";
import { useUsers, useCreateUser, useResetUserPassword, useUpdateUser } from "../../features/users/hooks";
import { useCheckpoints } from "../../features/checkpoints/hooks";
import { useScreenings } from "../../features/screenings/hooks";
import { useMe } from "../../features/auth/hooks";
import { initialsFor } from "../../lib/format";

const STATUS_FILTERS = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "disabled", label: "Disabled" },
];

const VERDICT_TONE = { GENUINE: "good", SUSPICIOUS: "warn", FAKE: "bad" };

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function VerifierDetail({ verifier, checkpoints, onClose, onOpenCase }) {
  const [checkpointId, setCheckpointId] = useState(verifier.checkpoint_id);
  const resetPassword = useResetUserPassword();
  const updateUser = useUpdateUser();
  const disabled = verifier.status !== "active";

  // "Recent Screenings" tracks whichever checkpoint is selected in the drawer —
  // it follows a reassignment instead of staying pinned to the original.
  const { data: screenings = [], isLoading } = useScreenings({ checkpointId });
  const history = screenings.filter((s) => s.officer_id === verifier.id);

  const reassign = (code) => {
    setCheckpointId(code);
    if (code && code !== verifier.checkpoint_id) {
      updateUser.mutate({ id: verifier.id, checkpoint_id: code });
    }
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
        className="max-h-[85vh] w-full max-w-[560px] overflow-y-auto rounded-2xl dark:rounded-lg border border-line bg-surface p-7 shadow-[var(--shadow-panel)]"
      >
        <div className="mb-5 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-navy text-[13px] font-semibold text-white">
              {initialsFor(verifier.full_name)}
            </div>
            <div>
              <div className="text-[15px] font-semibold text-ink">{verifier.full_name}</div>
              <div className="flex items-center gap-1.5 text-[11.5px] text-ink-faint">
                <span className={`h-1.5 w-1.5 rounded-full ${verifier.status === "active" ? "bg-good" : "bg-line"}`} />
                {verifier.status === "active" ? "Active" : "Disabled"} · {verifier.checkpoint_id}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-ink-faint hover:bg-surface-sunken"
          >
            <X size={15} strokeWidth={1.75} />
          </button>
        </div>

        <div className="mb-6 grid grid-cols-3 gap-3 rounded-2xl dark:rounded-lg border border-line bg-surface-sunken/50 p-4">
          <div>
            <div className="text-[9.5px] font-medium uppercase tracking-wider text-ink-faint">Username</div>
            <div className="mt-0.5 font-mono text-[13px] font-bold text-ink">{verifier.username}</div>
          </div>
          <div>
            <div className="text-[9.5px] font-medium uppercase tracking-wider text-ink-faint">Email</div>
            <div className="mt-0.5 truncate text-[12px] font-semibold text-ink" title={verifier.email}>
              {verifier.email}
            </div>
          </div>
          <div>
            <div className="text-[9.5px] font-medium uppercase tracking-wider text-ink-faint">Member since</div>
            <div className="mt-0.5 text-[13px] font-semibold text-ink">{formatDate(verifier.created_at)}</div>
          </div>
        </div>

        <div className="mb-6 flex items-center justify-between rounded-lg border border-line px-3.5 py-3">
          <div>
            <div className="text-[12.5px] font-medium text-ink">Reset password</div>
            <div className="text-[11px] text-ink-faint">Issues a new temporary password for this account.</div>
          </div>
          <button
            onClick={() => resetPassword.mutate(verifier.id)}
            disabled={resetPassword.isPending}
            className="flex shrink-0 items-center gap-1.5 rounded-lg border border-line px-3 py-2 text-[12px] font-medium text-ink-dim transition-colors hover:bg-surface-sunken disabled:opacity-60"
          >
            <KeyRound size={13} strokeWidth={1.75} />
            {resetPassword.isPending ? "Resetting…" : "Reset"}
          </button>
        </div>
        {resetPassword.isSuccess && (
          <div className="mb-6 rounded-lg border border-good/30 bg-good-soft px-3.5 py-3 text-[12.5px] text-good-ink">
            New temporary password: <span className="font-mono font-semibold">{resetPassword.data.temp_password}</span>
          </div>
        )}
        {resetPassword.isError && (
          <div className="mb-6 rounded-lg border border-bad/30 bg-bad-soft px-3.5 py-3 text-[12.5px] text-bad-ink">
            {resetPassword.error.response?.data?.error?.message || "Could not reset password."}
          </div>
        )}

        <div className="mb-6 rounded-lg border border-line px-3.5 py-3">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <div className="text-[12.5px] font-medium text-ink">Account status</div>
              <div className="text-[11px] text-ink-faint">
                {disabled ? "Disabled — this verifier cannot sign in." : "Active — can sign in and screen documents."}
              </div>
            </div>
            <button
              onClick={() => updateUser.mutate({ id: verifier.id, status: disabled ? "active" : "disabled" })}
              disabled={updateUser.isPending}
              className={`shrink-0 rounded-lg border px-3 py-2 text-[12px] font-medium transition-colors disabled:opacity-60 ${
                disabled
                  ? "border-good/40 text-good-ink hover:bg-good-soft"
                  : "border-bad/40 text-bad-ink hover:bg-bad-soft"
              }`}
            >
              {disabled ? "Enable" : "Disable"}
            </button>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-medium text-ink-dim">Checkpoint</span>
            <Select
              value={checkpointId}
              onChange={reassign}
              options={checkpoints.map((cp) => ({ value: cp.code, label: cp.code }))}
              placeholder="Select a checkpoint"
            />
          </div>
          {updateUser.isError && (
            <div className="mt-2 text-[11px] text-bad-ink">
              {updateUser.error.response?.data?.error?.message || "Could not update the account."}
            </div>
          )}
        </div>

        <span className="mb-3 block text-[13px] font-semibold">Recent Screenings</span>
        <div className="flex flex-col gap-1.5">
          {isLoading && <p className="text-[12px] text-ink-faint">Loading…</p>}
          {!isLoading && history.length === 0 && <p className="text-[12px] text-ink-faint">No screenings logged yet.</p>}
          {history.map((s) => (
            <button
              key={s.id}
              onClick={() => onOpenCase(s)}
              className="flex items-center gap-3 rounded-lg border border-line px-3.5 py-2.5 text-left transition-colors hover:bg-surface-sunken/60"
            >
              <FileText size={14} strokeWidth={1.75} className="shrink-0 text-ink-faint" />
              <div className="flex-1">
                <div className="font-mono text-[12px] font-medium text-ink">{s.reference_no}</div>
                <div className="text-[10.5px] text-ink-faint">
                  {s.doc_type} · {formatDate(s.created_at)}
                </div>
              </div>
              <Badge variant={VERDICT_TONE[s.verdict_band] ?? "neutral"}>{s.verdict}</Badge>
            </button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

function AddVerifierModal({ checkpoints, onClose, onCreated }) {
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [checkpointId, setCheckpointId] = useState("");
  const [password, setPassword] = useState("");
  const createUser = useCreateUser();

  const handleSubmit = (e) => {
    e.preventDefault();
    createUser.mutate(
      {
        username,
        full_name: fullName,
        email,
        password,
        role: "verifier",
        checkpoint_id: checkpointId,
      },
      { onSuccess: onCreated }
    );
  };

  const errorMessage =
    createUser.isError && (createUser.error.response?.data?.error?.message || "Could not create verifier.");

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
              <UserPlus size={20} strokeWidth={1.75} className="text-brand-ink" />
            </div>
            <div>
              <div className="text-[15px] font-semibold text-ink">Add Verifier</div>
              <p className="text-[11.5px] text-ink-faint">Creates a new account scoped to a checkpoint.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line text-ink-faint hover:bg-surface-sunken"
          >
            <X size={15} strokeWidth={1.75} />
          </button>
        </div>

        {errorMessage && (
          <div className="mb-3.5 rounded-lg border border-bad/30 bg-bad-soft px-3.5 py-2.5 text-[12px] text-bad-ink">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          <label className="flex flex-col gap-1.5">
            <span className="text-[11.5px] font-medium text-ink-dim">Username</span>
            <div className="flex items-center gap-2.5 rounded-lg border border-line bg-surface-sunken/60 px-3.5 py-2.5 focus-within:border-brand">
              <User size={14} strokeWidth={1.75} className="shrink-0 text-ink-faint" />
              <input
                required
                autoFocus
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. v.rao"
                className="w-full bg-transparent text-[13px] text-ink outline-none placeholder:text-ink-faint"
              />
            </div>
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-[11.5px] font-medium text-ink-dim">Full Name</span>
            <div className="flex items-center gap-2.5 rounded-lg border border-line bg-surface-sunken/60 px-3.5 py-2.5 focus-within:border-brand">
              <User size={14} strokeWidth={1.75} className="shrink-0 text-ink-faint" />
              <input
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. V. Rao"
                className="w-full bg-transparent text-[13px] text-ink outline-none placeholder:text-ink-faint"
              />
            </div>
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-[11.5px] font-medium text-ink-dim">Email</span>
            <div className="flex items-center gap-2.5 rounded-lg border border-line bg-surface-sunken/60 px-3.5 py-2.5 focus-within:border-brand">
              <Mail size={14} strokeWidth={1.75} className="shrink-0 text-ink-faint" />
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. v.rao@ssb.gov.in"
                className="w-full bg-transparent text-[13px] text-ink outline-none placeholder:text-ink-faint"
              />
            </div>
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-[11.5px] font-medium text-ink-dim">Checkpoint</span>
            <Select
              required
              value={checkpointId}
              onChange={setCheckpointId}
              icon={MapPin}
              placeholder="Select a checkpoint"
              options={checkpoints.map((cp) => ({ value: cp.code, label: cp.code }))}
            />
            {checkpoints.length === 0 && (
              <p className="text-[11px] text-warn-ink">No checkpoints yet — ask a super admin to register one first.</p>
            )}
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-[11.5px] font-medium text-ink-dim">Temporary Password</span>
            <div className="flex items-center gap-2.5 rounded-lg border border-line bg-surface-sunken/60 px-3.5 py-2.5 focus-within:border-brand">
              <KeyRound size={14} strokeWidth={1.75} className="shrink-0 text-ink-faint" />
              <input
                required
                type="password"
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-transparent text-[13px] text-ink outline-none placeholder:text-ink-faint"
              />
            </div>
          </label>

          <motion.button
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={createUser.isPending}
            className="mt-2 flex items-center justify-center gap-2 rounded-lg bg-navy py-3 text-[13px] font-semibold text-white shadow-sm disabled:opacity-70"
          >
            <Plus size={15} strokeWidth={2.25} />
            {createUser.isPending ? "Creating…" : "Create Verifier"}
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  );
}

export default function Verifiers() {
  const { data: me } = useMe();
  const { data: users = [], isLoading } = useUsers();
  const { data: checkpoints = [] } = useCheckpoints();
  const verifiers = users.filter((u) => u.role === "verifier" && (!me?.region || u.region === me.region));
  const [status, setStatus] = useState("all");
  const [selectedVerifier, setSelectedVerifier] = useState(null);
  const [selectedCase, setSelectedCase] = useState(null);
  const [showAdd, setShowAdd] = useState(false);

  const rows = verifiers.filter((v) => (status === "all" ? true : v.status === status));

  return (
    <>
      <Topbar
        title="Verifiers"
        subtitle={`${verifiers.length} verifier${verifiers.length === 1 ? "" : "s"} across ${checkpoints.length} checkpoint${checkpoints.length === 1 ? "" : "s"}`}
      />

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
          Add Verifier
        </motion.button>
      </div>

      <Card noPad delay={0.05}>
        <div className="overflow-x-auto">
          <div className="min-w-[560px]">
            <div className="grid grid-cols-[1.4fr_1fr_0.8fr_1fr] gap-2 border-b border-line-soft px-5 py-3 text-[10.5px] tracking-wide text-ink-faint">
              <span>NAME</span>
              <span>CHECKPOINT</span>
              <span>STATUS</span>
              <span>MEMBER SINCE</span>
            </div>
            {isLoading && <p className="px-5 py-4 text-[12px] text-ink-faint">Loading verifiers…</p>}
            {!isLoading && rows.length === 0 && (
              <p className="px-5 py-4 text-[12px] text-ink-faint">No verifiers match this filter.</p>
            )}
            {rows.map((v, i) => (
              <motion.button
                key={v.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03, duration: 0.35 }}
                onClick={() => setSelectedVerifier(v)}
                className={`grid w-full grid-cols-[1.4fr_1fr_0.8fr_1fr] items-center gap-2 px-5 py-3.5 text-left transition-colors hover:bg-surface-sunken/60 ${
                  i !== rows.length - 1 ? "border-b border-line-soft" : ""
                }`}
              >
                <span className="text-[12.5px] font-medium text-ink">{v.full_name}</span>
                <span className="font-mono text-[11.5px] text-ink-dim">{v.checkpoint_id}</span>
                <span className={`flex items-center gap-1.5 text-[11px] ${v.status === "active" ? "text-good-ink" : "text-ink-faint"}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${v.status === "active" ? "bg-good" : "bg-line"}`} />
                  {v.status === "active" ? "Active" : "Disabled"}
                </span>
                <span className="text-[12px] text-ink-dim">{formatDate(v.created_at)}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </Card>

      <AnimatePresence>
        {selectedVerifier && (
          <VerifierDetail
            verifier={selectedVerifier}
            checkpoints={checkpoints}
            onClose={() => setSelectedVerifier(null)}
            onOpenCase={setSelectedCase}
          />
        )}
        {showAdd && (
          <AddVerifierModal
            checkpoints={checkpoints}
            onClose={() => setShowAdd(false)}
            onCreated={() => setShowAdd(false)}
          />
        )}
      </AnimatePresence>
      <ScreeningDetailModal screeningId={selectedCase?.id} onClose={() => setSelectedCase(null)} />
    </>
  );
}
