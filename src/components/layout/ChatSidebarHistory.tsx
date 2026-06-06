import {
  Box,
  Button,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";
import {
  TrashIcon,
  NotePencilIcon,
  ChatsCircleIcon,
} from "@phosphor-icons/react";
import { useState, type MouseEvent } from "react";
import { NavLink, useLocation, useNavigate, useParams } from "react-router-dom";

import { Modal } from "@/components/elements/Modal";
import { useChatSessions } from "@/pages/chats/context/ChatSessionsContext";
import { useAppStore } from "@/store/useAppStore";
import { formatDate } from "@/utils/date";

interface ChatSidebarHistoryProps {
  collapsed: boolean;
}

export function ChatSidebarHistory({ collapsed }: ChatSidebarHistoryProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { id: activeRouteId } = useParams();
  const { createSession, deleteSession, sessions } = useChatSessions();
  const [pendingDeleteSessionId, setPendingDeleteSessionId] = useState<
    string | null
  >(null);
  const { selectedModel } = useAppStore();

  // State for the collapsed dropdown menu
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpenMenu = (event: MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setMenuAnchorEl(null);
  };

  const handleSelectDropdownChat = (sessionId: string) => {
    navigate(`/chat/${sessionId}`);
    handleCloseMenu();
  };

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
    handleCloseMenu(); // Close the dropdown menu if triggered from there
  };

  const handleConfirmDeleteChat = async () => {
    if (!pendingDeleteSessionId) return;
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
      {/* New chat button — icon only when collapsed */}
      <Tooltip title={collapsed ? "New chat" : ""} placement="right">
        <Button
          variant="outlined"
          fullWidth
          onClick={handleNewChat}
          startIcon={!collapsed ? <NotePencilIcon size={18} /> : undefined}
          sx={{
            minWidth: "unset",
            justifyContent: collapsed ? "center" : "flex-start",
            px: collapsed ? 1.5 : 2,
            borderColor: "divider",
            color: "text.primary",
            "&:hover": { borderColor: "primary.main", bgcolor: "action.hover" },
          }}
        >
          {collapsed ? <NotePencilIcon size={18} /> : "New chat"}
        </Button>
      </Tooltip>

      {/* Dropdown Menu Trigger — visible only when collapsed */}
      {collapsed && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
          <Tooltip title="View chats" placement="right">
            <IconButton
              onClick={handleOpenMenu}
              sx={{
                color: menuAnchorEl ? "primary.main" : "text.secondary",
                "&:hover": { color: "text.primary", bgcolor: "action.hover" },
              }}
            >
              <ChatsCircleIcon size={20} />
            </IconButton>
          </Tooltip>
        </Box>
      )}

      {/* Session list — hidden when collapsed */}
      {!collapsed && (
        <List
          dense
          disablePadding
          sx={{ minHeight: 0, flex: 1, overflowY: "auto", pr: 0.5 }}
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
                    secondary={formatDate(session.updatedAt)}
                    slotProps={{
                      primary: {
                        noWrap: true,
                        variant: "body2",
                        sx: { fontWeight: 500 },
                      },
                      secondary: { noWrap: true, variant: "caption" },
                    }}
                  />
                </ListItemButton>
                <IconButton
                  className="chat-delete-btn"
                  size="small"
                  aria-label="Delete chat"
                  onClick={(e) => handleDeleteChat(e, session.id)}
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
      )}

      {/* Dropdown Menu for Collapsed State */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleCloseMenu}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        slotProps={{
          paper: {
            sx: { width: 280, maxHeight: 400, ml: 1 },
          },
        }}
      >
        {sessions.length === 0 ? (
          <MenuItem disabled>No chats available</MenuItem>
        ) : (
          sessions.map((session) => {
            const isActive = location.pathname === `/chat/${session.id}`;

            return (
              <MenuItem
                key={session.id}
                selected={isActive}
                onClick={() => handleSelectDropdownChat(session.id)}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 2,
                  "&:hover .chat-menu-delete-btn": { opacity: 1 },
                }}
              >
                <ListItemText
                  primary={session.title}
                  secondary={formatDate(session.updatedAt)}
                  slotProps={{
                    primary: {
                      noWrap: true,
                      variant: "body2",
                      sx: { fontWeight: 500 },
                    },
                    secondary: { noWrap: true, variant: "caption" },
                  }}
                />
                <IconButton
                  className="chat-menu-delete-btn"
                  size="small"
                  onClick={(e) => handleDeleteChat(e, session.id)}
                  sx={{
                    opacity: 0, // Hides unless hovered (driven by MenuItem hover)
                    color: "text.secondary",
                    "&:hover": {
                      color: "error.main",
                      bgcolor: "error.dark",
                    },
                  }}
                >
                  <TrashIcon size={14} />
                </IconButton>
              </MenuItem>
            );
          })
        )}
      </Menu>

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
