import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useChatSessions } from "../context/ChatSessionsContext";

export function ChatIndexRedirect() {
  const navigate = useNavigate();
  const { createSession, sessions } = useChatSessions();

  useEffect(() => {
    const targetId = sessions[0]?.id ?? createSession();
    navigate(`/chat/${targetId}`, { replace: true });
  }, [createSession, navigate, sessions[0]?.id]);

  return (
    <Box
      sx={{
        display: "flex",
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
      }}
    >
      <CircularProgress size={28} />
    </Box>
  );
}
