import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { axios } from "@/lib/axios";

export interface CreateChatDto {
  model: string;
}

export const createNewChat = async (model: CreateChatDto): Promise<any> => {
  const res = await axios.post<any>("/chats", model);
  return res.data;
};

export const useCreateNewChat = (
  config: UseMutationOptions<any, Error, CreateChatDto> = {},
) => {
  return useMutation<any, Error, CreateChatDto>({
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
