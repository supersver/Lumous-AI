import {
  Avatar,
  Box,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import { UserCircleIcon } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useShallow } from "zustand/shallow";

import { useAppStore } from "@/store/useAppStore";
import { useGetModels } from "../api/getModels";
import { MessagesArea } from "../components/MessagesArea";
import { ModelSelector } from "../components/ModelSelector";
import { PromptInput } from "../components/PromptInput";
import { useChatSessions } from "../context/ChatSessionsContext";
import { useChatStream } from "../hooks/useChatStream";

export function Chats() {
  const { id: chatId } = useParams<{ id: string }>();
  const [draft, setDraft] = useState<string>("");
  const { user, selectedModel, setSelectedModel } = useAppStore(
    useShallow((state) => ({
      user: state.user,
      selectedModel: state.selectedModel,
      setSelectedModel: state.setSelectedModel,
    })),
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const modelsQuery = useGetModels();

  // Extract models and filters from the updated API response shape
  const models = modelsQuery.data?.models ?? [];
  const filters = modelsQuery.data?.filters;

  const { activeSession, activeSessionId, selectSession } = useChatSessions();
  const { sendMessage: streamMessage, isStreaming } = useChatStream();

  useEffect(() => {
    if (chatId && activeSessionId !== chatId) {
      selectSession(chatId);
    }
  }, [chatId, selectSession]);

  useEffect(() => {
    if (models.length === 0) return;

    const selectedModelExists = models.some(
      (model) => model.id === selectedModel?.id,
    );

    if (!selectedModelExists) {
      const firstModel = models[0];
      setSelectedModel({ id: firstModel.id, name: firstModel.name });
    }
  }, [models, selectedModel?.id, setSelectedModel]);

  const lastMessage = activeSession?.messages.at(-1);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [
    activeSession?.id,
    activeSession?.messages.length,
    isStreaming,
    lastMessage?.content,
    lastMessage?.status,
  ]);

  const userInitial =
    user?.name?.[0]?.toUpperCase() ?? user?.email?.[0]?.toUpperCase() ?? "M";
  const canSend =
    draft.trim().length > 0 &&
    Boolean(selectedModel) &&
    Boolean(chatId) &&
    !isStreaming;

  const handleSendPrompt = () => {
    if (!canSend || !chatId || !selectedModel) return;

    const content = draft.trim();
    setDraft("");
    void streamMessage({ chatId, content, model: selectedModel.id });
  };

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
          borderBottom: 1,
          borderColor: "divider",
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
              width: 44,
              height: 44,
              bgcolor: "background.paper",
              color: "secondary.light",
              border: 1,
              borderColor: "divider",
            }}
          >
            <UserCircleIcon size={22} weight="duotone" />
          </Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="h5" noWrap sx={{ fontWeight: 600 }}>
              {activeSession?.title ?? "New chat"}
            </Typography>
            <Typography variant="body2" color="text.secondary" noWrap>
              {activeSession?.messages.length ?? 0} messages
            </Typography>
          </Box>
        </Stack>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1.5}
          sx={{
            minWidth: 0,
            alignItems: { sm: "flex-start" },
            justifyContent: { xl: "flex-end" },
          }}
        >
          {modelsQuery.isLoading ? (
            <CircularProgress size={16} />
          ) : (
            <ModelSelector
              isError={modelsQuery.isError}
              isLoading={modelsQuery.isLoading}
              models={models}
              filters={filters} // Pass the newly extracted filters
              selectedModel={selectedModel}
              onModelChange={setSelectedModel}
            />
          )}
        </Stack>
      </Box>

      <MessagesArea
        bottomRef={messagesEndRef}
        isAwaitingResponse={isStreaming}
        session={activeSession}
        userInitial={userInitial}
      />

      <PromptInput
        canSend={canSend}
        draft={draft}
        isSending={isStreaming}
        selectedModelName={selectedModel?.name}
        onDraftChange={setDraft}
        onSend={handleSendPrompt}
      />
    </Box>
  );
}
