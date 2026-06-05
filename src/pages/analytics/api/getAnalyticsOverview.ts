import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { axios } from "@/lib/axios";
import type {
  AnalyticsDateRangeParams,
  AnalyticsOverview,
} from "../types/apiTypes";

export const overviewQueryKey = (params: AnalyticsDateRangeParams) =>
  ["analytics", "overview", params] as const;

export const getOverview = async (
  params: AnalyticsDateRangeParams,
): Promise<AnalyticsOverview> => {
  const res = await axios.get<AnalyticsOverview>("/analytics/overview", {
    params,
  });
  return res.data;
};

export const useAnalyticsOverview = (
  params: AnalyticsDateRangeParams = {},
  config: Omit<
    UseQueryOptions<AnalyticsOverview, Error>,
    "queryKey" | "queryFn"
  > = {},
) => {
  return useQuery<AnalyticsOverview, Error>({
    queryKey: overviewQueryKey(params),
    queryFn: () => getOverview(params),
    ...config,
  });
};
