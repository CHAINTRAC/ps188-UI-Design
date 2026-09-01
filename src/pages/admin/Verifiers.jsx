import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FileText, Lock, Mail, MapPin, Plus, User, UserPlus, X } from "lucide-react";
import Topbar from "../../components/layout/Topbar";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import ScreeningDetailModal from "../../components/shared/ScreeningDetailModal";
import { verifiersFull, verifierHistory } from "../../data/adminData";

const STATUS_FILTERS = [
  { key: "all", label: "All" },
  { key: "online", label: "Online" },
  { key: "offline", label: "Offline" },
];

// Known checkpoints, offered as suggestions — not a restricted list, since a
// zone can add new checkpoints or ones with different naming at any time.
const KNOWN_CHECKPOINTS = ["CP-01", "CP-02", "CP-04", "CP-06"];

function initialsFor(name) {
  return name
    .split(" ")
    .map((p) => p.replace(".", "")[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function VerifierDetail({ verifier, onClose, onOpenCase }) {
  const history = verifierHistory.filter((h) => h.verifierName === verifier.name);

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
              {verifier.initials}
            </div>
            <div>
              <div className="text-[15px] font-semibold text-ink">{verifier.name}</div>
              <div className="flex items-center gap-1.5 text-[11.5px] text-ink-faint">
                <span className={`h-1.5 w-1.5 rounded-full ${verifier.online ? "bg-good" : "bg-line"}`} />
                {verifier.online ? "Online" : "Offline"} · {verifier.checkpoint}
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

        <div className="mb-6 grid grid-cols-3 gap-3 rounded-2xl border border-line bg-surface-sunken/50 p-4">
          <div>
            <div className="text-[9.5px] font-medium uppercase tracking-wider text-ink-faint">Today</div>
            <div className="mt-0.5 font-mono text-[15px] font-bold text-ink">{verifier.today}</div>
          </div>
          <div>
            <div className="text-[9.5px] font-medium uppercase tracking-wider text-ink-faint">Accuracy</div>
            <div className="mt-0.5 font-mono text-[15px] font-bold text-ink">{verifier.accuracy}%</div>
          </div>
          <div>
            <div className="text-[9.5px] font-medium uppercase tracking-wider text-ink-faint">Member since</div>
            <div className="mt-0.5 text-[13px] font-semibold text-ink">{verifier.joined}</div>
          </div>
        </div>

        <span className="mb-3 block text-[13px] font-semibold">Recent Screenings</span>
        <div className="flex flex-col gap-1.5">
          {history.length === 0 && <p className="text-[12px] text-ink-faint">No screenings logged yet.</p>}
          {history.map((h) => (
            <button
              key={h.ref}
              onClick={() => onOpenCase(h)}
              className="flex items-center gap-3 rounded-lg border border-line px-3.5 py-2.5 text-left transition-colors hover:bg-surface-sunken/60"
            >
              <FileText size={14} strokeWidth={1.75} className="shrink-0 text-ink-faint" />
              <div className="flex-1">
                <div className="font-mono text-[12px] font-medium text-ink">{h.ref}</div>
                <div className="text-[10.5px] text-ink-faint">
                  {h.doc} · {h.time}
                </div>
              </div>
              <Badge variant={h.tone}>{h.verdict}</Badge>
            </button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

function AddVerifierModal({ onClose, onCreate }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [checkpoint, setCheckpoint] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate({
      name,
      initials: initialsFor(name),
      checkpoint,
      online: false,
      today: 0,
      accuracy: 0,
      joined: "Today",
    });
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
              <UserPlus size={20} strokeWidth={1.75} className="text-brand-ink" />
            </div>
            <div>
              <div className="text-[15px] font-semibold text-ink">Add Verifier</div>
              <p className="text-[11.5px] text-ink-faint">Creates a new account scoped to North Zone.</p>
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
            <div className="flex items-center gap-2.5 rounded-lg border border-line bg-surface-sunken/60 px-3.5 py-2.5 focus-within:border-brand">
              <MapPin size={14} strokeWidth={1.75} className="shrink-0 text-ink-faint" />
              <input
                required
                list="known-checkpoints"
                value={checkpoint}
                onChange={(e) => setCheckpoint(e.target.value)}
                placeholder="e.g. CP-04, or a new checkpoint"
                className="w-full bg-transparent text-[13px] text-ink outline-none placeholder:text-ink-faint"
              />
              <datalist id="known-checkpoints">
                {KNOWN_CHECKPOINTS.map((cp) => (
                  <option key={cp} value={cp} />
                ))}
              </datalist>
            </div>
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-[11.5px] font-medium text-ink-dim">Temporary Password</span>
            <div className="flex items-center gap-2.5 rounded-lg border border-line bg-surface-sunken/60 px-3.5 py-2.5 focus-within:border-brand">
              <Lock size={14} strokeWidth={1.75} className="shrink-0 text-ink-faint" />
              <input
                required
                type="password"
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
            className="mt-2 flex items-center justify-center gap-2 rounded-lg bg-navy py-3 text-[13px] font-semibold text-white shadow-sm"
          >
            <Plus size={15} strokeWidth={2.25} />
            Create Verifier
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  );
}

export default function Verifiers() {
  const [verifiers, setVerifiers] = useState(verifiersFull);
  const [status, setStatus] = useState("all");
  const [selectedVerifier, setSelectedVerifier] = useState(null);
  const [selectedCase, setSelectedCase] = useState(null);
  const [showAdd, setShowAdd] = useState(false);

  const rows = verifiers.filter((v) => {
    if (status === "online") return v.online;
    if (status === "offline") return !v.online;
    return true;
  });

  return (
    <>
      <Topbar title="Verifiers" subtitle={`North Zone · ${verifiers.length} verifiers across 4 checkpoints`} />

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
            <div className="grid grid-cols-[1.4fr_1fr_0.8fr_1fr_1fr] gap-2 border-b border-line-soft px-5 py-3 text-[10.5px] tracking-wide text-ink-faint">
              <span>NAME</span>
              <span>CHECKPOINT</span>
              <span>STATUS</span>
              <span>TODAY</span>
              <span>ACCURACY</span>
            </div>
            {rows.map((v, i) => (
              <motion.button
                key={v.name}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03, duration: 0.35 }}
                onClick={() => setSelectedVerifier(v)}
                className={`grid w-full grid-cols-[1.4fr_1fr_0.8fr_1fr_1fr] items-center gap-2 px-5 py-3.5 text-left transition-colors hover:bg-surface-sunken/60 ${
                  i !== rows.length - 1 ? "border-b border-line-soft" : ""
                }`}
              >
                <span className="text-[12.5px] font-medium text-ink">{v.name}</span>
                <span className="font-mono text-[11.5px] text-ink-dim">{v.checkpoint}</span>
                <span className={`flex items-center gap-1.5 text-[11px] ${v.online ? "text-good-ink" : "text-ink-faint"}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${v.online ? "bg-good" : "bg-line"}`} />
                  {v.online ? "Online" : "Offline"}
                </span>
                <span className="font-mono text-[12px]">{v.today}</span>
                <span className="font-mono text-[12px]">{v.accuracy}%</span>
              </motion.button>
            ))}
          </div>
        </div>
      </Card>

      <AnimatePresence>
        {selectedVerifier && (
          <VerifierDetail
            verifier={selectedVerifier}
            onClose={() => setSelectedVerifier(null)}
            onOpenCase={setSelectedCase}
          />
        )}
        {showAdd && (
          <AddVerifierModal
            onClose={() => setShowAdd(false)}
            onCreate={(v) => {
              setVerifiers((prev) => [...prev, v]);
              setShowAdd(false);
            }}
          />
        )}
      </AnimatePresence>
      <ScreeningDetailModal item={selectedCase} onClose={() => setSelectedCase(null)} decidedBy={selectedVerifier?.name} />
    </>
  );
}
