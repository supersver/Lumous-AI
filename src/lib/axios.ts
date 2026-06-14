import Axios, { type InternalAxiosRequestConfig, AxiosHeaders } from "axios";

import { API_URL, ENVIRONMENT } from "@/config";
import { useAppStore } from "@/store/useAppStore";
import storage from "../utils/storage";
import { auth } from "./firebase";
import { toast } from "react-toastify";

async function authRequestInterceptor(config: InternalAxiosRequestConfig) {
  if (!config.headers) {
    config.headers = new AxiosHeaders();
  }

  const user = auth.currentUser;

  if (user) {
    const token = await user.getIdToken(true);
    config.headers.authorization = `Bearer ${token}`;
  }

  config.headers.Accept = "application/json";
  return config;
}

export const axios = Axios.create({
  baseURL: API_URL,
});

// axios.defaults.timeout = 10000; // 10 seconds
axios.interceptors.request.use(authRequestInterceptor);
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const status = error?.response?.status;
    const clearSession = () => {
      storage.clear();
      useAppStore.getState().clearUser();
    };

    if (status === 401) {
      clearSession();

      if (window.location.pathname !== "/login") {
        window.location.assign("/login");
      }
    } else if (status === 403) {
      if (window.location.pathname !== "/") {
        window.location.assign("/");
      }
    } else if (status === 422) {
      clearSession();
      window.location.assign("/login");
    } else {
      toast.error(error?.response.data.error.message);
      if (ENVIRONMENT) {
        console.log("API Error:", {
          url: error?.config?.url,
          method: error?.config?.method,
          status,
          response: error?.response,
        });
      }
      return Promise.reject(error);
    }

    return Promise.reject(error);
  },
);
