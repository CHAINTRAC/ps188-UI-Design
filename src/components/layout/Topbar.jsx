import { motion } from "framer-motion";
import { Bell } from "lucide-react";
import ThemeToggle from "../ui/ThemeToggle";

export default function Topbar({ title, subtitle, role, liveLabel = "Live" }) {
  return (
    <div className="flex items-center justify-between">
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
      <div className="flex items-center gap-3.5">
        <div className="flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5 text-[12px] text-ink-dim">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-good opacity-60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-good" />
          </span>
          {liveLabel}
        </div>
        <button className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-surface text-ink-dim transition-colors hover:bg-surface-sunken">
          <Bell size={16} strokeWidth={1.75} />
        </button>
        <ThemeToggle />
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-navy text-[11px] font-semibold text-white">
          {role.userInitials}
        </div>
      </div>
    </div>
  );
}
