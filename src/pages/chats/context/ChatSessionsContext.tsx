import { createContext, useContext, type ReactNode } from "react";

import { useChatSessionsState } from "../hooks/useChatSessions";

type ChatSessionsContextValue = ReturnType<typeof useChatSessionsState>;

const ChatSessionsContext = createContext<ChatSessionsContextValue | null>(null);

export function ChatSessionsProvider({ children }: { children: ReactNode }) {
  const value = useChatSessionsState();

  return (
    <ChatSessionsContext.Provider value={value}>
      {children}
    </ChatSessionsContext.Provider>
  );
}

export function useChatSessions() {
  const context = useContext(ChatSessionsContext);

  if (!context) {
    throw new Error("useChatSessions must be used within ChatSessionsProvider");
  }

  return context;
}
