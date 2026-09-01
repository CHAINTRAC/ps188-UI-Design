import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import Card from "./Card";
import useCountUp from "../../lib/useCountUp";

export default function StatCard({ label, value, suffix = "", decimals = 0, trend, trendLabel, tone = "good", delay = 0, accent = false }) {
  const count = useCountUp(value, { decimals, delay: delay * 1000 + 150 });
  const trendUp = trend === "up";

  return (
    <Card delay={delay} className="flex flex-col gap-2.5">
      <span className="text-[11.5px] font-medium text-ink-dim">{label}</span>
      <div className="flex items-baseline gap-2.5">
        <span
          className={`font-display text-[26px] font-bold tabular-nums leading-none ${
            accent ? (tone === "bad" ? "text-bad" : tone === "warn" ? "text-warn-ink" : "text-good-ink") : "text-ink"
          }`}
        >
          {count}
          {suffix}
        </span>
        {trend && (
          <span
            className={`flex items-center gap-0.5 text-[11px] font-semibold ${
              trendUp ? "text-good-ink" : "text-ink-faint"
            }`}
          >
            {trendUp ? <ArrowUpRight size={12} strokeWidth={2.5} /> : <ArrowDownRight size={12} strokeWidth={2.5} />}
            {trendLabel}
          </span>
        )}
      </div>
    </Card>
  );
}
