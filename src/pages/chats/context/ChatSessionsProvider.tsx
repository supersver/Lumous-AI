import type { ReactNode } from "react";
import { useChatSessionsState } from "../hooks/useChatSessions";
import { ChatSessionsContext } from "./ChatSessionsContext";

export function ChatSessionsProvider({ children }: { children: ReactNode }) {
  const value = useChatSessionsState();
  return (
    <ChatSessionsContext.Provider value={value}>
      {children}
    </ChatSessionsContext.Provider>
  );
}
