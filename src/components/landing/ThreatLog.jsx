import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import useTypewriterLines from "../../lib/useTypewriterLines";

const LEVEL_COLOR = { HIGH: "var(--color-bad)", MED: "var(--color-warn)", LOW: "var(--color-good)" };

const ROWS = [
  { level: "HIGH", code: "FAKE_DOCUMENT", label: "Fake passports & visas", stat: "38% of flagged cases" },
  { level: "HIGH", code: "PHOTO_SWAP", label: "Altered photographs", stat: "24% of flagged cases" },
  { level: "MED", code: "FIELD_TAMPER", label: "Modified dates of birth", stat: "14% of flagged cases" },
  { level: "MED", code: "STAMP_FORGERY", label: "Tampered visa stamps", stat: "11% of flagged cases" },
  { level: "HIGH", code: "MULTI_IDENTITY", label: "Identity impersonation", stat: "9% of flagged cases" },
  { level: "LOW", code: "BLACKLIST_HIT", label: "Expired or blacklisted", stat: "4% of flagged cases" },
];

const LINES = ROWS.map((r) => `${r.code.padEnd(17)}${r.label}`);

export default function ThreatLog() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const { typed, activeIndex, done, start } = useTypewriterLines(LINES, { charDelay: 13, lineDelay: 240 });

  if (inView) start();

  return (
    <section id="challenge" className="border-b border-line/70 py-24">
      <div className="mx-auto flex max-w-6xl flex-col items-center px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="max-w-xl"
        >
          <span className="text-[11.5px] font-semibold tracking-widest text-brand-dim">THE CHALLENGE</span>
          <h2 className="mt-2 font-display text-[32px] font-bold text-ink">
            Thousands of documents a day.
            <br />
            Manual checks can't keep up.
          </h2>
          <p className="mt-3 text-[14px] leading-relaxed text-ink-dim">
            Border checkpoints rely on human inspection and basic database lookups — slow, inconsistent,
            and often blind to sophisticated forgeries.
          </p>
        </motion.div>

        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-11 w-full max-w-[920px] overflow-hidden rounded-2xl dark:rounded-lg border border-line bg-surface-sunken shadow-[var(--shadow-panel)]"
        >
          <div className="flex items-center gap-2 border-b border-line bg-surface px-4 py-3">
            <span className="h-2.5 w-2.5 rounded-full bg-bad" />
            <span className="h-2.5 w-2.5 rounded-full bg-warn" />
            <span className="h-2.5 w-2.5 rounded-full bg-good" />
            <span className="ml-2.5 min-w-0 flex-1 truncate font-mono text-[11px] text-ink-faint">sentinel@checkpoint — threat-log — 24 checkpoints</span>
          </div>

          <div className="overflow-x-auto px-4 py-6 text-left font-mono text-[11px] leading-[2.15] sm:px-7 sm:text-[12px]">
            {ROWS.map((row, i) => {
              const isPast = i < activeIndex || done;
              const isTyping = i === activeIndex;
              const text = typed[i] ?? "";

              return (
                <div key={row.code} className="flex items-baseline gap-2 whitespace-nowrap">
                  <span className="text-ink-faint">{String(i + 1).padStart(2, "0")}</span>
                  <span style={{ color: LEVEL_COLOR[row.level] }} className="font-semibold">
                    [{row.level}]{row.level === "MED" ? " " : ""}
                  </span>
                  <span className="whitespace-pre text-ink">
                    {text}
                    {isTyping && <span className="inline-block h-[12px] w-[6px] translate-y-[1px] animate-pulse bg-brand" />}
                  </span>
                  <span
                    className="ml-auto hidden pl-3 text-ink-faint transition-opacity duration-500 sm:inline-block"
                    style={{ opacity: isPast ? 1 : 0 }}
                  >
                    {row.stat}
                  </span>
                </div>
              );
            })}
            <div className="mt-1.5 flex items-center gap-2 text-ink-faint">
              <span>&gt;</span>
              <span
                className="inline-block h-[13px] w-[7px] bg-brand transition-opacity duration-300"
                style={{ opacity: done ? 1 : 0, animation: done ? "pulse 1.1s ease-in-out infinite" : "none" }}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
