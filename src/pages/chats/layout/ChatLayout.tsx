import { Box } from "@mui/material";
import { useState } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { useShallow } from "zustand/shallow";

import { useAppStore } from "@/store/useAppStore";
import { useChatSessions } from "../context/ChatSessionsContext";
import { useChatStream } from "../hooks/useChatStream";
import { PromptInput } from "../components/PromptInput";
import { useChatSettingsStore } from "../store/useChatSettingsStore";

export function ChatLayout() {
  const navigate = useNavigate();
  const { id: chatId } = useParams<{ id: string }>();
  const [draft, setDraft] = useState("");

  const { selectedModel } = useAppStore(
    useShallow((s) => ({ selectedModel: s.selectedModel })),
  );

  const { createSession } = useChatSessions();
  const { getSettingsForChat, setChatSettings } = useChatSettingsStore(
    useShallow((state) => ({
      getSettingsForChat: state.getSettingsForChat,
      setChatSettings: state.setChatSettings,
    })),
  );
  const {
    sendMessage: streamMessage,
    isStreaming,
    stopStreaming,
  } = useChatStream();

  const canSend = draft.trim().length > 0 && !isStreaming;

  const handleSend = async () => {
    if (!draft.trim() || isStreaming) return;

    const content = draft.trim();
    const chatSettings = getSettingsForChat(chatId);
    setDraft("");

    // If on index route, create a session first then navigate
    let activeChatId = chatId;
    if (!activeChatId) {
      activeChatId = await createSession(selectedModel?.id ?? "");
      setChatSettings(activeChatId, chatSettings);
      navigate(`/chat/${activeChatId}`);
    }

    void streamMessage({
      chatId: activeChatId,
      content,
      model: selectedModel?.id ?? "",
      webSearch: chatSettings.webSearch,
      reasoning: chatSettings.reasoning,
    });
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100dvh",
        minHeight: 0,
        bgcolor: "background.default",
        color: "text.primary",
      }}
    >
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
          overflowX: "hidden",
          WebkitOverflowScrolling: "touch",
        }}
      >
        <Outlet />
      </Box>

      <Box sx={{ flexShrink: 0 }}>
        <PromptInput
          activeChatId={chatId}
          canSend={canSend}
          draft={draft}
          isSending={isStreaming}
          selectedModelName={selectedModel?.name}
          onDraftChange={setDraft}
          onSend={handleSend}
          onStopStreaming={stopStreaming}
        />
      </Box>
    </Box>
  );
}
