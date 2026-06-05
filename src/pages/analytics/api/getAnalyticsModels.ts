import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { axios } from "@/lib/axios";
import type {
  AnalyticsModelsResponse,
  AnalyticsPaginatedParams,
} from "../types/apiTypes";

export const analyticsModelsQueryKey = (params: AnalyticsPaginatedParams) =>
  ["analytics", "models", params] as const;

export const getAnalyticsModels = async (
  params: AnalyticsPaginatedParams,
): Promise<AnalyticsModelsResponse> => {
  const res = await axios.get<AnalyticsModelsResponse>("/analytics/models", {
    params,
  });
  return res.data;
};

export const useAnalyticsModels = (
  params: AnalyticsPaginatedParams = {},
  config: Omit<
    UseQueryOptions<AnalyticsModelsResponse, Error>,
    "queryKey" | "queryFn"
  > = {},
) => {
  return useQuery<AnalyticsModelsResponse, Error>({
    queryKey: analyticsModelsQueryKey(params),
    queryFn: () => getAnalyticsModels(params),
    ...config,
  });
};
