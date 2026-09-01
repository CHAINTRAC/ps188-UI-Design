import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { LogOut, ShieldCheck } from "lucide-react";

export default function Sidebar({ role }) {
  const { pathname } = useLocation();

  return (
    <aside className="flex h-full w-[248px] shrink-0 flex-col bg-navy text-navy-ink">
      <Link to="/" className="flex items-center gap-2.5 border-b border-navy-line px-5 py-6">
        <ShieldCheck size={22} strokeWidth={1.75} className="text-brand shrink-0" />
        <div className="flex flex-col leading-tight">
          <span className="font-display text-[15px] font-semibold tracking-tight text-white">Sentinel</span>
          <span className="text-[10px] tracking-widest text-navy-ink-dim">DOCUMENT SCREENING</span>
        </div>
      </Link>

      <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
        <span className="px-3 pb-1 pt-2 text-[10px] font-medium tracking-widest text-navy-ink-dim">
          {role.tagline.toUpperCase()}
        </span>
        {role.nav.map((item) => {
          const active = pathname === item.path;
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className="relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13.5px] transition-colors"
              style={{ color: active ? "#fff" : undefined }}
            >
              {active && (
                <motion.span
                  layoutId="active-nav-pill"
                  className="absolute inset-0 rounded-lg bg-navy-raised"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                />
              )}
              <Icon size={17} strokeWidth={1.75} className="relative z-10 shrink-0" />
              <span className={`relative z-10 ${active ? "font-medium" : ""}`}>{item.label}</span>
              {active && <span className="absolute right-2 z-10 h-1.5 w-1.5 rounded-full bg-brand" />}
            </Link>
          );
        })}
      </nav>

      <Link
        to="/"
        className="flex items-center gap-2.5 border-t border-navy-line px-5 py-4 transition-colors hover:bg-navy-raised"
      >
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-navy-raised text-[11px] font-semibold text-brand">
          {role.userInitials}
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="truncate text-[13px] font-medium text-white">{role.userName}</span>
          <span className="text-[11px] text-navy-ink-dim">{role.userMeta}</span>
        </div>
        <LogOut size={15} strokeWidth={1.75} className="shrink-0 text-navy-ink-dim" />
      </Link>
    </aside>
  );
}
