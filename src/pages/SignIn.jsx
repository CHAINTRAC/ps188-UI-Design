import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Eye, EyeOff, Lock, ShieldCheck, User } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import DocScanVisual from "../components/landing/DocScanVisual";
import FlowBackground from "../components/landing/FlowBackground";
import ThemeToggle from "../components/ui/ThemeToggle";
import { ROLE_LIST } from "../config/roles";

export default function SignIn() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const role = ROLE_LIST.find((r) => r.key === params.get("role")) ?? ROLE_LIST[0];

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => navigate(role.basePath), 450);
  };

  return (
    <div className="relative min-h-screen">
      <FlowBackground />

      <div className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-6 pt-7">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy">
            <ShieldCheck size={16} strokeWidth={1.9} className="text-brand" />
          </div>
          <span className="font-display text-[15px] font-semibold text-ink">Sentinel</span>
        </Link>
        <ThemeToggle />
      </div>

      <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-14 px-6 py-14 lg:min-h-[calc(100vh-88px)] lg:grid-cols-[0.9fr_1fr] lg:gap-20">
        {/* left: form */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto w-full max-w-[420px] lg:mx-0"
        >
          <h1 className="font-display text-[36px] font-bold leading-tight text-ink">Sign in</h1>
          <div className="mt-2.5 flex items-center gap-2 text-[13.5px] text-ink-dim">
            <span>Continuing to the</span>
            <span className="rounded-full bg-brand-soft px-2.5 py-0.5 text-[11.5px] font-semibold text-brand-ink">{role.label}</span>
            <span>console</span>
          </div>

          <form onSubmit={handleSubmit} className="mt-9 flex flex-col gap-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-[11.5px] font-medium text-ink-dim">Username</span>
              <div className="flex items-center gap-2.5 rounded-lg border border-line bg-surface px-3.5 py-3 focus-within:border-brand">
                <User size={15} strokeWidth={1.75} className="shrink-0 text-ink-faint" />
                <input
                  required
                  autoFocus
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={`e.g. ${role.userName.toLowerCase().replace(". ", ".")}`}
                  className="w-full bg-transparent text-[13.5px] text-ink outline-none placeholder:text-ink-faint"
                />
              </div>
            </label>

            <label className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11.5px] font-medium text-ink-dim">Password</span>
                <a href="#" className="text-[11.5px] font-medium text-brand-dim">
                  Forgot password?
                </a>
              </div>
              <div className="flex items-center gap-2.5 rounded-lg border border-line bg-surface px-3.5 py-3 focus-within:border-brand">
                <Lock size={15} strokeWidth={1.75} className="shrink-0 text-ink-faint" />
                <input
                  required
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-transparent text-[13.5px] text-ink outline-none placeholder:text-ink-faint"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="shrink-0 text-ink-faint hover:text-ink-dim"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={15} strokeWidth={1.75} /> : <Eye size={15} strokeWidth={1.75} />}
                </button>
              </div>
            </label>

            <motion.button
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={submitting}
              className="mt-3 flex items-center justify-center gap-2 rounded-lg bg-navy py-3.5 text-[13.5px] font-semibold text-white shadow-sm transition-shadow hover:shadow-[0_0_24px_-4px_var(--color-brand)] disabled:opacity-70"
            >
              {submitting ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                <>
                  Sign In
                  <ArrowRight size={15} strokeWidth={2} />
                </>
              )}
            </motion.button>
          </form>

          <p className="mt-6 text-[11.5px] leading-relaxed text-ink-faint">
            Demo build — no backend is connected yet. Any credentials will sign you into the {role.label.toLowerCase()} console.
          </p>
        </motion.div>

        {/* right: illustrative depth stack, same page background as the form side */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto hidden w-full max-w-[440px] lg:block"
        >
          <div className="absolute -right-6 top-8 h-[540px] w-full rotate-[4deg] rounded-[28px] border border-line bg-surface/70" />
          <div className="absolute -left-2 top-3 h-[560px] w-full -rotate-2 rounded-[28px] border border-line bg-surface/40" />
          <div className="relative">
            <DocScanVisual />
          </div>
        </motion.div>
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-6 pb-8 text-[11px] text-ink-faint">
        Ministry of Home Affairs · SSB, Police II Division
      </div>
    </div>
  );
}
