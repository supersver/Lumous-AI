import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";
import { toast } from "react-toastify";

import { axios } from "@/lib/axios";
import { apiKeysQueryKey } from "./getApiKeys";

export const deleteKey = async (id: string): Promise<void> => {
  try {
    await axios.delete(`/api-keys/${encodeURIComponent(id)}`);
  } catch (err) {
    throw err;
  }
};

export const useDeleteKey = (
  config: UseMutationOptions<void, Error, string> = {},
) => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: deleteKey,
    ...config,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: apiKeysQueryKey });
      toast.success("API key deleted.");
    },
    onError: (error) => {
      toast.error(error?.message || "Failed to delete API key.");
    },
  });
};
