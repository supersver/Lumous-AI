import { createContext, useContext } from "react";
import { useChatSessionsState } from "../hooks/useChatSessions";

type ChatSessionsContextValue = ReturnType<typeof useChatSessionsState>;

export const ChatSessionsContext =
  createContext<ChatSessionsContextValue | null>(null);

export function useChatSessions() {
  const context = useContext(ChatSessionsContext);
  if (!context) {
    throw new Error("useChatSessions must be used within ChatSessionsProvider");
  }
  return context;
}
