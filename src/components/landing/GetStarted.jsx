import { motion } from "framer-motion";
import { ArrowRight, ScanLine, ShieldCheck, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ROLE_LIST } from "../../config/roles";

const COPY = {
  verifier: {
    text: "Screens documents at the checkpoint, reviews risk signals, and records a decision.",
    Icon: ScanLine,
    accent: "brand",
  },
  admin: {
    text: "Oversees the verifiers in a region and tracks team throughput and accuracy.",
    Icon: Users,
    accent: "warn",
  },
  superadmin: {
    text: "Full organization visibility — admins, checkpoints, and the audit trail.",
    Icon: ShieldCheck,
    accent: "good",
  },
};

const ACCENT_ICON_BG = { brand: "bg-brand-soft", warn: "bg-warn-soft", good: "bg-good-soft" };
const ACCENT_TEXT = { brand: "text-brand-dim", warn: "text-warn-ink", good: "text-good-ink" };

export default function GetStarted() {
  const navigate = useNavigate();

  return (
    <section id="get-started" className="border-t border-line/70 py-20">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-[11.5px] font-semibold tracking-widest text-brand-dim">GET STARTED</span>
          <h2 className="mt-2 font-display text-[32px] font-bold text-ink">One console, every role</h2>
          <p className="mx-auto mt-2 max-w-md text-[13.5px] text-ink-dim">
            Checkpoint officers, admins, and super admins all sign in the same way — the console you see
            is scoped to your account.
          </p>

          <motion.button
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/login")}
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-navy px-6 py-3.5 text-[13.5px] font-semibold text-white shadow-sm transition-shadow hover:shadow-[0_0_24px_-4px_var(--color-brand)]"
          >
            Sign In
            <ArrowRight size={15} strokeWidth={2} />
          </motion.button>
        </motion.div>

        <div className="mt-14 grid grid-cols-1 gap-4 text-left sm:grid-cols-3">
          {ROLE_LIST.map((role, i) => {
            const c = COPY[role.key];
            return (
              <motion.div
                key={role.key}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.08, duration: 0.45 }}
                className="rounded-2xl border border-line bg-surface p-5 shadow-[var(--shadow-card)] dark:rounded-lg"
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${ACCENT_ICON_BG[c.accent]}`}>
                  <c.Icon size={19} strokeWidth={1.75} className={ACCENT_TEXT[c.accent]} />
                </div>
                <div className="mt-3.5">
                  <div className="text-[14px] font-semibold text-ink">{role.label}</div>
                  <p className="mt-1.5 text-[12px] leading-relaxed text-ink-faint">{c.text}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
