import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { axios } from "@/lib/axios";

export interface ModelPricing {
  prompt: string;
  completion: string;
}

export interface Model {
  id: string;
  name: string;
  contextLength: number;
  pricing: ModelPricing;
}

export const getModels = async (): Promise<Model[]> => {
  const res = await axios.get<Model[]>("/models");
  return res.data;
};

export const useGetModels = (
  config: Omit<UseQueryOptions<Model[], Error>, "queryKey" | "queryFn"> = {},
) => {
  return useQuery<Model[], Error>({
    queryKey: ["models"],
    queryFn: getModels,

    ...config,
  });
};
