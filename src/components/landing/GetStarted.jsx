import { motion } from "framer-motion";
import { ArrowRight, ScanLine, ShieldCheck, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ROLE_LIST } from "../../config/roles";

const COPY = {
  verifier: {
    text: "Screen documents at the checkpoint, review risk signals, and record a decision.",
    Icon: ScanLine,
    accent: "brand",
  },
  admin: {
    text: "Oversee the verifiers in your region and track team throughput and accuracy.",
    Icon: Users,
    accent: "warn",
  },
  superadmin: {
    text: "Full organization visibility — admins, checkpoints, and the audit trail.",
    Icon: ShieldCheck,
    accent: "good",
  },
};

const ACCENT_BAR = { brand: "bg-brand", warn: "bg-warn", good: "bg-good" };
const ACCENT_TEXT = { brand: "text-brand-dim", warn: "text-warn-ink", good: "text-good-ink" };
const ACCENT_ICON_BG = { brand: "bg-brand-soft", warn: "bg-warn-soft", good: "bg-good-soft" };

export default function GetStarted() {
  const navigate = useNavigate();

  return (
    <section id="get-started" className="border-t border-line/70 py-20">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <span className="text-[11.5px] font-semibold tracking-widest text-brand-dim">GET STARTED</span>
          <h2 className="mt-2 font-display text-[32px] font-bold text-ink">Sign in with your role</h2>
          <p className="mx-auto mt-2 max-w-md text-[13.5px] text-ink-dim">
            Every checkpoint officer, admin, and super admin signs in through the same console.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {ROLE_LIST.map((role, i) => {
            const c = COPY[role.key];
            return (
              <motion.button
                key={role.key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.09, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -5 }}
                onClick={() => navigate(`/login?role=${role.key}`)}
                className="group relative flex flex-col items-start gap-4 overflow-hidden rounded-2xl border border-line bg-surface p-6 text-left shadow-[var(--shadow-card)] transition-shadow duration-300 hover:shadow-[var(--shadow-card-hover)]"
              >
                <span className={`absolute inset-x-0 top-0 h-1 ${ACCENT_BAR[c.accent]}`} />
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${ACCENT_ICON_BG[c.accent]} transition-transform duration-300 group-hover:scale-110`}>
                  <c.Icon size={22} strokeWidth={1.75} className={ACCENT_TEXT[c.accent]} />
                </div>
                <div>
                  <div className="font-display text-[18px] font-bold text-ink">{role.label}</div>
                  <p className="mt-1.5 text-[12.5px] leading-relaxed text-ink-faint">{c.text}</p>
                </div>
                <span className={`mt-auto flex items-center gap-1.5 text-[12.5px] font-semibold ${ACCENT_TEXT[c.accent]}`}>
                  Sign in
                  <ArrowRight size={14} strokeWidth={2.25} className="transition-transform group-hover:translate-x-1" />
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
