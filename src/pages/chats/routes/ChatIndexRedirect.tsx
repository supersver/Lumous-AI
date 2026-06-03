import { auth } from "@/lib/firebase";
import { useAppStore } from "@/store/useAppStore";
import { Box, Typography } from "@mui/material";

export function ChatIndexRedirect() {
  const user = useAppStore((s) => s.user);

  // const navigate = useNavigate();
  // const { createSession, sessions } = useChatSessions();

  // useEffect(() => {
  //   const targetId = sessions[0]?.id ?? createSession();
  //   navigate(`/chat/${targetId}`, { replace: true });
  // }, [createSession, navigate, sessions[0]?.id]);

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
      {/* <CircularProgress size={28} /> */}
      <Typography>Hello! {user?.name}</Typography>
    </Box>
  );
}
