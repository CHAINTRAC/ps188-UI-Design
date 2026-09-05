import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown } from "lucide-react";

// A fully-styled dropdown to replace the native <select>, whose open option
// list is browser-rendered and ignores the app's theme entirely.
export default function Select({
  value,
  onChange,
  options,
  placeholder = "Select…",
  icon: Icon,
  disabled = false,
  required = false,
  className = "",
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    };
    const onKeyDown = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const selected = options.find((o) => o.value === value);

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <input type="hidden" required={required} value={value} readOnly />
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-2.5 rounded-lg border border-line bg-surface-sunken/60 px-3.5 py-2.5 text-left text-[13px] outline-none transition-colors focus-within:border-brand disabled:cursor-not-allowed disabled:opacity-60"
      >
        {Icon && <Icon size={14} strokeWidth={1.75} className="shrink-0 text-ink-faint" />}
        <span className={`flex-1 truncate ${selected ? "text-ink" : "text-ink-faint"}`}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown size={14} strokeWidth={1.75} className={`shrink-0 text-ink-faint transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute z-30 mt-1.5 max-h-56 w-full overflow-y-auto rounded-lg border border-line bg-surface p-1 shadow-[var(--shadow-panel)]"
          >
            {options.length === 0 && (
              <div className="px-3 py-2 text-[12.5px] text-ink-faint">No options available</div>
            )}
            {options.map((o) => (
              <button
                key={o.value}
                type="button"
                onClick={() => {
                  onChange(o.value);
                  setOpen(false);
                }}
                className={`flex w-full items-center justify-between gap-2 rounded-md px-3 py-2 text-left text-[13px] transition-colors hover:bg-surface-sunken ${
                  o.value === value ? "text-ink" : "text-ink-dim"
                }`}
              >
                {o.label}
                {o.value === value && <Check size={13} strokeWidth={2} className="shrink-0 text-brand-ink" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
