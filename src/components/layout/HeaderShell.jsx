import { AnimatePresence, motion } from "framer-motion";
import { LogOut, ShieldCheck } from "lucide-react";
import { Link, Outlet, useLocation } from "react-router-dom";
import ThemeToggle from "../ui/ThemeToggle";

export default function HeaderShell({ role }) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-canvas">
      <header className="sticky top-0 z-40 border-b border-line bg-surface/90 backdrop-blur-md">
        <div className="mx-auto grid h-16 max-w-7xl grid-cols-3 items-center px-6">
          <Link to="/" className="flex items-center gap-2.5 justify-self-start">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy">
              <ShieldCheck size={16} strokeWidth={1.9} className="text-brand" />
            </div>
            <span className="font-display text-[15px] font-semibold text-ink">Sentinel</span>
          </Link>

          <nav className="hidden items-center gap-1 justify-self-center md:flex">
            {role.nav.map((item) => {
              const active = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative flex items-center gap-2 rounded-lg px-3.5 py-2 text-[13.5px] font-medium transition-colors ${
                    active ? "text-ink" : "text-ink-faint hover:text-ink-dim"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="header-active-tab"
                      className="absolute inset-0 rounded-lg bg-surface-sunken"
                      transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    />
                  )}
                  <Icon size={16} strokeWidth={1.75} className="relative z-10" />
                  <span className="relative z-10">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3 justify-self-end">
            <ThemeToggle />
            <div className="hidden flex-col items-end sm:flex">
              <span className="text-[12.5px] font-medium leading-tight text-ink">{role.userName}</span>
              <span className="text-[10.5px] leading-tight text-ink-faint">{role.userMeta}</span>
            </div>
            <Link
              to={`${role.basePath}/profile`}
              aria-label="View profile"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-navy text-[11px] font-semibold text-white ring-2 ring-transparent transition-all hover:ring-brand/40"
            >
              {role.userInitials}
            </Link>
            <Link
              to="/"
              aria-label="Sign out"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink-faint transition-colors hover:bg-surface-sunken hover:text-ink-dim"
            >
              <LogOut size={15} strokeWidth={1.75} />
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-7">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-6"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
