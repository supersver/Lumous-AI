import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { axios } from "@/lib/axios";
import type {
  AnalyticsChatsResponse,
  AnalyticsPaginatedParams,
} from "../types/apiTypes";

export const analyticsChatsQueryKey = (params: AnalyticsPaginatedParams) =>
  ["analytics", "chats", params] as const;

export const getAnalyticsChats = async (
  params: AnalyticsPaginatedParams,
): Promise<AnalyticsChatsResponse> => {
  const res = await axios.get<AnalyticsChatsResponse>("/analytics/chats", {
    params,
  });
  return res.data;
};

export const useAnalyticsChats = (
  params: AnalyticsPaginatedParams = {},
  config: Omit<
    UseQueryOptions<AnalyticsChatsResponse, Error>,
    "queryKey" | "queryFn"
  > = {},
) => {
  return useQuery<AnalyticsChatsResponse, Error>({
    queryKey: analyticsChatsQueryKey(params),
    queryFn: () => getAnalyticsChats(params),
    ...config,
  });
};
