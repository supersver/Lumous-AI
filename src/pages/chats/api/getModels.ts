import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { axios } from "@/lib/axios";

export interface FilterProvider {
  name: string;
  slug: string;
  logo: string;
  count: number;
}

export interface FilterPricing {
  free: number;
  paid: number;
}

export interface ModelsFilters {
  providers: FilterProvider[];
  pricing: FilterPricing;
}

export interface ModelPricing {
  prompt: string;
  completion: string;
}

export interface Model {
  id: string;
  name: string;
  provider: string;
  contextLength: number;
  description: string;
  featured: boolean;
  inputPrice: number;
  isFree: boolean;
  isPaid: boolean;
  outputPrice: number;
  providerLogo: string;
  providerSlug: string;
  supportsReasoning: boolean;
  supportsStreaming: boolean;
  supportsTools: boolean;
  supportsVision: boolean;
}

export interface GetModelsResponse {
  filters: ModelsFilters;
  models: Model[];
}

export const getModels = async (): Promise<GetModelsResponse> => {
  const res = await axios.get<GetModelsResponse>("/models");
  return res.data;
};

export const useGetModels = (
  config: Omit<
    UseQueryOptions<GetModelsResponse, Error>,
    "queryKey" | "queryFn"
  > = {},
) => {
  return useQuery<GetModelsResponse, Error>({
    queryKey: ["models"],
    queryFn: getModels,
    ...config,
  });
};
