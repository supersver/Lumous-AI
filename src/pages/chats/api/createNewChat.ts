import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { axios } from "@/lib/axios";

export interface CreateChatDto {
  model: string;
}

export interface Chat {
  id: string;
  title?: string;
  model: string;
  createdAt: string;
}

export const createNewChat = async (dto: CreateChatDto): Promise<Chat> => {
  const res = await axios.post<Chat>("/chats", dto);
  return res.data;
};

export const useCreateNewChat = (
  config: UseMutationOptions<Chat, Error, CreateChatDto> = {},
) => {
  return useMutation<Chat, Error, CreateChatDto>({
    mutationFn: createNewChat,
    onError: (error) => {
      toast.error(error?.message || "Chat creation failed.");
    },
    onSuccess: (data) => {
      if (data) {
        toast.success("New Chat Created!");
      }
    },
    ...config,
  });
};
