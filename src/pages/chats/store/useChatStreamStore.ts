import { create } from "zustand";

import type { ActiveChatStream } from "../types";

export interface ChatStreamState {
  activeStream: ActiveChatStream | null;
  isStreaming: boolean;
  clearActiveStream: () => void;
  startStream: (stream: ActiveChatStream) => void;
  updateActiveStream: (patch: Partial<ActiveChatStream>) => void;
}

export const useChatStreamStore = create<ChatStreamState>((set) => ({
  activeStream: null,
  isStreaming: false,

  clearActiveStream: () =>
    set({
      activeStream: null,
      isStreaming: false,
    }),

  startStream: (stream) =>
    set({
      activeStream: stream,
      isStreaming: true,
    }),

  updateActiveStream: (patch) =>
    set((state) => {
      if (!state.activeStream) {
        return state;
      }

      return {
        activeStream: {
          ...state.activeStream,
          ...patch,
        },
        isStreaming: true,
      };
    }),
}));
