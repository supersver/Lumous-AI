import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
import { API_URL } from "@/config";
import { auth } from "@/lib/firebase";

export const login = async (): Promise<any> => {
  const user = auth.currentUser;

  const token = await user?.getIdToken();
  try {
    const res = await axios.get(`${API_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

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
