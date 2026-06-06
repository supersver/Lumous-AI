import { Avatar, Box, Chip, Paper, Stack, Typography } from "@mui/material";
import { RobotIcon } from "@phosphor-icons/react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { formatTime } from "@/utils/time";
import type { ChatMessage } from "../types";
import { MarkdownComponents } from "./MarkdownComponents";

interface MessageBubbleProps {
  message: ChatMessage;
  userInitial: string;
}

const StreamingCursor = ({ hasContent }: { hasContent: boolean }) => (
  <Box
    component="span"
    aria-label="Assistant is typing"
    sx={{
      display: "inline-block",
      width: 7,
      height: 16,
      ml: hasContent ? 0.5 : 0,
      mb: -0.25,
      borderRadius: 0.5,
      bgcolor: "secondary.light",
      animation: "streamingCursorBlink 1s steps(2, start) infinite",
      "@keyframes streamingCursorBlink": {
        "0%, 45%": { opacity: 1 },
        "46%, 100%": { opacity: 0 },
      },
    }}
  />
);

export function MessageBubble({ message, userInitial }: MessageBubbleProps) {
  const isUser = message.role === "user";
  const isStreaming = message.status === "streaming";
  const isError = message.status === "error";

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
          flexShrink: 0,
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

      <Box
        sx={{
          minWidth: 0,
          maxWidth: 768,
          textAlign: isUser ? "right" : "left",
        }}
      >
        {/* Meta row */}
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
          {message.modelName && (
            <Chip label={message.modelName} size="small" variant="outlined" />
          )}
        </Stack>

        {/* Bubble */}
        <Paper
          elevation={0}
          sx={{
            px: 2,
            py: 1.5,
            textAlign: "left",
            border: 1,
            borderColor: isError
              ? "error.main"
              : isUser
                ? "primary.dark"
                : "divider",
            bgcolor: isUser ? "primary.dark" : "background.paper",
            color: "text.primary",
          }}
        >
          {isUser ? (
            // Plain text for user — preserve newlines
            <Typography
              component="div"
              variant="body2"
              sx={{ whiteSpace: "pre-wrap", lineHeight: 1.75 }}
            >
              {message.content}
              {isStreaming && (
                <StreamingCursor hasContent={Boolean(message.content)} />
              )}
            </Typography>
          ) : (
            // Full markdown for assistant
            <Typography
              component="div"
              variant="body2"
              sx={{ lineHeight: 1.75 }}
            >
              <Markdown
                components={MarkdownComponents}
                remarkPlugins={[remarkGfm]}
              >
                {message.content}
              </Markdown>
              {isStreaming && (
                <StreamingCursor hasContent={Boolean(message.content)} />
              )}
            </Typography>
          )}
        </Paper>

        {isError && message.error && (
          <Typography
            variant="caption"
            color="error.light"
            sx={{ display: "block", mt: 0.75 }}
          >
            {message.error}
          </Typography>
        )}
      </Box>
    </Stack>
  );
}
