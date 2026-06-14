import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";
import { toast } from "react-toastify";

import { axios } from "@/lib/axios";
import type { ApiKey, SaveApiKeyInput } from "./types";
import { apiKeysQueryKey } from "./getApiKeys";

export const saveKey = async (input: SaveApiKeyInput): Promise<ApiKey> => {
  const res = await axios.post<ApiKey>("/api-keys", input);
  return res.data;
};

export const useSaveKey = (
  config: UseMutationOptions<ApiKey, Error, SaveApiKeyInput> = {},
) => {
  const queryClient = useQueryClient();

  return useMutation<ApiKey, Error, SaveApiKeyInput>({
    mutationFn: saveKey,
    ...config,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: apiKeysQueryKey });
      toast.success("API key saved.");
    },
    onError: (error) => {
      toast.error(error?.message || "Failed to save API key.");
    },
  });
};
