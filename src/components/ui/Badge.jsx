const VARIANTS = {
  good: "bg-good-soft text-good-ink",
  warn: "bg-warn-soft text-warn-ink",
  bad: "bg-bad-soft text-bad-ink",
  brand: "bg-brand-soft text-brand-ink",
  neutral: "bg-surface-sunken text-ink-dim",
};

export default function Badge({ variant = "neutral", children, className = "" }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide ${VARIANTS[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
