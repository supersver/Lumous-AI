import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import storage from "@/utils/storage";

export interface AuthUser {
  id: string;
  firebaseUid: string;
  email: string;
  name: string;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

interface AppState {
  user: AuthUser | null;
  authReady: boolean;
  setUser: (user: AuthUser) => void;
  setAuthReady: (authReady: boolean) => void;
  clearUser: () => void;
  logout: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      authReady: false,
      setUser: (user) => set({ user }),
      setAuthReady: (authReady) => set({ authReady }),
      clearUser: () => set({ user: null }),
      logout: () => {
        storage.clear();
        set({ authReady: true, user: null });
      },
    }),
    {
      name: "modelpilot_app_store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user }),
    },
  ),
);
