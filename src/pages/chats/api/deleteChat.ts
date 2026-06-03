import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";
import { toast } from "react-toastify";
import { axios } from "@/lib/axios";
import { chatsQueryKey } from "./getChats";

export const deleteChat = async (chatId: string): Promise<void> => {
  await axios.delete(`/chats/${chatId}`);
};

export const useDeleteChat = (
  config: UseMutationOptions<void, Error, string> = {},
) => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: deleteChat,
    ...config,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: chatsQueryKey });
      toast.success("Chat deleted.");
    },
    onError: (error) => {
      toast.error(error?.message || "Failed to delete chat.");
    },
  });
};
