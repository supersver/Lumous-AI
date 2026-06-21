import type { RefObject } from "react";
import { Box, Paper, Stack, Typography, CircularProgress } from "@mui/material";
import { ChatCircleIcon } from "@phosphor-icons/react";

import type { ChatSession } from "../types";
import { MessageBubble } from "./MessageBubble";

interface MessagesAreaProps {
  bottomRef: RefObject<HTMLDivElement | null>;
  isAwaitingResponse?: boolean;
  session: ChatSession | undefined;
  userInitial: string;
}

export function MessagesArea({
  bottomRef,
  isAwaitingResponse = false,
  session,
  userInitial,
}: MessagesAreaProps) {
  const hasStreamingMessage =
    session?.messages.some((message) => message.status === "streaming") ??
    false;

  if (!session || session.messages.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          minHeight: 0,
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          px: 3,
          py: 5,
        }}
      >
        <Stack
          spacing={2}
          sx={{ maxWidth: 360, textAlign: "center", alignItems: "center" }}
        >
          <Paper
            elevation={0}
            sx={{
              display: "grid",
              placeItems: "center",
              width: 48,
              height: 48,
              border: 1,
              borderColor: "divider",
              bgcolor: "background.paper",
              color: "secondary.light",
            }}
          >
            <ChatCircleIcon size={22} weight="duotone" />
          </Paper>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            No messages yet
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Your next conversation will appear here.
          </Typography>
        </Stack>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: 0,
        flex: 1,
        overflowY: "auto",
        px: { xs: 2, sm: 3 },
        py: 3,
      }}
    >
      <Stack spacing={2.5} sx={{ mx: "auto", width: "100%", maxWidth: 896 }}>
        {session.messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            userInitial={userInitial}
          />
        ))}
        {isAwaitingResponse && !hasStreamingMessage ? (
          <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
            <Paper
              elevation={0}
              sx={{
                display: "grid",
                placeItems: "center",
                width: 36,
                height: 36,
                border: 1,
                borderColor: "divider",
                bgcolor: "secondary.dark",
                color: "secondary.light",
              }}
            >
              <CircularProgress size={16} color="inherit" />
            </Paper>
            <Typography variant="body2" color="text.secondary">
              Streaming response...
            </Typography>
          </Stack>
        ) : null}
        <Box ref={bottomRef} />
      </Stack>
    </Box>
  );
}
