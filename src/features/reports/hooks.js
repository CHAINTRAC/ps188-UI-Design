import { useQuery } from "@tanstack/react-query";
import { getReports } from "./services";

export const EMPTY_REPORTS = {
  region: "",
  total_screenings: 0,
  fake_rate: 0,
  escalated: 0,
  avg_decision_seconds: 0,
  weekly_volume: [],
  doc_type_breakdown: [],
  checkpoint_breakdown: [],
};

export function useReports(params = {}) {
  return useQuery({
    queryKey: ["reports", params],
    queryFn: () => getReports(params),
    select: (data) => ({ ...EMPTY_REPORTS, ...data }),
  });
}
