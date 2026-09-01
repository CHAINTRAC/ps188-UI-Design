import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Mail, MapPinned, Plus, User, UserPlus, X } from "lucide-react";
import Topbar from "../../components/layout/Topbar";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import { adminsFull, checkpointsFull } from "../../data/superAdminData";

const KNOWN_REGIONS = ["North Zone", "East Zone", "West Zone", "South Zone"];

function initialsFor(name) {
  return name
    .split(" ")
    .map((p) => p.replace(".", "")[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function AdminDetail({ admin, onClose }) {
  const managed = checkpointsFull.filter((c) => c.admin === admin.name);

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
        className="max-h-[85vh] w-full max-w-[560px] overflow-y-auto rounded-2xl border border-line bg-surface p-7 shadow-[var(--shadow-panel)]"
      >
        <div className="mb-5 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-navy text-[13px] font-semibold text-white">
              {admin.initials}
            </div>
            <div>
              <div className="text-[15px] font-semibold text-ink">{admin.name}</div>
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

        <div className="mb-6 grid grid-cols-3 gap-3 rounded-2xl border border-line bg-surface-sunken/50 p-4">
          <div>
            <div className="text-[9.5px] font-medium uppercase tracking-wider text-ink-faint">Team</div>
            <div className="mt-0.5 font-mono text-[15px] font-bold text-ink">{admin.team}</div>
          </div>
          <div>
            <div className="text-[9.5px] font-medium uppercase tracking-wider text-ink-faint">Accuracy</div>
            <div className="mt-0.5 font-mono text-[15px] font-bold text-ink">{admin.accuracy}%</div>
          </div>
          <div>
            <div className="text-[9.5px] font-medium uppercase tracking-wider text-ink-faint">Admin since</div>
            <div className="mt-0.5 text-[13px] font-semibold text-ink">{admin.joined}</div>
          </div>
        </div>

        <span className="mb-3 block text-[13px] font-semibold">Checkpoints Managed</span>
        <div className="flex flex-col gap-1.5">
          {managed.length === 0 && <p className="text-[12px] text-ink-faint">No checkpoints assigned yet.</p>}
          {managed.map((c) => (
            <div key={c.id} className="flex items-center gap-3 rounded-lg border border-line px-3.5 py-2.5">
              <MapPinned size={14} strokeWidth={1.75} className="shrink-0 text-ink-faint" />
              <div className="flex-1">
                <div className="font-mono text-[12px] font-medium text-ink">{c.id}</div>
                <div className="text-[10.5px] text-ink-faint">{c.today} screened today</div>
              </div>
              <span className="font-mono text-[11.5px] text-ink-dim">{c.online} online</span>
              <Badge variant={c.status === "good" ? "good" : "warn"}>{c.status === "good" ? "Healthy" : "Attention"}</Badge>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

function AddAdminModal({ onClose, onCreate }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [region, setRegion] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate({ name, initials: initialsFor(name), region, team: 0, accuracy: 0, email, joined: "Today" });
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

        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          <label className="flex flex-col gap-1.5">
            <span className="text-[11.5px] font-medium text-ink-dim">Full Name</span>
            <div className="flex items-center gap-2.5 rounded-lg border border-line bg-surface-sunken/60 px-3.5 py-2.5 focus-within:border-brand">
              <User size={14} strokeWidth={1.75} className="shrink-0 text-ink-faint" />
              <input
                required
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
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
                placeholder="e.g. North Zone, or a new region"
                className="w-full bg-transparent text-[13px] text-ink outline-none placeholder:text-ink-faint"
              />
              <datalist id="known-regions">
                {KNOWN_REGIONS.map((r) => (
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
            className="mt-2 flex items-center justify-center gap-2 rounded-lg bg-navy py-3 text-[13px] font-semibold text-white shadow-sm"
          >
            <Plus size={15} strokeWidth={2.25} />
            Create Admin
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  );
}

export default function Admins() {
  const [admins, setAdmins] = useState(adminsFull);
  const [selected, setSelected] = useState(null);
  const [showAdd, setShowAdd] = useState(false);

  return (
    <>
      <Topbar title="Admins" subtitle={`${admins.length} admins across all regions`} />

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
              <span>ACCURACY</span>
            </div>
            {admins.map((a, i) => (
              <motion.button
                key={a.name}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03, duration: 0.35 }}
                onClick={() => setSelected(a)}
                className={`grid w-full grid-cols-[1.4fr_1fr_0.8fr_1fr] items-center gap-2 px-5 py-3.5 text-left transition-colors hover:bg-surface-sunken/60 ${
                  i !== admins.length - 1 ? "border-b border-line-soft" : ""
                }`}
              >
                <span className="text-[12.5px] font-medium text-ink">{a.name}</span>
                <span className="text-[12px] text-ink-dim">{a.region}</span>
                <span className="font-mono text-[12px]">{a.team}</span>
                <span className="font-mono text-[12px] text-good-ink">{a.accuracy}%</span>
              </motion.button>
            ))}
          </div>
        </div>
      </Card>

      <AnimatePresence>
        {selected && <AdminDetail admin={selected} onClose={() => setSelected(null)} />}
        {showAdd && (
          <AddAdminModal
            onClose={() => setShowAdd(false)}
            onCreate={(a) => {
              setAdmins((prev) => [...prev, a]);
              setShowAdd(false);
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}
