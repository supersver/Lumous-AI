import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { RobotIcon } from "@phosphor-icons/react";

import { formatTime } from "@/utils/time";
import type { ChatMessage } from "../types";

interface MessageBubbleProps {
  message: ChatMessage;
  userInitial: string;
}

export function MessageBubble({ message, userInitial }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <Stack
      component="article"
      direction={isUser ? "row-reverse" : "row"}
      spacing={1.5}
      sx={{ alignItems: "flex-start" }}
    >
      <Avatar
        variant="rounded"
        sx={{
          width: 36,
          height: 36,
          bgcolor: isUser ? "primary.dark" : "secondary.dark",
          color: isUser ? "primary.light" : "secondary.light",
          border: 1,
          borderColor: isUser ? "primary.main" : "secondary.main",
        }}
      >
        {isUser ? (
          <Typography variant="caption" sx={{ fontWeight: 600 }}>
            {userInitial}
          </Typography>
        ) : (
          <RobotIcon size={18} weight="duotone" />
        )}
      </Avatar>

      <Box sx={{ minWidth: 0, maxWidth: 768, textAlign: isUser ? "right" : "left" }}>
        <Stack
          direction="row"
          spacing={1}
          sx={{
            mb: 0.5,
            alignItems: "center",
            justifyContent: isUser ? "flex-end" : "flex-start",
            flexWrap: "wrap",
          }}
        >
          <Typography variant="caption" color="text.secondary">
            {isUser ? "You" : "ModelPilot"}
          </Typography>
          <Typography variant="caption" color="text.disabled">
            {formatTime(message.createdAt)}
          </Typography>
          {message.modelName ? (
            <Chip label={message.modelName} size="small" variant="outlined" />
          ) : null}
        </Stack>
        <Paper
          elevation={0}
          sx={{
            px: 2,
            py: 1.5,
            textAlign: "left",
            border: 1,
            borderColor: isUser ? "primary.dark" : "divider",
            bgcolor: isUser ? "primary.dark" : "background.paper",
            color: "text.primary",
          }}
        >
          <Typography
            variant="body2"
            sx={{ whiteSpace: "pre-wrap", lineHeight: 1.7 }}
          >
            {message.content}
          </Typography>
        </Paper>
      </Box>
    </Stack>
  );
}
