import { create } from "zustand";

import type { ChatMessage } from "../types";

type MessagesById = Record<string, ChatMessage>;
type ChatMessagesById = Record<string, MessagesById>;
type MessageOrderByChatId = Record<string, string[]>;

export interface ChatMessagesState {
  messagesByChatId: ChatMessagesById;
  messageOrderByChatId: MessageOrderByChatId;
  addMessage: (chatId: string, message: ChatMessage) => void;
  appendToMessage: (
    chatId: string,
    messageId: string,
    contentChunk: string,
  ) => void;
  clearChatMessages: (chatId: string) => void;
  markChatMessagesComplete: (chatId: string) => void;
  replaceMessage: (
    chatId: string,
    messageId: string,
    message: ChatMessage,
  ) => void;
  setChatMessagesFromServer: (chatId: string, messages: ChatMessage[]) => void;
  updateMessage: (
    chatId: string,
    messageId: string,
    patch: Partial<ChatMessage>,
  ) => void;
}

const pendingStatuses = new Set(["optimistic", "streaming"]);

const buildMessageMap = (messages: ChatMessage[]) =>
  messages.reduce<MessagesById>((messagesById, message) => {
    messagesById[message.id] = { ...message, status: "complete" };
    return messagesById;
  }, {});

export const useChatMessagesStore = create<ChatMessagesState>((set) => ({
  messagesByChatId: {},
  messageOrderByChatId: {},

  addMessage: (chatId, message) =>
    set((state) => {
      const currentMessages = state.messagesByChatId[chatId] ?? {};
      const currentOrder = state.messageOrderByChatId[chatId] ?? [];

      return {
        messagesByChatId: {
          ...state.messagesByChatId,
          [chatId]: {
            ...currentMessages,
            [message.id]: message,
          },
        },
        messageOrderByChatId: {
          ...state.messageOrderByChatId,
          [chatId]: currentOrder.includes(message.id)
            ? currentOrder
            : [...currentOrder, message.id],
        },
      };
    }),

  appendToMessage: (chatId, messageId, contentChunk) =>
    set((state) => {
      const currentMessages = state.messagesByChatId[chatId];
      const currentMessage = currentMessages?.[messageId];

      if (!currentMessages || !currentMessage || !contentChunk) {
        return state;
      }

      return {
        messagesByChatId: {
          ...state.messagesByChatId,
          [chatId]: {
            ...currentMessages,
            [messageId]: {
              ...currentMessage,
              content: `${currentMessage.content}${contentChunk}`,
              status: "streaming",
            },
          },
        },
      };
    }),

  clearChatMessages: (chatId) =>
    set((state) => {
      const messagesByChatId = { ...state.messagesByChatId };
      const messageOrderByChatId = { ...state.messageOrderByChatId };

      delete messagesByChatId[chatId];
      delete messageOrderByChatId[chatId];

      return {
        messagesByChatId,
        messageOrderByChatId,
      };
    }),

  markChatMessagesComplete: (chatId) =>
    set((state) => {
      const currentMessages = state.messagesByChatId[chatId];

      if (!currentMessages) {
        return state;
      }

      return {
        messagesByChatId: {
          ...state.messagesByChatId,
          [chatId]: Object.entries(currentMessages).reduce<MessagesById>(
            (messagesById, [messageId, message]) => {
              messagesById[messageId] = {
                ...message,
                status: message.status === "error" ? "error" : "complete",
              };
              return messagesById;
            },
            {},
          ),
        },
      };
    }),

  replaceMessage: (chatId, messageId, message) =>
    set((state) => {
      const currentMessages = state.messagesByChatId[chatId] ?? {};
      const currentOrder = state.messageOrderByChatId[chatId] ?? [];
      const nextMessages = { ...currentMessages };

      delete nextMessages[messageId];
      nextMessages[message.id] = message;

      return {
        messagesByChatId: {
          ...state.messagesByChatId,
          [chatId]: nextMessages,
        },
        messageOrderByChatId: {
          ...state.messageOrderByChatId,
          [chatId]: currentOrder.map((id) =>
            id === messageId ? message.id : id,
          ),
        },
      };
    }),

  setChatMessagesFromServer: (chatId, messages) =>
    set((state) => {
      const currentOrder = state.messageOrderByChatId[chatId] ?? [];
      const currentMessages = state.messagesByChatId[chatId] ?? {};
      const hasPendingMessages = currentOrder.some((messageId) =>
        pendingStatuses.has(currentMessages[messageId]?.status ?? ""),
      );

      if (hasPendingMessages) {
        return state;
      }

      return {
        messagesByChatId: {
          ...state.messagesByChatId,
          [chatId]: buildMessageMap(messages),
        },
        messageOrderByChatId: {
          ...state.messageOrderByChatId,
          [chatId]: messages.map((message) => message.id),
        },
      };
    }),

  updateMessage: (chatId, messageId, patch) =>
    set((state) => {
      const currentMessages = state.messagesByChatId[chatId];
      const currentMessage = currentMessages?.[messageId];

      if (!currentMessages || !currentMessage) {
        return state;
      }

      return {
        messagesByChatId: {
          ...state.messagesByChatId,
          [chatId]: {
            ...currentMessages,
            [messageId]: {
              ...currentMessage,
              ...patch,
            },
          },
        },
      };
    }),
}));
