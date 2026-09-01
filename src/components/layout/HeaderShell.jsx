import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LogOut, Menu, ShieldCheck, X } from "lucide-react";
import { Link, Outlet, useLocation } from "react-router-dom";
import ThemeToggle from "../ui/ThemeToggle";

export default function HeaderShell({ role }) {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-canvas">
        <div
          className="absolute -left-[12%] top-[-18%] h-[600px] w-[600px] rounded-full blur-[130px]"
          style={{ background: "var(--color-brand)", opacity: "var(--blob-opacity-1)" }}
        />
        <div
          className="absolute -right-[10%] bottom-[-20%] h-[520px] w-[520px] rounded-full blur-[130px]"
          style={{ background: "var(--color-good)", opacity: "var(--blob-opacity-2)" }}
        />
        <div className="bg-dot-grid absolute inset-0 opacity-70" />
      </div>

      <header className="sticky top-0 z-40 border-b border-line bg-surface/90 backdrop-blur-md">
        <div className="mx-auto grid h-16 max-w-7xl grid-cols-[auto_1fr_auto] items-center gap-3 px-4 sm:px-6 md:grid-cols-3">
          <Link to="/" className="flex items-center gap-2.5 justify-self-start">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-navy">
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
                  className={`relative flex items-center gap-2 whitespace-nowrap rounded-lg px-3.5 py-2 text-[13.5px] font-medium transition-colors ${
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

          <div className="flex items-center gap-2 justify-self-end sm:gap-3">
            <ThemeToggle />
            <div className="hidden flex-col items-end lg:flex">
              <span className="text-[12.5px] font-medium leading-tight text-ink">{role.userName}</span>
              <span className="text-[10.5px] leading-tight text-ink-faint">{role.userMeta}</span>
            </div>
            <Link
              to={`${role.basePath}/profile`}
              aria-label="View profile"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-navy text-[11px] font-semibold text-white ring-2 ring-transparent transition-all hover:ring-brand/40"
            >
              {role.userInitials}
            </Link>
            <Link
              to="/"
              aria-label="Sign out"
              className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line text-ink-faint transition-colors hover:bg-surface-sunken hover:text-ink-dim sm:flex"
            >
              <LogOut size={15} strokeWidth={1.75} />
            </Link>
            <button
              onClick={() => setMobileOpen((o) => !o)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line text-ink-dim transition-colors hover:bg-surface-sunken md:hidden"
            >
              {mobileOpen ? <X size={17} strokeWidth={1.85} /> : <Menu size={17} strokeWidth={1.85} />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden border-t border-line md:hidden"
            >
              <nav className="flex flex-col gap-1 px-4 py-3">
                {role.nav.map((item) => {
                  const active = location.pathname === item.path;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-[14px] font-medium transition-colors ${
                        active ? "bg-surface-sunken text-ink" : "text-ink-faint hover:bg-surface-sunken/60 hover:text-ink-dim"
                      }`}
                    >
                      <Icon size={17} strokeWidth={1.75} />
                      {item.label}
                    </Link>
                  );
                })}
                <div className="my-1.5 border-t border-line-soft" />
                <div className="flex items-center gap-3 px-3.5 py-2">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-navy text-[10.5px] font-semibold text-white">
                    {role.userInitials}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[12.5px] font-medium leading-tight text-ink">{role.userName}</span>
                    <span className="text-[10.5px] leading-tight text-ink-faint">{role.userMeta}</span>
                  </div>
                </div>
                <Link
                  to="/"
                  className="flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-[14px] font-medium text-bad-ink hover:bg-bad-soft"
                >
                  <LogOut size={17} strokeWidth={1.75} />
                  Sign Out
                </Link>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="relative mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-7">
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
