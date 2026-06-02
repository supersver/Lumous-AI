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

export interface SelectedModel {
  id: string;
  name: string;
}

interface AppState {
  user: AuthUser | null;
  authReady: boolean;
  selectedModel: SelectedModel | null;
  setUser: (user: AuthUser) => void;
  setAuthReady: (authReady: boolean) => void;
  clearUser: () => void;
  logout: () => void;
  setSelectedModel: (model: SelectedModel | null) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      authReady: false,
      selectedModel: null,
      setUser: (user) => set({ user }),
      setAuthReady: (authReady) => set({ authReady }),
      clearUser: () => set({ user: null }),
      logout: () => {
        storage.clear();
        set({ authReady: true, user: null });
      },
      setSelectedModel: (model) => set({ selectedModel: model }),
    }),
    {
      name: "modelpilot_app_store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        selectedModel: state.selectedModel,
      }),
    },
  ),
);
