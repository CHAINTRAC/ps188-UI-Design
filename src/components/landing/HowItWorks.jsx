import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, FileCheck2, ScanFace, ScanLine, ScanSearch } from "lucide-react";

const MODULES = [
  {
    id: "ocr",
    title: "OCR Extraction",
    tag: "TEXT EXTRACTION",
    badgeColor: "#2a9d90",
    cardBg: "linear-gradient(145deg, #0c2d2a 0%, #071a18 100%)",
    bgGlow: "rgba(42, 157, 144, 0.4)",
    ambientBg:
      "radial-gradient(ellipse at 70% 50%, rgba(42, 157, 144, 0.22) 0%, rgba(20, 100, 90, 0.12) 45%, transparent 75%)",
    description:
      "Reads passports, visas, Aadhaar, licenses & permits — pulls every field: name, number, DOB, nationality, expiry.",
    codeSnippet: "MRZ: Z1234567<4IND8501011M3001017<<<< → parsed",
    stats: { speed: "~1.2s", accuracy: "12 fields", layer: "Layer 1" },
    icon: ScanLine,
  },
  {
    id: "validation",
    title: "Document Validation",
    tag: "CHECKSUM PROOF",
    badgeColor: "#1a9e63",
    cardBg: "linear-gradient(145deg, #064e3b 0%, #022c22 100%)",
    bgGlow: "rgba(26, 158, 99, 0.4)",
    ambientBg:
      "radial-gradient(ellipse at 70% 50%, rgba(26, 158, 99, 0.22) 0%, rgba(0, 120, 75, 0.12) 45%, transparent 75%)",
    description:
      "Checks extracted data against issuing standards — ICAO 9303 checksums, Verhoeff validation, MRZ cross-match.",
    codeSnippet: "ICAO 9303 checkdigit (7-3-1 weighted) → PASS",
    stats: { speed: "< 10ms", accuracy: "ICAO 9303", layer: "Layer 2" },
    icon: FileCheck2,
  },
  {
    id: "tampering",
    title: "Tampering Detection",
    tag: "FORENSIC ANALYSIS",
    badgeColor: "#dc4444",
    cardBg: "linear-gradient(145deg, #7f1d1d 0%, #450a0a 100%)",
    bgGlow: "rgba(220, 68, 68, 0.4)",
    ambientBg:
      "radial-gradient(ellipse at 70% 50%, rgba(220, 68, 68, 0.22) 0%, rgba(183, 28, 28, 0.12) 45%, transparent 75%)",
    description:
      "CNN + Error Level Analysis catch photo swaps, text edits, forged stamps, and metadata inconsistencies.",
    codeSnippet: "ELA variance: 118 (threshold 350) → CLEAN",
    stats: { speed: "~45ms", accuracy: "CNN + ELA", layer: "Layer 3" },
    icon: ScanSearch,
  },
  {
    id: "face",
    title: "Face Verification",
    tag: "BIOMETRIC MATCH",
    badgeColor: "#e08a1e",
    cardBg: "linear-gradient(145deg, #7c2d12 0%, #451a03 100%)",
    bgGlow: "rgba(224, 138, 30, 0.4)",
    ambientBg:
      "radial-gradient(ellipse at 70% 50%, rgba(224, 138, 30, 0.22) 0%, rgba(191, 84, 12, 0.12) 45%, transparent 75%)",
    description:
      "Matches the document photo against a live capture to confirm the presenter is the document's owner.",
    codeSnippet: "Face similarity: 96.2% (threshold 85%) → MATCH",
    stats: { speed: "~65ms", accuracy: "96% match", layer: "Layer 4" },
    icon: ScanFace,
  },
];

export default function HowItWorks() {
  const [activeIndex, setActiveIndex] = useState(0);
  const stackRef = useRef(null);
  const sectionRef = useRef(null);
  const activeIndexRef = useRef(0);
  const isEngagedRef = useRef(false);
  const wheelLockedRef = useRef(false);

  const getCircularIndex = useCallback((index) => {
    const len = MODULES.length;
    return ((index % len) + len) % len;
  }, []);

  const nextCard = useCallback(() => setActiveIndex((prev) => getCircularIndex(prev + 1)), [getCircularIndex]);
  const prevCard = useCallback(() => setActiveIndex((prev) => getCircularIndex(prev - 1)), [getCircularIndex]);

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  // scroll-jack: while the section is substantially in view, wheel steps through
  // modules one at a time; releases to normal page scroll at either edge.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(([entry]) => (isEngagedRef.current = entry.isIntersecting), {
      threshold: 0.6,
    });
    observer.observe(section);

    const WHEEL_LOCK_MS = 550;
    const lastIndex = MODULES.length - 1;

    const handleWheel = (e) => {
      if (!isEngagedRef.current) return;
      if (Math.abs(e.deltaY) < 8) return;

      const goingDown = e.deltaY > 0;
      const current = activeIndexRef.current;
      const canStepDown = goingDown && current < lastIndex;
      const canStepUp = !goingDown && current > 0;
      if (!canStepDown && !canStepUp) return;

      e.preventDefault();
      if (wheelLockedRef.current) return;

      wheelLockedRef.current = true;
      setActiveIndex((prev) => Math.min(lastIndex, Math.max(0, prev + (goingDown ? 1 : -1))));
      setTimeout(() => {
        wheelLockedRef.current = false;
      }, WHEEL_LOCK_MS);
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      observer.disconnect();
      window.removeEventListener("wheel", handleWheel);
    };
  }, []);

  const handleScrubAtX = useCallback(
    (clientX) => {
      if (!stackRef.current) return;
      const rect = stackRef.current.getBoundingClientRect();
      const normalizedX = (clientX - rect.left) / rect.width;
      const count = MODULES.length;
      const targetIdx = Math.min(count - 1, Math.max(0, Math.floor(normalizedX * count)));
      if (targetIdx !== activeIndex) setActiveIndex(targetIdx);
    },
    [activeIndex]
  );

  const handleMouseMove = useCallback(
    (e) => {
      if (e.buttons !== 1) return;
      handleScrubAtX(e.clientX);
    },
    [handleScrubAtX]
  );
  const handleTouchMove = useCallback(
    (e) => {
      if (e.touches?.[0]) handleScrubAtX(e.touches[0].clientX);
    },
    [handleScrubAtX]
  );

  const active = MODULES[activeIndex];

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      className="relative w-full select-none overflow-hidden border-y border-line/70 bg-surface-sunken/50 py-24"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-90 transition-all duration-700 ease-out"
        style={{ background: active.ambientBg }}
      />

      <div className="relative z-10 mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-6 lg:grid-cols-[1.1fr_1.3fr]">
        {/* left: headline + stats + nav */}
        <div className="flex flex-col items-start text-left">
          <div
            className="mb-4 inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider shadow-sm transition-all duration-500"
            style={{ backgroundColor: `${active.badgeColor}18`, color: active.badgeColor, borderColor: `${active.badgeColor}50` }}
          >
            <span className="h-2 w-2 animate-ping rounded-full" style={{ backgroundColor: active.badgeColor }} />
            {active.tag}
          </div>

          <h2 className="mb-4 font-display text-[32px] font-bold leading-[1.15] tracking-tight text-ink md:text-[38px]">
            Evidence powered by{" "}
            <span className="transition-colors duration-500" style={{ color: active.badgeColor }}>
              real forensics
            </span>
            .
          </h2>

          <p className="mb-7 max-w-xl text-[14px] leading-relaxed text-ink-dim">
            Click and drag across the cards to scrub through Sentinel's screening pipeline — every
            document is checked against text, structural, forensic, and biometric evidence.
          </p>

          <div className="mb-8 grid w-full max-w-md grid-cols-3 gap-4 rounded-2xl border border-line bg-surface p-4 shadow-[var(--shadow-card)] transition-colors duration-500">
            <div>
              <div className="text-[9.5px] font-bold uppercase tracking-wider text-ink-faint">Processing</div>
              <div className="mt-0.5 font-mono text-[13px] font-extrabold text-ink">{active.stats.speed}</div>
            </div>
            <div>
              <div className="text-[9.5px] font-bold uppercase tracking-wider text-ink-faint">Accuracy</div>
              <div className="mt-0.5 text-[13px] font-extrabold text-ink">{active.stats.accuracy}</div>
            </div>
            <div>
              <div className="text-[9.5px] font-bold uppercase tracking-wider text-ink-faint">Stage</div>
              <div className="mt-0.5 text-[13px] font-extrabold text-ink">{active.stats.layer}</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={prevCard}
              aria-label="Previous module"
              className="rounded-full border border-line bg-surface p-3 text-ink shadow-sm transition-all hover:scale-105 hover:border-brand active:scale-95"
            >
              <ChevronLeft size={20} />
            </button>

            <div className="flex gap-1.5 px-2">
              {MODULES.map((m, idx) => (
                <button
                  key={m.id}
                  onClick={() => setActiveIndex(idx)}
                  aria-label={`Go to ${m.title}`}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    idx === activeIndex ? "w-8" : "w-2.5 bg-ink-faint opacity-40 hover:opacity-80"
                  }`}
                  style={{ backgroundColor: idx === activeIndex ? active.badgeColor : undefined }}
                />
              ))}
            </div>

            <button
              onClick={nextCard}
              aria-label="Next module"
              className="rounded-full border border-line bg-surface p-3 text-ink shadow-sm transition-all hover:scale-105 hover:border-brand active:scale-95"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* right: 3D perspective card stack */}
        <div
          ref={stackRef}
          onMouseMove={handleMouseMove}
          onTouchMove={handleTouchMove}
          onTouchStart={handleTouchMove}
          style={{ perspective: 1200 }}
          className="relative flex h-[390px] w-full cursor-pointer items-center justify-center sm:h-[410px]"
        >
          {MODULES.map((card, idx) => {
            const len = MODULES.length;
            let diff = idx - activeIndex;
            if (diff > len / 2) diff -= len;
            if (diff < -len / 2) diff += len;

            if (Math.abs(diff) > 2) return null;
            const isActive = diff === 0;
            const Icon = card.icon;

            const isMobile = typeof window !== "undefined" && window.innerWidth < 640;
            const rotateY = diff * (isMobile ? -12 : -18);
            const translateX = diff * (isMobile ? 65 : 115);
            const translateZ = isActive ? 0 : -Math.abs(diff) * (isMobile ? 70 : 120);
            const scale = isActive ? 1 : 0.84 - Math.abs(diff) * 0.08;
            const opacity = isActive ? 1 : 0.45 - Math.abs(diff) * 0.15;

            return (
              <motion.div
                key={card.id}
                onClick={() => setActiveIndex(idx)}
                className="absolute top-0 flex h-[375px] w-[270px] transform-gpu select-none flex-col justify-between rounded-3xl border p-5 transition-all duration-500 ease-out sm:h-[395px] sm:w-[340px] sm:p-6"
                style={{
                  background: card.cardBg,
                  borderColor: isActive ? card.badgeColor : "rgba(255,255,255,0.12)",
                  boxShadow: isActive ? `0 24px 60px ${card.bgGlow}, 0 0 0 1px ${card.badgeColor}` : "0 12px 30px rgba(0,0,0,0.6)",
                  zIndex: 20 - Math.abs(diff),
                }}
                animate={{
                  transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                  opacity,
                }}
                transition={{ type: "spring", stiffness: 280, damping: 24 }}
              >
                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <span
                      className="flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider shadow-sm"
                      style={{ backgroundColor: `${card.badgeColor}25`, color: card.badgeColor, border: `1px solid ${card.badgeColor}60` }}
                    >
                      <Icon size={12} />
                      {card.tag}
                    </span>
                    <span className="font-mono text-xs font-bold text-white/70">0{idx + 1}</span>
                  </div>

                  <h3 className="mb-2.5 font-display text-xl font-extrabold leading-snug tracking-tight text-white drop-shadow-md">
                    {card.title}
                  </h3>
                  <p className="text-xs font-medium leading-relaxed text-white/90">{card.description}</p>
                </div>

                <div>
                  <div className="mb-4 break-all rounded-xl border border-white/20 bg-black/80 p-3.5 font-mono text-[11px] font-semibold text-white shadow-inner">
                    {card.codeSnippet}
                  </div>
                  <div className="flex items-center justify-between border-t border-white/20 pt-2.5 text-xs font-bold text-white">
                    <span>Inspect signal</span>
                    <ArrowRight size={15} style={{ color: card.badgeColor }} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
