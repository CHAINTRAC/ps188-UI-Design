import { useQuery } from "@tanstack/react-query";
import { getDashboardSummary } from "./services";

// Shared empty shape so pages can destructure without null guards before the
// first fetch resolves.
export const EMPTY_SUMMARY = {
  role: "",
  region: "",
  screenings_today: 0,
  screenings_total: 0,
  decided_today: 0,
  decided_total: 0,
  pending_decisions: 0,
  escalated: 0,
  avg_decision_seconds: 0,
  verdict_split: { genuine: 0, suspicious: 0, fake: 0 },
  weekly_volume: [],
  totals: null,
  verifier_activity: [],
  checkpoint_activity: [],
  flagged_cases: [],
};

export function useDashboardSummary() {
  return useQuery({
    queryKey: ["dashboard-summary"],
    queryFn: getDashboardSummary,
    select: (data) => ({ ...EMPTY_SUMMARY, ...data }),
  });
}
