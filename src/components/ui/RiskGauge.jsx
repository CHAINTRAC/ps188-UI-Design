import { motion } from "framer-motion";
import useCountUp from "../../lib/useCountUp";

const TONE = {
  good: "var(--color-good)",
  warn: "var(--color-warn)",
  bad: "var(--color-bad)",
};

export default function RiskGauge({ score, tone = "warn", size = 116 }) {
  const r = 42;
  const circumference = 2 * Math.PI * r;
  const offset = circumference * (1 - score / 100);
  const count = useCountUp(score, { duration: 1100, delay: 200 });

  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className="shrink-0">
      <g transform="rotate(-90 50 50)">
        <circle cx="50" cy="50" r={r} fill="none" stroke="var(--color-surface-sunken)" strokeWidth="9" />
        <motion.circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke={TONE[tone]}
          strokeWidth="9"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        />
      </g>
      <text x="50" y="47" textAnchor="middle" fontFamily="Space Grotesk" fontWeight="700" fontSize="22" fill="var(--color-ink)">
        {count}
      </text>
      <text x="50" y="61" textAnchor="middle" fontFamily="IBM Plex Sans" fontSize="7.5" fill="var(--color-ink-faint)">
        RISK / 100
      </text>
    </svg>
  );
}
