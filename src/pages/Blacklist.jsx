import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Ban, FileWarning, Plus, ShieldAlert, TriangleAlert, UserX, X } from "lucide-react";
import Topbar from "../components/layout/Topbar";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import { useBlacklist, useCreateBlacklistEntry, useDeactivateBlacklistEntry } from "../features/blacklist/hooks";
import { useUsers } from "../features/users/hooks";

const KIND_FILTERS = [
  { key: "all", label: "All" },
  { key: "document", label: "Document" },
  { key: "identity", label: "Identity" },
];

const STATUS_FILTERS = [
  { key: "active", label: "Active" },
  { key: "all", label: "All" },
];

function matchLabel(entry) {
  if (entry.kind === "document") return entry.doc_number;
  return [entry.name, entry.dob, entry.nationality].filter(Boolean).join(" · ");
}

function AddEntryModal({ onClose, onCreate, isPending, errorMessage }) {
  const [kind, setKind] = useState("document");
  const [docNumber, setDocNumber] = useState("");
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [nationality, setNationality] = useState("");
  const [reason, setReason] = useState("");
  const [source, setSource] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload =
      kind === "document"
        ? { kind, doc_number: docNumber, reason, source: source || undefined }
        : { kind, name, dob: dob || undefined, nationality: nationality || undefined, reason, source: source || undefined };
    onCreate(payload);
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
        className="w-full max-w-[440px] rounded-2xl border border-line bg-surface p-7 shadow-[var(--shadow-panel)]"
      >
        <div className="mb-6 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-bad-soft">
              <Ban size={20} strokeWidth={1.75} className="text-bad-ink" />
            </div>
            <div>
              <div className="text-[15px] font-semibold text-ink">Add Blacklist Entry</div>
              <p className="text-[11.5px] text-ink-faint">Flags matching screenings for review.</p>
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

          <div className="flex gap-2">
            {[
              { key: "document", label: "Document" },
              { key: "identity", label: "Identity" },
            ].map((k) => (
              <button
                key={k.key}
                type="button"
                onClick={() => setKind(k.key)}
                className={`flex-1 rounded-lg border px-3.5 py-2.5 text-[12.5px] font-medium transition-colors ${
                  kind === k.key
                    ? "border-navy bg-navy text-white"
                    : "border-line bg-surface text-ink-dim hover:bg-surface-sunken"
                }`}
              >
                {k.label}
              </button>
            ))}
          </div>

          {kind === "document" ? (
            <label className="flex flex-col gap-1.5">
              <span className="text-[11.5px] font-medium text-ink-dim">Document Number</span>
              <input
                required
                autoFocus
                value={docNumber}
                onChange={(e) => setDocNumber(e.target.value)}
                placeholder="e.g. Z1234567"
                className="rounded-lg border border-line bg-surface-sunken/60 px-3.5 py-2.5 text-[13px] text-ink outline-none placeholder:text-ink-faint focus:border-brand"
              />
            </label>
          ) : (
            <>
              <label className="flex flex-col gap-1.5">
                <span className="text-[11.5px] font-medium text-ink-dim">Full Name</span>
                <input
                  required
                  autoFocus
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. ARJUN MEHTA"
                  className="rounded-lg border border-line bg-surface-sunken/60 px-3.5 py-2.5 text-[13px] text-ink outline-none placeholder:text-ink-faint focus:border-brand"
                />
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                <label className="flex flex-col gap-1.5">
                  <span className="text-[11.5px] font-medium text-ink-dim">Date of Birth</span>
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="rounded-lg border border-line bg-surface-sunken/60 px-3.5 py-2.5 text-[13px] text-ink outline-none focus:border-brand"
                  />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="text-[11.5px] font-medium text-ink-dim">Nationality</span>
                  <input
                    value={nationality}
                    onChange={(e) => setNationality(e.target.value.toUpperCase())}
                    placeholder="ISO-3, e.g. IND"
                    maxLength={3}
                    className="rounded-lg border border-line bg-surface-sunken/60 px-3.5 py-2.5 text-[13px] text-ink outline-none placeholder:text-ink-faint focus:border-brand"
                  />
                </label>
              </div>
            </>
          )}

          <label className="flex flex-col gap-1.5">
            <span className="text-[11.5px] font-medium text-ink-dim">Reason</span>
            <textarea
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Why this entry is being blacklisted"
              className="h-16 resize-none rounded-lg border border-line bg-surface-sunken/60 p-2.5 font-sans text-[13px] text-ink outline-none placeholder:text-ink-faint focus:border-brand"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-[11.5px] font-medium text-ink-dim">Source (optional)</span>
            <input
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder="e.g. FIR 2026/0417"
              className="rounded-lg border border-line bg-surface-sunken/60 px-3.5 py-2.5 text-[13px] text-ink outline-none placeholder:text-ink-faint focus:border-brand"
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
                Add Entry
              </>
            )}
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  );
}

export default function Blacklist() {
  const [kindFilter, setKindFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("active");
  const [showAdd, setShowAdd] = useState(false);

  const { data: entries = [], isLoading } = useBlacklist({
    kind: kindFilter === "all" ? undefined : kindFilter,
    active: statusFilter === "all" ? undefined : true,
  });
  const { data: users = [] } = useUsers();
  const createEntry = useCreateBlacklistEntry();
  const deactivateEntry = useDeactivateBlacklistEntry();

  const addedByName = (userId) => users.find((u) => u.id === userId)?.full_name || "—";

  return (
    <>
      <Topbar title="Blacklist" subtitle="Documents and identities flagged for automatic review" />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {KIND_FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setKindFilter(f.key)}
              className={`rounded-full border px-3.5 py-1.5 text-[12.5px] font-medium transition-colors ${
                kindFilter === f.key
                  ? "border-navy bg-navy text-white"
                  : "border-line bg-surface text-ink-dim hover:bg-surface-sunken"
              }`}
            >
              {f.label}
            </button>
          ))}
          <span className="mx-1 h-4 w-px bg-line" />
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setStatusFilter(f.key)}
              className={`rounded-full border px-3.5 py-1.5 text-[12.5px] font-medium transition-colors ${
                statusFilter === f.key
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
          Add Entry
        </motion.button>
      </div>

      <Card noPad delay={0.05}>
        <div className="overflow-x-auto">
          <div className="min-w-[680px]">
            <div className="grid grid-cols-[0.7fr_1.2fr_1.6fr_1fr_0.9fr_0.7fr] gap-2 border-b border-line-soft px-5 py-3 text-[10.5px] tracking-wide text-ink-faint">
              <span>KIND</span>
              <span>MATCH</span>
              <span>REASON</span>
              <span>ADDED BY</span>
              <span>STATUS</span>
              <span></span>
            </div>
            {isLoading && <div className="px-5 py-10 text-center text-[12.5px] text-ink-faint">Loading…</div>}
            {!isLoading &&
              entries.map((e, i) => (
                <motion.div
                  key={e.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03, duration: 0.35 }}
                  className={`grid grid-cols-[0.7fr_1.2fr_1.6fr_1fr_0.9fr_0.7fr] items-center gap-2 px-5 py-3.5 transition-colors hover:bg-surface-sunken/60 ${
                    i !== entries.length - 1 ? "border-b border-line-soft" : ""
                  }`}
                >
                  <span className="flex items-center gap-1.5 text-[12px] text-ink-dim">
                    {e.kind === "document" ? (
                      <FileWarning size={13} strokeWidth={1.75} className="shrink-0 text-ink-faint" />
                    ) : (
                      <UserX size={13} strokeWidth={1.75} className="shrink-0 text-ink-faint" />
                    )}
                    {e.kind === "document" ? "Document" : "Identity"}
                  </span>
                  <span className="font-mono text-[12.5px] font-medium text-ink">{matchLabel(e)}</span>
                  <span className="truncate text-[12px] text-ink-dim" title={e.reason}>
                    {e.reason}
                    {e.source ? <span className="text-ink-faint"> · {e.source}</span> : null}
                  </span>
                  <span className="text-[12px] text-ink-dim">{addedByName(e.added_by)}</span>
                  <Badge variant={e.active ? "bad" : "neutral"} className="w-fit">
                    {e.active ? "Active" : "Inactive"}
                  </Badge>
                  {e.active ? (
                    <button
                      onClick={() => deactivateEntry.mutate(e.id)}
                      disabled={deactivateEntry.isPending}
                      className="justify-self-end text-[11.5px] font-medium text-ink-faint hover:text-bad-ink disabled:opacity-50"
                    >
                      Deactivate
                    </button>
                  ) : (
                    <span />
                  )}
                </motion.div>
              ))}
            {!isLoading && entries.length === 0 && (
              <div className="flex flex-col items-center gap-2 px-5 py-12 text-center">
                <ShieldAlert size={20} strokeWidth={1.5} className="text-ink-faint" />
                <span className="text-[12.5px] text-ink-faint">No blacklist entries match this filter.</span>
              </div>
            )}
          </div>
        </div>
      </Card>

      <AnimatePresence>
        {showAdd && (
          <AddEntryModal
            isPending={createEntry.isPending}
            errorMessage={
              createEntry.isError && (createEntry.error.response?.data?.error?.message || "Something went wrong. Try again.")
            }
            onClose={() => setShowAdd(false)}
            onCreate={(payload) => {
              createEntry.mutate(payload, { onSuccess: () => setShowAdd(false) });
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}
