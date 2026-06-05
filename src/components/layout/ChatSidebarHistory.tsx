import {
  Box,
  Button,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { PlusIcon, TrashIcon } from "@phosphor-icons/react";
import { useState, type MouseEvent } from "react";
import { NavLink, useLocation, useNavigate, useParams } from "react-router-dom";

import { Modal } from "@/components/elements/Modal";
import { useChatSessions } from "@/pages/chats/context/ChatSessionsContext";
import { formatDate } from "@/utils/date";
import { useAppStore } from "@/store/useAppStore";

export function ChatSidebarHistory() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id: activeRouteId } = useParams();
  const { createSession, deleteSession, sessions } = useChatSessions();
  const [pendingDeleteSessionId, setPendingDeleteSessionId] = useState<
    string | null
  >(null);

  const { selectedModel } = useAppStore();

  const handleNewChat = async () => {
    const sessionId = await createSession(selectedModel?.id ?? "");
    navigate(`/chat/${sessionId}`);
  };

  const handleDeleteChat = (
    event: MouseEvent<HTMLButtonElement>,
    sessionId: string,
  ) => {
    event.preventDefault();
    event.stopPropagation();

    setPendingDeleteSessionId(sessionId);
  };

  const handleConfirmDeleteChat = async () => {
    if (!pendingDeleteSessionId) {
      return;
    }

    const sessionId = pendingDeleteSessionId;
    setPendingDeleteSessionId(null);
    const nextSessionId = await deleteSession(sessionId);

    if (activeRouteId === sessionId) {
      navigate(nextSessionId ? `/chat/${nextSessionId}` : "/", {
        replace: true,
      });
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: 0,
        flex: 1,
        flexDirection: "column",
        gap: 1,
      }}
    >
      <Button
        variant="outlined"
        fullWidth
        startIcon={<PlusIcon size={18} />}
        onClick={handleNewChat}
        sx={{
          justifyContent: "flex-start",
          borderColor: "divider",
          color: "text.primary",
          "&:hover": {
            borderColor: "primary.main",
            bgcolor: "action.hover",
          },
        }}
      >
        New chat
      </Button>

      <List
        dense
        disablePadding
        sx={{
          minHeight: 0,
          flex: 1,
          overflowY: "auto",
          pr: 0.5,
        }}
      >
        {sessions.map((session) => {
          const chatPath = `/chat/${session.id}`;
          const isActive = location.pathname === chatPath;

          return (
            <Box
              key={session.id}
              sx={{
                position: "relative",
                mb: 0.5,
                "&:hover .chat-delete-btn": { opacity: 1 },
              }}
            >
              <ListItemButton
                component={NavLink}
                to={chatPath}
                selected={isActive}
                sx={{ pr: 5 }}
              >
                <ListItemText
                  primary={session.title}
                  secondary={`${formatDate(session.updatedAt)}`}
                  slotProps={{
                    primary: {
                      noWrap: true,
                      variant: "body2",
                      sx: { fontWeight: 500 },
                    },
                    secondary: {
                      noWrap: true,
                      variant: "caption",
                    },
                  }}
                />
              </ListItemButton>
              <IconButton
                className="chat-delete-btn"
                size="small"
                aria-label="Delete chat"
                onClick={(event) => handleDeleteChat(event, session.id)}
                sx={{
                  position: "absolute",
                  right: 4,
                  top: "50%",
                  transform: "translateY(-50%)",
                  opacity: 0,
                  color: "text.secondary",
                  transition: "opacity 0.15s",
                  "&:hover": {
                    color: "error.main",
                    bgcolor: "error.dark",
                    opacity: 1,
                  },
                }}
              >
                <TrashIcon size={14} />
              </IconButton>
            </Box>
          );
        })}
      </List>

      <Modal
        isOpen={Boolean(pendingDeleteSessionId)}
        onClose={() => setPendingDeleteSessionId(null)}
        onConfirm={handleConfirmDeleteChat}
        title="Delete Chat"
        description="This will permanently delete this conversation."
        confirmLabel="Delete"
        variant="danger"
      />
    </Box>
  );
}
