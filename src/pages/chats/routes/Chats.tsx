import { Box } from "@mui/material";
import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useShallow } from "zustand/shallow";

import { useAppStore } from "@/store/useAppStore";
import { MessagesArea } from "../components/MessagesArea";
import { useChatSessions } from "../context/ChatSessionsContext";
import { useChatStream } from "../hooks/useChatStream";

export function Chats() {
  const { id: chatId } = useParams<{ id: string }>();
  const { user } = useAppStore(
    useShallow((state) => ({
      user: state.user,
    })),
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { isStreaming } = useChatStream();
  const { activeSession, activeSessionId, selectSession } = useChatSessions();

  useEffect(() => {
    if (chatId && activeSessionId !== chatId) {
      selectSession(chatId);
    }
  }, [chatId, selectSession]);

  const lastMessage = activeSession?.messages.at(-1);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [
    activeSession?.id,
    activeSession?.messages.length,
    lastMessage?.content,
    lastMessage?.status,
  ]);

  const userInitial =
    user?.name?.[0]?.toUpperCase() ?? user?.email?.[0]?.toUpperCase() ?? "M";

  return (
    <Box
      sx={{
        display: "flex",
        height: "100%",
        minHeight: 0,
        flexDirection: "column",
        bgcolor: "background.default",
        color: "text.primary",
      }}
    >
      <MessagesArea
        bottomRef={messagesEndRef}
        isAwaitingResponse={isStreaming}
        session={activeSession}
        userInitial={userInitial}
      />
    </Box>
  );
}
