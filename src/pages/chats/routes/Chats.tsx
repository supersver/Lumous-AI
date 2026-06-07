import { Avatar, Box, Stack, Typography } from "@mui/material";
import { UserCircleIcon } from "@phosphor-icons/react";
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
      <Box
        component="header"
        sx={{
          display: "flex",
          flexDirection: { xs: "column", xl: "row" },
          gap: 2,
          px: { xs: 2, sm: 3 },
          py: 2,
          alignItems: { xl: "flex-start" },
          justifyContent: { xl: "space-between" },
        }}
      >
        <Stack
          direction="row"
          spacing={1.5}
          sx={{ minWidth: 0, alignItems: "flex-start" }}
        >
          <Avatar
            variant="rounded"
            sx={{
              width: 25,
              height: 25,
              bgcolor: "background.paper",
              color: "secondary.light",
              border: 1,
              borderColor: "divider",
            }}
          >
            <UserCircleIcon size={14} weight="duotone" />
          </Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography
              variant="h5"
              noWrap
              sx={{ fontWeight: 600, fontSize: 16 }}
            >
              {activeSession?.title ?? "New chat"}
            </Typography>
          </Box>
        </Stack>
      </Box>

      <MessagesArea
        bottomRef={messagesEndRef}
        isAwaitingResponse={isStreaming}
        session={activeSession}
        userInitial={userInitial}
      />
    </Box>
  );
}
