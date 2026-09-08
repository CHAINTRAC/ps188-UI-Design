import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { KeyRound, Mail, MapPinned, Plus, User, UserPlus, X } from "lucide-react";
import Topbar from "../../components/layout/Topbar";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Select from "../../components/ui/Select";
import { useUsers, useCreateUser, useResetUserPassword, useUpdateUser } from "../../features/users/hooks";
import { useCheckpoints } from "../../features/checkpoints/hooks";
import { initialsFor } from "../../lib/format";

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

const ROLE_OPTIONS = [
  { value: "verifier", label: "Verifier" },
  { value: "admin", label: "Admin" },
  { value: "superadmin", label: "Super Admin" },
];

function AdminDetail({ admin, team, checkpoints, regions, onClose }) {
  const managed = checkpoints.filter((c) => c.admin_id === admin.id);
  const resetPassword = useResetUserPassword();
  const updateUser = useUpdateUser();
  const [region, setRegion] = useState(admin.region || "");
  const [role, setRole] = useState(admin.role);
  const disabled = admin.status !== "active";

  const saveRegion = () => {
    const next = region.trim();
    if (next && next !== admin.region) updateUser.mutate({ id: admin.id, region: next });
  };
  const changeRole = (next) => {
    setRole(next);
    if (next && next !== admin.role) {
      const payload = { id: admin.id, role: next };
      // A new verifier needs a checkpoint; a new admin needs a region. Send the
      // current region along so an admin↔superadmin move keeps/clears scope
      // server-side; the backend rejects a promotion that still lacks its scope.
      if (next === "admin" && region.trim()) payload.region = region.trim();
      updateUser.mutate(payload);
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
              {initialsFor(admin.full_name)}
            </div>
            <div>
              <div className="text-[15px] font-semibold text-ink">{admin.full_name}</div>
              <div className="text-[11.5px] text-ink-faint">
                {admin.region} · {admin.email}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line text-ink-faint hover:bg-surface-sunken"
          >
            <X size={15} strokeWidth={1.75} />
          </button>
        </div>

        <div className="mb-6 grid grid-cols-3 gap-3 rounded-2xl dark:rounded-lg border border-line bg-surface-sunken/50 p-4">
          <div>
            <div className="text-[9.5px] font-medium uppercase tracking-wider text-ink-faint">Team</div>
            <div className="mt-0.5 font-mono text-[15px] font-bold text-ink">{team}</div>
          </div>
          <div>
            <div className="text-[9.5px] font-medium uppercase tracking-wider text-ink-faint">Checkpoints</div>
            <div className="mt-0.5 font-mono text-[15px] font-bold text-ink">{managed.length}</div>
          </div>
          <div>
            <div className="text-[9.5px] font-medium uppercase tracking-wider text-ink-faint">Admin since</div>
            <div className="mt-0.5 text-[13px] font-semibold text-ink">{formatDate(admin.created_at)}</div>
          </div>
        </div>

        <div className="mb-6 flex items-center justify-between rounded-lg border border-line px-3.5 py-3">
          <div>
            <div className="text-[12.5px] font-medium text-ink">Reset password</div>
            <div className="text-[11px] text-ink-faint">Issues a new temporary password for this account.</div>
          </div>
          <button
            onClick={() => resetPassword.mutate(admin.id)}
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
                {disabled ? "Disabled — cannot sign in." : "Active — full access for their region."}
              </div>
            </div>
            <button
              onClick={() => updateUser.mutate({ id: admin.id, status: disabled ? "active" : "disabled" })}
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

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-medium text-ink-dim">Region</span>
              <div className="flex gap-1.5">
                <input
                  list="admin-regions"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  onBlur={saveRegion}
                  className="w-full rounded-lg border border-line bg-surface-sunken/60 px-2.5 py-2 text-[12.5px] text-ink outline-none focus:border-brand"
                />
                <datalist id="admin-regions">
                  {regions.map((r) => (
                    <option key={r} value={r} />
                  ))}
                </datalist>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-medium text-ink-dim">Role</span>
              <Select value={role} onChange={changeRole} options={ROLE_OPTIONS} />
            </div>
          </div>
          {updateUser.isError && (
            <div className="mt-2 text-[11px] text-bad-ink">
              {updateUser.error.response?.data?.error?.message || "Could not update the account."}
            </div>
          )}
        </div>

        <span className="mb-3 block text-[13px] font-semibold">Checkpoints Managed</span>
        <div className="flex flex-col gap-1.5">
          {managed.length === 0 && <p className="text-[12px] text-ink-faint">No checkpoints assigned yet.</p>}
          {managed.map((c) => (
            <div key={c.id} className="flex items-center gap-3 rounded-lg border border-line px-3.5 py-2.5">
              <MapPinned size={14} strokeWidth={1.75} className="shrink-0 text-ink-faint" />
              <div className="flex-1">
                <div className="font-mono text-[12px] font-medium text-ink">{c.code}</div>
                <div className="text-[10.5px] text-ink-faint">{c.region}</div>
              </div>
              <Badge variant={c.status === "active" ? "good" : "warn"}>
                {c.status === "active" ? "Healthy" : "Attention"}
              </Badge>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

function AddAdminModal({ regions, onClose, onCreated }) {
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [region, setRegion] = useState("");
  const [password, setPassword] = useState("");
  const createUser = useCreateUser();

  const handleSubmit = (e) => {
    e.preventDefault();
    createUser.mutate(
      { username, full_name: fullName, email, password, role: "admin", region },
      { onSuccess: onCreated }
    );
  };

  const errorMessage =
    createUser.isError && (createUser.error.response?.data?.error?.message || "Could not create admin.");

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
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-good-soft">
              <UserPlus size={20} strokeWidth={1.75} className="text-good-ink" />
            </div>
            <div>
              <div className="text-[15px] font-semibold text-ink">Add Admin</div>
              <p className="text-[11.5px] text-ink-faint">Creates a new admin account for a region.</p>
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
                placeholder="e.g. r.khanna"
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
                placeholder="e.g. R. Khanna"
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
                placeholder="e.g. r.khanna@ssb.gov.in"
                className="w-full bg-transparent text-[13px] text-ink outline-none placeholder:text-ink-faint"
              />
            </div>
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-[11.5px] font-medium text-ink-dim">Region</span>
            <div className="flex items-center gap-2.5 rounded-lg border border-line bg-surface-sunken/60 px-3.5 py-2.5 focus-within:border-brand">
              <MapPinned size={14} strokeWidth={1.75} className="shrink-0 text-ink-faint" />
              <input
                required
                list="known-regions"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                placeholder="e.g. North Zone"
                className="w-full bg-transparent text-[13px] text-ink outline-none placeholder:text-ink-faint"
              />
              <datalist id="known-regions">
                {regions.map((r) => (
                  <option key={r} value={r} />
                ))}
              </datalist>
            </div>
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-[11.5px] font-medium text-ink-dim">Temporary Password</span>
            <input
              required
              type="password"
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="rounded-lg border border-line bg-surface-sunken/60 px-3.5 py-2.5 text-[13px] text-ink outline-none placeholder:text-ink-faint focus:border-brand"
            />
          </label>

          <motion.button
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={createUser.isPending}
            className="mt-2 flex items-center justify-center gap-2 rounded-lg bg-navy py-3 text-[13px] font-semibold text-white shadow-sm disabled:opacity-70"
          >
            <Plus size={15} strokeWidth={2.25} />
            {createUser.isPending ? "Creating…" : "Create Admin"}
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  );
}

export default function Admins() {
  const { data: users = [], isLoading } = useUsers();
  const { data: checkpoints = [] } = useCheckpoints();
  const admins = users.filter((u) => u.role === "admin");
  const verifiers = users.filter((u) => u.role === "verifier");
  const regions = [...new Set(checkpoints.map((c) => c.region))];
  const [selected, setSelected] = useState(null);
  const [showAdd, setShowAdd] = useState(false);

  const teamFor = (admin) => verifiers.filter((v) => v.region === admin.region).length;

  return (
    <>
      <Topbar title="Admins" subtitle={`${admins.length} admin${admins.length === 1 ? "" : "s"} across all regions`} />

      <div className="flex justify-end">
        <motion.button
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-1.5 rounded-full bg-navy px-4 py-2 text-[12.5px] font-semibold text-white shadow-sm"
        >
          <Plus size={14} strokeWidth={2.25} />
          Add Admin
        </motion.button>
      </div>

      <Card noPad delay={0.05}>
        <div className="overflow-x-auto">
          <div className="min-w-[480px]">
            <div className="grid grid-cols-[1.4fr_1fr_0.8fr_1fr] gap-2 border-b border-line-soft px-5 py-3 text-[10.5px] tracking-wide text-ink-faint">
              <span>NAME</span>
              <span>REGION</span>
              <span>TEAM</span>
              <span>STATUS</span>
            </div>
            {isLoading && <p className="px-5 py-4 text-[12px] text-ink-faint">Loading admins…</p>}
            {!isLoading && admins.length === 0 && (
              <p className="px-5 py-4 text-[12px] text-ink-faint">No admins yet.</p>
            )}
            {admins.map((a, i) => (
              <motion.button
                key={a.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03, duration: 0.35 }}
                onClick={() => setSelected(a)}
                className={`grid w-full grid-cols-[1.4fr_1fr_0.8fr_1fr] items-center gap-2 px-5 py-3.5 text-left transition-colors hover:bg-surface-sunken/60 ${
                  i !== admins.length - 1 ? "border-b border-line-soft" : ""
                }`}
              >
                <span className="text-[12.5px] font-medium text-ink">{a.full_name}</span>
                <span className="text-[12px] text-ink-dim">{a.region}</span>
                <span className="font-mono text-[12px]">{teamFor(a)}</span>
                <span className={`text-[12px] ${a.status === "active" ? "text-good-ink" : "text-ink-faint"}`}>
                  {a.status === "active" ? "Active" : "Disabled"}
                </span>
              </motion.button>
            ))}
          </div>
        </div>
      </Card>

      <AnimatePresence>
        {selected && (
          <AdminDetail
            admin={selected}
            team={teamFor(selected)}
            checkpoints={checkpoints}
            regions={regions}
            onClose={() => setSelected(null)}
          />
        )}
        {showAdd && (
          <AddAdminModal regions={regions} onClose={() => setShowAdd(false)} onCreated={() => setShowAdd(false)} />
        )}
      </AnimatePresence>
    </>
  );
}
