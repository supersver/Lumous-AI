import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { axios } from "@/lib/axios";
import type { SendMessageInput, SendMessageResponse } from "../types";

export const sendMessage = async (
  input: SendMessageInput,
): Promise<SendMessageResponse> => {
  const res = await axios.post<SendMessageResponse>(
    `/chats/${input.chatId}/messages`,
    { content: input.content, model: input.model },
  );
  return res.data;
};

export const useSendMessage = (
  config: UseMutationOptions<SendMessageResponse, Error, SendMessageInput> = {},
) => {
  return useMutation<SendMessageResponse, Error, SendMessageInput>({
    mutationFn: sendMessage,
    ...config,
    // onError: (error) => {
    //   toast.error(error?.message || "Failed to send message.");
    // },
  });
};
