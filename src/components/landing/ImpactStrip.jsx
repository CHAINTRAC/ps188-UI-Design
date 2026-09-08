import { motion } from "framer-motion";
import { Database, Gauge, ScrollText, Timer } from "lucide-react";

const IMPACT = [
  { Icon: Timer, title: "Minutes to seconds", detail: "Verification that took several minutes now runs in seconds per document." },
  { Icon: Gauge, title: "Consistent decisions", detail: "The same evidence-based standard applies at every checkpoint, every shift." },
  { Icon: Database, title: "Sharper detection", detail: "Forensic + checksum signals catch forgeries manual inspection misses." },
  { Icon: ScrollText, title: "A digital trail", detail: "Every screening and decision is logged for investigation and audit." },
];

export default function ImpactStrip() {
  return (
    <section id="impact" className="relative overflow-hidden border-y border-line/70 bg-surface-sunken/60 py-20">
      <div className="pointer-events-none absolute -left-32 top-0 h-[420px] w-[420px] rounded-full bg-brand/10 blur-[130px] dark:opacity-0" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-[380px] w-[380px] rounded-full bg-good/[0.06] blur-[120px] dark:opacity-0" />

      <div className="relative mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="mb-12 max-w-xl"
        >
          <span className="text-[11.5px] font-semibold tracking-widest text-brand-dim">IMPACT</span>
          <h2 className="mt-2 font-display text-[32px] font-bold text-ink">What changes at the checkpoint</h2>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {IMPACT.map(({ Icon, title, detail }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
            >
              <Icon size={22} strokeWidth={1.6} className="mb-4 text-brand-dim" />
              <h3 className="font-display text-[19px] font-bold text-ink">{title}</h3>
              <p className="mt-2 text-[12.5px] leading-relaxed text-ink-dim">{detail}</p>
              <div className="mt-5 h-px w-10 bg-brand/50" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
