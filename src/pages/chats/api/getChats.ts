import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { axios } from "@/lib/axios";
import type { ChatSession } from "../types";

export interface GetChatsParams {
  limit?: number;
  offset?: number;
}

export const chatsQueryKey = ["chats"] as const;

export const getChats = async (
  params: GetChatsParams = {},
): Promise<ChatSession[]> => {
  const res = await axios.get<ChatSession[]>("/chats", {
    params: { limit: 20, offset: 0, ...params },
  });

  return res.data;
};

export const useGetChats = (
  params: GetChatsParams = {},
  config: Omit<
    UseQueryOptions<ChatSession[], Error>,
    "queryKey" | "queryFn"
  > = {},
) => {
  return useQuery<ChatSession[], Error>({
    queryKey: [...chatsQueryKey, params],
    queryFn: () => getChats(params),
    ...config,
  });
};
