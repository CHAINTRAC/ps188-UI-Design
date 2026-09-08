import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Check, User } from "lucide-react";

const FIELDS = [
  { label: "NAME", value: "GURPREET SINGH", delay: 0 },
  { label: "PASSPORT NO.", value: "Z1234567", delay: 0.55 },
  { label: "NATIONALITY", value: "IND", delay: 1.1 },
  { label: "DATE OF BIRTH", value: "01 JAN 1985", delay: 1.65 },
  { label: "DATE OF EXPIRY", value: "01 MAR 2030", delay: 2.2 },
];

export default function DocScanVisual() {
  const ref = useRef(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [6, -6]), { stiffness: 180, damping: 20 });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-6, 6]), { stiffness: 180, damping: 20 });

  const handleMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const handleLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <div style={{ perspective: 1000 }} className="relative mx-auto w-full max-w-[420px] px-6 py-5">
      <motion.div
        ref={ref}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative overflow-hidden rounded-2xl dark:rounded-lg border border-line bg-surface p-6 shadow-[var(--shadow-panel)]"
      >
        <span className="scan-beam pointer-events-none absolute inset-x-0 top-0 z-10 h-14 bg-gradient-to-b from-brand/30 via-brand/12 to-transparent" />

        <div className="mb-4 flex items-center justify-between">
          <span className="font-mono text-[10px] tracking-widest text-ink-faint">PASSPORT · IND</span>
          <span className="rounded-full bg-good-soft px-2.5 py-1 text-[10.5px] font-semibold text-good-ink">GENUINE</span>
        </div>

        <div className="mb-4 flex items-center justify-center rounded-xl bg-surface-sunken py-5">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-navy">
            <User size={24} strokeWidth={1.5} className="text-brand" />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {FIELDS.map((f) => (
            <motion.div
              key={f.label}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + f.delay * 0.15, duration: 0.4 }}
              className="field-flash flex items-center justify-between rounded-lg border px-3 py-1.5"
              style={{ animationDelay: `${f.delay}s` }}
            >
              <div>
                <div className="text-[8px] font-medium tracking-wider text-ink-faint">{f.label}</div>
                <div className="font-mono text-[11.5px] text-ink">{f.value}</div>
              </div>
              <Check size={12} strokeWidth={2.5} className="shrink-0 text-good-ink" />
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 14, y: -8 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="absolute -right-1 -top-1 rounded-xl border border-line bg-surface px-3 py-2 shadow-[var(--shadow-card-hover)]"
      >
        <div className="text-[9.5px] text-ink-faint">Risk score</div>
        <div className="font-display text-[18px] font-bold text-good-ink">12 / 100</div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -14, y: 8 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 0.5, delay: 0.75 }}
        className="absolute -bottom-1 -left-1 rounded-xl border border-line bg-surface px-3 py-2 shadow-[var(--shadow-card-hover)]"
      >
        <div className="text-[9.5px] text-ink-faint">Face match</div>
        <div className="font-display text-[18px] font-bold text-ink">96%</div>
      </motion.div>
    </div>
  );
}
