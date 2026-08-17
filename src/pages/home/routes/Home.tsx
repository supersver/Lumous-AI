import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import { ChatCircleTextIcon } from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";

import { useAppStore } from "@/store/useAppStore";
import { ToolCard } from "../components/ToolCard";

export function Home() {
  const navigate = useNavigate();
  const user = useAppStore((s) => s.user);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const firstName = user?.name?.trim().split(/\s+/)[0] ?? "there";

  const tools = [
    {
      title: "AI Chat Assistant",
      description:
        "Chat with an AI assistant that can answer questions, help you write, analyze code, and more.",
      icon: ChatCircleTextIcon,
      onClick: () => navigate("/chats"),
    },
  ];

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100%",
        display: "flex",
        justifyContent: "center",
        px: { xs: 2, sm: 3, md: 4 },
        py: { xs: 3, sm: 4 },
      }}
    >
      <Box sx={{ width: "100%", maxWidth: 880 }}>
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            component="h1"
            sx={{ fontWeight: 600, letterSpacing: "-0.02em" }}
          >
            Welcome back{firstName === "there" ? "" : `, ${firstName}`} 👋
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mt: 1, lineHeight: 1.7 }}
          >
            What would you like to do today?
          </Typography>
        </Box>

        <Typography
          variant="overline"
          component="h2"
          sx={{ color: "text.secondary", letterSpacing: "0.08em" }}
        >
          Your tools
        </Typography>

        <Box
          sx={{
            mt: 2,
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, minmax(0, 1fr))",
              md: "repeat(3, minmax(0, 1fr))",
            },
            gap: 2,
          }}
        >
          {tools.map((tool) => (
            <ToolCard key={tool.title} {...tool} />
          ))}
        </Box>

        {isMobile && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: "block", mt: 3, textAlign: "center" }}
          >
            Tap a tool card to get started.
          </Typography>
        )}
      </Box>
    </Box>
  );
}
