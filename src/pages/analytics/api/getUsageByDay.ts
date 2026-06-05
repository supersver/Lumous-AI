import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { axios } from "@/lib/axios";
import type { AnalyticsDateRangeParams } from "../types/apiTypes";

export interface UsageByDayItem {
  date: string;
  messages: number;
  tokens: number;
  cost: string;
}

export const usageByDayQueryKey = (params: AnalyticsDateRangeParams) =>
  ["analytics", "usage-by-day", params] as const;

export const getUsageByDay = async (
  params: AnalyticsDateRangeParams,
): Promise<UsageByDayItem[]> => {
  const res = await axios.get<UsageByDayItem[]>("/analytics/usage-by-day", {
    params,
  });
  return res.data;
};

export const useAnalyticsUsageByDay = (
  params: AnalyticsDateRangeParams = {},
  config: Omit<
    UseQueryOptions<UsageByDayItem[], Error>,
    "queryKey" | "queryFn"
  > = {},
) => {
  return useQuery<UsageByDayItem[], Error>({
    queryKey: usageByDayQueryKey(params),
    queryFn: () => getUsageByDay(params),
    ...config,
  });
};
