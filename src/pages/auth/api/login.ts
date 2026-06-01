import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { axios } from "@/lib/axios";
import type { AuthUser } from "@/store/useAppStore";

export interface LoginResponse {
  user: AuthUser;
}

export const login = async (): Promise<LoginResponse> => {
  const res = await axios.get<LoginResponse>("/auth/me");
  return res.data;
};

export const useLogin = (
  config: UseMutationOptions<LoginResponse, Error, void> = {},
) => {
  return useMutation<LoginResponse, Error, void>({
    mutationFn: login,
    onError: (error) => {
      toast.error(error?.message || "Login failed. Please try again.");
    },
    onSuccess: (data) => {
      if (data) {
        toast.success("Login successful!");
      }
    },
    ...config,
  });
};
