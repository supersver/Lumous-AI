import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { axios } from "@/lib/axios";
import type { ChatSession } from "../types";

export const chatQueryKey = (chatId: string) => ["chats", chatId] as const;

export const getChat = async (chatId: string): Promise<ChatSession> => {
  const res = await axios.get<ChatSession>(`/chats/${chatId}`);
  return res.data;
};

export const useGetChat = (
  chatId: string,
  config: Omit<
    UseQueryOptions<ChatSession, Error>,
    "queryKey" | "queryFn"
  > = {},
) => {
  return useQuery<ChatSession, Error>({
    queryKey: chatQueryKey(chatId),
    queryFn: () => getChat(chatId),
    enabled: !!chatId,
    ...config,
  });
};
