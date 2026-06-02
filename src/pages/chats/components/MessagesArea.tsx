import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { ChatCircleIcon } from "@phosphor-icons/react";
import type { RefObject } from "react";

import type { ChatSession } from "../types";
import { MessageBubble } from "./MessageBubble";

interface MessagesAreaProps {
  bottomRef: RefObject<HTMLDivElement | null>;
  session: ChatSession | undefined;
  userInitial: string;
}

export function MessagesArea({
  bottomRef,
  session,
  userInitial,
}: MessagesAreaProps) {
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
      <Stack
        spacing={2.5}
        sx={{ mx: "auto", width: "100%", maxWidth: 896 }}
      >
        {session.messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            userInitial={userInitial}
          />
        ))}
        <Box ref={bottomRef} />
      </Stack>
    </Box>
  );
}
