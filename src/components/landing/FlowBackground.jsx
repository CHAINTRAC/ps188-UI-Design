const PATHS = [
  { d: "M -100,120 C 320,40 760,260 1600,110", dur: "16s", begin: "0s", color: "#2a9d90" },
  { d: "M -100,430 C 380,520 900,260 1600,470", dur: "19s", begin: "-5s", color: "#1a9e63" },
  { d: "M -100,760 C 460,700 980,900 1600,720", dur: "22s", begin: "-2s", color: "#e08a1e" },
  { d: "M -100,280 C 560,190 1020,420 1600,300", dur: "18s", begin: "-9s", color: "#2a9d90" },
  { d: "M -100,600 C 320,650 760,480 1600,600", dur: "21s", begin: "-13s", color: "#1a9e63" },
];

export default function FlowBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-canvas">
      <div
        className="aurora-drift-a absolute -left-[18%] top-[-20%] h-[780px] w-[780px] rounded-full blur-[130px]"
        style={{ background: "var(--color-brand)", opacity: "var(--blob-opacity-1)" }}
      />
      <div
        className="aurora-drift-b absolute -right-[15%] top-[38%] h-[680px] w-[680px] rounded-full blur-[130px]"
        style={{ background: "var(--color-good)", opacity: "var(--blob-opacity-2)" }}
      />
      <div
        className="aurora-drift-c absolute bottom-[-22%] left-[6%] h-[680px] w-[680px] rounded-full blur-[140px]"
        style={{ background: "var(--color-warn)", opacity: "var(--blob-opacity-3)" }}
      />

      <svg viewBox="0 0 1440 900" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        <defs>
          <filter id="flow-glow" x="-300%" y="-300%" width="700%" height="700%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {PATHS.map((p, i) => (
          <g key={i}>
            <path
              d={p.d}
              fill="none"
              stroke={p.color}
              style={{ opacity: "var(--flow-line-opacity)" }}
              strokeWidth="1.5"
              strokeDasharray="2 7"
              strokeLinecap="round"
            />
            <circle r="5" fill={p.color} filter="url(#flow-glow)">
              <animateMotion dur={p.dur} begin={p.begin} repeatCount="indefinite" path={p.d} rotate="auto" />
            </circle>
          </g>
        ))}
      </svg>

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-canvas/55" />
    </div>
  );
}
