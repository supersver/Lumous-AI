import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { axios } from "@/lib/axios";
import type { ApiKey, ApiKeysListResponse } from "./types";

export const apiKeysQueryKey = ["api-keys"] as const;

const normalizeApiKeys = (payload: ApiKeysListResponse): ApiKey[] => {
  if (Array.isArray(payload)) return payload;
  return payload.apiKeys ?? payload.keys ?? payload.data ?? [];
};

export const getApiKeys = async (): Promise<ApiKey[]> => {
  const res = await axios.get<ApiKeysListResponse>("/api-keys");
  return normalizeApiKeys(res.data);
};

export const useApiKeys = (
  config: Omit<UseQueryOptions<ApiKey[], Error>, "queryKey" | "queryFn"> = {},
) => {
  return useQuery<ApiKey[], Error>({
    queryKey: apiKeysQueryKey,
    queryFn: getApiKeys,
    staleTime: 30_000,
    ...config,
  });
};
