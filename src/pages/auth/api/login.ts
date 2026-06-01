import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { API_URL } from "@/config";
import { axios } from "@/lib/axios";

export const login = async (): Promise<any> => {
  try {
    const res = await axios.get(`${API_URL}/auth/me`);

    return res?.data;
  } catch (error: any) {
    console.error("Login error:", error);
    throw error;
  }
};

export const useLogin = (config = {}) => {
  return useMutation<any, Error>({
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
