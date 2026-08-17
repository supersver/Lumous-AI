import { useState } from "react";
import { Box, IconButton, useMediaQuery, useTheme } from "@mui/material";
import { SidebarSimpleIcon } from "@phosphor-icons/react";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { useShallow } from "zustand/shallow";

import { useAppStore } from "@/store/useAppStore";
import { ChatSessionsProvider } from "../context/ChatSessionsProvider";
import { useChatSessions } from "../context/ChatSessionsContext";
import { useChatStream } from "../hooks/useChatStream";
import { PromptInput } from "../components/PromptInput";
import { useChatSettingsStore } from "../store/useChatSettingsStore";
import ChatSidebar from "./ChatSidebar";

function ChatLayoutContent() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const navigate = useNavigate();
  const location = useLocation();
  const { chatId } = useParams<{ chatId: string }>();
  const [draft, setDraft] = useState("");

  const {
    selectedModel,
    sidebarCollapsed,
    setSidebarCollapsed,
    mobileOpen,
    setMobileOpen,
  } = useAppStore(
    useShallow((s) => ({
      selectedModel: s.selectedModel,
      sidebarCollapsed: s.sidebarCollapsed,
      setSidebarCollapsed: s.setSidebarCollapsed,
      mobileOpen: s.mobileOpen,
      setMobileOpen: s.setMobileOpen,
    })),
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

  const hidePromptInput =
    location.pathname.endsWith("/settings") ||
    location.pathname.endsWith("/analytics");

  const handleSend = async () => {
    if (!draft.trim() || isStreaming) return;

    const content = draft.trim();
    const chatSettings = getSettingsForChat(chatId);

    setDraft("");

    let activeChatId = chatId;

    if (!activeChatId) {
      activeChatId = await createSession(selectedModel?.id ?? "");
      setChatSettings(activeChatId, chatSettings);
      navigate(`/chats/${activeChatId}`);
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
        width: "100%",
        height: "100%",
        minHeight: 0,
        overflow: "hidden",
      }}
    >
      <ChatSidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      <Box
        component="main"
        sx={{
          display: "flex",
          flex: 1,
          minWidth: 0,
          minHeight: 0,
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {isMobile && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              px: 1,
              py: 0.5,
              flexShrink: 0,
              position: "relative",
            }}
          >
            <IconButton
              size="small"
              onClick={() => setMobileOpen(true)}
              sx={{
                color: "text.secondary",
                position: "absolute",
                top: 4,
                left: 5,
                border: 0.5,
                borderColor: "background.paper",
                borderRadius: "100%",
              }}
            >
              <SidebarSimpleIcon size={20} />
            </IconButton>
          </Box>
        )}

        <Box
          sx={{
            flex: 1,
            minWidth: 0,
            minHeight: 0,
            overflowY: "auto",
            overflowX: "hidden",
            WebkitOverflowScrolling: "touch",
          }}
        >
          <Outlet />
        </Box>

        {!hidePromptInput && (
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
        )}
      </Box>
    </Box>
  );
}

export function ChatLayout() {
  return (
    <ChatSessionsProvider>
      <ChatLayoutContent />
    </ChatSessionsProvider>
  );
}
