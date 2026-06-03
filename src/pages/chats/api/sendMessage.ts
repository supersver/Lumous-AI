import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { axios } from "@/lib/axios";

export interface SendMessageInput {
  chatId: string;
  content: string;
  model: string;
}

export interface SendMessageResponseMessage {
  id: string;
  chatId: string;
  role: "assistant";
  content: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  createdAt: string;
}

export interface SendMessageResponseUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  estimatedCost: string;
  latencyMs: number;
}

export interface SendMessageResponse {
  message: SendMessageResponseMessage;
  usage: SendMessageResponseUsage;
}

export const sendMessage = async (
  input: SendMessageInput,
): Promise<SendMessageResponse> => {
  const res = await axios.post<SendMessageResponse>(
    `/chats/${input.chatId}/messages`,
    {
      content: input.content,
      model: input.model,
    },
  );
  return res.data;
};

export const useSendMessage = (
  config: UseMutationOptions<SendMessageResponse, Error, SendMessageInput> = {},
) => {
  return useMutation<SendMessageResponse, Error, SendMessageInput>({
    mutationFn: sendMessage,
    ...config,
    onError: (error) => {
      toast.error(error?.message || "Failed to send message.");
    },
  });
};
