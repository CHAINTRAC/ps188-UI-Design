import { motion } from "framer-motion";

export default function Topbar({ title, subtitle, liveLabel, actions }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div>
        <motion.h1
          key={title}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35 }}
          className="font-display text-[21px] font-semibold text-ink"
        >
          {title}
        </motion.h1>
        {subtitle && <p className="mt-0.5 text-[12.5px] text-ink-dim">{subtitle}</p>}
      </div>
      {liveLabel && (
        <div className="flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5 text-[12px] text-ink-dim">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-good opacity-60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-good" />
          </span>
          {liveLabel}
        </div>
      )}
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  );
}
