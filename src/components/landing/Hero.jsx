import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DocScanVisual from "./DocScanVisual";

const HEADLINE = [
  [{ t: "Catch" }, { t: "a" }, { t: "forged", accent: true }],
  [{ t: "document" }, { t: "before" }, { t: "it" }],
  [{ t: "crosses" }, { t: "the" }, { t: "border." }],
];

const headlineContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.045, delayChildren: 0.1 } },
};
const wordVariant = {
  hidden: { opacity: 0, y: 22, filter: "blur(6px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

export default function Hero() {
  const navigate = useNavigate();
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section className="relative overflow-hidden border-b border-line/70">
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-brand/[0.10] blur-[130px]" />

      <div className="relative mx-auto max-w-6xl px-6 pb-20 pt-16 md:pt-24">
        <div className="grid items-center gap-14 md:grid-cols-[1.1fr_0.9fr]">
          <div>
            <motion.h1
              variants={headlineContainer}
              initial="hidden"
              animate="show"
              className="font-display text-[44px] font-bold leading-[1.08] tracking-tight text-ink md:text-[54px]"
            >
              {HEADLINE.map((line, li) => (
                <span key={li} className="block">
                  {line.map((word, wi) => (
                    <motion.span
                      key={wi}
                      variants={wordVariant}
                      className={`mr-[0.28em] inline-block ${word.accent ? "text-brand-dim" : ""}`}
                    >
                      {word.t}
                    </motion.span>
                  ))}
                </span>
              ))}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.55 }}
              className="mt-5 max-w-md text-[16px] leading-relaxed text-ink-dim"
            >
              Sentinel reads a passport, visa, Aadhaar card or permit in seconds — extracts every
              field, checks it against issuing standards, hunts for tampering, and verifies the
              face — so checkpoint officers decide with evidence, not a glance.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.65 }}
              className="mt-8 flex items-center gap-3"
            >
              <motion.button
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/login")}
                className="flex items-center gap-2 rounded-full bg-navy px-5 py-3 text-[13.5px] font-semibold text-white shadow-[0_0_0_0_rgba(0,0,0,0)] transition-shadow hover:shadow-[0_0_28px_-4px_var(--color-brand)]"
              >
                Sign In
                <ArrowRight size={15} strokeWidth={2} />
              </motion.button>
              <button
                onClick={() => scrollTo("how-it-works")}
                className="rounded-full border border-line px-5 py-3 text-[13.5px] font-semibold text-ink-dim transition-colors hover:bg-surface-sunken"
              >
                See how it works
              </button>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <DocScanVisual />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
