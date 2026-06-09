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
  sidebarCollapsed: boolean;
  mobileOpen: boolean;
  setUser: (user: AuthUser) => void;
  setAuthReady: (authReady: boolean) => void;
  clearUser: () => void;
  logout: () => void;
  setSelectedModel: (model: SelectedModel | null) => void;
  setSidebarCollapsed: (sidebar: boolean) => void;
  setMobileOpen: (open: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      authReady: false,
      selectedModel: null,
      sidebarCollapsed: false,
      mobileOpen: false,
      setUser: (user) => set({ user }),
      setAuthReady: (authReady) => set({ authReady }),
      clearUser: () => set({ user: null }),
      logout: () => {
        storage.clear();
        set({ authReady: true, user: null });
      },
      setSelectedModel: (model) => set({ selectedModel: model }),
      setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }),
      setMobileOpen: (mobileOpen) => set({ mobileOpen }),
    }),
    {
      name: "lumous_ai",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        selectedModel: state.selectedModel,
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    },
  ),
);
