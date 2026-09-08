import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Ban, FileWarning, ImagePlus, Plus, Search, ShieldAlert, TriangleAlert, User, UserX, X } from "lucide-react";
import Topbar from "../components/layout/Topbar";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Select from "../components/ui/Select";
import { useBlacklist, useBlacklistPhoto, useCreateBlacklistEntry, useDeactivateBlacklistEntry } from "../features/blacklist/hooks";
import { useUsers } from "../features/users/hooks";
import useDebouncedValue from "../lib/useDebouncedValue";
import { timeAgo } from "../lib/format";

const KIND_FILTER_OPTIONS = [
  { value: "all", label: "All kinds" },
  { value: "document", label: "Document" },
  { value: "identity", label: "Identity" },
];

const STATUS_FILTER_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "all", label: "All statuses" },
];

const DOC_TYPE_OPTIONS = [
  { value: "", label: "Unspecified" },
  { value: "passport", label: "Passport" },
  { value: "visa", label: "Visa" },
  { value: "national_id", label: "National ID" },
  { value: "driving_license", label: "Driving License" },
  { value: "permit", label: "Permit" },
];
const DOC_TYPE_LABEL = Object.fromEntries(DOC_TYPE_OPTIONS.map((o) => [o.value, o.label]));

// Same values as DOC_TYPE_OPTIONS, but "" reads as "any type" in a filter
// context rather than "unspecified" in the add-entry form.
const DOC_TYPE_FILTER_OPTIONS = [{ value: "", label: "All document types" }, ...DOC_TYPE_OPTIONS.slice(1)];

function matchLabel(entry) {
  if (entry.kind === "document") return entry.doc_number;
  return [entry.name, entry.dob, entry.nationality].filter(Boolean).join(" · ");
}

function EntryThumbnail({ entry }) {
  const url = useBlacklistPhoto(entry.photo_url ? entry.id : null);
  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-line bg-surface-sunken">
      {url ? (
        <img src={url} alt="" className="h-full w-full object-cover" />
      ) : entry.kind === "document" ? (
        <FileWarning size={14} strokeWidth={1.75} className="text-ink-faint" />
      ) : (
        <UserX size={14} strokeWidth={1.75} className="text-ink-faint" />
      )}
    </div>
  );
}

function AddEntryModal({ onClose, onCreate, isPending, errorMessage }) {
  const [kind, setKind] = useState("document");
  const [docNumber, setDocNumber] = useState("");
  const [docType, setDocType] = useState("");
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [nationality, setNationality] = useState("");
  const [reason, setReason] = useState("");
  const [source, setSource] = useState("");
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  useEffect(() => {
    if (!photo) {
      setPhotoPreview(null);
      return;
    }
    const url = URL.createObjectURL(photo);
    setPhotoPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [photo]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const base = { kind, doc_type: docType || undefined, reason, source: source || undefined, photo: photo || undefined };
    const payload =
      kind === "document"
        ? { ...base, doc_number: docNumber }
        : { ...base, name, dob: dob || undefined, nationality: nationality || undefined };
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
        className="max-h-[90vh] w-full max-w-[440px] overflow-y-auto rounded-2xl dark:rounded-lg border border-line bg-surface p-7 shadow-[var(--shadow-panel)]"
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

          <div className="flex items-center gap-3">
            <label
              htmlFor="blacklist-photo"
              className="flex h-16 w-16 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-dashed border-line bg-surface-sunken/60 hover:border-brand"
            >
              {photoPreview ? (
                <img src={photoPreview} alt="" className="h-full w-full object-cover" />
              ) : (
                <ImagePlus size={18} strokeWidth={1.75} className="text-ink-faint" />
              )}
            </label>
            <input
              id="blacklist-photo"
              type="file"
              accept="image/jpeg,image/png"
              className="hidden"
              onChange={(e) => setPhoto(e.target.files?.[0] ?? null)}
            />
            <div className="flex flex-col gap-0.5">
              <span className="text-[11.5px] font-medium text-ink-dim">Photo (optional)</span>
              <span className="text-[11px] text-ink-faint">A reference photo shown alongside this entry.</span>
            </div>
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
            <span className="text-[11.5px] font-medium text-ink-dim">Document Type (optional)</span>
            <Select value={docType} onChange={setDocType} options={DOC_TYPE_OPTIONS} />
          </label>

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

function DetailRow({ label, value }) {
  if (!value) return null;
  return (
    <div className="flex items-center justify-between gap-3 py-2 border-b border-line-soft last:border-b-0">
      <span className="text-[11.5px] text-ink-faint">{label}</span>
      <span className="text-right text-[12.5px] font-medium text-ink">{value}</span>
    </div>
  );
}

function EntryDetailModal({ entry, addedByName, onClose, onDeactivate, isDeactivating }) {
  const photoUrl = useBlacklistPhoto(entry.photo_url ? entry.id : null);

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
        className="max-h-[90vh] w-full max-w-[440px] overflow-y-auto rounded-2xl dark:rounded-lg border border-line bg-surface p-7 shadow-[var(--shadow-panel)]"
      >
        <div className="mb-5 flex items-start justify-between">
          <div>
            <div className="font-mono text-[14px] font-semibold text-ink">{matchLabel(entry)}</div>
            <div className="text-[11.5px] text-ink-faint">
              {entry.kind === "document" ? "Document" : "Identity"} · added {timeAgo(entry.created_at)}
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line text-ink-faint hover:bg-surface-sunken"
          >
            <X size={15} strokeWidth={1.75} />
          </button>
        </div>

        <div className="mb-5 flex h-[220px] items-center justify-center overflow-hidden rounded-2xl dark:rounded-lg border border-line bg-surface-sunken">
          {photoUrl ? (
            <img src={photoUrl} alt="" className="h-full w-full object-cover" />
          ) : entry.kind === "document" ? (
            <FileWarning size={40} strokeWidth={1.25} className="text-ink-faint" />
          ) : (
            <User size={40} strokeWidth={1.25} className="text-ink-faint" />
          )}
        </div>

        <Badge variant={entry.active ? "bad" : "neutral"} className="mb-4 w-fit">
          {entry.active ? "Active — blocks matching screenings" : "Inactive — no longer blocks"}
        </Badge>

        <div className="rounded-2xl dark:rounded-lg border border-line px-4">
          <DetailRow label="Document number" value={entry.doc_number} />
          <DetailRow label="Document type" value={entry.doc_type ? DOC_TYPE_LABEL[entry.doc_type] ?? entry.doc_type : null} />
          <DetailRow label="Name" value={entry.name} />
          <DetailRow label="Date of birth" value={entry.dob} />
          <DetailRow label="Nationality" value={entry.nationality} />
          <DetailRow label="Source" value={entry.source} />
          <DetailRow label="Added by" value={addedByName} />
          <DetailRow label="Added on" value={new Date(entry.created_at).toLocaleString()} />
        </div>

        <div className="mt-4 rounded-2xl dark:rounded-lg border border-line bg-surface-sunken/50 p-4">
          <span className="mb-1.5 block text-[11.5px] font-medium text-ink-dim">Reason</span>
          <p className="text-[12.5px] leading-relaxed text-ink">{entry.reason}</p>
        </div>

        {entry.active && (
          <motion.button
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            onClick={onDeactivate}
            disabled={isDeactivating}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-bad/30 bg-bad-soft py-2.5 text-[12.5px] font-semibold text-bad-ink disabled:opacity-60"
          >
            {isDeactivating ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-bad-ink/30 border-t-bad-ink" />
            ) : (
              "Deactivate — unblock this entry"
            )}
          </motion.button>
        )}
      </motion.div>
    </motion.div>
  );
}

export default function Blacklist() {
  const [kindFilter, setKindFilter] = useState("all");
  const [docTypeFilter, setDocTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("active");
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [selected, setSelected] = useState(null);
  const debouncedSearch = useDebouncedValue(search, 300);

  const { data: entries = [], isLoading } = useBlacklist({
    kind: kindFilter === "all" ? undefined : kindFilter,
    docType: docTypeFilter || undefined,
    active: statusFilter === "active" ? true : statusFilter === "inactive" ? false : undefined,
    q: debouncedSearch || undefined,
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
          <Select value={kindFilter} onChange={setKindFilter} options={KIND_FILTER_OPTIONS} className="w-36" />
          <Select value={docTypeFilter} onChange={setDocTypeFilter} options={DOC_TYPE_FILTER_OPTIONS} className="w-44" />
          <Select value={statusFilter} onChange={setStatusFilter} options={STATUS_FILTER_OPTIONS} className="w-36" />
          <div className="ml-1 flex items-center gap-2 rounded-full border border-line bg-surface px-3.5 py-1.5">
            <Search size={13} strokeWidth={1.75} className="shrink-0 text-ink-faint" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search number, name, reason…"
              className="w-48 bg-transparent text-[12.5px] text-ink outline-none placeholder:text-ink-faint"
            />
          </div>
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
          <div className="min-w-[860px]">
            <div className="grid grid-cols-[44px_0.7fr_1.1fr_0.9fr_1.5fr_0.9fr_0.7fr_0.7fr] gap-2 border-b border-line-soft px-5 py-3 text-[10.5px] tracking-wide text-ink-faint">
              <span></span>
              <span>KIND</span>
              <span>MATCH</span>
              <span>DOC TYPE</span>
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
                  onClick={() => setSelected(e)}
                  className={`grid cursor-pointer grid-cols-[44px_0.7fr_1.1fr_0.9fr_1.5fr_0.9fr_0.7fr_0.7fr] items-center gap-2 px-5 py-3.5 transition-colors hover:bg-surface-sunken/60 ${
                    i !== entries.length - 1 ? "border-b border-line-soft" : ""
                  }`}
                >
                  <EntryThumbnail entry={e} />
                  <span className="flex items-center gap-1.5 text-[12px] text-ink-dim">
                    {e.kind === "document" ? (
                      <FileWarning size={13} strokeWidth={1.75} className="shrink-0 text-ink-faint" />
                    ) : (
                      <UserX size={13} strokeWidth={1.75} className="shrink-0 text-ink-faint" />
                    )}
                    {e.kind === "document" ? "Document" : "Identity"}
                  </span>
                  <span className="font-mono text-[12.5px] font-medium text-ink">{matchLabel(e)}</span>
                  <span className="text-[12px] text-ink-dim">{e.doc_type ? DOC_TYPE_LABEL[e.doc_type] ?? e.doc_type : "—"}</span>
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
                      onClick={(evt) => {
                        evt.stopPropagation();
                        deactivateEntry.mutate(e.id);
                      }}
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
        {selected && (
          <EntryDetailModal
            entry={selected}
            addedByName={addedByName(selected.added_by)}
            onClose={() => setSelected(null)}
            isDeactivating={deactivateEntry.isPending}
            onDeactivate={() => deactivateEntry.mutate(selected.id, { onSuccess: () => setSelected(null) })}
          />
        )}
      </AnimatePresence>
    </>
  );
}
