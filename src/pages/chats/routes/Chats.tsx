import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { UserCircleIcon } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useShallow } from "zustand/shallow";

import { useAppStore } from "@/store/useAppStore";
import { useGetModels } from "../api/getModels";
import { useSendMessage } from "../api/sendMessage";
import { MessagesArea } from "../components/MessagesArea";
import { ModelSelector } from "../components/ModelSelector";
import { PromptInput } from "../components/PromptInput";
import { useChatSessions } from "../context/ChatSessionsContext";

export function Chats() {
  const { id: chatId } = useParams<{ id: string }>();
  const navigate = useNavigate();
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
  const models = modelsQuery.data ?? [];
  const {
    activeSession,
    activeSessionId,
    appendAssistantMessage,
    createSession,
    selectSession,
    sendMessage: addUserMessage,
    sessions,
  } = useChatSessions();
  const sendMessageMutation = useSendMessage();

  useEffect(() => {
    if (!chatId) return;

    const sessionExists = sessions.some((session) => session.id === chatId);

    if (!sessionExists) {
      const fallbackId = sessions[0]?.id ?? createSession();
      navigate(`/chat/${fallbackId}`, { replace: true });
      return;
    }

    if (activeSessionId !== chatId) {
      selectSession(chatId);
    }
  }, [
    activeSessionId,
    chatId,
    createSession,
    navigate,
    selectSession,
    sessions,
  ]);

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

  const isSending = sendMessageMutation.isPending;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeSession?.id, activeSession?.messages.length, isSending]);

  const userInitial =
    user?.name?.[0]?.toUpperCase() ?? user?.email?.[0]?.toUpperCase() ?? "M";
  const canSend =
    draft.trim().length > 0 &&
    Boolean(selectedModel) &&
    Boolean(chatId) &&
    !isSending;

  const handleSendPrompt = () => {
    if (!canSend || !chatId || !selectedModel) return;

    const content = draft.trim();
    addUserMessage(content, selectedModel);
    setDraft("");

    sendMessageMutation.mutate(
      {
        chatId,
        content,
        model: selectedModel.id,
      },
      {
        onSuccess: (data) => {
          appendAssistantMessage(chatId, {
            id: data.message.id,
            role: data.message.role,
            content: data.message.content,
            createdAt: data.message.createdAt,
            modelId: selectedModel.id,
            modelName: selectedModel.name,
          });
        },
      },
    );
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
            <Typography
              variant="overline"
              sx={{ color: "primary.main", lineHeight: 1.5 }}
            >
              ModelPilot
            </Typography>
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
          <ModelSelector
            isError={modelsQuery.isError}
            isLoading={modelsQuery.isLoading}
            models={models}
            selectedModel={selectedModel}
            onModelChange={setSelectedModel}
          />
          {modelsQuery.isLoading ? (
            <Stack
              direction="row"
              spacing={1}
              sx={{
                height: 40,
                alignItems: "center",
                px: 1.5,
                border: 1,
                borderColor: "divider",
                borderRadius: 1,
              }}
            >
              <CircularProgress size={16} />
              <Typography variant="body2" color="text.secondary">
                Loading
              </Typography>
            </Stack>
          ) : null}
        </Stack>
      </Box>

      <MessagesArea
        bottomRef={messagesEndRef}
        isAwaitingResponse={isSending}
        session={activeSession}
        userInitial={userInitial}
      />

      <PromptInput
        canSend={canSend}
        draft={draft}
        isSending={isSending}
        selectedModelName={selectedModel?.name}
        onDraftChange={setDraft}
        onSend={handleSendPrompt}
      />
    </Box>
  );
}
