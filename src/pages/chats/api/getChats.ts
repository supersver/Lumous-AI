import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { axios } from "@/lib/axios";

export interface Chats {
  id: string;
  message: string;
}

export const getChats = async (): Promise<Chats[]> => {
  const res = await axios.get<Chats[]>("/chats");
  return res.data;
};

export const useChats = (
  config: Omit<UseQueryOptions<Chats[], Error>, "queryKey" | "queryFn"> = {},
) => {
  return useQuery<Chats[], Error>({
    queryKey: ["chats"],
    queryFn: getChats,
    ...config,
  });
};
