import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { ChatSettings } from "../types";

export const defaultChatSettings: ChatSettings = {
  webSearch: false,
  reasoning: false,
};

type ChatSettingsById = Record<string, ChatSettings>;

interface ChatSettingsState {
  draftSettings: ChatSettings;
  settingsByChatId: ChatSettingsById;
  getSettingsForChat: (chatId?: string | null) => ChatSettings;
  setChatSettings: (chatId: string, settings: ChatSettings) => void;
  updateChatSettings: (
    chatId: string | null | undefined,
    patch: Partial<ChatSettings>,
  ) => void;
}

const mergeSettings = (settings?: Partial<ChatSettings>): ChatSettings => ({
  ...defaultChatSettings,
  ...settings,
});

export const useChatSettingsStore = create<ChatSettingsState>()(
  persist(
    (set, get) => ({
      draftSettings: defaultChatSettings,
      settingsByChatId: {},

      getSettingsForChat: (chatId) => {
        if (!chatId) {
          return get().draftSettings;
        }

        return mergeSettings(get().settingsByChatId[chatId]);
      },

      setChatSettings: (chatId, settings) =>
        set((state) => ({
          settingsByChatId: {
            ...state.settingsByChatId,
            [chatId]: mergeSettings(settings),
          },
        })),

      updateChatSettings: (chatId, patch) =>
        set((state) => {
          if (!chatId) {
            return {
              draftSettings: mergeSettings({
                ...state.draftSettings,
                ...patch,
              }),
            };
          }

          return {
            settingsByChatId: {
              ...state.settingsByChatId,
              [chatId]: mergeSettings({
                ...state.settingsByChatId[chatId],
                ...patch,
              }),
            },
          };
        }),
    }),
    {
      name: "lumous_chat_settings",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
